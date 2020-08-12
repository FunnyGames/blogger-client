import React from 'react';
import { connect } from 'react-redux';
import { userActions } from '../../../actions';
import ResetPasswordForm from '../../../forms/users/ResetPasswordForm';
import paths from '../../../constants/path.constants';
import history from '../../../helpers/history';
import setTitle from '../../../environments/document';

import '../../../css/login.css';

const REDIRECT_TIMEOUT = 5000;

const verifyToken = (token) => {
    const buff = Buffer.from(token, 'base64');
    const text = buff.toString('ascii');
    const splited = text.split(';');
    const email = splited[1];
    const expire = splited[2];

    let error = null;
    let valid = true;
    if (!email || !expire || !splited[0]) {
        error = 'Invalid token. Please reset your password again.';
        valid = false;
    }

    const now = new Date().getTime();
    if (now > expire) {
        error = 'Token is expired. Please reset your password again.';
        valid = false;
    }

    return { error, valid, email };
}

class ResetPassword extends React.Component {
    componentDidMount() {
        setTitle("Reset Password");
    }

    submit = values => {
        // Get dispatch function from props
        let { dispatch } = this.props;

        // Get username and password from form
        let { newPassword } = values;

        // Try to login
        if (newPassword) {
            let token = this.getToken();
            dispatch(userActions.resetPassword(token, newPassword));
        }
    }

    getToken = () => {
        return this.props.match.params.token;
    }

    render() {
        // Get the data from props
        const { loggedIn, forgotPassword } = this.props;

        // If user already logged in then redirect to homepage
        if (loggedIn) {
            history.push(paths.HOMEPAGE);
            return null;
        }

        // Verfiy token
        const token = this.getToken();
        const { error, valid, email } = verifyToken(token);

        // Check if there's an error
        let errorMsg = null;
        let successMsg = null;
        let disable = false;
        if (!valid || error) {
            disable = true;
            errorMsg = error || 'Error occurred, try to refresh the page.';
            setTimeout(() => history.push(paths.FORGOT_PASSWORD), REDIRECT_TIMEOUT);
        } else if (forgotPassword && forgotPassword.error) {
            disable = true;
            errorMsg = forgotPassword.error;
        } else if (forgotPassword && forgotPassword.ok) {
            successMsg = 'Updated your password successfully! You can log in now with your new password.';
            disable = true;
            setTimeout(() => history.push(paths.LOGIN), REDIRECT_TIMEOUT);
        }

        return (
            <div className="login-page">
                <div className="ui middle aligned center aligned grid">
                    <div className="column">
                        <h2 className="ui image header">
                            <div className="content">
                                Reset password
                            </div>
                        </h2>
                        <br />
                        Enter new password to reset your password for account: <strong>{email}</strong>
                        <br />
                        <br />
                        <ResetPasswordForm onSubmit={this.submit} disable={disable} />
                        {errorMsg ? <div className="ui message error">{errorMsg}</div> : null}
                        {successMsg ? <div className="ui message success">{successMsg}</div> : null}
                    </div>
                </div>
            </div>
        );
    }
}

// Set props to state fields
function mapStateToProps(state) {
    const loggedIn = state.user.loggedIn;
    const { forgotPassword } = state;
    return { loggedIn, forgotPassword };
}

const connected = connect(mapStateToProps)(ResetPassword);
export { connected as ResetPassword };
