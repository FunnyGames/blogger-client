import * as http from './base.service';
import url from '../constants/url.constants';
import * as utils from '../helpers/utils';

export const userService = {
    login,
    checkAvailability,
    register,
    getProfile,
    updateProfile,
    updatePassword,
    getUserGroups,
    getUsers,
    getUserProfile,
    cancelAccount
};

function login(username, password) {
    let data = {
        username, password
    };
    return http.post(url.LOGIN, data);
}

function checkAvailability(username, email) {
    let data = {
        username,
        email
    };
    return http.put(url.CHECK_USERNAME_AVAILABILITY, data);
}

function register(data) {
    return http.post(url.REGISTER, data);
}

function getProfile() {
    return http.get(url.GET_PROFILE, {}, true);
}

function updateProfile(data) {
    return http.put(url.UPDATE_PROFILE, data);
}

function updatePassword(data) {
    return http.put(url.UPDATE_PASSWORD, data);
}

function getUserGroups(userId, page, limit, name, sortBy, sortOrder) {
    let urlx = utils.convertUrlPath(url.GET_USER_GROUPS, { id: userId });
    let params = {
        page,
        limit,
        name,
        sortBy,
        sortOrder
    };
    return http.get(urlx, params);
}

function getUsers(page, limit, name, sortBy, sortOrder) {
    let params = {
        page,
        limit,
        name,
        sortBy,
        sortOrder
    };
    return http.get(url.GET_USERS, params);
}

function getUserProfile(userId) {
    let urlx = utils.convertUrlPath(url.GET_USER_PROFILE, { id: userId });
    return http.get(urlx);
}

function cancelAccount(username, password) {
    let data = {
        username, password
    };
    return http.put(url.CANCEL_ACCOUNT, data);
}
