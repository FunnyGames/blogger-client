import { chatConstants, userConstants } from '../constants';
import * as utils from '../helpers/utils';

export function chats(state = {}, action) {
    switch (action.type) {
        case chatConstants.GET_CHAT_LIST_REQUEST:
            return { loading: true };
        case chatConstants.GET_CHAT_LIST_SUCCESS:
            return { ...action.payload };
        case chatConstants.GET_CHAT_LIST_FAILURE:
            return { error: action.error };

        case chatConstants.CREATE_CHAT_SUCCESS:
            state.chats = [...state.chats, action.payload];
            return { ...state };

        case chatConstants.GET_MESSAGES_SUCCESS:
            if (state.chats) {
                state.chats = state.chats.map(c => {
                    if (c._id === action.other.chatId) {
                        c.totalNewMessages = 0;
                        c.opened = true;
                    } else {
                        c.opened = false;
                    }
                    return c;
                });
                return { ...state };
            }
            return state;

        case chatConstants.CREATE_MESSAGE_SUCCESS:
            if (state.chats && state.chats.length > 0) {
                let msg = action.payload;
                let chats = state.chats;
                let list = [];
                let newChat = null;
                for (let i = 0; i < chats.length; ++i) {
                    let c = chats[i];
                    if (c._id !== msg.chatId) {
                        list.push(c);
                    } else {
                        newChat = c;
                        newChat.lastMessage = utils.shortenMessage(msg.content);
                        newChat.deleted = msg.deleted;
                        newChat.lastUpdate = msg.createDate;
                        newChat.lastMessageId = msg._id;
                        newChat.totalMessages++;
                        newChat.totalNewMessages = 0;
                    }
                }
                if (newChat) {
                    list.splice(0, 0, newChat);
                    state.chats = list;
                }
            }
            return { ...state };

        case chatConstants.NEW_MESSAGE:
            if (!state.chats) return state;
            let msg = action.payload;
            if (state.chats.length > 0) {
                let chats = state.chats;
                let list = [];
                let newChat = null;
                for (let i = 0; i < chats.length; ++i) {
                    let c = chats[i];
                    if (c._id !== msg.chatId) {
                        list.push(c);
                    } else {
                        newChat = c;
                        newChat.lastMessage = utils.shortenMessage(msg.content);
                        newChat.deleted = msg.deleted;
                        newChat.lastUpdate = msg.createDate;
                        newChat.lastMessageId = msg._id;
                        newChat.totalMessages++;
                        if (!action.payload.isChatOpened) newChat.totalNewMessages++;
                    }
                }
                if (newChat) {
                    list.splice(0, 0, newChat);
                    state.chats = list;
                }
            } else {
                let newChat = {};
                newChat.username1 = msg.fromUsername;
                newChat.userId1 = msg.userId1;
                newChat.lastMessage = utils.shortenMessage(msg.content);
                newChat.deleted = msg.deleted;
                newChat.lastUpdate = msg.createDate;
                newChat.lastMessageId = msg._id;
                newChat.totalMessages++;
                newChat.totalNewMessages++;
                state.chats = [newChat];
            }
            return { ...state };

        case chatConstants.DELETE_MESSAGE_REQUEST:
            if (action.other) {
                let msgId = action.other.msgId;
                let chatId = action.other.chatId;
                for (let i = 0; i < state.chats.length; ++i) {
                    let c = state.chats[i];
                    if (c._id === chatId && c.lastMessageId === msgId) {
                        state.lastMessageDeletedChatId = chatId;
                        break;
                    }
                }
                if (state.lastMessageDeletedChatId) {
                    return { ...state };
                }
            }
            return state;

        case chatConstants.DELETE_MESSAGE_SUCCESS:
            if (state.lastMessageDeletedChatId) {
                state.chats = state.chats.map(c => {
                    if (c._id === state.lastMessageDeletedChatId) {
                        c.deleted = true;
                        c.lastMessage = '.';
                    }
                    return c;
                });
                return { ...state };
            }
            return state;


        case chatConstants.BLOCK_USER_SUCCESS:
            state.chats = state.chats.map(c => {
                if (c._id === action.other.chatId) {
                    if (utils.getUserId() === c.userId2)
                        c.userBlocked1 = true;
                    else
                        c.userBlocked2 = true;
                }
                return c;
            });
            return { ...state };

        case chatConstants.BLOCK_USER_RECEIVED_SUCCESS:
            state.chats = state.chats.map(c => {
                if (c._id === action.other.chatId) {
                    if (utils.getUserId() !== c.userId2)
                        c.userBlocked1 = true;
                    else
                        c.userBlocked2 = true;
                }
                return c;
            });
            return { ...state };

        case chatConstants.UNBLOCK_USER_SUCCESS:
        case chatConstants.UNBLOCK_USER_RECEIVED_SUCCESS:
            if (!state.chats) return state;
            state.chats = state.chats.map(c => {
                if (c._id === action.other.chatId) {
                    c.userBlocked1 = false;
                    c.userBlocked2 = false;
                }
                return c;
            });
            return { ...state };

        case chatConstants.USER_STATUS:
            let chatId = action.other.chatId;
            if (chatId && state.chats) {
                state.chats = state.chats.map(c => {
                    if (c._id === chatId) {
                        c.online = action.other.online;
                    }
                    return c;
                });
                return { ...state };
            }
            return state;

        case userConstants.LOGOUT_SUCCESS:
            return {};

        default:
            if (state.chats) {
                state.chats = state.chats.map(c => {
                    c.opened = false;
                    return c;
                });
                return { ...state };
            }
            return state;
    }
}

