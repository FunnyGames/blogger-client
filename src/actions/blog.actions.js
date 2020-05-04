import { blogConstants } from '../constants';
import { blogService } from '../services';
import { alertActions } from './';
import { perform } from './base.actions';
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
    const datax = { page, limit, name, sortBy, sortOrder, query };
    const actions = {
        request: blogConstants.GET_BLOGS_REQUEST,
        success: blogConstants.GET_BLOGS_SUCCESS,
        failure: blogConstants.GET_BLOGS_FAILURE
    };
    return perform(blogService.getBlogs, datax, actions);
}

function createBlog(datax) {
    const actions = {
        request: blogConstants.CREATE_BLOG_REQUEST,
        success: blogConstants.CREATE_BLOG_SUCCESS,
        failure: blogConstants.CREATE_BLOG_FAILURE
    };
    const successCallback = (dispatch, data) => {
        let path = utils.convertUrlPath(paths.BLOG, { id: data._id });
        history.push(path);
    };
    return perform(blogService.createBlog, datax, actions, successCallback);
}

function getBlog(blogId) {
    const datax = blogId;
    const actions = {
        request: blogConstants.GET_BLOG_REQUEST,
        success: blogConstants.GET_BLOG_SUCCESS,
        failure: blogConstants.GET_BLOG_FAILURE
    };
    return perform(blogService.getBlog, datax, actions);
}

function getMembers(blogId) {
    const datax = blogId;
    const actions = {
        request: blogConstants.GET_BLOG_MEMBERS_REQUEST,
        success: blogConstants.GET_BLOG_MEMBERS_SUCCESS,
        failure: blogConstants.GET_BLOG_MEMBERS_FAILURE
    };
    return perform(blogService.getMembers, datax, actions);
}

function updateBlog(blogId, data) {
    const datax = { blogId, data };
    const actions = {
        request: blogConstants.UPDATE_BLOG_REQUEST,
        success: blogConstants.UPDATE_BLOG_SUCCESS,
        failure: blogConstants.UPDATE_BLOG_FAILURE
    };
    const successCallback = (dispatch, data) => {
        dispatch(alertActions.success(`Blog updated successfully`));
        dispatch(alertActions.refresh());
    };
    return perform(blogService.updateBlog, datax, actions, successCallback);
}

function deleteBlog(blogId) {
    const datax = blogId;
    const actions = {
        request: blogConstants.DELETE_BLOG_REQUEST,
        success: blogConstants.DELETE_BLOG_SUCCESS,
        failure: blogConstants.DELETE_BLOG_FAILURE
    };
    const successCallback = (dispatch) => {
        dispatch(alertActions.success(`Blog deleted successfully`));
        dispatch(alertActions.refresh());
    };
    return perform(blogService.deleteBlog, datax, actions, successCallback);
}