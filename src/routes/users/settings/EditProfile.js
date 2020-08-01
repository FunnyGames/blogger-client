import React from 'react';
import { connect } from 'react-redux';
import { userActions } from '../../../actions';
import setTitle from '../../../environments/document';
import ProfileForm from '../../../forms/users/ProfileForm';
import ErrorConnect from '../../../components/pages/ErrorConnect';
import renderLoader from '../../../components/interactive/Loader';
import Avatar from './Avatar';

import '../../../css/profile.css';

class EditProfile extends React.Component {
    state = {
        percentage: null,
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

    precentageCallback = (percentage) => {
        this.setState({ percentage });
    }

    onSaveImage = (image) => {
        // Get dispatch function from props
        let { dispatch } = this.props;

        if (image) {
            dispatch(userActions.uploadAvatar(image, this.precentageCallback));
        }
    }

    onDeleteImage = (image) => {
        // Get dispatch function from props
        let { dispatch } = this.props;

        if (image) {
            dispatch(userActions.deleteAvatar());
        }
    }

    render() {
        const { user, info } = this.props;
        if (info.error) return <ErrorConnect />;
        if (!user) return renderLoader();

        const { firstName, lastName, email, avatar } = user;

        return (
            <div className="ui container">
                <strong>Avatar:</strong>
                <Avatar onSaveImage={this.onSaveImage} onDeleteImage={this.onDeleteImage} src={avatar} percentage={this.state.percentage} avatarUpdated={info.avatarUpdated} />
                <br />
                <strong>Profile:</strong>
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
