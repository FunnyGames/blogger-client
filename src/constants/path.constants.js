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
    FORGOT_PASSWORD: '/forgot',
    RESET_PASSWORD: '/reset/:token',
    USERS: '/users',
    USER: '/users/:id',
    USER_BLOGS: '/users/:id/blogs',
    USER_GROUPS: '/users/:id/groups',
    USER_FRIENDS: '/users/:id/friends',

    // Settings
    PROFILE: '/profile',
    EDIT_PASSWORD: '/profile/password',
    NOTIFICATIONS_SETTINGS: '/profile/notifications',
    CANCEL_ACCOUNT: '/profile/cancel',
    FRIENDS: '/profile/friends',
    FRIEND_REQUESTS: '/profile/requests',
    BLOCKED_USERS: '/profile/blocked',
    PROFILE_GROUPS: '/profile/groups',
    PROFILE_BLOGS: '/profile/blogs',
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

    // Notifications
    NOTIFICATIONS: '/notifications',

    // Chat
    CHAT: '/chat',
    VIEW_CHAT: '/chat/:id',
}