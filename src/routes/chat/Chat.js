import React from 'react';
import { connect } from 'react-redux';
import { chatActions } from '../../actions';
import * as timeUtils from '../../helpers/time-utils';
import * as utils from '../../helpers/utils';
import history from '../../helpers/history';
import paths from '../../constants/path.constants';
import globalConstants from '../../constants/global.constants';
import setTitle from '../../environments/document';
import { Picker } from 'emoji-mart';
import BasicModal from '../../components/interactive/BasicModal';
import { Conversation } from './Conversation';
import { NewChat } from './NewChat';
import { ContextMenuTrigger } from 'react-contextmenu';
import { ContextMenu, MenuItem } from 'react-contextmenu';
import socket from '../../socket/socket.service';

import '../../css/chat.css';
import 'emoji-mart/css/emoji-mart.css';

const BLOCK_USER_ID = 'BLOCK_USER_ID';
const UNBLOCK_USER_ID = 'UNBLOCK_USER_ID';

class Chat extends React.Component {
    state = {
        selectedOption: null,
        search: '',
        message: '',
        emojiPickerOpened: false
    };

    openNewChatModal = {};

    componentDidMount() {
        setTitle("Chat");

        this.loadChatList();
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    getChatId = () => {
        return this.props.match.params.id;
    }

    onSearch = (e) => {
        this.setState({ search: e.target.value });
    }

    onChangeSelect = (chat) => {
        const urlx = utils.convertUrlPath(paths.VIEW_CHAT, { id: chat._id });
        history.push(urlx);
    }

    onMessageChange = (e) => {
        this.setState({ message: e.target.value });
    }

    onMessageKeyDown = (e) => {
        if (e.key === 'Enter' && this.state.message && this.state.message.length > 0) {
            this.sendMessage();
        }
    }

    onEmojiClick = (emoji) => {
        let { message } = this.state;
        message += emoji.native;
        this.setState({ message });
    }

    onToggleEmojiPicker = () => {
        this.setState({ emojiPickerOpened: !this.state.emojiPickerOpened });
    }

    sendMessage = (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        const content = this.state.message;
        const chatId = this.getChatId();
        const { dispatch } = this.props;

        if (chatId && content) {
            dispatch(chatActions.createMessage(chatId, content));
            this.setState({ message: '' });
        }
    }

    loadChatList = () => {
        const { dispatch } = this.props;

        dispatch(chatActions.getChatList());
    }

    loadMessages = (chatId, clear) => {
        if (clear) {
            this.props.dispatch(chatActions.clear());
        }
        const { dispatch, messages, chats } = this.props;
        let seenIds = undefined;
        if (messages && messages.messages && !clear) {
            seenIds = messages.messages.map(c => c._id);
        }
        const limit = globalConstants.MESSAGES_LIMIT;
        dispatch(chatActions.getMessages(chatId, seenIds, limit));
        const chatsx = chats.chats;
        setTimeout(() => dispatch(chatActions.countTotalMessages(chatsx, chatId)), 300);
    }

    onDeleteMessage = (id) => {
        const { dispatch } = this.props;
        const chatId = this.getChatId();

        dispatch(chatActions.deleteMessage(chatId, id));
    }

    onUserSelect = (userId) => {
        if (this.openNewChatModal) this.openNewChatModal.close();
        let { chats, dispatch } = this.props;
        if (chats && chats.chats) {
            chats = chats.chats;
        }
        for (let i = 0; i < chats.length; ++i) {
            let c = chats[i];
            if (c.userId1 === userId || c.userId2 === userId) {
                this.onChangeSelect(c);
                return;
            }
        }
        dispatch(chatActions.createChat(userId));
    }

    onClickBlock = (e, data) => {
        const { _id } = data;
        const { dispatch } = this.props;

        dispatch(chatActions.blockUser(_id));
    }

    onClickUnBlock = (e, data) => {
        const { _id } = data;
        const { dispatch } = this.props;

        dispatch(chatActions.unblockUser(_id));
    }

    openNewChat = () => {
        if (this.openNewChatModal.func) {
            this.openNewChatModal.func();
        }
    }

    scrollToBottom = () => {
        if (this.messagesEnd && this.messagesEnd.scrollIntoView) {
            this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
        }
    }

    buildLeftPanelItem = (_id, username, lastMessage, lastUpdate, newMessages, selected, meUser1, chat) => {
        const { userBlocked1, userBlocked2 } = chat;
        const key = 'item-' + _id;
        const newMsgCount = newMessages > 0 ? <b className="chat-new-messages-count">{newMessages}</b> : null;
        const userClass = `item user_info ${selected ? 'selected' : ''}`;
        if (!lastMessage) lastMessage = 'No messages';

        const isBlocked = meUser1 ? userBlocked2 : userBlocked1;
        const menuId = (isBlocked ? UNBLOCK_USER_ID : BLOCK_USER_ID) + _id;
        const onClickBlock = isBlocked ? this.onClickUnBlock : this.onClickBlock;
        const meBlocked = meUser1 ? userBlocked1 : userBlocked2;
        const blockMsg = meBlocked ? 'You are blocked' : isBlocked ? 'Unblock User' : 'Block User';

        return (
            <div key={key}>
                <ContextMenuTrigger id={menuId}>
                    <div className={userClass} onClick={() => this.onChangeSelect(chat)}>
                        <div className="content">
                            <span className="chat-last-update">{lastUpdate}</span>
                            <span className="chat-username">{username} {newMsgCount}</span><br />
                            <span className="chat-last-message">{lastMessage}</span>
                        </div>
                        <div className="ui divider" />
                    </div>
                </ContextMenuTrigger>
                <ContextMenu id={menuId}>
                    <MenuItem data={{ _id }} onClick={onClickBlock} disabled={meBlocked}>
                        {blockMsg}
                    </MenuItem>
                </ContextMenu>
            </div>
        );
    }

    loadingChatList = () => {
        return <i>Loading...</i>;
    }

    isChatSelected = (_id) => {
        return this.state.selectedOption && this.state.selectedOption._id === _id;
    }

    filterChatList = (chats) => {
        const s = this.state.search;
        if (!s) return chats;
        const re = new RegExp(s, 'ig');
        return chats.filter(c => re.test(c.username1) || re.test(c.username2));
    }

    buildLeftPanel = (chats) => {
        if (!chats || chats.loading) return this.loadingChatList();
        const list = [];
        chats = chats.chats;
        if (chats && chats.length > 0) {
            chats = this.filterChatList(chats);
            const length = chats.length;
            for (let i = 0; i < length; ++i) {
                let { userId1, username1, username2, lastMessage, _id, deleted, lastUpdate, lastUserId, totalNewMessages } = chats[i];
                const meUser1 = userId1 === utils.getUserId();
                let username = meUser1 ? username2 : username1;
                let newMessages = 0;
                if (totalNewMessages > 0) {
                    if ((meUser1 && userId1 !== lastUserId) || (!meUser1 && userId1 === lastUserId)) {
                        newMessages = totalNewMessages;
                    }
                }
                if (deleted) lastMessage = 'Message deleted';
                lastUpdate = timeUtils.formatChatTime(lastUpdate);
                const selected = this.isChatSelected(_id);
                list.push(this.buildLeftPanelItem(_id, username, lastMessage, lastUpdate, newMessages, selected, meUser1, chats[i]));
            }
        } else {
            list.push(<div key="no-chats"><center><i>No Chats</i></center></div>)
        }
        return (
            <div className="ui big middle celled aligned list">
                {list}
            </div>
        );
    }

    buildCenterPanel = (messages) => {
        const { loading, metadata } = messages;
        const { message, selectedOption, emojiPickerOpened } = this.state;
        if (!selectedOption) {
            return <div>Please select chat first</div>;
        }
        let { userId1, username1, username2, totalMessages, userBlocked1, userBlocked2, online } = selectedOption;
        const meUser1 = userId1 === utils.getUserId();
        const username = meUser1 ? username2 : username1;
        const isBlocked = userBlocked1 || userBlocked2;
        const sendIcon = message && message.length > 0 ? 'inverted circular paper plane link icon' : 'disabled paper plane icon';
        const inputClass = `ui ${isBlocked ? 'disabled' : ''} left action right icon fluid input`;
        const chatId = this.getChatId();
        const hasMore = !loading && metadata && metadata.total > globalConstants.MESSAGES_LIMIT;
        const onlineStatus = online ? 'online' : 'offline';
        const onlineDiv = (<span className={`dot ${onlineStatus}`}></span>);
        return (
            <div>
                <h2>{username} {onlineDiv} <span className="total-messages">({totalMessages} total)</span></h2>
                <div className="ui divider"></div>
                <Conversation
                    messages={messages}
                    hasMore={hasMore}
                    loadMore={() => this.loadMessages(chatId, false)}
                    onDeleteMessage={this.onDeleteMessage}
                />
                <div className="ui divider"></div>
                {emojiPickerOpened &&
                    <div style={{ position: 'absolute', zIndex: '200', transform: 'translate(0px, -430px)' }}>
                        <Picker onSelect={this.onEmojiClick} />
                    </div>
                }
                <div className={inputClass}>
                    <button className="ui blue icon button" onClick={() => isBlocked ? null : this.onToggleEmojiPicker()}>
                        <span role="img" aria-label="emoji">😀</span>
                    </button>
                    <input type="text" placeholder="Type a message" onChange={this.onMessageChange} onKeyDown={this.onMessageKeyDown} value={this.state.message} />
                    <i className={sendIcon} onClick={this.sendMessage}></i>
                </div>
            </div>
        );
    }

    updateChatView = (chats) => {
        if (!chats || chats.loading || !chats.chats) return true;
        const chatId = this.getChatId();
        const selectedOption = this.state.selectedOption;
        if (!selectedOption || selectedOption._id !== chatId) {
            let chat = null;
            chats = chats.chats;
            const f = () => this.loadMessages(this.state.selectedOption._id, true);
            for (let i = 0; i < chats.length; ++i) {
                chat = chats[i];
                if (chat._id === chatId) {
                    this.setState({ selectedOption: chat }, f);
                    const userId = chat.userId1 === utils.getUserId() ? chat.userId2 : chat.userId1;
                    socket.listenToUserStatus(userId);
                    return true;
                }
            }
        }
        return false;
    }

    render() {
        const { chats, messages } = this.props;
        if (this.updateChatView(chats)) {
            return this.loadingChatList();
        }
        const leftPanel = this.buildLeftPanel(chats);
        const centerPanel = this.buildCenterPanel(messages);

        return (
            <div style={{ marginBottom: '4em', marginTop: '4em' }}>
                <div className="ui header">
                    <div className="ui center aligned header">
                        <h1>Chat:</h1>
                    </div>
                </div>
                <div className="ui container">
                    <div className="ui grid" style={{ minWidth: '1280px' }}>
                        <div className="four wide column">
                            <h3>
                                Users:
                                <div className="ui mini icon transparent input" style={{ float: 'right' }}>
                                    <input type="text" placeholder="Search..." onChange={this.onSearch} />
                                    <i className="search icon"></i>
                                </div>
                            </h3>
                            <div className="ui divider"></div>
                            <div style={{ minHeight: '200px', maxHeight: '600px', overflow: 'auto' }}>
                                {leftPanel}
                            </div>
                            <div className="ui divider"></div>
                            <b className="ui fluid blue button" style={{ marginTop: '20px' }} onClick={this.openNewChat}>
                                Start a new chat
                            </b>
                        </div>
                        <div className="eight wide column" style={{ minWidth: '60%' }}>
                            {centerPanel}
                        </div>
                    </div>
                </div>
                <BasicModal openModal={this.openNewChatModal} showCloseButton={true}>
                    <NewChat onUserSelect={this.onUserSelect} />
                </BasicModal>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { messages, chats } = state;
    return { messages, chats };
}

const connected = connect(mapStateToProps)(Chat);
export { connected as Chat };