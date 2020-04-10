import { commentConstants } from '../constants';
import globalConstants from '../constants/global.constants';

export function comments(state = {}, action) {
    switch (action.type) {
        case commentConstants.GET_COMMENTS_REQUEST:
            return { ...state, loading: true };
        case commentConstants.GET_COMMENTS_SUCCESS:
            let data = state.data;
            if (!state.data) data = [];
            let d = data.concat(action.payload.comments);
            data = filterDuplicates(d);
            action.payload.metadata.end = action.payload.comments.length < globalConstants.COMMENT_ROWS_LIMIT;
            return { data, metadata: action.payload.metadata };
        case commentConstants.GET_COMMENTS_FAILURE:
            return { error: action.error };
        case commentConstants.GET_COMMENTS_CLEAR:
            return {};

        default:
            return state;
    }
}

function filterDuplicates(arr) {
    return arr.filter((comment, index, self) =>
        index === self.findIndex((c) => (
            c._id === comment._id
        ))
    );
}