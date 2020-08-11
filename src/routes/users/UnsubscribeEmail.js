import React from 'react';
import { connect } from 'react-redux';
import { userActions } from '../../actions';
import paths from '../../constants/path.constants';
import history from '../../helpers/history';
import setTitle from '../../environments/document';

import '../../css/profile.css';

const REDIRECT_TIMEOUT = 5000;

class UnsubscribeEmail extends React.Component {
    componentDidMount() {
        setTitle("Unsubscribe Email");
        this.sendUnsubEmail();
    }

    sendUnsubEmail = () => {
        const { dispatch } = this.props;
        let { email, token, t } = this.getToken();
        if (email && token && t) {
            dispatch(userActions.unsubscribeEmail(email, token, t));
        }
    }

    getToken = () => {
        const { search } = this.props.location;
        if (!search) return {};
        const decoded = decodeURIComponent(search);
        const sp1 = decoded.split('?');
        if (!sp1 || sp1.length !== 2) return {};
        const sp2 = sp1[1].split('&');
        if (!sp2 || sp2.length !== 3) return {};
        let obj = {};
        for (let i in sp2) {
            let k = sp2[i];
            let s = k.split('=');
            obj[s[0]] = s[1];
        }
        return obj;
    }

    render() {
        const { unsubscribeEmail } = this.props;

        let msg = unsubscribeEmail.loading && 'Loading...';
        let errorMsg = unsubscribeEmail.error;
        let successMsg = unsubscribeEmail.ok && 'Email has been removed successfully from list!';

        if (unsubscribeEmail.ok || unsubscribeEmail.error) {
            setTimeout(() => history.push(paths.HOMEPAGE), REDIRECT_TIMEOUT);
        }

        let { email, token, t } = this.getToken();
        if (!email || !token || !t) {
            history.push(paths.HOMEPAGE);
        }

        return (
            <div className="login-page">
                <div className="ui middle aligned center aligned grid">
                    <div className="column">
                        <div className="ui center aligned header">
                            <h1>Unsubscribe {email} from email updates</h1>
                        </div>
                        <br />
                        {msg ? <div className="ui message">{msg}</div> : null}
                        {errorMsg ? <div className="ui message error">{errorMsg}</div> : null}
                        {successMsg ? <div className="ui message success">{successMsg}</div> : null}
                    </div>
                </div>
            </div >
        );
    }
}

function mapStateToProps(state) {
    const { unsubscribeEmail } = state;
    return { unsubscribeEmail };
}

const connected = connect(mapStateToProps)(UnsubscribeEmail);
export { connected as UnsubscribeEmail };
