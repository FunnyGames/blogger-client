import * as http from './base.service';
import url from '../constants/url.constants';

export const settingService = {
    getSettings,
    updateSettings,
};

function getSettings() {
    return http.get(url.GET_SETTINGS);
}

function updateSettings({ data }) {
    return http.post(url.UPDATE_SETTINGS, data);
}