// All router paths will be here
export default {
    // Static
    HOMEPAGE: '/',
    ABOUT: '/about',
    PRIVACY: '/privacy',
    SUPPORT: '/support',

    // Users
    LOGIN: '/login',
    REGISTER: '/register',
    USERS: '/users',
    USER: '/users/:id',

    // Settings
    PROFILE: '/profile',
    EDIT_PASSWORD: '/profile/password',
    NOTIFICATIONS_SETTINGS: '/profile/notifications',
    CANCEL_ACCOUNT: '/profile/cancel',
    BLOCKED_USERS: '/profile/blocked',
    PROFILE_GROUPS: '/profile/groups',
    SUBSCRIPTIONS: '/profile/subscriptions',

    // Groups
    GROUPS: '/groups',
    GROUP: '/groups/:id',
    ADD_GROUP: '/groups/add',

    // Blogs
    BLOGS: '/blogs',
    BLOG: '/blogs/:id',
    BLOG_EDIT: '/blogs/:id/edit',
    ADD_BLOG: '/blogs/add',
    USER_BLOGS: '/users/:id/blogs',

    // Notifications
    NOTIFICATIONS: '/notifications',

    // Chat
    CHAT: '/chat',
    VIEW_CHAT: '/chat/:id',
}