import React from 'react';
import * as timeUtils from '../../helpers/time-utils';
import { ContextMenuTrigger } from 'react-contextmenu';

import '../../css/chat.css';
import '../../css/react-contextmenu.css';

export const DELETE_MESSAGE_ID = 'DELETE_MESSAGE_ID';

export const Message = (props) => {
    const { details } = props;
    let { _id, deleted, content, fromMe, createDate } = details;

    if (deleted) content = 'Message Deleted';
    createDate = timeUtils.formatMessageTime(createDate);

    const msgClass = fromMe ? 'msg_cotainer_send' : 'msg_cotainer';
    const timeClass = fromMe ? 'msg_time_send' : 'msg_time';
    const fromClass = fromMe ? 'from_msg_me' : 'from_msg_other';
    const menuDisabled = !fromMe || deleted;
    const pointerStyle = menuDisabled ? null : { cursor: 'pointer' };

    return (
        <div key={_id} className={fromClass}>
            <ContextMenuTrigger id={DELETE_MESSAGE_ID} disable={menuDisabled}>
                <div className={msgClass} id={_id} style={pointerStyle}>
                    {deleted ?
                        <i id={_id} style={{ color: 'gray' }}>{content}</i>
                        :
                        content
                    }
                    <span id={_id} className={timeClass}>{createDate}</span>
                </div>
            </ContextMenuTrigger>
        </div>
    );
}