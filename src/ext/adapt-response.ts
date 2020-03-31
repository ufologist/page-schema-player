// @ts-nocheck
import QsMan from 'qsman';
import {
    filter
} from 'amis';
import {
    tokenize
} from 'amis/lib/utils/tpl-builtin';

// 获取默认的环境模式
import getDefaultMode from './get-default-mode';

var qsParam = new QsMan(window.location.search).getObject();
// 自动识别环境模式
if (!qsParam._mode) {
    qsParam._mode = getDefaultMode();
}

/**
 * 接口告知未登录时如何处理, 即可以理解为未登录处理器
 * 
 * @param {object} result
 * 
 * @param {object} unauthorized
 * @param {string | function} unauthorized.handler 字符串类型表示使用内置的未登录处理器, 方法类型表示自定义实现
 * @param {number} unauthorized.status 接口返回中的状态为多少时表示需要登录
 * @param {string} unauthorized.redirectUrl 未登录时需要重定向到哪里去
 * @param {string} unauthorized.redirectParamName 传给重定向页面的回调参数名
 * 
 * @param {object} schemaEnv schema 配置中匹配出来的 env
 */
function handleUnauthorized(result, unauthorized, schemaEnv) {
    if (typeof unauthorized.handler === 'string') { // 内置
        // TODO 在这里实现你自己的内置未登录处理器, 下面的代码仅供参考
        if (unauthorized.handler === 'demo') { // 例如跳转到某个统一登录页
            unauthorized.status = 401;
            if (qsParam._mode === 'production') {
                unauthorized.redirectUrl = '//github.com/ufologist/page-schema-player';
            } else {
                unauthorized.redirectUrl = '//github.com/ufologist/page-schema';
            }
            unauthorized.redirectParamName = 'redirect_uri';

            redirectWhenUnauthorized(result.status, unauthorized);
        } else {
            console.warn('api._unauthorized.handler is not found', unauthorized);
        }
    } else if (typeof unauthorized.handler === 'function') { // 自定义
        try {
            unauthorized.handler(result);
        } catch (error) {
            console.warn('api._unauthorized.handler exec error', unauthorized, error);
        }
    } else if (unauthorized.status) { // 告知状态来处理未登录重定向
        if (unauthorized.redirectUrl) {
            // https://github.com/baidu/amis/blob/bd5b6dd8400e2bb3b76720ebd0fb8f012664f869/src/utils/api.ts#L69
            unauthorized.redirectUrl = tokenize(unauthorized.redirectUrl, {
                _env: schemaEnv
            }, '| raw');
            redirectWhenUnauthorized(result.status, unauthorized);
        } else {
            console.warn('api._unauthorized.redirectUrl is not config', unauthorized);
        }
    }
}

/**
 * 通过状态判定为未登录时重定向到某个页面
 */
function redirectWhenUnauthorized(resultStatus, {
    status,
    redirectUrl = '',
    redirectParamName = 'redirect_uri'
}) {
    if (resultStatus == status) {
        var url = new QsMan(redirectUrl).append({
            [redirectParamName]: window.location.href
        }).toString();
        window.location.replace(url);
    }
}

/**
 * 适配组件接口规范
 * 
 * @param data 
 * @param adaptorName 
 */
function adaptData(data, adaptorName: string) {
    var _data = data;
    if (_data) {
        // CURD: https://baidu.github.io/amis/docs/renderers/CRUD#%E6%8E%A5%E5%8F%A3%E8%AF%B4%E6%98%8E
        if (adaptorName === 'curd-content-totalElements') {
            _data = {
                items: _data.content,
                total: _data.totalElements
            };
        } else if (adaptorName === 'select-describe-value') {
            _data = {
                options: _data.map(function(item) {
                    return {
                        label: item.describe,
                        value: item.value
                    };
                })
            };
        } else if (adaptorName.indexOf('filter:') === 0) { // 通用过滤器适配规则
            // 通用过滤器适配规则为: filter:pick:targetField~data, 支持组合使用
            // 例如
            // - 将返回的数据, 用对象包一下, 适合返回的数据是非对象的情况
            //   {
            //       data: 1
            //   }
            //   filter:pick:value~data
            //   {
            //       data: {
            //           value: 1
            //       }
            //   }
            // - 做字段映射, 适合返回的数据字段以规范不符的情况
            //   {
            //       data: {
            //           content: [],
            //           totalElements: 100
            //       }
            //   }
            //   pick:data|pick:items~content,total~totalElements
            //   {
            //       data: {
            //           items: [],
            //           total: 100
            //       }
            //   }
            var filterRules = adaptorName.split('filter:')[1];
            var json = filter('${data | ' + filterRules + ' | json}', {
                data: {
                    data: _data
                }
            });
            // console.log('filter adaptor result', text);
            try {
                _data = JSON.parse(json);
            } catch (error) {
                _data = data;
                console.warn('filter adaptor error', error);
            }
        }
    }

    return _data;
}

/**
 * 适配各种接口到 amis 标准的接口规范
 * 
 * @param response 
 * @see https://baidu.github.io/amis/docs/api
 */
export default function adaptResponse(response, adaptorName, unauthorized, schemaEnv) {
    var result = response.data;

    var amisApi = {
        status: 0,
        data: '',
        msg: ''
    };

    if (typeof result.status !== 'undefined') {      // 适配 status/statusInfo/data
        amisApi.status = result.status;
        amisApi.data = result.data;

        if (result.message) {
            amisApi.msg = result.message;
        } else if (result.statusInfo && typeof result.statusInfo.message !== 'undefined') {
            amisApi.msg = result.statusInfo.message;
        } else {
            amisApi.msg = result.msg;
        }
    } else if (typeof result.data !== 'undefined') { // 适配只返回了 data 字段
        amisApi.data = result.data;
    } else {                                         // 适配直接返回的数据
        amisApi.data = result;
    }

    if (amisApi.status != 0) {
        amisApi.msg = `${amisApi.msg || '接口调用出错但未提供错误信息'}(错误码:B${amisApi.status})`;
        handleUnauthorized(amisApi, unauthorized, schemaEnv);
    }

    // 表单提交成功后, 会默认打开一个 toast 提示接口返回的消息
    // 通过适配器取消这个机制(仅在接口调用成功时), 强制使用表单的 messages.saveSuccess 配置
    if (adaptorName === 'silence-when-success' && amisApi.status == 0) {
        amisApi.msg = '';
    }

    amisApi.data = adaptData(amisApi.data, adaptorName);
    response.data = amisApi;
    return response;
}