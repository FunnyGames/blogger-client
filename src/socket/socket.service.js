import io from 'socket.io-client';
import env from '../environments/env';
import * as utils from '../helpers/utils';
import constants from '../constants/global.constants';
import socketConstants from './constants';

const HEADER = constants.HEADER_AUTH;

let socket = null;
let currentUserId = null;
let toListenUserId = null;

const connect = () => {
    if (socket) return;
    try {
        socket = io(env.api.serverAddress, {
            path: '/socket',
            transportOptions: {
                polling: {
                    extraHeaders: {
                        [HEADER]: utils.getToken()
                    }
                }
            }
        });
        if (toListenUserId) {
            listenToUserStatus(toListenUserId);
        }
    } catch (error) {
    }
}

const send = (event, data) => {
    if (!socket) return;
    socket.emit(event, data);
}

const addListener = (event, func) => {
    if (!socket) return;
    socket.on(event, func);
}

const disconnect = () => {
    if (!socket) return;
    socket.disconnect();
    socket = null;
}

const join = (room) => {
    if (!socket) return;
    socket.emit(socketConstants.JOIN, { room });
}

const leave = (room) => {
    if (!socket) return;
    socket.emit(socketConstants.LEAVE, { room });
}

const listenToUserStatus = (userId) => {
    if (!socket) {
        currentUserId = null;
        toListenUserId = userId;
        return;
    }
    toListenUserId = null;
    if (currentUserId !== userId) {
        if (currentUserId) socket.emit(socketConstants.LEAVE, { userId: currentUserId });
        socket.emit(socketConstants.JOIN, { userId });
        currentUserId = userId;
    }
}

const clearCurrentUserId = () => {
    if (currentUserId) {
        socket.emit(socketConstants.LEAVE, { userId: currentUserId });
        currentUserId = null;
    }
}

export default { send, connect, addListener, disconnect, join, leave, listenToUserStatus, clearCurrentUserId };