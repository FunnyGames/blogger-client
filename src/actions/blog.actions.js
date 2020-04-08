import { blogConstants } from '../constants';
import { blogService } from '../services';
import { alertActions, returnError } from '../actions';
import history from '../helpers/history';
import paths from '../constants/path.constants';
import * as utils from '../helpers/utils';

export const blogActions = {
    getBlogs,
    createBlog,
    getBlog,
    getMembers,
    updateBlog,
    deleteBlog
};

function getBlogs(page, limit, name, sortBy, sortOrder, query) {
    return dispatch => {
        dispatch(request({}));

        blogService.getBlogs(page, limit, name, sortBy, sortOrder, query)
            .then(
                data => {
                    dispatch(success(data));
                },
                error => returnError(dispatch, failure, error, true)
            );
    };

    function request() { return { type: blogConstants.GET_BLOGS_REQUEST } }
    function success(payload) { return { type: blogConstants.GET_BLOGS_SUCCESS, payload } }
    function failure(error) { return { type: blogConstants.GET_BLOGS_FAILURE, error } }
}

function createBlog(data) {
    return dispatch => {
        dispatch(request(data));

        blogService.createBlog(data)
            .then(
                data => {
                    dispatch(success(data));
                    let path = utils.convertUrlPath(paths.BLOG, { id: data._id });
                    history.push(path);
                },
                error => returnError(dispatch, failure, error, true)
            );
    };

    function request(data) { return { type: blogConstants.CREATE_BLOG_REQUEST, data } }
    function success(payload) { return { type: blogConstants.CREATE_BLOG_SUCCESS, payload } }
    function failure(error) { return { type: blogConstants.CREATE_BLOG_FAILURE, error } }
}

function getBlog(blogId) {
    return dispatch => {
        dispatch(request());

        blogService.getBlog(blogId)
            .then(
                data => {
                    dispatch(success(data));
                },
                error => returnError(dispatch, failure, error, true)
            );
    };

    function request() { return { type: blogConstants.GET_BLOG_REQUEST } }
    function success(payload) { return { type: blogConstants.GET_BLOG_SUCCESS, payload } }
    function failure(error, status) { return { type: blogConstants.GET_BLOG_FAILURE, error, status } }
}

function getMembers(blogId) {
    return dispatch => {
        dispatch(request({}));

        blogService.getMembers(blogId)
            .then(
                data => {
                    dispatch(success(data));
                },
                error => returnError(dispatch, failure, error, true)
            );
    };

    function request() { return { type: blogConstants.GET_BLOG_MEMBERS_REQUEST } }
    function success(payload) { return { type: blogConstants.GET_BLOG_MEMBERS_SUCCESS, payload } }
    function failure(error) { return { type: blogConstants.GET_BLOG_MEMBERS_FAILURE, error } }
}

function updateBlog(blogId, data) {
    return dispatch => {
        dispatch(request());

        blogService.updateBlog(blogId, data)
            .then(
                data => {
                    dispatch(success(data));
                    dispatch(alertActions.success(`Blog updated successfully`));
                    dispatch(alertActions.refresh());
                },
                error => returnError(dispatch, failure, error, true)
            );
    };

    function request() { return { type: blogConstants.UPDATE_BLOG_REQUEST } }
    function success(payload) { return { type: blogConstants.UPDATE_BLOG_SUCCESS, payload } }
    function failure(error) { return { type: blogConstants.UPDATE_BLOG_FAILURE, error } }
}

function deleteBlog(blogId) {
    return dispatch => {
        dispatch(request());

        blogService.deleteBlog(blogId)
            .then(
                data => {
                    dispatch(success(data));
                    dispatch(alertActions.success(`Blog deleted successfully`));
                    dispatch(alertActions.refresh());
                },
                error => returnError(dispatch, failure, error, true)
            );
    };

    function request() { return { type: blogConstants.DELETE_BLOG_REQUEST } }
    function success(payload) { return { type: blogConstants.DELETE_BLOG_SUCCESS, payload } }
    function failure(error) { return { type: blogConstants.DELETE_BLOG_FAILURE, error } }
}