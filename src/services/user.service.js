import * as http from './base.service';
import axios from '../helpers/axios';
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
    cancelAccount,
    subscribe,
    unsubscribe,
    subscriptions,
    subscribers,
    uploadAvatar,
    deleteAvatar,
    forgotPassword,
    resetPassword,
    resendEmail,
    confirmEmail,
    unsubscribeEmail,
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

function subscribe(userId) {
    let urlx = utils.convertUrlPath(url.SUBSCRIBE, { id: userId });
    return http.get(urlx);
}

function unsubscribe(userId) {
    let urlx = utils.convertUrlPath(url.UNUBSCRIBE, { id: userId });
    return http.get(urlx);
}

function subscriptions(page, limit, name, sortBy, sortOrder) {
    let params = {
        page,
        limit,
        name,
        sortBy,
        sortOrder
    };
    return http.get(url.SUBSCRIPTIONS, params);
}

function subscribers(page, limit, name, sortBy, sortOrder) {
    let params = {
        page,
        limit,
        name,
        sortBy,
        sortOrder
    };
    return http.get(url.SUBSCRIBERS, params);
}

function uploadAvatar(image, callback) {
    const formData = new FormData();
    formData.append(
        'image',
        image
    );
    return axios.post(url.UPLOAD_AVATAR, formData, {
        onUploadProgress: progressEvent => callback(progressEvent.loaded / progressEvent.total)
    });
}

function deleteAvatar() {
    return http.del(url.DELETE_AVATAR);
}

function forgotPassword(data) {
    return http.post(url.FORGOT_PASSWORD, data);
}

function resetPassword(data) {
    let { token, newPassword } = data;
    let urlx = utils.convertUrlPath(url.RESET_PASSWORD, { token });
    return http.post(urlx, { newPassword });
}

function resendEmail() {
    return http.get(url.EMAIL_RESEND);
}

function confirmEmail(token) {
    let urlx = utils.convertUrlPath(url.EMAIL_CONFIRM, { token });
    return http.get(urlx);
}

function unsubscribeEmail(data) {
    let { email, token, t } = data;
    let encoded = encodeURI(`?email=${email}&token=${token}&t=${t}`);
    let urlx = url.UNSUBSCRIBE_EMAIL + encoded;
    return http.get(urlx);
}
