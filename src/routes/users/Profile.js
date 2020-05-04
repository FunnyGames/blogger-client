import React from 'react';
import { connect } from 'react-redux';
import paths from '../../constants/path.constants';
import setTitle from '../../environments/document';
import ErrorConnect from '../../components/pages/ErrorConnect';
import renderLoader from '../../components/interactive/Loader';
import * as utils from '../../helpers/utils';
import history from '../../helpers/history';
import { EditProfile } from './settings/EditProfile';
import { EditPassword } from './settings/EditPassword';
import { ProfileGroups } from './settings/ProfileGroups';
import { CancelAccount } from './settings/CancelAccount';
import { BlockedUsers } from './settings/BlockedUsers';
import { Subscriptions } from './settings/Subscriptions';
import { NotificationSettings } from './settings/NotificationSettings';

import '../../css/profile.css';

class Profile extends React.Component {

    componentDidMount() {
        if (!history.location.state || !history.location.state.fromProfile) {
            setTitle("Profile");
        }
    }

    onClickTitle = (link, title) => {
        if (title) {
            setTitle(title);
        }
        history.push(link, { fromProfile: true });
    }

    buildLeftPanelItem = (title, icon, link, external) => {
        const path = this.props.match.path;
        const key = 'p-' + title;
        const iconClass = `icon ${icon}`;
        const itemStyle = link === path ? { backgroundColor: '#f0f0ff' } : null;
        const linkStyle = { padding: '5px', fontWeight: 'normal', cursor: 'pointer' };
        const ex = external && <i style={{ float: 'right' }} className="external alternate icon"></i>;
        return (
            <div key={key} className="item" style={itemStyle}>
                <div className="content">
                    <div className="header" style={linkStyle} onClick={() => this.onClickTitle(link, title)}><i className={iconClass} /> {title} {ex}</div>
                </div>
            </div>
        );
    }

    buildLeftPanelTitle = (title, icon) => {
        const key = 'p-' + title;
        const iconClass = icon ? `icon ${icon}` : null;
        const itemStyle = { paddingTop: '15px', paddingLeft: '2em' };
        const linkStyle = { padding: '5px', fontWeight: 'bold' };
        return (
            <div key={key} style={itemStyle}>
                <div className="content">
                    <div className="header" style={linkStyle}><i className={iconClass} /> {title}</div>
                </div>
            </div>
        );
    }

    buildLeftPanel = () => {
        const list = [];

        const userId = utils.getUserId();
        let myBlogsLink = utils.convertUrlPath(paths.USER_BLOGS, { id: userId });

        list.push(this.buildLeftPanelTitle('General'));
        list.push(this.buildLeftPanelItem('My Posts', 'book', myBlogsLink, true));
        list.push(this.buildLeftPanelItem('My Groups', 'users', paths.PROFILE_GROUPS));
        list.push(this.buildLeftPanelItem('Blocked Users', 'ban', paths.BLOCKED_USERS));
        list.push(this.buildLeftPanelItem('Subscriptions', 'newspaper outline', paths.SUBSCRIPTIONS));

        list.push(this.buildLeftPanelTitle('Settings'));
        list.push(this.buildLeftPanelItem('Edit Profile', 'user circle outline', paths.PROFILE));
        list.push(this.buildLeftPanelItem('Change Password', 'lock', paths.EDIT_PASSWORD));
        list.push(this.buildLeftPanelItem('Notification Settings', 'bell outline', paths.NOTIFICATIONS_SETTINGS));
        list.push(this.buildLeftPanelItem('Cancel Account', 'close', paths.CANCEL_ACCOUNT));

        return (
            <div className="ui big middle celled aligned animated list">
                {list}
            </div>
        );
    }

    buildCenterPanel = () => {
        const path = this.props.match.path;
        let ret;
        switch (path) {
            case paths.PROFILE: ret = (<EditProfile />); break;
            case paths.EDIT_PASSWORD: ret = (<EditPassword />); break;
            case paths.PROFILE_GROUPS: ret = (<ProfileGroups />); break;
            case paths.CANCEL_ACCOUNT: ret = (<CancelAccount />); break;
            case paths.BLOCKED_USERS: ret = (<BlockedUsers />); break;
            case paths.SUBSCRIPTIONS: ret = (<Subscriptions />); break;
            case paths.NOTIFICATIONS_SETTINGS: ret = (<NotificationSettings />); break;
            default: ret = null;
        }
        return (
            <div className="ui segment" style={{ minHeight: '450px' }}>
                {ret}
            </div>
        );
    }

    render() {
        const { user, info } = this.props;
        if (info.error) return <ErrorConnect />;
        if (!user) return renderLoader();

        const username = user.username;
        const leftPanel = this.buildLeftPanel();
        const centerPanel = this.buildCenterPanel();
        return (
            <div style={{ marginBottom: '4em', marginTop: '4em' }}>
                <div className="ui header">
                    <div className="ui center aligned header">
                        <h1>{username}`s Profile:</h1>
                    </div>
                </div>
                <div className="ui divider" />
                <div className="ui container">
                    <div className="ui grid" style={{ minWidth: '1280px' }}>
                        <div className="four wide column">
                            <div className="ui segment" style={{ minHeight: '450px', maxHeight: '600px', overflow: 'auto' }}>
                                {leftPanel}
                            </div>
                        </div>
                        <div className="eight wide column" style={{ minWidth: '60%' }}>
                            {centerPanel}
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

function mapStateToProps(state) {
    const { user, userGroups, alert } = state;
    const { forceRefresh } = alert;
    return { user: user.user, info: user, groups: userGroups, forceRefresh };
}

const connected = connect(mapStateToProps)(Profile);
export { connected as Profile };
