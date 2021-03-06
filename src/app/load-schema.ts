import * as React from 'react';
import axios from 'axios';
import QsMan from 'qsman';
var NProgress = require('nprogress');
import 'nprogress/nprogress.css';

import InfoPageSchema from './info-page-schema';
import isInWhiteList from '../ext/is-in-white-list';

// Babel 转义之后的 JSX 会使用到 React, 如果只是导入不使用一下的话, 这个导入就会被优化掉
var forBabel = React;

class LoadedErrorPageSchema extends InfoPageSchema {
    constructor(message:string, url:string, error:Error) {
        // 借助 a 元素拿到完整的 URL
        var anchor = document.createElement('a');
        anchor.href = url;

        super(message, `配置来自: <code>${anchor.href}</code>`, error ? error.message : '未知的错误');
    }
}

/**
 * 加载 schema 文件
 * 
 * @param url 
 */
export default function(url:string) {
    NProgress.start();

    var _url = url;
    // 排除掉 blob URL
    // 因为 GET blob:http://localhost/f505556e-7dd0-462f-a5ac-bda1bfbd2cd8?a=1 net::ERR_FILE_NOT_FOUND
    if (_url.indexOf('blob:') !== 0) {
        _url = new QsMan(_url).append({
            _: Date.now()
        }).toString();
    }

    if (isInWhiteList(_url)) {
        return axios({
            method: 'get',
            url: _url
        }).then((response) => {
            var schema = {};

            if (typeof response.data === 'string') {
                console.log(`--------------------${url}`);
                console.log('eval response as javascript code');
                var code = '';

                try {
                    // @ts-ignore
                    if (window.Babel) { // 如果页面中有 @babel/standalone
                        console.log('@babel/standalone');
                        // @ts-ignore
                        code = window.Babel.transform(`(${response.data})`, {
                            presets: ['env', 'react']
                        }).code;
                    } else {
                        code = `(${response.data})`;
                    }

                    console.log(code);
                    schema = eval(code);
                } catch (error) {
                    schema = new LoadedErrorPageSchema('解析页面的配置出错了', url, error);
                }

                console.log('--------------------');
            } else {
                schema = response.data;
            }

            return schema;
        }).catch((error) => {
            return new LoadedErrorPageSchema('加载页面的配置失败了', url, error);
        }).finally(function() {
            NProgress.done();
        });
    } else {
        NProgress.done();
        return Promise.resolve(new LoadedErrorPageSchema('只能加载域名白名单内的页面配置', url, new Error('设置了域名白名单规则以避免安全问题')));
    }
}