import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { renderEmail } from '../render';
import * as v from '../validator';

const formName = 'forgot_password';

const ForgotPasswordForm = props => {
    const { handleSubmit, submitting, disable } = props;

    return (
        <form onSubmit={handleSubmit} className="ui large form">
            <div className="ui stacked secondary  segment">
                <Field name="email" component={renderEmail} type="email" label="Email" />

                <button type="submit" disabled={submitting || disable} className="ui fluid large blue submit button">
                    Submit
                </button>
            </div>
        </form>
    );
}

const validate = values => {
    const errors = {};

    v.validateEmail(errors, values);

    return errors;
};

export default reduxForm({
    // a unique name for the form
    form: formName,
    validate
})(ForgotPasswordForm);