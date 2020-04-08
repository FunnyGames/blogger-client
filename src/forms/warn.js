import constants from '../constants/global.constants';

export function warnPassword(warnings, values) {
    let strength = 0;
    const password = values.password;
    if (password && password.length >= constants.PASSWORD_MIN_LENGTH) {
        var hasUpperCase = /[A-Z]/.test(password);
        var hasLowerCase = /[a-z]/.test(password);
        var hasNumbers = /\d/.test(password);
        var hasNonalphas = /\W/.test(password);
        strength = hasUpperCase + hasLowerCase + hasNumbers + hasNonalphas;
    }
    warnings.password = {
        strength
    };
}