import * as http from './base.service';
import url from '../constants/url.constants';
import * as utils from '../helpers/utils';

export const groupService = {
    getGroups,
    createGroup,
    getGroup,
    getGroupUsers,
    addMember,
    removeMember,
    updateGroup,
    deleteGroup
};

function getGroups(page, limit, name, sortBy, sortOrder) {
    let params = {
        page,
        limit,
        name,
        sortBy,
        sortOrder
    };

    return http.get(url.GET_GROUPS, params);
}

function createGroup(data) {
    return http.post(url.CREATE_GROUP, data);
}

function getGroup(groupId) {
    let urlx = utils.convertUrlPath(url.GET_GROUP, { id: groupId });
    return http.get(urlx);
}

function getGroupUsers(groupId, page, limit, name, sortBy, sortOrder) {
    let urlx = utils.convertUrlPath(url.GET_GROUP_USERS, { id: groupId });
    let params = {
        page,
        limit,
        name,
        sortBy,
        sortOrder
    };
    return http.get(urlx, params);
}

function addMember(groupId, userId) {
    let urlx = utils.convertUrlPath(url.ADD_USER_TO_GROUP, { id: groupId, userId });
    return http.get(urlx);
}

function removeMember(groupId, userId) {
    let urlx = utils.convertUrlPath(url.ADD_USER_TO_GROUP, { id: groupId, userId });
    return http.del(urlx);
}

function updateGroup(groupId, name, description) {
    let urlx = utils.convertUrlPath(url.UPDATE_GROUP, { id: groupId });
    return http.put(urlx, { name, description });
}

function deleteGroup(groupId) {
    let urlx = utils.convertUrlPath(url.UPDATE_GROUP, { id: groupId });
    return http.del(urlx);
}
