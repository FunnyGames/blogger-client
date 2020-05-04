import React from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';
import { renderPassword, renderPasswordNoWarn } from '../render';
import paths from '../../constants/path.constants';
import * as v from '../validator';
import * as w from '../warn';

const formName = 'password';

class EditPasswordForm extends React.Component {
    render() {
        const { handleSubmit, submitting } = this.props;

        return (
            <div>
                <form onSubmit={handleSubmit} className="ui large form">
                    <div className="content">
                        Old Password: <Field name="oldPassword" component={renderPasswordNoWarn} type="password" label="Old Password" />
                        New Password: <Field name="password" component={renderPassword} type="password" label="New Password" />

                        <button type="submit" disabled={submitting} className="ui large blue submit button">
                            Submit
                        </button>
                        <Link type="submit" disabled={submitting} className="ui large submit button" to={paths.PROFILE}>
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        );
    }
}


const validate = values => {
    const errors = {};

    v.validatePassword(errors, values);
    v.validatePassword(errors, values, "oldPassword");

    return errors;
};

const warn = values => {
    const warnings = {}

    w.warnPassword(warnings, values);

    return warnings;
}

export default reduxForm({
    // a unique name for the form
    form: formName,
    validate,
    warn
})(EditPasswordForm);