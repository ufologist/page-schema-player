import * as React from 'react';
import axios from 'axios';

import InfoPageSchema from './info-page-schema';

// Babel 转义之后的 JSX 会使用到 React, 如果只是导入不使用一下的话, 这个导入就会被优化掉
var forBabel = React;

/**
 * 加载 schema 文件
 * 
 * @param url 
 */
export default function(url:string) {
    return axios({
        method: 'GET',
        url: url
    }).then((response) => {
        var schema = {};

        // TODO 有 json5 来解析以 json5 结尾的文件
        if (typeof response.data === 'string') {
            try {
                // @ts-ignore
                var es5 = window.Babel.transform(`(${response.data})`, {
                    presets: ['env', 'react']
                }).code;
                console.log(`--------------------${url}`);
                console.log(es5);
                console.log('--------------------');
                schema = eval(es5);
            } catch (error) {
                schema = new InfoPageSchema('解析页面的配置出错了', `配置来自: <code>${url}</code>`, error ? error.message : '未知的错误');
            }
        } else {
            schema = response.data;
        }

        return schema;
    }).catch((error) => {
        return new InfoPageSchema('加载页面的配置失败了', `配置来自: <code>${url}</code>`, error ? error.message : '未知的错误');
    });
}