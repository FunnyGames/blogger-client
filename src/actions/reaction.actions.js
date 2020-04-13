import { reactionConstants } from '../constants';
import { reactionService } from '../services';
import { alertActions, returnError, alertRefersh } from '../actions';

export const reactionActions = {
    getReactions,
    createReaction,
    deleteReaction,
    getUsersReactions,
    clear
};

function getReactions(blogId) {
    return dispatch => {
        dispatch(request());

        reactionService.getReactions(blogId)
            .then(
                data => {
                    dispatch(success(data));
                },
                error => returnError(dispatch, failure, error, true)
            );
    };

    function request() { return { type: reactionConstants.GET_REACTIONS_REQUEST } }
    function success(payload) { return { type: reactionConstants.GET_REACTIONS_SUCCESS, payload } }
    function failure(error) { return { type: reactionConstants.GET_REACTIONS_FAILURE, error } }
}

function createReaction(blogId, data) {
    return dispatch => {
        dispatch(request());

        reactionService.createReaction(blogId, data)
            .then(
                data => {
                    dispatch(success(data));
                },
                error => returnError(dispatch, failure, error, true)
            );
    };

    function request() { return { type: reactionConstants.CREATE_REACTION_REQUEST } }
    function success(payload) { return { type: reactionConstants.CREATE_REACTION_SUCCESS, payload } }
    function failure(error) { return { type: reactionConstants.CREATE_REACTION_FAILURE, error } }
}

function getUsersReactions(blogId, data, limit) {
    return dispatch => {
        dispatch(request());

        reactionService.getUsersReactions(blogId, data, limit)
            .then(
                data => {
                    dispatch(success(data));
                },
                error => returnError(dispatch, failure, error, true)
            );
    };

    function request() { return { type: reactionConstants.GET_REACTIONS_USERS_REQUEST } }
    function success(payload) { return { type: reactionConstants.GET_REACTIONS_USERS_SUCCESS, payload } }
    function failure(error) { return { type: reactionConstants.GET_REACTIONS_USERS_FAILURE, error } }
}

function deleteReaction(reactionId) {
    return dispatch => {
        dispatch(request());

        reactionService.deleteReaction(reactionId)
            .then(
                data => {
                    dispatch(success(data));
                },
                error => returnError(dispatch, failure, error, true)
            );
    };

    function request() { return { type: reactionConstants.DELETE_REACTION_REQUEST } }
    function success(payload) { return { type: reactionConstants.DELETE_REACTION_SUCCESS, payload } }
    function failure(error) { return { type: reactionConstants.DELETE_REACTION_FAILURE, error } }
}

function clear() {
    return { type: reactionConstants.GET_REACTIONS_CLEAR };
}