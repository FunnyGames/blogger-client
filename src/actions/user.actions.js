import { userConstants } from '../constants';
import { userService } from '../services';
import { alertActions, returnError, notificationActions, alertRefersh } from '../actions';
import history from '../helpers/history';
import paths from '../constants/path.constants';
import globalConstants from '../constants/global.constants';
import { chatActions } from './chat.actions';
import socket from '../socket/socket.service';
import { perform } from './base.actions';
import * as socketListener from '../socket/listener';
import { friendActions } from './friend.actions';

const { LOCAL_STR_TOKEN } = globalConstants;

export const userActions = {
    checkAvailability,
    login,
    register,
    logout,
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

function loadInitialData(dispatch) {
    dispatch(notificationActions.getTotalNotifications());
    dispatch(chatActions.getTotalMessages());
    dispatch(friendActions.getTotalFriendRequests());

    socket.connect();
    socketListener.listen(dispatch);
}

function checkAvailability(username, email) {
    return dispatch => {
        dispatch(request({ username, email }));

        userService.checkAvailability(username, email)
            .then(
                available => {
                    dispatch(success(available));
                },
                error => dispatch(failure(error.response.data))
            );
    };

    function request(available) { return { type: userConstants.USER_AVAILABLE_REQUEST, available } }
    function success(available) { return { type: userConstants.USER_AVAILABLE_SUCCESS, available } }
    function failure(error) { return { type: userConstants.USER_AVAILABLE_FAILURE, error } }
}

function login(username, password, redirect) {
    return dispatch => {
        dispatch(request({ username }));

        userService.login(username, password)
            .then(
                data => {
                    dispatch(success(data));
                    localStorage.setItem(LOCAL_STR_TOKEN, data.jwt);
                    if (!redirect) redirect = paths.HOMEPAGE;
                    history.push(redirect);
                },
                error => returnError(dispatch, failure, error, true)
            );
    };

    function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(data) { return { type: userConstants.LOGIN_SUCCESS, data } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function register(values) {
    return dispatch => {
        dispatch(request(values));

        userService.register(values)
            .then(
                data => {
                    dispatch(success(data));
                    localStorage.setItem(LOCAL_STR_TOKEN, data.jwt);
                    history.push(paths.HOMEPAGE);
                },
                error => returnError(dispatch, failure, error, true)
            );
    };

    function request(user) { return { type: userConstants.REGISTER_REQUEST, user } }
    function success(data) { return { type: userConstants.REGISTER_SUCCESS, data } }
    function failure(error) { return { type: userConstants.REGISTER_FAILURE, error } }
}

function logout(error) {
    return dispatch => {
        dispatch(success());
        if (error) {
            dispatch(alertActions.error(error));
        } else {
            dispatch(alertActions.success('Logged out successfully'));
        }
        setTimeout(() => {
            localStorage.removeItem(LOCAL_STR_TOKEN);
            history.push(paths.LOGIN);
        }, 50);
        socket.disconnect();
    };

    function success() { return { type: userConstants.LOGOUT_SUCCESS } }
}

function getProfile() {
    return dispatch => {
        dispatch(request());

        userService.getProfile()
            .then(
                user => {
                    dispatch(success(user));

                    loadInitialData(dispatch);
                },
                error => returnError(dispatch, failure, error, true)
            );
    };

    function request() { return { type: userConstants.GET_PROFILE_REQUEST } }
    function success(user) { return { type: userConstants.GET_PROFILE_SUCCESS, user } }
    function failure(error) { return { type: userConstants.GET_PROFILE_FAILURE, error } }
}

function updateProfile(user) {
    return dispatch => {
        dispatch(request(user));

        userService.updateProfile(user)
            .then(
                res => { window.location.reload(); return dispatch(success(res)); },
                error => returnError(dispatch, failure, error, true)
            );
    };

    function request(user) { return { type: userConstants.UPDATE_PROFILE_REQUEST, user } }
    function success(res) { return { type: userConstants.UPDATE_PROFILE_SUCCESS, res } }
    function failure(error) { return { type: userConstants.UPDATE_PROFILE_FAILURE, error } }
}

function updatePassword(data) {
    return dispatch => {
        dispatch(request(data));

        userService.updatePassword(data)
            .then(
                res => {
                    dispatch(alertActions.success('Password updated successfully'));
                    setTimeout(history.push(paths.PROFILE), 5000);
                    return dispatch(success(res));
                },
                error => returnError(dispatch, failure, error, true)
            );
    };

    function request(user) { return { type: userConstants.UPDATE_PASSWORD_REQUEST, user } }
    function success(res) { return { type: userConstants.UPDATE_PASSWORD_SUCCESS, res } }
    function failure(error) { return { type: userConstants.UPDATE_PASSWORD_FAILURE, error } }
}

function getUserGroups(userId, page, limit, name, sortBy, sortOrder) {
    return dispatch => {
        dispatch(request({ userId, page, limit, name, sortBy, sortOrder }));

        userService.getUserGroups(userId, page, limit, name, sortBy, sortOrder)
            .then(
                groups => {
                    dispatch(success(groups));
                },
                error => returnError(dispatch, failure, error, true)
            );
    };

    function request(groups) { return { type: userConstants.GET_GROUPS_REQUEST, groups, other: { currentTab: userId } } }
    function success(payload) { return { type: userConstants.GET_GROUPS_SUCCESS, payload, other: { currentTab: userId } } }
    function failure(error) { return { type: userConstants.GET_GROUPS_FAILURE, error } }
}

function getUsers(page, limit, name, sortBy, sortOrder) {
    return dispatch => {
        dispatch(request({ page, limit, name, sortBy, sortOrder }));

        userService.getUsers(page, limit, name, sortBy, sortOrder)
            .then(
                users => {
                    dispatch(success(users));
                },
                error => returnError(dispatch, failure, error, true)
            );
    };

    function request(users) { return { type: userConstants.GET_USERS_REQUEST, users } }
    function success(payload) { return { type: userConstants.GET_USERS_SUCCESS, payload } }
    function failure(error) { return { type: userConstants.GET_USERS_FAILURE, error } }
}

function getUserProfile(userId) {
    return dispatch => {
        dispatch(request({ userId }));

        userService.getUserProfile(userId)
            .then(
                user => {
                    dispatch(success(user));
                },
                error => returnError(dispatch, failure, error, true)
            );
    };

    function request(user) { return { type: userConstants.GET_USER_PROFILE_REQUEST, user } }
    function success(payload) { return { type: userConstants.GET_USER_PROFILE_SUCCESS, payload } }
    function failure(error, status) { return { type: userConstants.GET_USER_PROFILE_FAILURE, error, status } }
}

function cancelAccount(username, password) {
    return dispatch => {
        dispatch(request());

        userService.cancelAccount(username, password)
            .then(
                data => {
                    dispatch(success(data));
                    dispatch(alertActions.success('Your account was cancelled!'));
                    setTimeout(() => {
                        localStorage.removeItem(LOCAL_STR_TOKEN);
                        history.push(paths.LOGIN);
                    }, 50);
                },
                error => returnError(dispatch, failure, error, true)
            );
    };

    function request() { return { type: userConstants.CANCEL_ACCOUNT_REQUEST } }
    function success(payload) { return { type: userConstants.CANCEL_ACCOUNT_SUCCESS, payload } }
    function failure(error) { return { type: userConstants.CANCEL_ACCOUNT_FAILURE, error } }
}

function subscribe(userId) {
    return dispatch => {
        dispatch(request());

        userService.subscribe(userId)
            .then(
                data => {
                    dispatch(success(data));
                },
                error => returnError(dispatch, failure, error, true)
            );
    };

    function request() { return { type: userConstants.SUBSCRIBE_REQUEST } }
    function success(payload) { return { type: userConstants.SUBSCRIBE_SUCCESS, payload } }
    function failure(error) { return { type: userConstants.SUBSCRIBE_FAILURE, error } }
}

function unsubscribe(userId) {
    return dispatch => {
        dispatch(request());

        userService.unsubscribe(userId)
            .then(
                data => {
                    dispatch(success(data));
                    dispatch(alertActions.refresh(alertRefersh.UNSUBSCRIBE));
                },
                error => returnError(dispatch, failure, error, true)
            );
    };

    function request() { return { type: userConstants.UNSUBSCRIBE_REQUEST } }
    function success(payload) { return { type: userConstants.UNSUBSCRIBE_SUCCESS, payload } }
    function failure(error) { return { type: userConstants.UNSUBSCRIBE_FAILURE, error } }
}

function subscriptions(page, limit, name, sortBy, sortOrder) {
    return dispatch => {
        dispatch(request());

        userService.subscriptions(page, limit, name, sortBy, sortOrder)
            .then(
                data => {
                    dispatch(success(data));
                },
                error => returnError(dispatch, failure, error, true)
            );
    };

    function request() { return { type: userConstants.GET_SUBSCRIPTIONS_REQUEST } }
    function success(payload) { return { type: userConstants.GET_SUBSCRIPTIONS_SUCCESS, payload } }
    function failure(error) { return { type: userConstants.GET_SUBSCRIPTIONS_FAILURE, error } }
}

function subscribers(page, limit, name, sortBy, sortOrder) {
    return dispatch => {
        dispatch(request());

        userService.subscribers(page, limit, name, sortBy, sortOrder)
            .then(
                data => {
                    dispatch(success(data));
                },
                error => returnError(dispatch, failure, error, true)
            );
    };

    function request() { return { type: userConstants.GET_SUBSCRIBERS_REQUEST } }
    function success(payload) { return { type: userConstants.GET_SUBSCRIBERS_SUCCESS, payload } }
    function failure(error) { return { type: userConstants.GET_SUBSCRIBERS_FAILURE, error } }
}

function uploadAvatar(image, callback) {
    const datax = image;
    const actions = {
        request: userConstants.UPLOAD_AVATAR_REQUEST,
        success: userConstants.UPLOAD_AVATAR_SUCCESS,
        failure: userConstants.UPLOAD_AVATAR_FAILURE
    };
    return perform(userService.uploadAvatar, datax, actions, null, null, null, callback);
}

function deleteAvatar() {
    const datax = null;
    const actions = {
        request: userConstants.DELETE_AVATAR_REQUEST,
        success: userConstants.DELETE_AVATAR_SUCCESS,
        failure: userConstants.DELETE_AVATAR_FAILURE
    };
    return perform(userService.deleteAvatar, datax, actions);
}

function forgotPassword(email) {
    const datax = { email };
    const actions = {
        request: userConstants.FORGOT_PASSWORD_REQUEST,
        success: userConstants.FORGOT_PASSWORD_SUCCESS,
        failure: userConstants.FORGOT_PASSWORD_FAILURE
    };
    return perform(userService.forgotPassword, datax, actions);
}

function resetPassword(token, newPassword) {
    const datax = { token, newPassword };
    const actions = {
        request: userConstants.RESET_PASSWORD_REQUEST,
        success: userConstants.RESET_PASSWORD_SUCCESS,
        failure: userConstants.RESET_PASSWORD_FAILURE
    };
    return perform(userService.resetPassword, datax, actions);
}

function resendEmail() {
    const datax = null;
    const actions = {
        request: userConstants.EMAIL_RESEND_REQUEST,
        success: userConstants.EMAIL_RESEND_SUCCESS,
        failure: userConstants.EMAIL_RESEND_FAILURE
    };
    const successCallback = (dispatch, data) => {
        dispatch(alertActions.success(`Email sent successfully!`));
    };
    const failureCallback = (dispatch, error) => {
        dispatch(alertActions.error(`Sending email failed!`));
    };
    return perform(userService.resendEmail, datax, actions, successCallback, failureCallback);
}

function confirmEmail(token) {
    const datax = token;
    const actions = {
        request: userConstants.EMAIL_CONFIRM_REQUEST,
        success: userConstants.EMAIL_CONFIRM_SUCCESS,
        failure: userConstants.EMAIL_CONFIRM_FAILURE
    };
    const successCallback = (dispatch, data) => {
        localStorage.setItem(LOCAL_STR_TOKEN, data.jwt);
        dispatch(userActions.getProfile());
    };
    return perform(userService.confirmEmail, datax, actions, successCallback);
}

function unsubscribeEmail(email, token, t) {
    const datax = { email, token, t };
    const actions = {
        request: userConstants.UNSUBSCRIBE_EMAIL_REQUEST,
        success: userConstants.UNSUBSCRIBE_EMAIL_SUCCESS,
        failure: userConstants.UNSUBSCRIBE_EMAIL_FAILURE
    };
    return perform(userService.unsubscribeEmail, datax, actions);
}