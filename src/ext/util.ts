/**
 * 获取主域名
 * 
 * @param hostname 
 * @return {string}
 */
export function getMainDomain(hostname) {
    var mainDomain = '';
    var domainSegment = hostname.split('.');

    if (hostname.replace(/[\d\.]/g, '') === '') { // IP
        mainDomain = hostname;
    } else if (domainSegment.length === 1) {      // localhost
        mainDomain = hostname;
    } else {
        // 顶级域名
        var topLevelDomain = domainSegment[domainSegment.length - 1];
        // 二级域名
        var secondLevelDomain = domainSegment[domainSegment.length - 2];
        // 主域名
        mainDomain = secondLevelDomain + '.' + topLevelDomain;
    }

    return mainDomain;
}

/**
 * 获取最后一级的域名
 * 
 * @param hostname 
 * @return {string}
 */
export function getLastLevelDomain(hostname) {
    var domainSegment = hostname.split('.');
    return domainSegment[0];
}