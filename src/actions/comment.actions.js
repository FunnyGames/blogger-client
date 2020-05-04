import { commentConstants } from '../constants';
import { commentService } from '../services';
import { perform } from './base.actions';
import { alertActions, alertRefersh } from '../actions';

export const commentActions = {
    getComments,
    createComment,
    updateComment,
    deleteComment,
    clear
};

function getComments(blogId, limit, seenIds) {
    const datax = { blogId, limit, seenIds };
    const actions = {
        request: commentConstants.GET_COMMENTS_REQUEST,
        success: commentConstants.GET_COMMENTS_SUCCESS,
        failure: commentConstants.GET_COMMENTS_FAILURE
    };
    return perform(commentService.getComments, datax, actions);
}

function createComment(blogId, data) {
    const datax = { blogId, data };
    const actions = {
        request: commentConstants.CREATE_COMMENT_REQUEST,
        success: commentConstants.CREATE_COMMENT_SUCCESS,
        failure: commentConstants.CREATE_COMMENT_FAILURE
    };
    const successCallback = (dispatch, data) => {
        dispatch(alertActions.success(`Comment added successfully`));
        dispatch(alertActions.refresh(alertRefersh.CREATE_COMMENT));
    };
    return perform(commentService.createComment, datax, actions, successCallback);
}

function updateComment(commentId, data) {
    const datax = { commentId, data };
    const actions = {
        request: commentConstants.UPDATE_COMMENT_REQUEST,
        success: commentConstants.UPDATE_COMMENT_SUCCESS,
        failure: commentConstants.UPDATE_COMMENT_FAILURE
    };
    const successCallback = (dispatch, data) => {
        dispatch(alertActions.success(`Comment updated successfully`));
        dispatch(alertActions.refresh(alertRefersh.UPDATE_COMMENT));
    };
    return perform(commentService.updateComment, datax, actions, successCallback);
}

function deleteComment(commentId) {
    const datax = commentId;
    const actions = {
        request: commentConstants.DELETE_COMMENT_REQUEST,
        success: commentConstants.DELETE_COMMENT_SUCCESS,
        failure: commentConstants.DELETE_COMMENT_FAILURE
    };
    const successCallback = (dispatch, data) => {
        dispatch(alertActions.success(`Comment deleted successfully`));
        dispatch(alertActions.refresh(alertRefersh.DELETE_COMMENT));
    };
    return perform(commentService.deleteComment, datax, actions, successCallback);
}

function clear() {
    return { type: commentConstants.GET_COMMENTS_CLEAR };
}