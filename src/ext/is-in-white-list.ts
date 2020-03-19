import {
    getMainDomain
} from './util';

var domainWhiteList = [
    'github.com',
    'github.io'
];

export default function isInWhiteList(url, mode) {
    if (mode === 'production') {
        var anchor = document.createElement('a');
        anchor.href = url;
        // 如果 URL 为相对路径, hostname 为当前页面的域名
        // 如果 URL 为伪协议, 例如 javascript:alert(1), hostname 为空字符串
        var mainDomain = getMainDomain(anchor.hostname);

        return domainWhiteList.indexOf(mainDomain) !== -1;
    } else {
        return true;
    }
}