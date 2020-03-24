import * as React from 'react';
import axios from 'axios';
import * as copy from 'copy-to-clipboard';
import QsMan from 'qsman';

import {
    toast,
    alert,
    confirm,
    render as renderAmis
} from 'amis';
import {
    Action
} from 'amis/lib/types';

import adaptResponse from '../ext/adapt-response';

interface RendererProps {
    schema?: any;
    [propName: string]: any;
};

/**
 * AMIS 渲染器
 */
export default class AMisRenderer extends React.Component<RendererProps> {
    env: any = null;

    handleAction = (e: any, action: Action) => {
        this.env.alert(`没有识别的动作：${JSON.stringify(action)}`);
    }

    constructor(props: RendererProps) {
        super(props);
        const history = props.history;

        // todo，这个过程可以 cache
        this.env = {
            session: 'global',
            updateLocation: props.updateLocation || ((location:string, replace:boolean) => {
                // 可用于动态变更 URL
                // 例如翻页时 URL 会带上 page=n 的参数, 那么刷新页面时就可以回到这个状态
                if (location === 'goBack') {
                    return history.goBack();
                }
                history[replace ? 'replace' : 'push'](location);
            }),
            jumpTo: props.jumpTo || ((to:string, action?:any) => {
                if (to === 'goBack') {
                    return history.goBack();
                }
                if (action && action.actionType === 'url') {
                    action.blank === false ? (window.location.href = to) : window.open(to);
                    return;
                }
                // TODO 当使用 nav 组件时应该是内部路由跳转
                window.location.replace(to);
            }),
            fetcher: (fetcherConfig: any) => {
                var url = fetcherConfig.url;
                var method = fetcherConfig.method;
                var data = fetcherConfig.data;
                var config = fetcherConfig.config;
                var headers = fetcherConfig.headers;

                config = config || {};
                config.headers = config.headers || {};
                config.withCredentials = true;

                if (config.cancelExecutor) {
                    config.cancelToken = new axios.CancelToken(config.cancelExecutor);
                }

                config.headers = headers || {};
                config.method = method;

                if (method === 'get' && data) {
                    config.params = data;
                } else if (data && data instanceof FormData) {
                    // config.headers = config.headers || {};
                    // config.headers['Content-Type'] = 'multipart/form-data';
                } else if (data
                    && typeof data !== 'string'
                    && !(data instanceof Blob)
                    && !(data instanceof ArrayBuffer)
                ) {
                    data = JSON.stringify(data);
                    // config.headers = config.headers || {};
                    config.headers['Content-Type'] = 'application/json';
                }

                data && (config.data = data);

                // 通过给 adaptor 指定名称来自动适配组件接口规范
                var qsParam = new QsMan(url).getObject();
                var adaptorName = '';
                if (typeof fetcherConfig.adaptor === 'object') {
                    adaptorName = fetcherConfig.adaptor.name;
                    // 必须删掉, 否则会被当做真正的 adaptor 来执行, 我们其实只需要知道名字
                    delete fetcherConfig.adaptor;
                } else if (qsParam._adaptor) {
                    adaptorName = qsParam._adaptor;
                }

                return axios(url, config).then(function(response) {
                    return adaptResponse(response, adaptorName);
                }, function(error) {
                    if (error.response) {
                        error.message = `网络请求错误(错误码:H${error.response.status})`;
                    } else {
                        error.message = `网络请求失败(错误码:A${error.message?.charCodeAt(0) || 0})`;
                    }
                    throw error;
                });
            },
            isCancel: (e: any) => axios.isCancel(e),
            notify: (type: 'success' | 'error' | 'info', msg: string, config: any) => {
                if (toast[type]) {
                    toast[type](msg, type === 'error' ? '系统错误' : '系统消息', config);
                } else {
                    toast.error(msg, `消息类型:${type}`, config);
                }
                console.log('[notify]', type, msg);
            },
            alert,
            confirm,
            copy: (contents: string, options: any = {}) => {
                const ret = copy(contents, options);
                if (ret && (!options || options.shutup !== true)) {
                    toast.info('内容已拷贝到剪切板', '提示');
                }
                return ret;
            },
            affixOffsetTop: 0
        };

        // 有些场景下需要用到 env 中的方法, 例如要弹出一个 notify, 或者发一个额外的 HTTP 请求
        // @ts-ignore
        window.amisEnv = {
            fetcher: this.env.fetcher,
            notify: this.env.notify,
            alert: this.env.alert,
            confirm: this.env.confirm,
            copy: this.env.copy
        };
    }

    render() {
        const {
            schema,
            theme,
            onAction,
            ...rest
        } = this.props;
        return renderAmis(schema, {
            onAction: onAction || this.handleAction,
            theme,
            ...rest
        }, this.env);
    }
}