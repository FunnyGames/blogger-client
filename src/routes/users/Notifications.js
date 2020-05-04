import React from 'react';
import { connect } from 'react-redux';
import { notificationActions } from '../../actions';
import * as timeUtils from '../../helpers/time-utils';
import history from '../../helpers/history';
import globalConstants from '../../constants/global.constants';
import Table from '../../components/interactive/Table';
import { notificationOptions } from '../../constants/table.options';
import setTitle from '../../environments/document';
import types from '../../constants/notification-types.contants';
import { formatNotification } from '../../components/navbar/NotificationButton';

import '../../css/notification.css';

class Notifications extends React.Component {
    state = {
        page: 1,
        selectedOption: null,
        filter: null
    };

    hasUnread = false;

    componentDidMount() {
        setTitle("Notifications");

        this.loadNotifications();
    }

    loadNotifications = () => {
        const { dispatch } = this.props;

        const limit = globalConstants.TABLE_LIMIT;
        const { page, selectedOption, filter } = this.state;
        let { sortOrder, sortBy } = {};
        if (selectedOption) {
            sortBy = selectedOption.sortBy;
            sortOrder = selectedOption.sortOrder;
        }
        dispatch(notificationActions.getNotifications(page, limit, filter, sortBy, sortOrder));
    }

    onPageChange = (page) => {
        this.setState({ page }, this.loadNotifications);
    }

    handleSelectChange = selectedOption => {
        this.setState({ selectedOption }, this.loadNotifications);
    };

    onClickMarkAllAsRead = () => {
        const { dispatch } = this.props;

        dispatch(notificationActions.markReadAll(this.state.filter));
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

    onChangeFilter = (filter) => {
        const { notifications } = this.props;
        if (notifications.loading) return;
        this.setState({ filter, page: 1 }, this.loadNotifications);
    }

    buildLeftPanelItem = (text, icon, link) => {
        const key = 'item-' + link;
        const iconClass = `icon ${icon}`;
        const itemStyle = this.state.filter === link ? { backgroundColor: '#f0f0ff' } : null;
        return (
            <div key={key} className="item" style={itemStyle}>
                <div className="content">
                    <div className="header" style={{ cursor: 'pointer', padding: '5px' }} onClick={() => this.onChangeFilter(link)}><i className={iconClass} /> {text}</div>
                </div>
            </div>
        );
    }

    buildLeftPanel = () => {
        const list = [];
        list.push(this.buildLeftPanelItem('All Notifications', 'bell outline', null));
        list.push(this.buildLeftPanelItem('Blogs', 'edit outline', types.BLOG_NEW));
        list.push(this.buildLeftPanelItem('Groups', 'users', types.GROUP_ADD));
        list.push(this.buildLeftPanelItem('Comments', 'comment outline', types.COMMENT));
        list.push(this.buildLeftPanelItem('Reactions', 'thumbs up outline', types.REACT));
        list.push(this.buildLeftPanelItem('Custom', 'bullhorn', types.CUSTOM));
        return (
            <div className="ui big middle celled aligned animated list">
                {list}
            </div>
        );
    }

    buildItem = (n) => {
        const { _id, createDate, read } = n;
        const date = timeUtils.formatNotificationDateTime(createDate);
        const { text, toLink, msgType } = formatNotification(n);
        const style = { cursor: 'pointer' };
        let readMark = null;
        if (!read) {
            this.hasUnread = true;
            style.backgroundColor = '#e8e8ff';
            readMark = (
                <b className="not-mark" onClick={e => { e.stopPropagation(); this.onClickMarkAsRead(_id); }}>
                    <b className="ui blue empty circular label" style={{ marginRight: '5px' }} />
                    <i className="icon check"></i>Mark as Read
                </b>
            );
        }
        return (
            <tr key={_id} style={style} onClick={() => this.onNotificationClick(toLink, _id)}>
                <td>
                    <span className="notification-header">{msgType}</span><br />
                    {readMark}
                    {text}
                </td>
                <td className="right aligned notification-header">{date}</td>
            </tr>
        );
    }

    buildTableRows = (data) => {
        const list = [];
        this.hasUnread = false;
        if (data && data.length > 0) {
            const length = data.length;
            for (let i = 0; i < length; ++i) {
                const n = data[i];
                const item = this.buildItem(n);
                list.push(item);
            }
        } else {
            list.push(<tr key="no-notifications"><td>No Notifications</td></tr>);
        }
        return list;
    }

    buildCenterPanel = () => {
        const { notifications } = this.props;
        const data = notifications.notifications;
        const loadingTable = notifications.loading;
        let tableRows = this.buildTableRows(data);
        const totalRows = notifications.metadata && notifications.metadata.total;
        const markAllClass = `not-mark-all ${this.hasUnread && 'active'}`;

        return (
            <div>
                <b className={markAllClass} style={{ float: 'left', fontSize: 'medium' }} onClick={this.hasUnread ? this.onClickMarkAllAsRead : null}>
                    <i className="icon check"></i>Mark All as Read
                </b>
                <Table
                    loading={loadingTable}
                    tableRows={tableRows}
                    totalRows={totalRows}
                    onPageChange={this.onPageChange}
                    onSelectChange={this.handleSelectChange}
                    options={notificationOptions}
                    disableSearch={true}
                />
            </div>
        );
    }

    render() {
        const leftPanel = this.buildLeftPanel();
        const centerPanel = this.buildCenterPanel();

        return (
            <div style={{ marginBottom: '4em', marginTop: '4em' }}>
                <div className="ui header">
                    <div className="ui center aligned header">
                        <h1>Notifications:</h1>
                    </div>
                </div>
                <div className="ui container" style={{ display: 'flex' }}>
                    <div style={{ minWidth: '15em', paddingRight: '10px' }}>
                        {leftPanel}
                    </div>
                    <div style={{ width: '100%' }}>
                        {centerPanel}
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { notifications } = state;
    return { notifications };
}

const connected = connect(mapStateToProps)(Notifications);
export { connected as Notifications };
