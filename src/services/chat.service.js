import * as http from './base.service';
import url from '../constants/url.constants';
import * as utils from '../helpers/utils';

export const chatService = {
    createChat,
    createMessage,
    getMessages,
    getChatList,
    getTotalMessages,
    getBlockedUsers,
    blockUser,
    unblockUser,
    deleteMessage
};

function createChat(userId) {
    const data = {
        userId
    };
    return http.post(url.CREATE_CHAT, data);
}

function createMessage({ chatId, content }) {
    const data = {
        content
    };
    let urlx = utils.convertUrlPath(url.CREATE_MESSAGE, { id: chatId });
    return http.post(urlx, data);
}

function getMessages({ chatId, seenIds, limit }) {
    const data = {
        seenIds
    };
    const params = {
        limit
    };
    let urlx = utils.convertUrlPath(url.GET_MESSAGES, { id: chatId });
    return http.put(urlx, data, params);
}

function getChatList() {
    return http.get(url.GET_CHAT_LIST);
}

function getTotalMessages() {
    return http.get(url.GET_TOTAL_MESSAGES);
}

function getBlockedUsers() {
    return http.get(url.GET_BLOCKED_USERS);
}

function blockUser(chatId) {
    let urlx = utils.convertUrlPath(url.CHAT_BLOCK_USER, { id: chatId });
    return http.get(urlx);
}

function unblockUser(chatId) {
    let urlx = utils.convertUrlPath(url.CHAT_UNBLOCK_USER, { id: chatId });
    return http.get(urlx);
}

function deleteMessage({ chatId, msgId }) {
    let urlx = utils.convertUrlPath(url.DELETE_MESSAGE, { id: chatId, id2: msgId });
    return http.del(urlx);
}
