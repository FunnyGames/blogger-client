import { alertConstants } from '../constants';
import globalConstants from '../constants/global.constants';

export const alertActions = {
    success,
    error,
    clear,
    refresh
};

function success(message) {
    return { type: alertConstants.SUCCESS, message };
}

function error(error) {
    return { type: alertConstants.ERROR, error };
}

function clear() {
    return { type: alertConstants.CLEAR };
}

function refresh() {
    return { type: alertConstants.REFRESH };
}

export function returnError(dispatch, failure, error, includeAlert) {
    let errorMsg;
    if (!error.response) errorMsg = globalConstants.CONNECTION_ERROR;
    else if (!error.response.data || !error.response.data.error) errorMsg = globalConstants.SERVER_ERROR;
    else errorMsg = error.response.data.error.toString();

    if (includeAlert && !error.cancel) dispatch(alertActions.error(errorMsg));

    let status = error.response ? error.response.status : 0;
    return dispatch(failure(errorMsg, status));
}