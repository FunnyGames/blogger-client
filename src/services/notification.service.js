import * as http from './base.service';
import url from '../constants/url.constants';
import * as utils from '../helpers/utils';

export const notificationService = {
    getNotifications,
    getShortNotifications,
    getTotalNotifications,
    markReadAll,
    markReadById
};

function getNotifications(page, limit, filter, sortBy, sortOrder) {
    let params = {
        page,
        limit,
        filter,
        sortBy,
        sortOrder
    };

    return http.get(url.GET_NOTIFICATIONS, params);
}

function getShortNotifications() {
    return http.get(url.GET_SHORT_NOTIFICATIONS);
}

function getTotalNotifications() {
    return http.get(url.GET_TOTAL_NOTIFICATIONS);
}

function markReadAll(filter) {
    const params = {
        filter
    };
    return http.get(url.MARK_ALL_READ_NOTIFICATIONS, params);
}

function markReadById(id) {
    let urlx = utils.convertUrlPath(url.MARK_READ_NOTIFICATION, { id });
    return http.get(urlx);
}