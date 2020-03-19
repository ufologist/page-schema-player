/**
 * 获取主域名
 * 
 * @param hostname 
 * @return {string}
 */
function getMainDomain(hostname) {
    var domainSegment = hostname.split('.');
    // 顶级域名
    var topLevelDomain = domainSegment[domainSegment.length - 1];
    // 二级域名
    var secondLevelDomain = domainSegment[domainSegment.length - 2];
    // 主域名
    var mainDomain = secondLevelDomain + '.' + topLevelDomain;

    return mainDomain;
}

/**
 * 获取最后一级的域名
 * 
 * @param hostname 
 * @return {string}
 */
function getLastLevelDomain(hostname) {
    var domainSegment = hostname.split('.');
    return domainSegment[0];
}

// 测试环境
// 例如: https://static.test.com/path/to/page-schema-player/index.html
var testEnvMainDomain = 'test.com';
// 测试环境子环境
// 例如: https://static-betaa.test.com/path/to/page-schema-player/index.html
var testSubEnv = ['betaa', 'betab', 'betac', 'betad'];
// 沙箱环境
// 例如: https://static-stage.test.com/path/to/page-schema-player/index.html
var stageDomainKeyword = 'stage';

/**
 * 获取默认的环境模式(自动识别)
 * 
 * @return {string}
 */
export default function getDefaultMode() {
    var mode = '';

    var hostname = window.location.hostname;
    if (hostname.replace(/[\d\.]/g, '') === '') { // 通过 IP 访问时为开发环境
        mode = 'dev';
    } else if (hostname === 'localhost') { // localhost 时为开发环境
        mode = 'dev';
    } else if (getMainDomain(hostname) === testEnvMainDomain) { // 根据域名规则来界定测试环境和沙箱环境
        mode = 'test';

        var lastLevelDomain = getLastLevelDomain(hostname);
        for (var i = 0, length = testSubEnv.length; i < length; i++) {
            if (lastLevelDomain.indexOf(testSubEnv[i]) !== -1) {
                mode = testSubEnv[i];
                break;
            }
        }

        if (lastLevelDomain.indexOf(stageDomainKeyword) !== -1) {
            mode = 'stage';
        }
    } else { // 默认环境模式为生产环境
        mode = 'production';
    }

    return mode;
}