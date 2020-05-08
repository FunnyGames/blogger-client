import { notificationConstants, userConstants } from '../constants';

export function notifications(state = {}, action) {
    switch (action.type) {
        case notificationConstants.GET_NOTIFICATIONS_REQUEST:
            return { loading: true };
        case notificationConstants.GET_NOTIFICATIONS_SUCCESS:
            return { ...action.payload };
        case notificationConstants.GET_NOTIFICATIONS_FAILURE:
            return { error: action.error };

        case notificationConstants.MARK_READ_SUCCESS:
            markById(state, action.id);
            return { ...state };

        case notificationConstants.MARK_READ_ALL_SUCCESS:
            markAll(state);
            return { ...state };

        case userConstants.LOGOUT_SUCCESS:
            return {};

        default:
            return state;
    }
}

export function shortNotifications(state = {}, action) {
    switch (action.type) {
        case notificationConstants.GET_SHORT_NOTIFICATIONS_REQUEST:
            return { loading: true };
        case notificationConstants.GET_SHORT_NOTIFICATIONS_SUCCESS:
            return { ...action.payload };
        case notificationConstants.GET_SHORT_NOTIFICATIONS_FAILURE:
            return { error: action.error };

        case notificationConstants.MARK_READ_SUCCESS:
            markById(state, action.other);
            return { ...state };

        case notificationConstants.MARK_READ_ALL_SUCCESS:
            markAll(state);
            return { ...state };

        case userConstants.LOGOUT_SUCCESS:
            return {};

        default:
            return state;
    }
}

export function totalNotifications(state = {}, action) {
    switch (action.type) {
        case notificationConstants.GET_TOTAL_NOTIFICATIONS_REQUEST:
            return { loading: true };
        case notificationConstants.GET_TOTAL_NOTIFICATIONS_SUCCESS:
            return { ...action.payload };
        case notificationConstants.GET_TOTAL_NOTIFICATIONS_FAILURE:
            return { error: action.error };

        case notificationConstants.GET_NOTIFICATIONS_SUCCESS:
        case notificationConstants.GET_SHORT_NOTIFICATIONS_SUCCESS:
            return { count: 0 };

        case notificationConstants.NEW_NOTIFICATION:
            let count = state.count || 0;
            ++count;
            return { count };

        case userConstants.LOGOUT_SUCCESS:
            return {};

        default:
            return state;
    }
}

function markAll(state) {
    if (state && state.notifications) {
        let nts = state.notifications;
        let length = nts.length;
        for (let i = 0; i < length; ++i) {
            let n = nts[i];
            n.read = true;
        }
    }
}

function markById(state, id) {
    if (state && state.notifications) {
        let nts = state.notifications;
        let length = nts.length;
        for (let i = 0; i < length; ++i) {
            let n = nts[i];
            if (n._id === id) {
                n.read = true;
                break;
            }
        }
    }
}