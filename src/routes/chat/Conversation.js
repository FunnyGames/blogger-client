import React, { useEffect, useRef, useState } from 'react';
import * as utils from '../../helpers/utils';
import * as timeUtils from '../../helpers/time-utils';
import { Message, DELETE_MESSAGE_ID } from './Message';
import { ContextMenu, MenuItem } from 'react-contextmenu';

export const Conversation = (props) => {
    const [allowToLoadMore, setAllowToLoadMore] = useState(false);
    const [lastMessage, setLastMessage] = useState(null);
    const [showDownBtn, setShowDownBtn] = useState(false);
    let { messages, hasMore, loadMore } = props;

    const messagesEndRef = useRef(null);

    const scrollToBottom = (behavior) => {
        behavior = behavior === 'auto' ? 'auto' : 'smooth';
        if (messagesEndRef && messagesEndRef.current && messagesEndRef.current.parentNode) {
            messagesEndRef.current.scrollIntoView({ behavior, block: 'nearest' });
        }
    }

    useEffect(() => {
        if (messages && messages.length > 0) {
            const m = messages[messages.length - 1];
            if (lastMessage !== m) {
                setLastMessage(m);
                scrollToBottom('auto');
            }
        }
    }, [messages, lastMessage]);

    const handleScroll = (e) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        const top = e.target.scrollTop <= e.target.clientHeight - 100;
        if (bottom) setAllowToLoadMore(true);
        if (top && allowToLoadMore && hasMore && loadMore) {
            loadMore();
        }
        setShowDownBtn(e.target.scrollHeight - e.target.scrollTop > e.target.clientHeight + 30);
    }

    const loadingMessages = () => {
        return <i>Loading...</i>;
    }

    const buildContent = () => {
        if (!messages || !messages.messages) return loadingMessages();
        messages = messages.messages;
        const list = [];
        let lastDate = null;
        if (messages && messages.length > 0) {
            const length = messages.length;
            for (let i = 0; i < length; ++i) {
                const m = messages[i];
                m.fromMe = m.fromUserId === utils.getUserId();
                const cDate = m.createDate;
                if (!timeUtils.dateEquals(cDate, lastDate)) {
                    lastDate = cDate;
                    const nDate = timeUtils.formatConversationTime(cDate);
                    list.push(<center key={'div-' + nDate}><div className="ui blue label">{nDate}</div></center>);
                }
                list.push(<Message key={m._id} details={m} />);
            }
            list.push(
                <div key="end-messages" ref={messagesEndRef} />
            );
        } else {
            return <div style={{ fontStyle: 'italic' }}>No messages</div>;
        }
        return list;
    }

    function handleDeleteMessageClick(e, data) {
        const id = data.target && data.target.id;
        if (id && props.onDeleteMessage) {
            props.onDeleteMessage(id);
        }
    }

    const downStyle = showDownBtn ? { display: 'block' } : { display: 'none' };

    return (
        <div style={{ minHeight: '600px', maxHeight: '600px', overflow: 'auto', background: '#f0f0ff' }} onScroll={handleScroll}>
            <div className="card">
                <div className="card-header msg_head">
                    {buildContent()}
                </div>
                <div>
                    <ContextMenu id={DELETE_MESSAGE_ID}>
                        <MenuItem onClick={handleDeleteMessageClick}>
                            Delete message
                        </MenuItem>
                    </ContextMenu>
                </div>
                <div className="circular ui icon blue button chat-go-down" style={downStyle} onClick={scrollToBottom}><i className="angle double down icon"></i></div>
            </div>
        </div>
    );
}