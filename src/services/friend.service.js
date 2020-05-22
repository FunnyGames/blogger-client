import * as http from './base.service';
import url from '../constants/url.constants';
import * as utils from '../helpers/utils';

export const friendService = {
    getFriends,
    friendRequest,
    getFriendRequests,
    unfriend,
    friendAccept,
    getTotalFriendRequests,
};

function getFriends({ userId, page, limit, name, sortBy, sortOrder }) {
    let params = {
        userId,
        page,
        limit,
        name,
        sortBy,
        sortOrder
    };
    return http.get(url.GET_FRIENDS, params);
}

function getFriendRequests({ page, limit, name, sortBy, sortOrder, hideRequests }) {
    let params = {
        page,
        limit,
        name,
        sortBy,
        sortOrder,
        hideRequests
    };
    return http.get(url.GET_FRIEND_REQUESTS, params);
}

function friendRequest(userId) {
    let urlx = utils.convertUrlPath(url.FRIEND_REQUEST, { id: userId });
    return http.get(urlx);
}

function unfriend(friendId) {
    let urlx = utils.convertUrlPath(url.UNFRIEND, { id: friendId });
    return http.get(urlx);
}

function friendAccept(friendId) {
    let urlx = utils.convertUrlPath(url.FRIEND_ACCEPT, { id: friendId });
    return http.get(urlx);
}

function getTotalFriendRequests() {
    return http.get(url.GET_TOTAL_FRIEND_REQUESTS);
}