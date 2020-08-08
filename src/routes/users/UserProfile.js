import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { userActions, friendActions } from '../../actions';
import paths from '../../constants/path.constants';
import setTitle from '../../environments/document';
import ErrorConnect from '../../components/pages/ErrorConnect';
import renderLoader from '../../components/interactive/Loader';
import { NotFound } from '../../components/pages/NotFound';
import * as utils from '../../helpers/utils';
import history from '../../helpers/history';
import { UserBlogs } from '../blogs/UserBlogList';
import { UserGroups } from './profile/Groups';
import { UserFriends } from './profile/Friends';

import defaultProfileImage from '../../images/static/default-profile.png';

import '../../css/profile.css';


class UserProfile extends React.Component {

    componentDidMount() {
        // Do it only once when the page is loaded
        let action = this.getAction();
        if (action) {
            this.performAction(action);
        }
        if (!history.location.state || !history.location.state.fromProfile) {
            if (this.props.profile && this.props.profile.username)
                setTitle(`${this.props.profile.username}\`s Profile`)
            else
                setTitle("Loading Profile");
        }

        // Fetch user profile
        if (this.props.profile && this.props.profile._id) {
            this.reloadDataIfChanged();
        } else {
            this.reloadData();
        }
    }

    componentDidUpdate() {
        this.reloadDataIfChanged();
    }

    reloadDataIfChanged = () => {
        const { profile } = this.props;
        if (profile && profile._id) {
            const urlId = this.getUserId();
            if (profile._id !== urlId) {
                this.reloadData();
            }
        }
    }

    reloadData = () => {
        const userId = this.getUserId();
        const myId = utils.getUserId();

        // Don't fetch if user is loading their profile
        if (userId === myId) {
            history.push(paths.PROFILE);
            return;
        }

        this.fetchUser();
    }

    getAction = () => {
        let { search } = this.props.location;
        if (search) {
            let splitted = search.split('?');
            for (let i = 0; i < splitted.length; ++i) {
                let s = splitted[i];
                if (s.includes('action')) {
                    let fieldName = s.split('=');
                    if (fieldName[0] === 'action') {
                        return fieldName[1];
                    }
                }
            }
        }
        return null;
    }

    performAction = (action) => {
        // Get dispatch function from props
        const { dispatch } = this.props;

        action = action.replace(/-/g, '=');
        let data = Buffer.from(action, 'base64').toString();
        let splitted = data.split(';');
        let friendId = splitted[0];
        let perform = splitted[1];
        if (perform === 'accept') {
            dispatch(friendActions.friendAccept(friendId));
        } else if (perform === 'decline') {
            dispatch(friendActions.unfriend(friendId));
        }
    }

    getUserId = () => {
        return this.props.match.params.id;
    }

    fetchUser() {
        // Get dispatch function from props
        const { dispatch } = this.props;

        // Fetch user profile
        const userId = this.getUserId();

        dispatch(userActions.getUserProfile(userId));
    }

    onSubscribeClick = () => {
        const { dispatch, profile } = this.props;
        if (profile.subLoading) return;

        const userId = this.getUserId();

        if (profile.subscribed) {
            dispatch(userActions.unsubscribe(userId));
        } else {
            dispatch(userActions.subscribe(userId));
        }
    }

    onFriendClick = () => {
        const { dispatch, profile } = this.props;
        if (profile.subLoading) return;
        const { friend } = profile;

        const userId = this.getUserId();

        if (friend) {
            dispatch(friendActions.unfriend(friend._id));
        } else {
            dispatch(friendActions.friendRequest(userId));
        }
    }

    onFriendRespondClick = () => {
        const { dispatch, profile } = this.props;
        if (profile.subLoading) return;
        const { friend } = profile;
        if (!friend) return;

        dispatch(friendActions.friendAccept(friend._id));
    }

    onMenuClick = (link, title) => {
        if (title) {
            setTitle(title);
        }
        history.push(link, { fromProfile: true });
    }

