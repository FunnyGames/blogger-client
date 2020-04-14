import { groupConstants } from '../constants';
import { groupService } from '../services';
import { alertActions, returnError, alertRefersh } from '../actions';
import history from '../helpers/history';
import paths from '../constants/path.constants';
import * as utils from '../helpers/utils';

export const groupActions = {
    getGroups,
    createGroup,
    getGroup,
    getGroupUsers,
    addMember,
    removeMember,
    updateGroup,
    deleteGroup,
    exitGroup
};

function getGroups(page, limit, name, sortBy, sortOrder) {
    return dispatch => {
        dispatch(request({ page, limit, name, sortBy, sortOrder }));

        groupService.getGroups(page, limit, name, sortBy, sortOrder)
            .then(
                data => {
                    dispatch(success(data));
                },
                error => returnError(dispatch, failure, error, true)
            );
    };

    function request(groups) { return { type: groupConstants.GET_GROUPS_REQUEST, groups } }
    function success(payload) { return { type: groupConstants.GET_GROUPS_SUCCESS, payload } }
    function failure(error) { return { type: groupConstants.GET_GROUPS_FAILURE, error } }
}

function createGroup(data) {
    return dispatch => {
        dispatch(request(data));

        groupService.createGroup(data)
            .then(
                data => {
                    dispatch(success(data));
                    let path = utils.convertUrlPath(paths.GROUP, { id: data._id });
                    history.push(path);
                },
                error => returnError(dispatch, failure, error, true)
            );
    };

    function request(data) { return { type: groupConstants.CREATE_GROUP_SUCCESS, data } }
    function success(payload) { return { type: groupConstants.CREATE_GROUP_SUCCESS, payload } }
    function failure(error) { return { type: groupConstants.CREATE_GROUP_FAILURE, error } }
}

function getGroup(groupId) {
    return dispatch => {
        dispatch(request());

        groupService.getGroup(groupId)
            .then(
                data => {
                    dispatch(success(data));
                },
                error => returnError(dispatch, failure, error, true)
            );
    };

    function request() { return { type: groupConstants.GET_GROUP_REQUEST } }
    function success(payload) { return { type: groupConstants.GET_GROUP_SUCCESS, payload } }
    function failure(error, status) { return { type: groupConstants.GET_GROUP_FAILURE, error, status } }
}

function getGroupUsers(groupId, page, limit, name, sortBy, sortOrder) {
    return dispatch => {
        dispatch(request());

        groupService.getGroupUsers(groupId, page, limit, name, sortBy, sortOrder)
            .then(
                data => {
                    dispatch(success(data));
                },
                error => returnError(dispatch, failure, error, true)
            );
    };

    function request() { return { type: groupConstants.GET_GROUP_USERS_REQUEST } }
    function success(payload) { return { type: groupConstants.GET_GROUP_USERS_SUCCESS, payload } }
    function failure(error) { return { type: groupConstants.GET_GROUP_USERS_FAILURE, error } }
}

function addMember(groupId, userId, username) {
    return dispatch => {
        dispatch(request());

        groupService.addMember(groupId, userId)
            .then(
                data => {
                    dispatch(success(data));
                    dispatch(alertActions.success(`User ${username} added successfully`));
                    dispatch(alertActions.refresh(alertRefersh.UPDATE_GROUP_USERS));
                },
                error => returnError(dispatch, failure, error, true)
            );
    };

    function request() { return { type: groupConstants.ADD_USER_TO_GROUP_REQUEST } }
    function success(payload) { return { type: groupConstants.ADD_USER_TO_GROUP_SUCCESS, payload } }
    function failure(error) { return { type: groupConstants.ADD_USER_TO_GROUP_FAILURE, error } }
}

function removeMember(groupId, userId, username) {
    return dispatch => {
        dispatch(request());

        groupService.removeMember(groupId, userId)
            .then(
                data => {
                    dispatch(success(data));
                    dispatch(alertActions.success(`User ${username} removed successfully`));
                    dispatch(alertActions.refresh(alertRefersh.UPDATE_GROUP_USERS));
                },
                error => returnError(dispatch, failure, error, true)
            );
    };

    function request() { return { type: groupConstants.REMOVE_USER_FROM_GROUP_REQUEST } }
    function success(payload) { return { type: groupConstants.REMOVE_USER_FROM_GROUP_SUCCESS, payload } }
    function failure(error) { return { type: groupConstants.REMOVE_USER_FROM_GROUP_FAILURE, error } }
}

function updateGroup(groupId, name, description) {
    return dispatch => {
        dispatch(request());

        groupService.updateGroup(groupId, name, description)
            .then(
                data => {
                    dispatch(success(data));
                    dispatch(alertActions.success(`Group updated successfully`));
                    dispatch(alertActions.refresh(alertRefersh.UPDATE_GROUP));
                },
                error => returnError(dispatch, failure, error, true)
            );
    };

    function request() { return { type: groupConstants.UPDATE_GROUP_REQUEST } }
    function success(payload) { return { type: groupConstants.UPDATE_GROUP_SUCCESS, payload } }
    function failure(error) { return { type: groupConstants.UPDATE_GROUP_FAILURE, error } }
}

function deleteGroup(groupId) {
    return dispatch => {
        dispatch(request());

        groupService.deleteGroup(groupId)
            .then(
                data => {
                    dispatch(success(data));
                    dispatch(alertActions.success(`Group deleted successfully`));
                    dispatch(alertActions.refresh());
                },
                error => returnError(dispatch, failure, error, true)
            );
    };

    function request() { return { type: groupConstants.DELETE_GROUP_REQUEST } }
    function success(payload) { return { type: groupConstants.DELETE_GROUP_SUCCESS, payload } }
    function failure(error) { return { type: groupConstants.DELETE_GROUP_FAILURE, error } }
}

function exitGroup(groupId, userId) {
    return dispatch => {
        dispatch(request());

        groupService.removeMember(groupId, userId)
            .then(
                data => {
                    dispatch(success(data));
                    dispatch(alertActions.success(`You were removed successfully`));
                    dispatch(alertActions.refresh());
                },
                error => returnError(dispatch, failure, error, true)
            );
    };

    function request() { return { type: groupConstants.REMOVE_USER_FROM_GROUP_REQUEST } }
    function success(payload) { return { type: groupConstants.REMOVE_USER_FROM_GROUP_SUCCESS, payload } }
    function failure(error) { return { type: groupConstants.REMOVE_USER_FROM_GROUP_FAILURE, error } }
}