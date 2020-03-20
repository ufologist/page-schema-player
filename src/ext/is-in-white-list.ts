import {
    getMainDomain
} from './util';

var domainWhiteList = [
    'localhost',
    '192.168',
    'github.com',
    'github.io'
];

export default function isInWhiteList(url) {
    // 允许 blob URL, 但注意是有安全隐患的
    if (url.indexOf('blob:') === 0) {
        return true;
    }

    var anchor = document.createElement('a');
    anchor.href = url;
    // 如果 URL 为相对路径, hostname 为当前页面的域名
    // 如果 URL 为伪协议, 例如 javascript:alert(1), hostname 为空字符串
    var mainDomain = getMainDomain(anchor.hostname);

    var whiteListDomain = domainWhiteList.find(function(value) {
        return mainDomain.indexOf(value) === 0;
    });

    return Boolean(whiteListDomain);
}