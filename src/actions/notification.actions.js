import { notificationConstants } from '../constants';
import { notificationService } from '../services';
import { returnError } from '../actions';

export const notificationActions = {
    getNotifications,
    getShortNotifications,
    getTotalNotifications,
    markReadAll,
    markReadById
};

function getNotifications(page, limit, filter, sortBy, sortOrder) {
    return dispatch => {
        dispatch(request());

        notificationService.getNotifications(page, limit, filter, sortBy, sortOrder)
            .then(
                data => {
                    dispatch(success(data));
                },
                error => returnError(dispatch, failure, error, true)
            );
    };

    function request() { return { type: notificationConstants.GET_NOTIFICATIONS_REQUEST } }
    function success(payload) { return { type: notificationConstants.GET_NOTIFICATIONS_SUCCESS, payload } }
    function failure(error) { return { type: notificationConstants.GET_NOTIFICATIONS_FAILURE, error } }
}

function getShortNotifications() {
    return dispatch => {
        dispatch(request());

        notificationService.getShortNotifications()
            .then(
                data => {
                    dispatch(success(data));
                },
                error => returnError(dispatch, failure, error, true)
            );
    };

    function request() { return { type: notificationConstants.GET_SHORT_NOTIFICATIONS_REQUEST } }
    function success(payload) { return { type: notificationConstants.GET_SHORT_NOTIFICATIONS_SUCCESS, payload } }
    function failure(error) { return { type: notificationConstants.GET_SHORT_NOTIFICATIONS_FAILURE, error } }
}

function getTotalNotifications() {
    return dispatch => {
        dispatch(request());

        notificationService.getTotalNotifications()
            .then(
                data => {
                    dispatch(success(data));
                },
                error => returnError(dispatch, failure, error, true)
            );
    };

    function request() { return { type: notificationConstants.GET_TOTAL_NOTIFICATIONS_REQUEST } }
    function success(payload) { return { type: notificationConstants.GET_TOTAL_NOTIFICATIONS_SUCCESS, payload } }
    function failure(error) { return { type: notificationConstants.GET_TOTAL_NOTIFICATIONS_FAILURE, error } }
}

function markReadAll(filter) {
    return dispatch => {
        dispatch(request());

        notificationService.markReadAll(filter)
            .then(
                data => {
                    dispatch(success(data));
                },
                error => returnError(dispatch, failure, error, true)
            );
    };

    function request() { return { type: notificationConstants.MARK_READ_ALL_REQUEST } }
    function success(payload) { return { type: notificationConstants.MARK_READ_ALL_SUCCESS, payload } }
    function failure(error) { return { type: notificationConstants.MARK_READ_ALL_FAILURE, error } }
}

function markReadById(id) {
    return dispatch => {
        dispatch(request());

        notificationService.markReadById(id)
            .then(
                data => {
                    dispatch(success(data));
                },
                error => returnError(dispatch, failure, error, true)
            );
    };

    function request() { return { type: notificationConstants.MARK_READ_REQUEST } }
    function success(payload) { return { type: notificationConstants.MARK_READ_SUCCESS, payload, id } }
    function failure(error) { return { type: notificationConstants.MARK_READ_FAILURE, error } }
}