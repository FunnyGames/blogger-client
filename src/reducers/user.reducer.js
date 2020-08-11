import { userConstants, friendConstants } from '../constants';
import globalConstants from '../constants/global.constants';
const { LOCAL_STR_TOKEN } = globalConstants;

const jwt = localStorage.getItem(LOCAL_STR_TOKEN);
const initialState = {
    loggedIn: (jwt ? true : false)
};

export function user(state = initialState, action) {
    switch (action.type) {
        case userConstants.REGISTER_REQUEST:
        case userConstants.LOGIN_REQUEST:
            return {
                loggingIn: true
            };
        case userConstants.REGISTER_SUCCESS:
        case userConstants.LOGIN_SUCCESS:
            return {
                loggedIn: true
            };
        case userConstants.REGISTER_FAILURE:
        case userConstants.LOGIN_FAILURE:
            return {
                loggedIn: false,
                error: action.error
            };

        case userConstants.CANCEL_ACCOUNT_SUCCESS:
        case userConstants.LOGOUT_SUCCESS:
            return { loggedIn: false, user: {} };

        case userConstants.GET_PROFILE_REQUEST:
            return { loggedIn: state.loggedIn, loading: true };
        case userConstants.GET_PROFILE_SUCCESS:
            return { loggedIn: state.loggedIn, user: action.user };
        case userConstants.GET_PROFILE_FAILURE:
            return { loggedIn: state.loggedIn, error: action.error };

        case userConstants.UPLOAD_AVATAR_REQUEST:
        case userConstants.UPLOAD_AVATAR_FAILURE:
        case userConstants.DELETE_AVATAR_REQUEST:
        case userConstants.DELETE_AVATAR_FAILURE:
            return { ...state, avatarUpdated: false };

        case userConstants.UPLOAD_AVATAR_SUCCESS:
            let u = {
                ...state.user,
                avatar: action.payload.data.avatar
            };
            return { ...state, user: u, avatarUpdated: true };

        case userConstants.DELETE_AVATAR_SUCCESS:
            let us = {
                ...state.user,
                avatar: ''
            };
            return { ...state, user: us, avatarUpdated: true };

        default:
            return state;
    }
}