    buildFriendButtons = (friend, loading) => {
        let friendText = 'Add Friend';
        let friendClass = 'ui tiny';
        let acceptClass = 'ui tiny blue';
        let iconClass = '';
        let accept = false;
        if (friend) {
            if (friend.pending) {
                if (friend.userRequested === utils.getUserId()) {
                    friendText = 'Cancel Request';
                    iconClass = 'icon ban';
                } else {
                    friendText = 'Decline';
                    iconClass = 'icon user times';
                    accept = true;
                }
            } else {
                friendText = 'Remove';
                iconClass = 'icon user times';
            }
            friendClass += ' red';
        } else {
            friendClass += ' blue';
            iconClass = 'icon user plus';
        }

        if (loading) {
            acceptClass += ' loading';
            friendClass += ' loading';
        }
        acceptClass += ' button';
        friendClass += ' button';

        return (
            <Fragment>
                {accept && <button className={acceptClass} onClick={this.onFriendRespondClick} ><i className="icon user plus" />Accept</button>}
                <button className={friendClass} onClick={this.onFriendClick} ><i className={iconClass} />{friendText}</button>
            </Fragment>
        );
    }

    isActive = (link) => {
        return this.props.match.url === link;
    }

    getContent = () => {
        const path = this.props.match.path;
        let ret;
        switch (path) {
            case paths.USER: ret = (<UserBlogs />); break;
            case paths.USER_GROUPS: ret = (<UserGroups match={this.props.match} />); break;
            case paths.USER_FRIENDS: ret = (<UserFriends match={this.props.match} />); break;
            default: ret = null;
        }
        return ret;
    }

    addItem = (id, title, link) => {
        let active = this.isActive(link);
        const cls = `${active ? 'active' : ''} item`;
        return (
            <div key={'menu-' + id} className={cls} style={{ cursor: 'pointer' }} onClick={() => this.onMenuClick(link)}>
                {title}
            </div>
        );
    }

    buildCenterPanel = () => {
        const userId = this.getUserId();
        let userLink = utils.convertUrlPath(paths.USER, { id: userId });
        let userGroupsLink = utils.convertUrlPath(paths.USER_GROUPS, { id: userId });
        let userFriendsLink = utils.convertUrlPath(paths.USER_FRIENDS, { id: userId });
        const menu = [];
        menu.push(this.addItem('blogs', 'Blogs', userLink));
        menu.push(this.addItem('groups', 'Groups', userGroupsLink));
        menu.push(this.addItem('friends', 'Friends', userFriendsLink));
        const content = this.getContent();
        return (
            <Fragment>
                <div className="ui secondary pointing menu">
                    {menu}
                </div>
                <div className="ui segment">
                    {content}
                </div>
            </Fragment>
        );
    }

    render() {
        const { profile } = this.props;
        if (!profile || profile.loading) return renderLoader();
        if (profile.notFound) return <NotFound title="User not found" />;
        if (profile.error) return <ErrorConnect />;


        const centerPanel = this.buildCenterPanel();

        const { username, firstName, lastName, subscribed, subLoading, friend, friendLoading, avatar } = profile;

        const subText = subscribed ? 'SUBSCRIBED' : 'SUBSCRIBE';
        const subClass = `ui tiny ${subscribed ? '' : 'blue'} ${subLoading ? 'loading' : ''} button`;

        const friendDiv = this.buildFriendButtons(friend, friendLoading);

        const imageSrc = avatar || defaultProfileImage;

        return (
            <div style={{ marginBottom: '4em', marginTop: '4em' }}>
                <div className="ui container">
                    <div className="ui grid">
                        <div className="four wide column">
                            <div className="ui card">
                                <div className="image" style={{ marginTop: '0px' }}>
                                    <img src={imageSrc} alt="Profile" />
                                </div>
                                <div className="content">
                                    <div className="header">{username}</div>
                                    <div className="meta">
                                        <span className="date">{firstName + " " + lastName}</span>
                                    </div>
                                </div>
                                <div className="extra content">
                                    <b style={{ color: 'black' }}>Subscription:</b><br />
                                    <button className={subClass} onClick={this.onSubscribeClick} >{subText}</button>
                                    <br />
                                    <br />
                                    <b style={{ color: 'black' }}>Friend:</b><br />
                                    {friendDiv}
                                </div>
                            </div>
                        </div>
                        <div className="twelve wide column" style={{ maxWidth: '2000px' }}>
                            {centerPanel}
                        </div>
                    </div>
                    <p></p>
                </div>
            </div >
        );
    }
}

function mapStateToProps(state) {
    const { profile } = state;
    if (profile && profile.username) {
        setTitle(profile.username + "`s Profile");
    }
    return { profile };
}

const connected = connect(mapStateToProps)(UserProfile);
export { connected as UserProfile };
