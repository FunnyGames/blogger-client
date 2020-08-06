import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { renderPassword, renderPasswordNoWarn } from '../render';
import * as v from '../validator';
import * as w from '../warn';

const formName = 'reset_password';

const ResetPasswordForm = props => {
    const { handleSubmit, submitting, disable } = props;

    return (
        <form onSubmit={handleSubmit} className="ui large form">
            <div className="ui stacked secondary  segment">
                <b>New Password:</b> <Field name="newPassword" component={renderPassword} type="password" label="New Password" />
                <b>Re-enter Password:</b> <Field name="newPasswordReenter" component={renderPasswordNoWarn} type="password" label="Re-enter Password" />

                <button type="submit" disabled={submitting || disable} className="ui fluid large blue submit button">
                    Submit
                </button>
            </div>
        </form>
    );
}

const validate = values => {
    const errors = {};

    v.validatePassword(errors, values, 'newPassword');

    if (values.newPassword !== values.newPasswordReenter)
        errors.newPasswordReenter = 'Passwords do not match';

    return errors;
};

const warn = values => {
    const warnings = {}

    w.warnPassword(warnings, values, 'newPassword');

    return warnings;
}

export default reduxForm({
    // a unique name for the form
    form: formName,
    validate,
    warn
})(ResetPasswordForm);