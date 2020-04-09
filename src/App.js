import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Modal from 'react-modal';

import history from './helpers/history';
import { alertActions, userActions } from './actions';
import paths from './constants/path.constants';
import { cancelPendingRequests } from './helpers/axios';

import Navbar from './components/pages/Navbar';
import Footer from './components/pages/Footer';
import Toast from './components/interactive/Toast';
import ForceLogout from './components/interactive/ForceLogout';

import { PrivateRoute } from './routes/PrivateRoute';
import { NotFound } from './components/pages/NotFound';
import { About } from './routes/static/About';
import { Privacy } from './routes/static/Privacy';
import { Support } from './routes/static/Support';

import { HomePage } from './routes/HomePage';
import { AddBlog } from './routes/blogs/AddBlog';
import { ViewBlog } from './routes/blogs/ViewBlog';
import { EditBlog } from './routes/blogs/EditBlog';
import { UserBlogs } from './routes/blogs/UserBlogList';

import { GroupsList } from './routes/groups/GroupsList';
import { AddGroup } from './routes/groups/AddGroup';

import { Login } from './routes/users/Login';
import { Register } from './routes/users/Register';
import { Profile } from './routes/users/Profile';
import { EditPassword } from './routes/users/EditPassword';
import { UsersList } from './routes/users/UsersList';
import { UserProfile } from './routes/users/UserProfile';
import { ViewGroup } from './routes/groups/ViewGroup';

Modal.setAppElement('#root');

class App extends React.Component {
    constructor(props) {
        super(props);

        const { dispatch } = this.props;
        history.listen(() => {
            // cancel requests when changing pages
            cancelPendingRequests();

            // clear alert on location change
            dispatch(alertActions.clear());

            this.loadProfile();
        });
    }

    componentDidMount() {
        this.loadProfile();
    }

    loadProfile = () => {
        // Load user info/profile if data is missing
        const { user, dispatch } = this.props;
        if (user && user.loggedIn) {
            if (!user.user || !user.user.username) {
                if (user.loading) return;
                dispatch(userActions.getProfile());
            }
        }
    }

    createPublicRoutes() {
        const list = [];
        list.push(<Route key="HomePage" exact path={paths.HOMEPAGE} component={HomePage} />);
        list.push(<Route key="UserBlogs" exact path={paths.USER_BLOGS} component={UserBlogs} />);
        list.push(<Route key="Blogs" exact path={paths.BLOGS} ><Redirect to={paths.HOMEPAGE} /></Route>);
        list.push(<Route key="ViewBlog" path={paths.BLOG} component={ViewBlog} />);
        list.push(<Route key="Login" path={paths.LOGIN + "*"} component={Login} />);
        list.push(<Route key="Register" path={paths.REGISTER} component={Register} />);
        list.push(<Route key="About" path={paths.ABOUT} component={About} />);
        list.push(<Route key="Privacy" path={paths.PRIVACY} component={Privacy} />);
        list.push(<Route key="Support" path={paths.SUPPORT} component={Support} />);
        return list;
    }

    createPrivateRoutes() {
        const list = [];
        list.push(<PrivateRoute key="EditPassword" path={paths.EDIT_PASSWORD} component={EditPassword} />);
        list.push(<PrivateRoute key="Profile" path={paths.PROFILE} component={Profile} />);
        list.push(<PrivateRoute key="User" exact path={paths.USER} component={UserProfile} />);
        list.push(<PrivateRoute key="UsersList" exact path={paths.USERS} component={UsersList} />);

        list.push(<PrivateRoute key="AddBlog" exact path={paths.ADD_BLOG} component={AddBlog} />);
        list.push(<PrivateRoute key="EditBlog" exact path={paths.BLOG_EDIT} component={EditBlog} />);

        list.push(<PrivateRoute key="AddGroup" exact path={paths.ADD_GROUP} component={AddGroup} />);
        list.push(<PrivateRoute key="ViewGroup" path={paths.GROUP} component={ViewGroup} />);
        list.push(<PrivateRoute key="Groups" path={paths.GROUPS} component={GroupsList} />);
        return list;
    }

    render() {
        // Create list of routes for public and private routes
        const publicRoutes = this.createPublicRoutes();
        const privateRoutes = this.createPrivateRoutes();

        // Return the render
        return (
            <Router history={history}>
                <Navbar history={history} />
                <Switch>
                    {privateRoutes}
                    {publicRoutes}

                    <Route component={NotFound} />
                </Switch>
                <Footer />
                <Toast />
                <ForceLogout />
            </Router>
        );
    }
}

// Set props with state fields
function mapStateToProps(state) {
    const { user } = state;
    return { user };
}

const connectedApp = connect(mapStateToProps)(App);
export { connectedApp as App };