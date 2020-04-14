import * as http from './base.service';
import url from '../constants/url.constants';
import * as utils from '../helpers/utils';

export const reactionService = {
    getReactions,
    createReaction,
    getUsersReactions,
    deleteReaction
};

function getReactions(blogId) {
    let urlx = utils.convertUrlPath(url.GET_REACTIONS, { id: blogId });
    return http.get(urlx);
}

function createReaction(blogId, data) {
    let urlx = utils.convertUrlPath(url.CREATE_REACTION, { id: blogId });
    return http.post(urlx, data);
}

function getUsersReactions(blogId, data, limit) {
    let params = { limit };
    let urlx = utils.convertUrlPath(url.GET_USERS_REACTIONS, { id: blogId });
    return http.put(urlx, data, params);
}

function deleteReaction(reactionId) {
    let urlx = utils.convertUrlPath(url.DELETE_REACTION, { id: reactionId });
    return http.del(urlx);
}
