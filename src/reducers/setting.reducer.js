import { settingConstants, userConstants } from '../constants';

export function settings(state = {}, action) {
    switch (action.type) {
        case settingConstants.GET_SETTINGS_REQUEST:
            return { loading: true };
        case settingConstants.GET_SETTINGS_SUCCESS:
            return { ...action.payload };
        case settingConstants.GET_SETTINGS_FAILURE:
            return { error: action.error };

        case userConstants.LOGOUT_SUCCESS:
            return {};

        default:
            return state;
    }
}