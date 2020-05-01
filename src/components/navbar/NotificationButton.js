import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import paths from '../../constants/path.constants';
import * as timeUtils from '../../helpers/time-utils';
import * as utils from '../../helpers/utils';
import history from '../../helpers/history';
import Dropdown from '../interactive/Dropdown';
import { setReactionImage } from '../blog/Reaction';
import types from '../../constants/notification-types.contants';
import { notificationActions } from '../../actions';

import '../../css/notification.css';

export const formatNotification = (notification) => {
    const { kind, fromUserId, fromUsername, sourceName, content, sourceId } = notification;
    let toLink = paths.HOMEPAGE;
    let path = null;
    let msgType = '';
    const userUrl = fromUserId ? utils.convertUrlPath(paths.USER, { id: fromUserId }) : '';
    const userLink = <div className="notification-user-link" onClick={e => { e.stopPropagation(); history.push(userUrl); }} allowclose="true">{fromUsername}</div>;
    let text;
    let image;
    switch (kind) {
        case types.COMMENT:
            path = paths.BLOG;
            text = (
                <div allowclose="true">
                    {userLink} have posted a comment in your post <b>{sourceName}</b>:
                    <p>
                        <i>
                            {content}
                        </i>
                    </p>
                </div>
            );
            msgType = 'New Comment';
            break;
        case types.REACT:
            path = paths.BLOG;
            image = setReactionImage(content);
            text = (
                <div allowclose="true">
                    {userLink} reacted to your post <b>{sourceName}</b> with {<img src={image} width="16px" height="16px" alt={content} />}
                </div>
            );
            msgType = 'New Reaction';
            break;
        case types.GROUP_ADD:
            path = paths.GROUP;
            text = (
                <div allowclose="true">
                    {userLink} added you to a group <b>{sourceName}</b>
                </div>
            );
            msgType = 'Group Update';
            break;
        case types.BLOG_NEW:
            path = paths.BLOG;
            text = (
                <div allowclose="true">
                    {userLink} have posted a new blog: <b>{sourceName}</b>
                </div>
            );
            msgType = 'New Blog';
            break;
        default:
    }
    if (path && sourceId) {
        toLink = utils.convertUrlPath(path, { id: sourceId });
    }
    return { text, toLink, msgType };
}

class NotificationButton extends React.Component {
    hasUnread = false;

    componentDidMount() {
        const { dispatch } = this.props;

        dispatch(notificationActions.getTotalNotifications());
    }

    onNotificationMenuOpen = (e) => {
        const { dispatch } = this.props;

        dispatch(notificationActions.getShortNotifications());
    }

    onClickMarkAllAsRead = (e) => {
        const { dispatch } = this.props;

        dispatch(notificationActions.markReadAll());
    }

    onClickViewAllNotifications = (e) => {
        history.push(paths.NOTIFICATIONS);
    }

    onClickMarkAsRead = (id) => {
        if (!id) return;
        const { dispatch } = this.props;

        dispatch(notificationActions.markReadById(id));
    }

    onNotificationClick = (path, id) => {
        history.push(path);
        this.onClickMarkAsRead(id);
    }

    buildNotificationItem = (notification, hasMore) => {
        const { _id, read, createDate } = notification;
        const date = timeUtils.formatNotificationDateTime(createDate);
        const { text, toLink, msgType } = formatNotification(notification);
        const itemClass = `notification-item ${!read && 'read'}`;
        return (
            <div key={_id} className={itemClass} onClick={() => this.onNotificationClick(toLink, _id)} allowclose="true">
                <div className="event" allowclose="true">
                    <div className="content" allowclose="true">
                        <div className="notification-header" style={{ float: 'right' }} allowclose="true">
                            {date}
                        </div>
                        <div className="notification-header" allowclose="true">{msgType}</div>
                        <div className="">
                            {!read && (
                                <b className="not-mark" onClick={e => { e.stopPropagation(); this.onClickMarkAsRead(_id); }}>
                                    <b className="ui blue empty circular label" style={{ marginRight: '5px' }} />
                                    <i className="icon check"></i>Mark as Read
                                </b>
                            )}
                            {text}
                        </div>
                    </div>
                </div>
                {hasMore && <div className="ui divider"></div>}
            </div>
        );
    }

    loadingNotifications = () => {
        return <div className="ui loading basic segment" />;
    }

    noNotifications = () => {
        return <div>No notifications</div>;
    }

    buildNotificationsList = () => {
        const { notifications } = this.props;
        if (!notifications || notifications.loading) return this.loadingNotifications();
        let data = notifications.notifications;
        if (!data || data.length === 0) return this.noNotifications();
        const list = [];
        const notlength = data.length;
        this.hasUnread = false;
        for (let i = 0; i < notlength; ++i) {
            const notification = data[i];
            const { read } = notification;
            const hasMore = i + 1 < data.length;
            const n = this.buildNotificationItem(notification, hasMore);
            list.push(n);
            if (!read) this.hasUnread = true;
        }
        return list;
    }

    buildNotificationContent = () => {
        const notificationsList = this.buildNotificationsList();
        const settingsLink = paths.PROFILE; // TODO change to settings page
        const markAllClass = `not-mark-all ${this.hasUnread && 'active'}`;
        return (
            <div className="ui segment" style={{ width: '400px', marginLeft: '-175px' }}>
                Notifications
                <Link to={settingsLink} className="notifications-settings" allowclose="true">
                    <i className="icon cog"></i>Settings
                </Link>
                <b className={markAllClass} onClick={this.hasUnread ? this.onClickMarkAllAsRead : null}>
                    <i className="icon check"></i>Mark All as Read
                </b>
                <div className="ui divider"></div>
                <div className="ui feed scroller" style={{ maxHeight: '300px', overflow: 'auto' }}>
                    {notificationsList}
                </div>
                <div className="ui divider"></div>
                <center className="view-all-notifications" onClick={this.onClickViewAllNotifications} allowclose="true">View all notifications</center>
            </div>
        );
    }

    render() {
        const { totalNotifications } = this.props;
        let numberOfNotifications = 0;
        if (totalNotifications && totalNotifications.count > 0) numberOfNotifications = totalNotifications.count;
        const notificationButton = (
            <div className="notification">
                <i style={{ color: 'white' }} className="large icon bell"></i>
                {numberOfNotifications > 0 ? <span className="badge">{numberOfNotifications}</span> : null}
            </div>
        );
        const notificationContent = this.buildNotificationContent();
        return (
            <div className="navbar-icon" onClick={this.toggleNotificatioMenu}>
                <Dropdown button={notificationButton} content={notificationContent} contentClassName="notification-panel" onMenuOpen={this.onNotificationMenuOpen} />
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { shortNotifications, totalNotifications } = state;
    return { notifications: shortNotifications, totalNotifications };
};

export default connect(
    mapStateToProps,
    null
)(NotificationButton);