export function userAvailable(state = {}, action) {
    let data = {};
    data.error = state.error;
    if (!data.error) data.error = {};
    switch (action.type) {
        case userConstants.USER_AVAILABLE_REQUEST:
            if (action.available.username) {
                data.checking = 'username';
            } else if (action.available.email) {
                data.checking = 'email';
            }
            return data;
        case userConstants.USER_AVAILABLE_SUCCESS:
            if (state.checking === 'username') {
                delete data.error.username;
            } else if (state.checking === 'email') {
                delete data.error.email;
            }
            return data;
        case userConstants.USER_AVAILABLE_FAILURE:
            if (action.error.data && action.error.data.email) data.error.email = true;
            else if (action.error.data && action.error.data.username) data.error.username = true;
            return data;

        case userConstants.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}

export function users(state = {}, action) {
    switch (action.type) {
        case userConstants.GET_USERS_REQUEST:
            return { loading: true };
        case userConstants.GET_USERS_SUCCESS:
            return { data: action.payload.users, metadata: action.payload.metadata };
        case userConstants.GET_USERS_FAILURE:
            return { error: action.error };

        case userConstants.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}

export function profile(state = {}, action) {
    switch (action.type) {
        case userConstants.GET_USER_PROFILE_REQUEST:
            return { loading: true };
        case userConstants.GET_USER_PROFILE_SUCCESS:
            return { ...action.payload };
        case userConstants.GET_USER_PROFILE_FAILURE:
            let notFound = action.status === 404 || action.status === 400;
            return { error: action.error, status: action.status, notFound };

        case userConstants.SUBSCRIBE_SUCCESS:
            return { ...state, subscribed: true, subLoading: undefined };

        case userConstants.UNSUBSCRIBE_SUCCESS:
            return { ...state, subscribed: false, subLoading: undefined };

        case userConstants.SUBSCRIBE_REQUEST:
        case userConstants.UNSUBSCRIBE_REQUEST:
            return { ...state, subLoading: true };

        case friendConstants.FRIEND_ACCEPT_SUCCESS:
            if (!state.friend) return state;
            if (state.friend._id !== action.other) return state;
            return { ...state, friendLoading: undefined, friend: { ...state.friend, pending: false } };

        case friendConstants.UNFRIEND_SUCCESS:
            if (!state.friend) return state;
            if (state.friend._id !== action.other) return state;
            return { ...state, friendLoading: undefined, friend: null };

        case friendConstants.FRIEND_SUCCESS:
            return { ...state, friend: action.payload, friendLoading: false };

        case friendConstants.NEW_FRIEND_REQUEST:
            if (state.friend) return state;
            if (state._id !== action.data.content.userId1 && state._id !== action.data.content.userId2) return state;
            return { ...state, friend: action.data.content, friendLoading: false };

        case friendConstants.NEW_FRIEND_ACCEPT:
            if (!state.friend) return state;
            if (state.friend._id !== action.data.content._id) return state;
            return { ...state, friend: action.data.content, friendLoading: false };

        case friendConstants.FRIEND_REQUEST:
            return { ...state, friendLoading: true };

        case friendConstants.UNFRIEND_REQUEST:
        case friendConstants.FRIEND_ACCEPT_REQUEST:
            if (!state.friend) return state;
            if (state.friend._id !== action.other) return state;
            return { ...state, friendLoading: true };

        case userConstants.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}

export function userGroups(state = {}, action) {
    switch (action.type) {
        case userConstants.GET_GROUPS_REQUEST:
            return { loading: true };
        case userConstants.GET_GROUPS_SUCCESS:
            return { data: action.payload.groups, metadata: action.payload.metadata };
        case userConstants.GET_GROUPS_FAILURE:
            return { error: action.error };

        case userConstants.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}

export function subscriptions(state = {}, action) {
    switch (action.type) {
        case userConstants.GET_SUBSCRIPTIONS_REQUEST:
            return { loading: true };
        case userConstants.GET_SUBSCRIPTIONS_SUCCESS:
            return { data: action.payload.users, metadata: action.payload.metadata };
        case userConstants.GET_SUBSCRIPTIONS_FAILURE:
            return { error: action.error };

        case userConstants.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}

export function subscribers(state = {}, action) {
    switch (action.type) {
        case userConstants.GET_SUBSCRIBERS_REQUEST:
            return { loading: true };
        case userConstants.GET_SUBSCRIBERS_SUCCESS:
            return { data: action.payload.users, metadata: action.payload.metadata };
        case userConstants.GET_SUBSCRIBERS_FAILURE:
            return { error: action.error };

        case userConstants.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}

export function forgotPassword(state = {}, action) {
    switch (action.type) {
        case userConstants.FORGOT_PASSWORD_REQUEST:
            return { loading: true };
        case userConstants.FORGOT_PASSWORD_SUCCESS:
            return { ...action.payload };
        case userConstants.FORGOT_PASSWORD_FAILURE:
            return { error: action.error };

        case userConstants.RESET_PASSWORD_REQUEST:
            return { loading: true };
        case userConstants.RESET_PASSWORD_SUCCESS:
            return { ...action.payload };
        case userConstants.RESET_PASSWORD_FAILURE:
            return { error: action.error };

        case userConstants.LOGOUT_SUCCESS:
        case userConstants.LOGIN_SUCCESS:
        case userConstants.REGISTER_SUCCESS:
            return {};
        default:
            return state;
    }
}

export function emailConfirm(state = {}, action) {
    switch (action.type) {
        case userConstants.EMAIL_CONFIRM_REQUEST:
            return { loading: true };
        case userConstants.EMAIL_CONFIRM_SUCCESS:
            return { ...action.payload };
        case userConstants.EMAIL_CONFIRM_FAILURE:
            return { error: action.error };

        case userConstants.LOGOUT_SUCCESS:
        case userConstants.LOGIN_SUCCESS:
        case userConstants.REGISTER_SUCCESS:
            return {};

        default:
            return state;
    }
}

export function unsubscribeEmail(state = {}, action) {
    switch (action.type) {
        case userConstants.UNSUBSCRIBE_EMAIL_REQUEST:
            return { loading: true };
        case userConstants.UNSUBSCRIBE_EMAIL_SUCCESS:
            return { ...action.payload };
        case userConstants.UNSUBSCRIBE_EMAIL_FAILURE:
            return { error: action.error };

        case userConstants.LOGOUT_SUCCESS:
        case userConstants.LOGIN_SUCCESS:
        case userConstants.REGISTER_SUCCESS:
            return {};

        default:
            return state;
    }
}