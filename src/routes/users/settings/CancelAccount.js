import React from 'react';
import { connect } from 'react-redux';
import setTitle from '../../../environments/document';
import { userActions } from '../../../actions';
import ErrorConnect from '../../../components/pages/ErrorConnect';
import renderLoader from '../../../components/interactive/Loader';
import CancelAccountForm from '../../../forms/users/CancelAccountForm';

import '../../../css/profile.css';

class CancelAccount extends React.Component {
    componentDidMount() {
        setTitle('Cancel Account');
    }

    cancelAccountSubmit = (values) => {
        // Get dispatch function from props
        let { dispatch } = this.props;

        // Get username and password from form
        let { username, password } = values;

        // Sent cancel request
        if (username && password) {
            dispatch(userActions.cancelAccount(username, password));
        }
    }

    render() {
        const { user, info } = this.props;
        if (info.error) return <ErrorConnect />;
        if (!user) return renderLoader();

        const username = user.username;
        return (
            <div>
                <h2>Are you sure you want to delete your account?</h2>
                <div style={{ color: 'red', fontWeight: 'bold' }}>You cannot restore your account after deletion!</div>
                <div>If you're sure, please enter your username and password and click `Delete Account`.</div>
                <div>Otherwise, exit this window.</div>
                <p></p>
                <CancelAccountForm onSubmit={this.cancelAccountSubmit} username={username} />
            </div >
        );
    }
}

function mapStateToProps(state) {
    const { user } = state;
    return { user: user.user, info: user };
}

const connected = connect(mapStateToProps)(CancelAccount);
export { connected as CancelAccount };
