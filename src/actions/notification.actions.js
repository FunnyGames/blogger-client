import { notificationConstants } from '../constants';
import { notificationService } from '../services';
import { perform } from './base.actions';

export const notificationActions = {
    getNotifications,
    getShortNotifications,
    getTotalNotifications,
    markReadAll,
    markReadById
};

function getNotifications(page, limit, filter, sortBy, sortOrder) {
    const datax = { page, limit, filter, sortBy, sortOrder };
    const actions = {
        request: notificationConstants.GET_NOTIFICATIONS_REQUEST,
        success: notificationConstants.GET_NOTIFICATIONS_SUCCESS,
        failure: notificationConstants.GET_NOTIFICATIONS_FAILURE
    };
    return perform(notificationService.getNotifications, datax, actions);
}

function getShortNotifications() {
    const datax = null;
    const actions = {
        request: notificationConstants.GET_SHORT_NOTIFICATIONS_REQUEST,
        success: notificationConstants.GET_SHORT_NOTIFICATIONS_SUCCESS,
        failure: notificationConstants.GET_SHORT_NOTIFICATIONS_FAILURE
    };
    return perform(notificationService.getShortNotifications, datax, actions);
}

function getTotalNotifications() {
    const datax = null;
    const actions = {
        request: notificationConstants.GET_TOTAL_NOTIFICATIONS_REQUEST,
        success: notificationConstants.GET_TOTAL_NOTIFICATIONS_SUCCESS,
        failure: notificationConstants.GET_TOTAL_NOTIFICATIONS_FAILURE
    };
    return perform(notificationService.getTotalNotifications, datax, actions);
}

function markReadAll(filter) {
    const datax = filter;
    const actions = {
        request: notificationConstants.MARK_READ_ALL_REQUEST,
        success: notificationConstants.MARK_READ_ALL_SUCCESS,
        failure: notificationConstants.MARK_READ_ALL_FAILURE
    };
    return perform(notificationService.markReadAll, datax, actions);
}

function markReadById(id) {
    const datax = id;
    const actions = {
        request: notificationConstants.MARK_READ_REQUEST,
        success: notificationConstants.MARK_READ_SUCCESS,
        failure: notificationConstants.MARK_READ_FAILURE
    };
    const other = { success: id };
    return perform(notificationService.markReadById, datax, actions, null, null, other);
}