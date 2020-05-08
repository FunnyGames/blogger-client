import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import paths from '../../constants/path.constants';
import { userActions } from '../../actions';
import NotificationButton from './NotificationButton';
import MessageButton from './MessageButton';

import '../../css/navbar.css';

// Component for showing the navbar
class Navbar extends React.Component {
    hasActive = false;

    pathIsActive = (path, p) => {
        if (this.hasActive) return false;
        let splitted = path.split('/');
        for (let i = splitted.length; i > 0; --i) {
            let s = splitted[i];
            if (s && s.includes(p.substring(1, p.length))) {
                this.hasActive = true;
                return true;
            }
        }
        return false;
    }

    getLinkClass() {
        let path = this.props.path;
        let cls = "header-link";
        let active = false;
        for (let i = 0; i < arguments.length; ++i) {
            let p = arguments[i];
            if (p.exact) {
                if (path === p.page) {
                    active = true;
                    this.hasActive = true;
                    break
                }
            } else if (this.pathIsActive(path, p)) {
                active = true;
                break;
            }
        }
        if (active) cls += " active";
        return cls;
    }

    createLink(name, path) {
        return <Link key={path} className={this.getLinkClass(path)} to={path}>{name}</Link>;
    }

    handleLogout = (e) => {
        e.preventDefault();
        let { dispatch } = this.props;
        dispatch(userActions.logout());
    }

    render() {
        this.hasActive = false;
        const { loggedIn, user, version } = this.props;
        let listOfLinks = [];
        listOfLinks.push(<Link key={paths.BLOGS} className={this.getLinkClass({ page: paths.HOMEPAGE, exact: true }, paths.BLOGS)} to={paths.HOMEPAGE}>Blogs</Link>);
        listOfLinks.push(this.createLink("Groups", paths.GROUPS));
        listOfLinks.push(this.createLink("Users", paths.USERS));
        if (loggedIn) {
            listOfLinks.push(this.createLink("Profile", paths.PROFILE));
            listOfLinks.push(<Link to="/" className="header-link" key="Logout" onClick={this.handleLogout}>Log out</Link>);
            if (user && user.error) {
                listOfLinks.push(<div className="hello-nav" key="Welcome"><i className="exclamation triangle icon"></i></div>);
            } else {
                let name = user && user.user ? user.user.firstName : null;
                let text = name ? "Hello " + name + "!" : "...";
                listOfLinks.push(<div className="hello-nav" key="Welcome" style={{ minWidth: '200px' }}>{!name ? <div className="ui active loader"></div> : null} {text}</div >);
                listOfLinks.push(<NotificationButton key="notification-button" />);
                listOfLinks.push(<MessageButton key="message-button" />);
            }
        } else {
            listOfLinks.push(this.createLink("Log in", paths.LOGIN));
            listOfLinks.push(this.createLink("Register", paths.REGISTER));
        }

        return (
            <div className="sticky">
                <div className="navbar topnav">
                    <Link className="header-main" to={paths.HOMEPAGE}>Blogger <span style={{ fontSize: 'x-small' }}>v{version}</span></Link>
                    {listOfLinks}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const loggedIn = state.user.loggedIn;
    const user = state.user;
    const path = ownProps.history ? ownProps.history.location.pathname : paths.HOMEPAGE;
    return { loggedIn, path, user };
};

export default connect(
    mapStateToProps,
    null
)(Navbar);