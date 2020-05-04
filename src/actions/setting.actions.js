import { settingConstants } from '../constants';
import { settingService } from '../services';
import { perform } from './base.actions';
import { alertActions } from '../actions';

export const settingActions = {
    getSettings,
    updateSettings,
};

function getSettings() {
    const datax = null;
    const actions = {
        request: settingConstants.GET_SETTINGS_REQUEST,
        success: settingConstants.GET_SETTINGS_SUCCESS,
        failure: settingConstants.GET_SETTINGS_FAILURE
    };
    return perform(settingService.getSettings, datax, actions);
}

function updateSettings(data) {
    const datax = { data };
    const actions = {
        request: settingConstants.UPDATE_SETTINGS_REQUEST,
        success: settingConstants.UPDATE_SETTINGS_SUCCESS,
        failure: settingConstants.UPDATE_SETTINGS_FAILURE
    };
    const successCallback = (dispatch, data) => {
        dispatch(alertActions.success(`Settings updated successfully`));
    };
    return perform(settingService.updateSettings, datax, actions, successCallback);
}