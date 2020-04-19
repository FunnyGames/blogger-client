import { groupConstants } from '../constants';
import { groupService } from '../services';
import { perform } from './base.actions';
import { alertActions, alertRefersh } from '../actions';
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
    const datax = { page, limit, name, sortBy, sortOrder };
    const actions = {
        request: groupConstants.GET_GROUPS_REQUEST,
        success: groupConstants.GET_GROUPS_SUCCESS,
        failure: groupConstants.GET_GROUPS_FAILURE
    };
    return perform(groupService.getGroups, datax, actions);
}

function createGroup(data) {
    const datax = data;
    const actions = {
        request: groupConstants.CREATE_GROUP_SUCCESS,
        success: groupConstants.CREATE_GROUP_SUCCESS,
        failure: groupConstants.CREATE_GROUP_FAILURE
    };
    const successCallback = (dispatch, data) => {
        let path = utils.convertUrlPath(paths.GROUP, { id: data._id });
        history.push(path);
    };
    return perform(groupService.createGroup, datax, actions, successCallback);
}

function getGroup(groupId) {
    const datax = groupId;
    const actions = {
        request: groupConstants.GET_GROUP_REQUEST,
        success: groupConstants.GET_GROUP_SUCCESS,
        failure: groupConstants.GET_GROUP_FAILURE
    };
    return perform(groupService.getGroup, datax, actions);
}

function getGroupUsers(groupId, page, limit, name, sortBy, sortOrder) {
    const datax = { groupId, page, limit, name, sortBy, sortOrder };
    const actions = {
        request: groupConstants.GET_GROUP_USERS_REQUEST,
        success: groupConstants.GET_GROUP_USERS_SUCCESS,
        failure: groupConstants.GET_GROUP_USERS_FAILURE
    };
    return perform(groupService.getGroupUsers, datax, actions);
}

function addMember(groupId, userId, username) {
    const datax = { groupId, userId };
    const actions = {
        request: groupConstants.ADD_USER_TO_GROUP_REQUEST,
        success: groupConstants.ADD_USER_TO_GROUP_SUCCESS,
        failure: groupConstants.ADD_USER_TO_GROUP_FAILURE
    };
    const successCallback = (dispatch, data) => {
        dispatch(alertActions.success(`User ${username} added successfully`));
        dispatch(alertActions.refresh(alertRefersh.UPDATE_GROUP_USERS));
    };
    return perform(groupService.addMember, datax, actions, successCallback);
}

function removeMember(groupId, userId, username) {
    const datax = { groupId, userId };
    const actions = {
        request: groupConstants.REMOVE_USER_FROM_GROUP_REQUEST,
        success: groupConstants.REMOVE_USER_FROM_GROUP_SUCCESS,
        failure: groupConstants.REMOVE_USER_FROM_GROUP_FAILURE
    };
    const successCallback = (dispatch, data) => {
        dispatch(alertActions.success(`User ${username} removed successfully`));
        dispatch(alertActions.refresh(alertRefersh.UPDATE_GROUP_USERS));
    };
    return perform(groupService.removeMember, datax, actions, successCallback);
}

function updateGroup(groupId, name, description) {
    const datax = { groupId, name, description };
    const actions = {
        request: groupConstants.UPDATE_GROUP_REQUEST,
        success: groupConstants.UPDATE_GROUP_SUCCESS,
        failure: groupConstants.UPDATE_GROUP_FAILURE
    };
    const successCallback = (dispatch, data) => {
        dispatch(alertActions.success(`Group updated successfully`));
        dispatch(alertActions.refresh(alertRefersh.UPDATE_GROUP));
    };
    return perform(groupService.updateGroup, datax, actions, successCallback);
}

function deleteGroup(groupId) {
    const datax = groupId;
    const actions = {
        request: groupConstants.DELETE_GROUP_REQUEST,
        success: groupConstants.DELETE_GROUP_SUCCESS,
        failure: groupConstants.DELETE_GROUP_FAILURE
    };
    const successCallback = (dispatch, data) => {
        dispatch(alertActions.success(`Group deleted successfully`));
        dispatch(alertActions.refresh());
    };
    return perform(groupService.deleteGroup, datax, actions, successCallback);
}

function exitGroup(groupId, userId) {
    const datax = { groupId, userId };
    const actions = {
        request: groupConstants.REMOVE_USER_FROM_GROUP_REQUEST,
        success: groupConstants.REMOVE_USER_FROM_GROUP_SUCCESS,
        failure: groupConstants.REMOVE_USER_FROM_GROUP_FAILURE
    };
    const successCallback = (dispatch, data) => {
        dispatch(alertActions.success(`You were removed successfully`));
        dispatch(alertActions.refresh());
    };
    return perform(groupService.removeMember, datax, actions, successCallback);
}