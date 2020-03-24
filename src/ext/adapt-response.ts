// @ts-nocheck
import {
    filter
} from 'amis';

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
export default function adaptResponse(response, adaptorName) {
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