// Any other constants will be here
export default {
    // Headers
    COOKIE_JWT: 'jwt_blogger',
    HEADER_AUTH: 'authorization',
    LOCAL_STR_TOKEN: 'token',

    // Errors
    CONNECTION_ERROR: 'Could not connect to server',
    SERVER_ERROR: 'Internal server error',

    // Table
    TABLE_MAX_PAGES: 10,
    TABLE_LIMIT: 10,

    // Comments & ReactionsLimit
    COMMENT_ROWS_LIMIT: 5,
    REACTION_USER_ROWS_LIMIT: 20,

    // Validators
    // User
    USERNAME_MIN_LENGTH: 5,
    USERNAME_MAX_LENGTH: 20,
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_MAX_LENGTH: 20,
    FIRST_NAME_MIN_LENGTH: 1,
    FIRST_NAME_MAX_LENGTH: 50,
    LAST_NAME_MIN_LENGTH: 1,
    LAST_NAME_MAX_LENGTH: 50,
    // Group
    GROUP_NAME_MIN_LENGTH: 5,
    GROUP_NAME_MAX_LENGTH: 120,
    GROUP_DESC_MIN_LENGTH: 5,
    GROUP_DESC_MAX_LENGTH: 120,
    // Blog
    BLOG_TITLE_MIN_LENGTH: 5,
    BLOG_TITLE_MAX_LENGTH: 120,
    BLOG_CONT_MIN_LENGTH: 5,
    BLOG_CONT_MAX_LENGTH: Number.NaN,
    // Comment
    COMMENT_MIN_LENGTH: 5,
    COMMENT_MAX_LENGTH: 1000,
};