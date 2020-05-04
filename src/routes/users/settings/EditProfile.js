import React from 'react';
import { connect } from 'react-redux';
import { userActions } from '../../../actions';
import setTitle from '../../../environments/document';
import ProfileForm from '../../../forms/users/ProfileForm';
import ErrorConnect from '../../../components/pages/ErrorConnect';
import renderLoader from '../../../components/interactive/Loader';

import '../../../css/profile.css';

class EditProfile extends React.Component {
    state = {
        editProfile: false
    };

    componentDidMount() {
        setTitle("Edit Profile");
    }

    onEditProfile = () => {
        let editProfile = !this.state.editProfile;
        this.setState({ editProfile });
    }

    onSubmit = (values) => {
        // Get dispatch function from props
        let { dispatch } = this.props;

        // Get values from form
        let { firstName, lastName, email } = values;

        // Try to update
        if (firstName && lastName && email) {
            let user = {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim()
            }
            dispatch(userActions.updateProfile(user));
        }
    }

    render() {
        const { user, info } = this.props;
        if (info.error) return <ErrorConnect />;
        if (!user) return renderLoader();

        const firstName = user.firstName;
        const lastName = user.lastName;
        const email = user.email;

        return (
            <div className="ui container">
                <ProfileForm email={email} firstName={firstName} lastName={lastName} onSubmit={this.onSubmit} initialValues={{ firstName, lastName, email }} />
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { user } = state;
    return { user: user.user, info: user };
}

const connected = connect(mapStateToProps)(EditProfile);
export { connected as EditProfile };
