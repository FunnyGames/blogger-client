import { returnError } from './';

export function perform(service, data, actions, successCallback, failureCallback, other) {
    if (!other) other = {};
    return dispatch => {
        dispatch(request(other.request));

        service(data)
            .then(
                data => {
                    dispatch(success(data, other.success));
                    if (successCallback) {
                        successCallback(dispatch, data);
                    }
                },
                error => {
                    if (failureCallback) {
                        failureCallback(dispatch, error);
                    }
                    return returnError(dispatch, failure, error, true, other.failure);
                }
            );
    };

    function request(other) { return { type: actions.request, other } }
    function success(payload, other) { return { type: actions.success, payload, other } }
    function failure(error, status, other) { return { type: actions.failure, error, status, other } }
}