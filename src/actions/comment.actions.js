import { commentConstants } from '../constants';
import { commentService } from '../services';
import { alertActions, returnError, alertRefersh } from '../actions';

export const commentActions = {
    getComments,
    createComment,
    updateComment,
    deleteComment,
    clear
};

function getComments(blogId, limit, seenIds) {
    return dispatch => {
        dispatch(request());

        commentService.getComments(blogId, limit, seenIds)
            .then(
                data => {
                    dispatch(success(data));
                },
                error => returnError(dispatch, failure, error, true)
            );
    };

    function request() { return { type: commentConstants.GET_COMMENTS_REQUEST } }
    function success(payload) { return { type: commentConstants.GET_COMMENTS_SUCCESS, payload } }
    function failure(error) { return { type: commentConstants.GET_COMMENTS_FAILURE, error } }
}

function createComment(blogId, data) {
    return dispatch => {
        dispatch(request(data));

        commentService.createComment(blogId, data)
            .then(
                data => {
                    dispatch(success(data));
                    dispatch(alertActions.success(`Comment added successfully`));
                    dispatch(alertActions.refresh(alertRefersh.CREATE_COMMENT));
                },
                error => returnError(dispatch, failure, error, true)
            );
    };

    function request(data) { return { type: commentConstants.CREATE_COMMENT_REQUEST, data } }
    function success(payload) { return { type: commentConstants.CREATE_COMMENT_SUCCESS, payload } }
    function failure(error) { return { type: commentConstants.CREATE_COMMENT_FAILURE, error } }
}

function updateComment(commentId, data) {
    return dispatch => {
        dispatch(request());

        commentService.updateComment(commentId, data)
            .then(
                data => {
                    dispatch(success(data));
                    dispatch(alertActions.success(`Comment updated successfully`));
                    dispatch(alertActions.refresh(alertRefersh.UPDATE_COMMENT));
                },
                error => returnError(dispatch, failure, error, true)
            );
    };

    function request() { return { type: commentConstants.UPDATE_COMMENT_REQUEST } }
    function success(payload) { return { type: commentConstants.UPDATE_COMMENT_SUCCESS, payload } }
    function failure(error) { return { type: commentConstants.UPDATE_COMMENT_FAILURE, error } }
}

function deleteComment(commentId) {
    return dispatch => {
        dispatch(request());

        commentService.deleteComment(commentId)
            .then(
                data => {
                    dispatch(success(data));
                    dispatch(alertActions.success(`Comment deleted successfully`));
                    dispatch(alertActions.refresh(alertRefersh.DELETE_COMMENT));
                },
                error => returnError(dispatch, failure, error, true)
            );
    };

    function request() { return { type: commentConstants.DELETE_COMMENT_REQUEST } }
    function success(payload) { return { type: commentConstants.DELETE_COMMENT_SUCCESS, payload } }
    function failure(error) { return { type: commentConstants.DELETE_COMMENT_FAILURE, error } }
}

function clear() {
    return { type: commentConstants.GET_COMMENTS_CLEAR };
}