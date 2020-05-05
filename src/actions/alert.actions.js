import { alertConstants } from '../constants';
import globalConstants from '../constants/global.constants';

export const alertActions = {
    success,
    error,
    clear,
    refresh,
    notification,
    logout
};

export const alertRefersh = {
    // Forced refresh actions
    CREATE_COMMENT: 'CREATE_COMMENT',
    UPDATE_COMMENT: 'UPDATE_COMMENT',
    DELETE_COMMENT: 'DELETE_COMMENT',

    UPDATE_GROUP: 'UPDATE_GROUP',
    UPDATE_GROUP_USERS: 'UPDATE_GROUP_USERS',

    UNSUBSCRIBE: 'UNSUBSCRIBE',

    // Functions
    is,
    isIn
}

function success(message) {
    return { type: alertConstants.SUCCESS, message };
}

function error(error) {
    return { type: alertConstants.ERROR, error };
}

function clear() {
    return { type: alertConstants.CLEAR };
}

function refresh(action) {
    return { type: alertConstants.REFRESH, action };
}

function notification(action) {
    return { type: alertConstants.NOTIFICATION, action };
}

function logout() {
    return { type: alertConstants.LOGOUT };
}

function is(alert, action) {
    return alert && alert.forceRefresh && alert.action && alert.action === action;
}

function isIn(alert, actions) {
    return alert && alert.forceRefresh && alert.action && actions && actions.length > 0 && actions.includes(alert.action);
}

export function returnError(dispatch, failure, error, includeAlert, other) {
    let errorMsg;
    let logoutUser = false;
    if (!error.response) errorMsg = globalConstants.CONNECTION_ERROR;
    else if (!error.response.data || !error.response.data.error) errorMsg = globalConstants.SERVER_ERROR;
    else {
        errorMsg = error.response.data.error.toString();
        if (error.response.data.tokenExpired) {
            logoutUser = true;
            dispatch(alertActions.logout());
        }
    }

    if (includeAlert && !error.cancel && !logoutUser) dispatch(alertActions.error(errorMsg));

    let status = error.response ? error.response.status : 0;
    return dispatch(failure(errorMsg, status, other));
}