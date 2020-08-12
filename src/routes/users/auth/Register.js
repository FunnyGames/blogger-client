import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import paths from '../../../constants/path.constants';
import RegisterForm from '../../../forms/users/RegisterForm';
import { userActions } from '../../../actions';
import history from '../../../helpers/history';
import setTitle from '../../../environments/document';

import '../../../css/login.css';


class Register extends React.Component {
    componentDidMount() {
        setTitle("Register");
    }

    submit = values => {
        // Get dispatch function from props
        let { dispatch } = this.props;

        // Try to register
        if (values) {
            values.firstName = values.firstName.trim();
            values.lastName = values.lastName.trim();
            values.email = values.email.trim();
            dispatch(userActions.register(values));
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
                                Register
                            </div>
                        </h2>
                        <RegisterForm onSubmit={this.submit} />
                        {errorMsg}
                        <div className="ui message">
                            Already a member? <Link key={paths.LOGIN} to={paths.LOGIN}>Log in</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const loggedIn = state.user.loggedIn;
    const { user } = state;
    return { user, loggedIn };
}

const connected = connect(mapStateToProps)(Register);
export { connected as Register };
