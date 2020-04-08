import { groupConstants } from '../constants';

export function groups(state = {}, action) {
    switch (action.type) {
        case groupConstants.GET_GROUPS_REQUEST:
            return { loading: true };
        case groupConstants.GET_GROUPS_SUCCESS:
            return { data: action.payload.groups, metadata: action.payload.metadata };
        case groupConstants.GET_GROUPS_FAILURE:
            return { error: action.error };

        default:
            return state;
    }
}

export function group(state = {}, action) {
    switch (action.type) {
        case groupConstants.GET_GROUP_REQUEST:
            return { loading: true };
        case groupConstants.GET_GROUP_SUCCESS:
            return { ...action.payload };
        case groupConstants.GET_GROUP_FAILURE:
            let notFound = action.status === 404 || action.status === 400;
            return { error: action.error, status: action.status, notFound };

        default:
            return state;
    }
}

export function groupUsers(state = {}, action) {
    switch (action.type) {
        case groupConstants.GET_GROUP_USERS_REQUEST:
            return { loading: true };
        case groupConstants.GET_GROUP_USERS_SUCCESS:
            return { data: action.payload.users, metadata: action.payload.metadata };
        case groupConstants.GET_GROUP_USERS_FAILURE:
            return { error: action.error };

        default:
            return state;
    }
}