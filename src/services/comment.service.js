import * as http from './base.service';
import url from '../constants/url.constants';
import * as utils from '../helpers/utils';

export const commentService = {
    getComments,
    createComment,
    updateComment,
    deleteComment
};

function getComments(blogId, limit, seenIds) {
    let params = {
        limit
    };
    let data = {
        seenIds
    };
    let urlx = utils.convertUrlPath(url.GET_COMMENTS, { id: blogId });
    return http.put(urlx, data, params);
}

function createComment(blogId, data) {
    let urlx = utils.convertUrlPath(url.CREATE_COMMENT, { id: blogId });
    return http.post(urlx, data);
}

function updateComment(commentId, data) {
    let urlx = utils.convertUrlPath(url.UPDATE_COMMENT, { id: commentId });
    return http.put(urlx, data);
}

function deleteComment(commentId) {
    let urlx = utils.convertUrlPath(url.UPDATE_COMMENT, { id: commentId });
    return http.del(urlx);
}
