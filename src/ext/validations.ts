import {
    addRule
} from 'amis';
import {
    validations,
    validateMessages // 可用于覆盖默认的验证信息
} from 'amis/lib/utils/validations';

addRule('isPhone', function(values, value) {
    return validations.matchRegexp(values, value, /^1\d{10}$/);
}, '请输入正确的手机号码');