import React from 'react';
import { connect } from 'react-redux';
import { userActions } from '../../../actions';
import paths from '../../../constants/path.constants';
import history from '../../../helpers/history';
import setTitle from '../../../environments/document';

import '../../../css/login.css';

const REDIRECT_TIMEOUT = 5000;

class ConfirmEmail extends React.Component {
    componentDidMount() {
        setTitle("Confirm email");
        this.sendConfirm();
    }

    sendConfirm = () => {
        const { dispatch } = this.props;
        let token = this.getToken();
        dispatch(userActions.confirmEmail(token));
    }

    getToken = () => {
        return this.props.match.params.token;
    }

    render() {
        // Get the data from props
        const { emailConfirm } = this.props;

        let msg = emailConfirm.loading && 'Loading...';
        let errorMsg = emailConfirm.error;
        let successMsg = emailConfirm.jwt && 'Email verfied successfully!';

        if (emailConfirm.jwt || emailConfirm.error) {
            setTimeout(() => history.push(paths.PROFILE), REDIRECT_TIMEOUT);
        }

        return (
            <div className="login-page">
                <div className="ui middle aligned center aligned grid">
                    <div className="column">
                        <h2 className="ui image header">
                            <div className="content">
                                Email Confirm
                            </div>
                        </h2>
                        <br />
                        {msg ? <div className="ui message">{msg}</div> : null}
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
    const { emailConfirm } = state;
    return { emailConfirm };
}

const connected = connect(mapStateToProps)(ConfirmEmail);
export { connected as ConfirmEmail };
