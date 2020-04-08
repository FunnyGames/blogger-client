import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { renderUsername, renderPassword, renderEmail, renderContactInput } from '../render';
import * as v from '../validator';
import * as w from '../warn';
import { userActions } from '../../actions';

class RegisterForm extends React.Component {
    onUsernameBlur = (event) => {
        // Get dispatch function from props
        const { dispatch } = this.props;

        // Get username from input
        let username = event.target.value;
        let errors = {};
        v.validateUsername(errors, { username });
        if (errors.username) {
            return;
        }

        // Validate username
        if (username) {
            dispatch(userActions.checkAvailability(username, undefined));
        }
    }

    onEmailBlur = (event) => {
        // Get dispatch function from props
        const { dispatch } = this.props;

        // Get email from input
        let email = event.target.value;
        let errors = {};
        v.validateUsername(errors, { email });
        if (errors.email) {
            return;
        }

        // Validate email
        if (email) {
            dispatch(userActions.checkAvailability(undefined, email));
        }
    }

    render() {
        const { handleSubmit, submitting, userAvailable } = this.props;
        const userError = (userAvailable && userAvailable.error && userAvailable.error.username ? 'Username already taken' : null);
        const emailError = (userAvailable && userAvailable.error && userAvailable.error.email ? 'Email already taken' : null);
        return (
            <form onSubmit={handleSubmit} className="ui large form">
                <div className="ui stacked secondary segment">
                    <Field name="username" availableErr={userError} component={renderUsername} type="text" label="Username" onBlur={this.onUsernameBlur} />
                    <Field name="password" component={renderPassword} type="password" label="Password" />
                    <Field name="email" availableErr={emailError} component={renderEmail} type="email" label="Email" onBlur={this.onEmailBlur} />
                    <Field name="firstName" component={renderContactInput} type="text" label="FirstName" />
                    <Field name="lastName" component={renderContactInput} type="text" label="LastName" />

                    <button type="submit" disabled={submitting || userError || emailError} className="ui fluid large blue submit button">
                        Submit
                    </button>
                </div>
            </form>
        );
    }
}

const validate = values => {
    const errors = {};

    v.validateEmail(errors, values);
    v.validateFirstName(errors, values);
    v.validateLastName(errors, values);
    v.validateUsername(errors, values);
    v.validatePassword(errors, values);

    return errors;
};

const warn = values => {
    const warnings = {}

    w.warnPassword(warnings, values);

    return warnings;
}

// Set props to state fields
function mapStateToProps(state) {
    const { userAvailable } = state;
    return { userAvailable };
}

let RegForm = connect(
    mapStateToProps
)(RegisterForm);

export default reduxForm({
    // a unique name for the form
    form: 'register',
    validate,
    warn
})(RegForm);