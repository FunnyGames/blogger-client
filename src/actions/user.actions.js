import { userConstants } from '../constants';
import { userService } from '../services';
import { alertActions, returnError } from '../actions';
import history from '../helpers/history';
import paths from '../constants/path.constants';
import globalConstants from '../constants/global.constants';

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
    getUserProfile
};

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
                    history.push('/');
                },
                error => returnError(dispatch, failure, error, true)
            );
    };

    function request(user) { return { type: userConstants.REGISTER_REQUEST, user } }
    function success(data) { return { type: userConstants.REGISTER_SUCCESS, data } }
    function failure(error) { return { type: userConstants.REGISTER_FAILURE, error } }
}

function logout() {
    return dispatch => {
        dispatch(request({}));

        userService.logout()
            .then(
                data => {
                    localStorage.removeItem(LOCAL_STR_TOKEN);
                    dispatch(success(data));
                    dispatch(alertActions.success('Logged out successfully'));
                    history.push('/');
                },
                error => returnError(dispatch, failure, error, true)
            );
    };

    function request() { return { type: userConstants.LOGOUT_REQUEST } }
    function success(data) { return { type: userConstants.LOGOUT_SUCCESS, data } }
    function failure(error) { return { type: userConstants.LOGOUT_FAILURE, error } }
}

function getProfile() {
    return dispatch => {
        dispatch(request({}));

        userService.getProfile()
            .then(
                user => dispatch(success(user)),
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

    function request(groups) { return { type: userConstants.GET_GROUPS_REQUEST, groups } }
    function success(payload) { return { type: userConstants.GET_GROUPS_SUCCESS, payload } }
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