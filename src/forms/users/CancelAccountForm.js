import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { renderUsername, renderPasswordNoWarn } from '../render';
import * as v from '../validator';

const formName = 'cancel_account';
let _username = null;

const CancelAccountForm = props => {
    const { handleSubmit, submitting, username } = props;
    _username = username;

    return (
        <form onSubmit={handleSubmit} className="ui form" style={{ width: '550px' }}>
            <div className="ui">
                <b>Username:</b> <Field name="username" component={renderUsername} type="text" label="Username" />
                <b>Password:</b> <Field name="password" component={renderPasswordNoWarn} type="password" label="Password" />

                <button type="submit" disabled={submitting} className="ui fluid large red submit button">
                    Delete Account
                </button>
            </div>
        </form>
    );
}

const validate = values => {
    const errors = {};

    v.validateUsername(errors, values, _username);
    v.validatePassword(errors, values);

    return errors;
};

export default reduxForm({
    // a unique name for the form
    form: formName,
    validate
})(CancelAccountForm);