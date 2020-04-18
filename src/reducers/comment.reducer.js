import { commentConstants, userConstants } from '../constants';

export function comments(state = {}, action) {
    switch (action.type) {
        case commentConstants.GET_COMMENTS_REQUEST:
            return { ...state, loading: true };
        case commentConstants.GET_COMMENTS_SUCCESS:
            let data = state.data;
            if (!state.data) data = [];
            data = data.concat(action.payload.comments);
            let total = state.metadata ? state.metadata.overall : 0;
            action.payload.metadata.overall = Math.max(action.payload.metadata.total, total);
            return { data, metadata: action.payload.metadata };
        case commentConstants.GET_COMMENTS_FAILURE:
            return { error: action.error };
        case commentConstants.GET_COMMENTS_CLEAR:
        case userConstants.LOGOUT_SUCCESS:
            return {};

        default:
            return state;
    }
}