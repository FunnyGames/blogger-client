import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import { alert } from './alert.reducer';
import { user, userAvailable, users, profile, userGroups, subscriptions, forgotPassword } from './user.reducer';
import { groups, group, groupUsers } from './group.reducer';
import { blogs, blog, members } from './blog.reducer';
import { update } from './update.reducer';
import { comments } from './comment.reducer';
import { reactions, userReactions } from './reaction.reducer';
import { notifications, shortNotifications, totalNotifications } from './notification.reducer';
import { friends, totalFriendRequests, requests, allRequests } from './friend.reducer';
import { chats, totalMessages, messages, blocked } from './chat.reducer';
import { settings } from './setting.reducer';

const rootReducer = combineReducers({
    alert,
    blogs,
    blog,
    chats,
    blocked,
    totalMessages,
    messages,
    notifications,
    shortNotifications,
    totalNotifications,
    userReactions,
    reactions,
    comments,
    members,
    group,
    groups,
    groupUsers,
    users,
    user,
    userGroups,
    subscriptions,
    settings,
    update,
    profile,
    userAvailable,
    friends,
    requests,
    allRequests,
    totalFriendRequests,
    forgotPassword,
    form: formReducer
});

export default rootReducer;