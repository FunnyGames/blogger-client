import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { renderUsername, renderPasswordNoWarn } from '../render';
import * as v from '../validator';

const formName = 'login';

const LoginForm = props => {
    const { handleSubmit, submitting } = props;

    return (
        <form onSubmit={handleSubmit} className="ui large form">
            <div className="ui stacked secondary  segment">
                <Field name="username" component={renderUsername} type="text" label="Username" />
                <Field name="password" component={renderPasswordNoWarn} type="password" label="Password" />

                <button type="submit" disabled={submitting} className="ui fluid large blue submit button">
                    Submit
            </button>
            </div>
        </form>
    );
}

const validate = values => {
    const errors = {};

    v.validateUsername(errors, values);
    v.validatePassword(errors, values);

    return errors;
};

export default reduxForm({
    // a unique name for the form
    form: formName,
    validate
})(LoginForm);