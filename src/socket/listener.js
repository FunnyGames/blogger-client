import socket from './socket.service';
import { notificationActions } from '../actions';

const NOTIFICATION = 'notification';
const MESSAGE = 'message';

export const listen = (dispatch) => {
    socket.addListener(NOTIFICATION, (data) => {
        dispatch(notificationActions.newNotification(data));
    });

    socket.addListener(MESSAGE, (data) => {

    });
}

