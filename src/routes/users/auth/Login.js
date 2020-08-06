import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from '../../../actions';
import LoginForm from '../../../forms/users/LoginForm';
import paths from '../../../constants/path.constants';
import history from '../../../helpers/history';
import setTitle from '../../../environments/document';
import * as utils from '../../../helpers/utils';

import '../../../css/login.css';

class Login extends React.Component {
    componentDidMount() {
        setTitle("Log in");
    }

    submit = values => {
        // Get dispatch function from props
        let { dispatch } = this.props;

        // Get username and password from form
        let { username, password } = values;

        // Try to login
        if (username && password) {
            let params = utils.getUrlParams();
            let redirect = params.get('from');
            dispatch(userActions.login(username, password, redirect));
        }
    }

    render() {
        // Get the user from props
        const { user, loggedIn } = this.props;

        // If user already logged in then redirect to homepage
        if (loggedIn) {
            history.push(paths.HOMEPAGE);
            return null;
        }

        // Check if there's an error
        const errorMsg = user && user.error ? <div className="ui message error">{user.error}</div> : null;
        return (
            <div className="login-page">
                <div className="ui middle aligned center aligned grid">
                    <div className="column">
                        <h2 className="ui image header">
                            <div className="content">
                                Log-in to your account
                            </div>
                        </h2>
                        <LoginForm onSubmit={this.submit} />
                        {errorMsg}
                        <div className="ui message">
                            New to us? <Link key={paths.REGISTER} to={paths.REGISTER}>Register</Link> | <Link key={paths.FORGOT_PASSWORD} to={paths.FORGOT_PASSWORD}>Forgot password? </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// Set props to state fields
function mapStateToProps(state) {
    const loggedIn = state.user.loggedIn;
    const { user } = state;
    return { user, loggedIn };
}

const connected = connect(mapStateToProps)(Login);
export { connected as Login };
