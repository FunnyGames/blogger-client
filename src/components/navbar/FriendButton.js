import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import paths from '../../constants/path.constants';
import * as utils from '../../helpers/utils';
import history from '../../helpers/history';
import Dropdown from '../interactive/Dropdown';
import { friendActions } from '../../actions';
import globalConstants from '../../constants/global.constants';

import '../../css/notification.css';

export const formatFriendRequest = (request, onAccept, onDecline) => {
    const { username1, username2, userId1, pending, userRequested } = request;
    let fromUserId = userRequested;
    let fromUsername = userRequested === userId1 ? username1 : username2;
    const userUrl = fromUserId ? utils.convertUrlPath(paths.USER, { id: fromUserId }) : '';
    const userLink = <div className="notification-user-link" style={{ display: 'initial' }} onClick={e => { e.stopPropagation(); history.push(userUrl); }} allowclose="true">{fromUsername}</div>;
    let text = (
        <div allowclose="true">
            {pending &&
                <span style={{ float: 'right' }}>
                    <b className="ui blue tiny button" onClick={onAccept}><i className="icon user plus" />Accept</b>
                    <b className="ui red tiny button" onClick={onDecline}><i className="icon user times" />Decline</b>
                </span>
            }
            <b>{userLink}</b>
        </div>
    );
    return text;
}

class FriendButton extends React.Component {
    componentDidMount() {
        const { dispatch } = this.props;

        dispatch(friendActions.getTotalFriendRequests());
    }

    onFriendMenuOpen = () => {
        const { dispatch } = this.props;

        let page = 1;
        let limit = globalConstants.FRIEND_REQUEST_LIMIT;
        let name = '';
        let sortBy = undefined;
        let sortOrder = undefined;
        dispatch(friendActions.getFriendRequests(page, limit, name, sortBy, sortOrder));
    }

    onClickViewAllRequests = () => {
        history.push(paths.FRIEND_REQUESTS);
    }

    onAccept = (_id) => {
        const { dispatch } = this.props;
        dispatch(friendActions.friendAccept(_id));
    }

    onDecline = (_id) => {
        const { dispatch } = this.props;
        dispatch(friendActions.unfriend(_id));
    }

    buildNotificationItem = (request, hasMore) => {
        const { _id } = request;
        const onAccept = () => this.onAccept(_id);
        const onDecline = () => this.onDecline(_id);
        const text = formatFriendRequest(request, onAccept, onDecline);
        return (
            <div key={_id} allowclose="true">
                <div className="event" allowclose="true">
                    <div className="content" allowclose="true">
                        {text}
                        {hasMore && <div className="ui divider"></div>}
                    </div>
                </div>
            </div>
        );
    }

    loadingRequests = () => {
        return <div className="ui loading basic segment" />;
    }

    noRequests = () => {
        return <div>No friend requests</div>;
    }

    buildNotificationsList = () => {
        const { friends } = this.props;
        if (!friends || friends.loading) return this.loadingRequests();
        let data = friends.data;
        if (!data || data.length === 0) return this.noRequests();
        const list = [];
        const notlength = data.length;
        for (let i = 0; i < notlength; ++i) {
            const user = data[i];
            const hasMore = i + 1 < data.length;
            const n = this.buildNotificationItem(user, hasMore);
            list.push(n);
        }
        return list;
    }

    buildNotificationContent = () => {
        const notificationsList = this.buildNotificationsList();
        const settingsLink = paths.NOTIFICATIONS_SETTINGS;
        return (
            <div className="ui segment" style={{ width: '400px', marginLeft: '-175px' }}>
                Friend Requests
                <Link to={settingsLink} className="notifications-settings" allowclose="true">
                    <i className="icon cog"></i>Settings
                </Link>
                <div className="ui divider"></div>
                <div className="ui feed scroller" style={{ maxHeight: '300px', overflow: 'auto' }}>
                    {notificationsList}
                </div>
                <div className="ui divider"></div>
                <center className="view-all-notifications" onClick={this.onClickViewAllRequests} allowclose="true">View all friend requests</center>
            </div>
        );
    }

    render() {
        const { totalFriendRequests } = this.props;
        let numberOfFriendRequests = 0;
        if (totalFriendRequests && totalFriendRequests.count) numberOfFriendRequests = totalFriendRequests.count.length;
        const notificationButton = (
            <div className="notification">
                <i style={{ color: 'white' }} className="large icon users"></i>
                {numberOfFriendRequests > 0 ? <span className="badge">{numberOfFriendRequests}</span> : null}
            </div>
        );
        const notificationContent = this.buildNotificationContent();
        return (
            <div className="navbar-icon" onClick={this.toggleNotificatioMenu}>
                <Dropdown button={notificationButton} content={notificationContent} contentClassName="notification-panel" onMenuOpen={this.onFriendMenuOpen} />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const { requests, totalFriendRequests } = state;
    return { friends: requests, totalFriendRequests };
};

export default connect(
    mapStateToProps,
    null
)(FriendButton);