import { friendConstants, userConstants } from '../constants';

export function friends(state = {}, action) {
    switch (action.type) {
        case friendConstants.GET_FRIENDS_REQUEST:
            return { loading: true };
        case friendConstants.GET_FRIENDS_SUCCESS:
            return { data: action.payload.users, metadata: action.payload.metadata };
        case friendConstants.GET_FRIENDS_FAILURE:
            return { error: action.error };

        case userConstants.LOGOUT_SUCCESS:
            return {};

        default:
            return state;
    }
}

export function totalFriendRequests(state = {}, action) {
    let count;
    switch (action.type) {
        case friendConstants.GET_TOTAL_FRIENDS_REQUEST:
            return { loading: true };
        case friendConstants.GET_TOTAL_FRIENDS_SUCCESS:
            return { ...action.payload };
        case friendConstants.GET_TOTAL_FRIENDS_FAILURE:
            return { error: action.error };

        case friendConstants.FRIEND_ACCEPT_SUCCESS:
        case friendConstants.UNFRIEND_SUCCESS:
            count = state.count ? state.count.filter(c => c !== action.other) : [];
            return { count };

        case friendConstants.NEW_FRIEND_REQUEST:
            count = state.count ? [...state.count, action.data.content._id] : [action.data.content._id];
            return { count };

        case friendConstants.GET_FRIENDS_REQ_SUCCESS:
            count = action.payload.users.map(c => c._id);
            return { count };

        case userConstants.LOGOUT_SUCCESS:
            return {};

        default:
            return state;
    }
}

export function requests(state = {}, action) {
    switch (action.type) {
        case friendConstants.GET_FRIENDS_REQ_REQUEST:
            return { loading: true };
        case friendConstants.GET_FRIENDS_REQ_SUCCESS:
            return { data: action.payload.users, metadata: action.payload.metadata };
        case friendConstants.GET_FRIENDS_REQ_FAILURE:
            return { error: action.error };

        case friendConstants.FRIEND_ACCEPT_SUCCESS:
        case friendConstants.UNFRIEND_SUCCESS:
            if (state && state.data) {
                state.data = state.data.filter(u => u._id !== action.other);
            }
            return { ...state };

        case userConstants.LOGOUT_SUCCESS:
            return {};

        default:
            return state;
    }
}

export function allRequests(state = {}, action) {
    switch (action.type) {
        case friendConstants.GET_FRIENDS_ALL_REQ_REQUEST:
            return { loading: true };
        case friendConstants.GET_FRIENDS_ALL_REQ_SUCCESS:
            return { data: action.payload.users, metadata: action.payload.metadata };
        case friendConstants.GET_FRIENDS_ALL_REQ_FAILURE:
            return { error: action.error };

        case friendConstants.FRIEND_ACCEPT_SUCCESS:
        case friendConstants.UNFRIEND_SUCCESS:
            if (state && state.data) {
                state.data = state.data.filter(u => u._id !== action.other);
            }
            return { ...state };

        case userConstants.LOGOUT_SUCCESS:
            return {};

        default:
            return state;
    }
}