import socket from './socket.service';
import { notificationActions, chatActions, friendActions } from '../actions';
import constants from './listen.constants';

export const listen = (dispatch) => {
    // Notification
    socket.addListener(constants.NOTIFICATION, (data) => {
        dispatch(notificationActions.newNotification(data));
    });

    // Chat
    socket.addListener(constants.MESSAGE, (data) => {
        dispatch(chatActions.newMessage(data));
    });

    socket.addListener(constants.DELETE_MESSAGE, (data) => {
        const { chatId, msgId } = data;
        dispatch(chatActions.deleteOtherUserMessage(chatId, msgId));
    });

    socket.addListener(constants.BLOCK_USER, (data) => {
        dispatch(chatActions.blockUserReceive(data.chatId));
    });

    socket.addListener(constants.UNBLOCK_USER, (data) => {
        dispatch(chatActions.unblockUserReceive(data.chatId));
    });

    // User
    socket.addListener(constants.USER_STATUS, (data) => {
        dispatch(chatActions.userStatus(data));
    });

    // Friend
    socket.addListener(constants.FRIEND, (data) => {
        if (data.content) {
            if (data.content.pending) {
                dispatch(friendActions.newFriendRequest(data));
            } else {
                dispatch(friendActions.newFriendAccepted(data));
            }
        }
    });
}