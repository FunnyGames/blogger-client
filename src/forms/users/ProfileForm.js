import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { renderEmail, renderContactInput } from '../render';
import * as v from '../validator';
import { userActions } from '../../actions';

class ProfileForm extends React.Component {
    state = {
        edit: false
    };

    onEmailBlur = (event) => {
        // Get dispatch function from props
        const { dispatch } = this.props;

        // Get email from input
        let email = event.target.value;

        // Validate email
        if (email) {
            dispatch(userActions.checkAvailability(undefined, email));
        }
    }

    onEditChange = () => {
        // Toggle edit view
        let edit = !this.state.edit;
        this.setState({ edit });
    }

    render() {
        const { handleSubmit, submitting, initialValues, reset, userAvailable, profileStatus } = this.props;
        const { firstName, lastName, email } = initialValues;
        let { edit } = this.state;
        const emailError = (userAvailable && userAvailable.error && userAvailable.error.email ? 'Email already taken' : null);
        const editText = (edit ? "Cancel" : "Edit");
        const fontStyle = { fontSize: '1.2em' };
        if (profileStatus && profileStatus.loading && edit) this.setState({ edit: false });

        return (
            <div>
                <form onSubmit={handleSubmit} className="ui form">
                    <table className="ui very basic table">
                        <tbody>
                            <tr style={{ lineHeight: '3em' }}>
                                <td>
                                    <label style={fontStyle}>Email:</label>
                                </td>
                                <td>
                                    {edit ?
                                        <Field
                                            className="ui mini input"
                                            name="email"
                                            availableErr={emailError}
                                            component={renderEmail}
                                            onBlur={this.onEmailBlur}
                                            type="text"
                                            label={email}
                                            defaultValue={email} />
                                        : email}
                                </td>
                            </tr>

                            <tr style={{ lineHeight: '3em' }}>
                                <td>
                                    <label style={fontStyle}>First name:</label>
                                </td>
                                <td>
                                    {edit ? <Field className="ui mini input" name="firstName" component={renderContactInput} type="text" label={firstName} /> : firstName}
                                </td>
                            </tr>

                            <tr style={{ lineHeight: '3em' }}>
                                <td>
                                    <label style={fontStyle}>Last name: </label>
                                </td>
                                <td>
                                    {edit ? <Field name="lastName" component={renderContactInput} type="text" label={lastName} /> : lastName}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <p></p>
                    {edit ? <button type="submit" disabled={submitting || emailError} className="ui blue submit button">Save </button> : null}
                    <u className="ui blue button" onClick={() => { this.onEditChange(); reset(); }}>{editText}</u>
                </form>
            </div>
        );
    }
}

const validate = values => {
    const errors = {};

    v.validateEmail(errors, values);
    v.validateFirstName(errors, values);
    v.validateLastName(errors, values);

    return errors;
};

// Set props to state fields
function mapStateToProps(state) {
    const { userAvailable, update } = state;
    let profileStatus = update.updateProfile;
    return { userAvailable, profileStatus };
}

let ProForm = connect(
    mapStateToProps
)(ProfileForm);

export default reduxForm({
    // a unique name for the form
    form: 'profile',
    validate
})(ProForm);