import { reactionConstants } from '../constants';
import { reactionService } from '../services';
import { perform } from './base.actions';

export const reactionActions = {
    getReactions,
    createReaction,
    deleteReaction,
    getUsersReactions,
    clear
};

function getReactions(blogId) {
    const datax = blogId;
    const actions = {
        request: reactionConstants.GET_REACTIONS_REQUEST,
        success: reactionConstants.GET_REACTIONS_SUCCESS,
        failure: reactionConstants.GET_REACTIONS_FAILURE
    };
    return perform(reactionService.getReactions, datax, actions);
}

function createReaction(blogId, data) {
    const datax = { blogId, data };
    const actions = {
        request: reactionConstants.CREATE_REACTION_REQUEST,
        success: reactionConstants.CREATE_REACTION_SUCCESS,
        failure: reactionConstants.CREATE_REACTION_FAILURE
    };
    return perform(reactionService.createReaction, datax, actions);
}

function getUsersReactions(blogId, data, limit) {
    const datax = { blogId, data, limit };
    const actions = {
        request: reactionConstants.GET_REACTIONS_USERS_REQUEST,
        success: reactionConstants.GET_REACTIONS_USERS_SUCCESS,
        failure: reactionConstants.GET_REACTIONS_USERS_FAILURE
    };
    return perform(reactionService.getUsersReactions, datax, actions);
}

function deleteReaction(reactionId) {
    const datax = reactionId;
    const actions = {
        request: reactionConstants.DELETE_REACTION_REQUEST,
        success: reactionConstants.DELETE_REACTION_SUCCESS,
        failure: reactionConstants.DELETE_REACTION_FAILURE
    };
    return perform(reactionService.deleteReaction, datax, actions);
}

function clear() {
    return { type: reactionConstants.GET_REACTIONS_CLEAR };
}