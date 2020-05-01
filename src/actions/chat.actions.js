import { chatConstants } from '../constants';
import { chatService } from '../services';
import { perform } from './base.actions';
import * as utils from '../helpers/utils';

export const chatActions = {
    createChat,
    createMessage,
    getMessages,
    getChatList,
    getTotalMessages,
    getBlockedUsers,
    blockUser,
    unblockUser,
    deleteMessage,
    clear,
    countTotalMessages
};

function createChat(userId) {
    const datax = userId;
    const actions = {
        request: chatConstants.CREATE_CHAT_REQUEST,
        success: chatConstants.CREATE_CHAT_SUCCESS,
        failure: chatConstants.CREATE_CHAT_FAILURE
    };
    return perform(chatService.createChat, datax, actions);
}

function createMessage(chatId, content) {
    const datax = { chatId, content };
    const actions = {
        request: chatConstants.CREATE_MESSAGE_REQUEST,
        success: chatConstants.CREATE_MESSAGE_SUCCESS,
        failure: chatConstants.CREATE_MESSAGE_FAILURE
    };
    return perform(chatService.createMessage, datax, actions);
}

function getMessages(chatId, seenIds, limit) {
    const datax = { chatId, seenIds, limit };
    const actions = {
        request: chatConstants.GET_MESSAGES_REQUEST,
        success: chatConstants.GET_MESSAGES_SUCCESS,
        failure: chatConstants.GET_MESSAGES_FAILURE
    };
    const other = { success: { chatId } };
    return perform(chatService.getMessages, datax, actions, null, null, other);
}

function getChatList() {
    const datax = null;
    const actions = {
        request: chatConstants.GET_CHAT_LIST_REQUEST,
        success: chatConstants.GET_CHAT_LIST_SUCCESS,
        failure: chatConstants.GET_CHAT_LIST_FAILURE
    };
    return perform(chatService.getChatList, datax, actions);
}

function getTotalMessages() {
    const datax = null;
    const actions = {
        request: chatConstants.GET_TOTAL_MESSAGES_REQUEST,
        success: chatConstants.GET_TOTAL_MESSAGES_SUCCESS,
        failure: chatConstants.GET_TOTAL_MESSAGES_FAILURE
    };
    return perform(chatService.getTotalMessages, datax, actions);
}

function getBlockedUsers() {
    const datax = null;
    const actions = {
        request: chatConstants.GET_BLOCKED_USERS_REQUEST,
        success: chatConstants.GET_BLOCKED_USERS_SUCCESS,
        failure: chatConstants.GET_BLOCKED_USERS_FAILURE
    };
    return perform(chatService.getBlockedUsers, datax, actions);
}

function blockUser(chatId) {
    const datax = chatId;
    const actions = {
        request: chatConstants.BLOCK_USER_REQUEST,
        success: chatConstants.BLOCK_USER_SUCCESS,
        failure: chatConstants.BLOCK_USER_FAILURE
    };
    const other = { success: { chatId } };
    return perform(chatService.blockUser, datax, actions, null, null, other);
}

function unblockUser(chatId) {
    const datax = chatId;
    const actions = {
        request: chatConstants.UNBLOCK_USER_REQUEST,
        success: chatConstants.UNBLOCK_USER_SUCCESS,
        failure: chatConstants.UNBLOCK_USER_FAILURE
    };
    const other = { success: { chatId } };
    return perform(chatService.unblockUser, datax, actions, null, null, other);
}

function deleteMessage(chatId, msgId) {
    const datax = { chatId, msgId };
    const actions = {
        request: chatConstants.DELETE_MESSAGE_REQUEST,
        success: chatConstants.DELETE_MESSAGE_SUCCESS,
        failure: chatConstants.DELETE_MESSAGE_FAILURE
    };
    const other = { request: { msgId, chatId } };
    return perform(chatService.deleteMessage, datax, actions, null, null, other);
}

function clear() {
    return { type: chatConstants.GET_MESSAGES_CLEAR };
}

function countTotalMessages(chats) {
    let count = 0;
    const myUserId = utils.getUserId();
    for (let i = 0; i < chats.length; ++i) {
        let c = chats[i];
        if (c.totalNewMessages > 0 && c.lastUserId !== myUserId) {
            ++count;
        }
    }
    return { type: chatConstants.GET_TOTAL_MESSAGES_NUMBER, payload: { count } };
}