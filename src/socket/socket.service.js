import io from 'socket.io-client';
import env from '../environments/env';
import * as utils from '../helpers/utils';
import constants from '../constants/global.constants';

const HEADER = constants.HEADER_AUTH;

let socket = null;

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

export default { send, connect, addListener };