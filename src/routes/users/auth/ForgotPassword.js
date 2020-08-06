import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from '../../../actions';
import ForgotPasswordForm from '../../../forms/users/ForgotPasswordForm';
import paths from '../../../constants/path.constants';
import history from '../../../helpers/history';
import setTitle from '../../../environments/document';

import '../../../css/login.css';

class ForgotPassword extends React.Component {
    componentDidMount() {
        setTitle("Reset Password");
    }

    submit = values => {
        // Get dispatch function from props
        let { dispatch } = this.props;

        // Get email from form
        let { email } = values;

        // Send reset request
        if (email) {
            dispatch(userActions.forgotPassword(email));
        }
    }

    render() {
        // Get the data from props
        const { loggedIn, forgotPassword } = this.props;

        // If user already logged in then redirect to homepage
        if (loggedIn) {
            history.push(paths.HOMEPAGE);
            return null;
        }

        let title = 'Reset Password';
        let description = 'Enter the email you registered with and we will send you an email with instructions to reset your password.';
        let message = null;
        let disable = false;

        // Check if email sent
        if (forgotPassword && (forgotPassword.loading || forgotPassword.ok)) {
            disable = true;
            if (forgotPassword.ok) {
                message = (
                    <div className="ui positive visible message">
                        <p>Email sent. Please check your mailbox.</p>
                        <Link to={paths.LOGIN}>Login here</Link>
                    </div>
                );
            }
        }

        // Check if there's an error
        const errorMsg = forgotPassword && forgotPassword.error ? <div className="ui message error">{forgotPassword.error}</div> : null;
        return (
            <div className="login-page">
                <div className="ui middle aligned center aligned grid">
                    <div className="column">
                        <h2 className="ui image header">
                            <div className="content">
                                {title}
                            </div>
                        </h2>
                        <br />
                        {description}
                        <br />
                        <br />
                        <ForgotPasswordForm onSubmit={this.submit} disable={disable} />
                        {message}
                        {errorMsg}
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

const connected = connect(mapStateToProps)(ForgotPassword);
export { connected as ForgotPassword };
