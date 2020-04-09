import { commentConstants } from '../constants';

export function comments(state = {}, action) {
    switch (action.type) {
        case commentConstants.GET_COMMENTS_REQUEST:
            return { ...state, loading: true };
        case commentConstants.GET_COMMENTS_SUCCESS:
            let data = state.data;
            if (!state.data) data = [];
            data = data.concat(action.payload.comments);
            return { data, metadata: action.payload.metadata };
        case commentConstants.GET_COMMENTS_FAILURE:
            return { error: action.error };
        case commentConstants.GET_COMMENTS_CLEAR:
            return {};

        default:
            return state;
    }
}