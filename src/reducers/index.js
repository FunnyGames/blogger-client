import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import { alert } from './alert.reducer';
import { user, userAvailable, users, profile, userGroups } from './user.reducer';
import { groups, group, groupUsers } from './group.reducer';
import { blogs, blog, members } from './blog.reducer';
import { update } from './update.reducer';
import { comments } from './comment.reducer';
import { reactions, userReactions } from './reaction.reducer';
import { notifications, shortNotifications, totalNotifications } from './notification.reducer';

const rootReducer = combineReducers({
    alert,
    blogs,
    blog,
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
    update,
    profile,
    userAvailable,
    form: formReducer
});

export default rootReducer;