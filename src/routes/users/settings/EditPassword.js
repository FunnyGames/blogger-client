import React from 'react';
import { connect } from 'react-redux';
import { userActions } from '../../../actions';
import renderLoader from '../../../components/interactive/Loader';
import setTitle from '../../../environments/document';
import EditPasswordForm from '../../../forms/users/EditPasswordForm';
import ErrorConnect from '../../../components/pages/ErrorConnect';

import '../../../css/profile.css';

class EditPassword extends React.Component {
    componentDidMount() {
        setTitle("Change Password");
    }

    onSubmit = (values) => {
        // Get dispatch function from props
        let { dispatch } = this.props;

        // Get values from form
        let { password, oldPassword } = values;

        // Try to update
        if (password && oldPassword) {
            let data = {
                newPassword: password,
                oldPassword
            }
            dispatch(userActions.updatePassword(data));
        }
    }

    render() {
        const { user, info } = this.props;
        if (info.error) return <ErrorConnect />;
        if (!user) return renderLoader();

        return (
            <div className="">
                <div className="ui center aligned header">
                    <h1>Change Password:</h1>
                </div>
                <div className="ui middle aligned center aligned grid">
                    <div className="column">
                        <EditPasswordForm onSubmit={this.onSubmit} />
                    </div>
                </div>
            </div >
        );
    }
}

function mapStateToProps(state) {
    const { user } = state;
    return { user: user.user, info: user };
}

const connected = connect(mapStateToProps)(EditPassword);
export { connected as EditPassword };
