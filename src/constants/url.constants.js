// All urls to server will be here

const api = '/api/v1';

export default {
    // Users
    LOGIN: api + '/users/login',
    REGISTER: api + '/users/register',
    LOGOUT: api + '/users/logout',
    CHECK_USERNAME_AVAILABILITY: api + '/users/available',
    GET_PROFILE: api + '/users/profile',
    UPDATE_PROFILE: api + '/users/update/profile',
    UPDATE_PASSWORD: api + '/users/update/password',
    GET_USER_GROUPS: api + '/users/:id/groups',
    GET_USERS: api + '/users',
    GET_USER_PROFILE: api + '/users/:id',
    CANCEL_ACCOUNT: api + '/users/cancel',

    // Groups
    GET_GROUPS: api + '/groups',
    GET_GROUP: api + '/groups/:id',
    GET_GROUP_USERS: api + '/groups/:id/users',
    UPDATE_GROUP: api + '/groups/:id',
    CREATE_GROUP: api + '/groups',
    ADD_USER_TO_GROUP: api + '/groups/:id/users/:userId',
    REMOVE_USER_FROM_GROUP: api + '/groups/:id/users/:userId',

    // Blogs
    GET_BLOGS: api + '/blogs',
    GET_BLOG: api + '/blogs/:id',
    UPDATE_BLOG: api + '/blogs/:id',
    CREATE_BLOG: api + '/blogs',
    GET_BLOG_MEMBERS: api + '/blogs/:id/members',

    // Comments
    GET_COMMENTS: api + '/comments/:id/get',
    CREATE_COMMENT: api + '/comments/:id',
    UPDATE_COMMENT: api + '/comments/:id',
    DELETE_COMMENT: api + '/comments/:id',

    // Reactions
    CREATE_REACTION: api + '/reactions/:id',
    GET_REACTIONS: api + '/reactions/:id',
    GET_USERS_REACTIONS: api + '/reactions/:id/users',
    DELETE_REACTION: api + '/reactions/:id',

    // Notifications
    GET_NOTIFICATIONS: api + '/notifications',
    GET_SHORT_NOTIFICATIONS: api + '/notifications/short',
    GET_TOTAL_NOTIFICATIONS: api + '/notifications/total',
    MARK_ALL_READ_NOTIFICATIONS: api + '/notifications/readall',
    MARK_READ_NOTIFICATION: api + '/notifications/:id/read',
}