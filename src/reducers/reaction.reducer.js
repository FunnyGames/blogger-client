import { reactionConstants } from '../constants';

export function reactions(state = {}, action) {
    switch (action.type) {
        case reactionConstants.GET_REACTIONS_REQUEST:
            return { loading: true };
        case reactionConstants.GET_REACTIONS_SUCCESS:
            return { ...action.payload };
        case reactionConstants.GET_REACTIONS_FAILURE:
            return { error: action.error };

        case reactionConstants.CREATE_REACTION_REQUEST:
            return { ...state, myReaction: { loading: true } };
        case reactionConstants.CREATE_REACTION_SUCCESS:
            return { ...action.payload };
        case reactionConstants.CREATE_REACTION_FAILURE:
            return { ...state, myReaction: { error: action.error } };

        case reactionConstants.DELETE_REACTION_REQUEST:
            return { ...state, myReaction: { loading: true } };
        case reactionConstants.DELETE_REACTION_SUCCESS:
            return { ...action.payload, myReaction: {} };
        case reactionConstants.DELETE_REACTION_FAILURE:
            return { ...state, myReaction: { error: action.error } };

        default:
            return state;
    }
}


export function userReactions(state = {}, action) {
    switch (action.type) {
        case reactionConstants.GET_REACTIONS_USERS_REQUEST:
            return { ...state, loading: true };
        case reactionConstants.GET_REACTIONS_USERS_SUCCESS:
            let data = state.reactions;
            if (!state.reactions) data = [];
            data = data.concat(action.payload.reactions);
            let total = state.metadata ? state.metadata.overall : 0;
            action.payload.metadata.overall = Math.max(action.payload.metadata.total, total);
            return { reactions: data, metadata: action.payload.metadata };
        case reactionConstants.GET_REACTIONS_USERS_FAILURE:
            return { error: action.error };
        case reactionConstants.GET_REACTIONS_CLEAR:
            return {};

        default:
            return state;
    }
}