export function totalMessages(state = {}, action) {
    switch (action.type) {
        case chatConstants.GET_TOTAL_MESSAGES_REQUEST:
            return { loading: true };
        case chatConstants.GET_TOTAL_MESSAGES_SUCCESS:
            return { ...action.payload };
        case chatConstants.GET_TOTAL_MESSAGES_FAILURE:
            return { error: action.error };

        case chatConstants.GET_TOTAL_MESSAGES_NUMBER:
            return { ...action.payload };

        case chatConstants.NEW_MESSAGE:
            if (action.payload.isChatOpened) {
                return state;
            }
            const chatId = action.payload.chatId;
            let count = (state.count ? state.count.filter(c => c !== chatId) : []);
            count.push(chatId);
            return { count };

        case userConstants.LOGOUT_SUCCESS:
            return {};

        default:
            return state;
    }
}

export function messages(state = {}, action) {
    switch (action.type) {
        case chatConstants.GET_MESSAGES_REQUEST:
            return { ...state, loading: true };
        case chatConstants.GET_MESSAGES_SUCCESS:
            let data = state.messages || [];
            data = action.payload.messages.reverse().concat(data);
            let total = state.metadata ? state.metadata.overall : 0;
            action.payload.metadata.overall = Math.max(action.payload.metadata.total, total);
            return { messages: data, metadata: action.payload.metadata, chatId: action.other.chatId };
        case chatConstants.GET_MESSAGES_FAILURE:
            return { error: action.error };

        case chatConstants.CREATE_MESSAGE_SUCCESS:
            state = {
                messages: [...state.messages, action.payload],
                metadata: { total: state.metadata.total + 1 },
                chatId: state.chatId
            };
            return state;

        case chatConstants.NEW_MESSAGE:
            if (!state.messages || state.chatId !== action.payload.chatId) return state;
            let msg = { ...action.payload, chats: undefined };
            state = {
                messages: [...state.messages, msg],
                metadata: { total: state.metadata.total + 1 },
                chatId: state.chatId
            };
            return state;

        case chatConstants.GET_MESSAGES_CLEAR:
        case userConstants.LOGOUT_SUCCESS:
            return {};

        case chatConstants.DELETE_MESSAGE_REQUEST:
            let deleteMessageId = action.other && action.other.msgId;
            return { ...state, deleteMessageId };

        case chatConstants.DELETE_MESSAGE_SUCCESS:
            state = {
                messages: [...state.messages.map(m => {
                    if (m._id === state.deleteMessageId) {
                        m.deleted = true;
                        m.content = '.';
                    }
                    return m;
                })],
                metadata: { total: state.metadata.total },
                chatId: state.chatId
            };
            return state;

        default:
            return state;
    }
}

export function blocked(state = {}, action) {
    switch (action.type) {
        case chatConstants.GET_BLOCKED_USERS_REQUEST:
            return { loading: true };
        case chatConstants.GET_BLOCKED_USERS_SUCCESS:
            return { ...action.payload };
        case chatConstants.GET_BLOCKED_USERS_FAILURE:
            return { error: action.error };

        case chatConstants.UNBLOCK_USER_SUCCESS:
            if (!state.blocked) return state;
            state.blocked = state.blocked.filter(c => c._id !== action.other.chatId);
            return { ...state };

        default:
            return state;
    }
}