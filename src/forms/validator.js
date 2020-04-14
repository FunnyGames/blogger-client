import constants from '../constants/global.constants';

export function validateFirstName(errors, values) {
    let options = {
        min: constants.FIRST_NAME_MIN_LENGTH,
        max: constants.FIRST_NAME_MAX_LENGTH,
        allowSpaces: true
    }
    validate(errors, values, 'firstName', 'first name', options);
}

export function validateLastName(errors, values) {
    let options = {
        min: constants.LAST_NAME_MIN_LENGTH,
        max: constants.LAST_NAME_MAX_LENGTH,
        allowSpaces: true
    }
    validate(errors, values, 'lastName', 'last name', options);
}

export function validateEmail(errors, values) {
    let options = {
        regex: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        regexError: 'Invalid email'
    }
    validate(errors, values, 'email', 'email', options);
}

export function validateUsername(errors, values, username) {
    let options = {
        min: constants.USERNAME_MIN_LENGTH,
        max: constants.USERNAME_MAX_LENGTH,
        regex: /^[a-zA-Z0-9]+$/,
        regexError: 'You can use only these characters: English alphabet (a-z, A-Z), numericals (0-9)'
    }
    if (username) {
        options.regex = new RegExp(`^${username}$`, 'i');
        options.regexError = `You didn't enter your username correctly`;
    }
    validate(errors, values, 'username', 'username', options);
}

export function validatePassword(errors, values, fieldName) {
    if (!fieldName) fieldName = 'password';
    let options = {
        min: constants.PASSWORD_MIN_LENGTH,
        max: constants.PASSWORD_MAX_LENGTH
    }
    validate(errors, values, fieldName, 'password', options);
}

export function validateGroupName(errors, values) {
    let options = {
        min: constants.GROUP_NAME_MIN_LENGTH,
        max: constants.GROUP_NAME_MAX_LENGTH,
        allowSpaces: true
    }
    validate(errors, values, 'name', 'group name', options);
}

export function validateGroupDescription(errors, values) {
    let options = {
        min: constants.GROUP_DESC_MIN_LENGTH,
        max: constants.GROUP_DESC_MAX_LENGTH,
        allowSpaces: true
    }
    validate(errors, values, 'description', 'group description', options);
}

export function validateBlogTitle(errors, values) {
    let options = {
        min: constants.BLOG_TITLE_MIN_LENGTH,
        max: constants.BLOG_TITLE_MAX_LENGTH,
        allowSpaces: true
    }
    validate(errors, values, 'title', 'title', options);
}

export function validateBlogContent(errors, values) {
    let options = {
        min: constants.BLOG_CONT_MIN_LENGTH,
        max: constants.BLOG_CONT_MAX_LENGTH,
        allowSpaces: true
    }
    validate(errors, values, 'content', 'blog content', options);
}

export function validateComment(errors, values) {
    let options = {
        min: constants.COMMENT_MIN_LENGTH,
        max: constants.COMMENT_MAX_LENGTH,
        allowSpaces: true
    }
    validate(errors, values, 'content', 'comment content', options);
}

function validate(errors, values, fieldName, text, options) {
    let field = values[fieldName];
    if (!field) {
        errors[fieldName] = `You must enter ${text}`;
    } else if (field.length < options.min && Number.isNaN(options.max)) {
        errors[fieldName] = `Length must be at least ${options.min} characters long`;
    } else if (field.length < options.min || field.length > options.max) {
        errors[fieldName] = `Length must be between ${options.min} and ${options.max} characters long`;
    } else if (!options.allowSpaces && field.includes(' ')) {
        errors[fieldName] = `Spaces are not allowed in ${text}`;
    } else if (options.regex) {
        let regex = options.regex;
        if (!regex.test(field)) {
            errors[fieldName] = options.regexError;
        }
    }
}