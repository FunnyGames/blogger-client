import { friendConstants } from '../constants';
import { friendService } from '../services';
import { perform } from './base.actions';
import { alertActions, alertRefersh } from '.';
import { formatNotification } from '../components/navbar/NotificationButton';

export const friendActions = {
    getFriends,
    getFriendRequests,
    getAllFriendRequests,
    friendRequest,
    unfriend,
    friendAccept,
    getTotalFriendRequests,
    newFriendRequest,
    newFriendAccepted
};

function getFriends(userId, page, limit, name, sortBy, sortOrder) {
    const datax = { userId, page, limit, name, sortBy, sortOrder };
    const actions = {
        request: friendConstants.GET_FRIENDS_REQUEST,
        success: friendConstants.GET_FRIENDS_SUCCESS,
        failure: friendConstants.GET_FRIENDS_FAILURE
    };
    const other = { request: { currentTab: userId }, success: { currentTab: userId } };
    return perform(friendService.getFriends, datax, actions, null, null, other);
}

function getFriendRequests(page, limit, name, sortBy, sortOrder) {
    const datax = { page, limit, name, sortBy, sortOrder, hideRequests: true };
    const actions = {
        request: friendConstants.GET_FRIENDS_REQ_REQUEST,
        success: friendConstants.GET_FRIENDS_REQ_SUCCESS,
        failure: friendConstants.GET_FRIENDS_REQ_FAILURE
    };
    return perform(friendService.getFriendRequests, datax, actions);
}

function getAllFriendRequests(page, limit, name, sortBy, sortOrder) {
    const datax = { page, limit, name, sortBy, sortOrder, hideRequests: false };
    const actions = {
        request: friendConstants.GET_FRIENDS_ALL_REQ_REQUEST,
        success: friendConstants.GET_FRIENDS_ALL_REQ_SUCCESS,
        failure: friendConstants.GET_FRIENDS_ALL_REQ_FAILURE
    };
    return perform(friendService.getFriendRequests, datax, actions);
}

function friendRequest(userId) {
    const datax = userId;
    const actions = {
        request: friendConstants.FRIEND_REQUEST,
        success: friendConstants.FRIEND_SUCCESS,
        failure: friendConstants.FRIEND_FAILURE
    };
    return perform(friendService.friendRequest, datax, actions);
}

function unfriend(friendId) {
    const datax = friendId;
    const actions = {
        request: friendConstants.UNFRIEND_REQUEST,
        success: friendConstants.UNFRIEND_SUCCESS,
        failure: friendConstants.UNFRIEND_FAILURE
    };
    const successCallback = (dispatch, data) => {
        dispatch(alertActions.refresh(alertRefersh.FRIEND_REQUEST));
    };
    const other = { request: friendId, success: friendId };
    return perform(friendService.unfriend, datax, actions, successCallback, null, other);
}

function friendAccept(friendId) {
    const datax = friendId;
    const actions = {
        request: friendConstants.FRIEND_ACCEPT_REQUEST,
        success: friendConstants.FRIEND_ACCEPT_SUCCESS,
        failure: friendConstants.FRIEND_ACCEPT__FAILURE
    };
    const successCallback = (dispatch, data) => {
        dispatch(alertActions.refresh(alertRefersh.FRIEND_REQUEST));
    };
    const other = { request: friendId, success: friendId };
    return perform(friendService.friendAccept, datax, actions, successCallback, null, other);
}

function getTotalFriendRequests() {
    const datax = null;
    const actions = {
        request: friendConstants.GET_TOTAL_FRIENDS_REQUEST,
        success: friendConstants.GET_TOTAL_FRIENDS_SUCCESS,
        failure: friendConstants.GET_TOTAL_FRIENDS_FAILURE
    };
    return perform(friendService.getTotalFriendRequests, datax, actions);
}

function newFriendRequest(data) {
    return dispatch => {
        dispatch(success(data));
        const msg = formatNotification(data);
        dispatch(alertActions.notification(msg));
    };

    function success(data) { return { type: friendConstants.NEW_FRIEND_REQUEST, data } }
}

function newFriendAccepted(data) {
    return dispatch => {
        dispatch(success(data));
        const msg = formatNotification(data);
        dispatch(alertActions.notification(msg));
    };

    function success(data) { return { type: friendConstants.NEW_FRIEND_ACCEPT, data } }
}