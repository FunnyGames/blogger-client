import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { renderTextbox } from '../render';
import * as v from '../validator';

const formName = 'comment';

class CommentForm extends React.Component {

    render() {
        const { submitting, saveMessage, handleSubmit } = this.props;

        return (
            <form onSubmit={handleSubmit} className="ui large form">
                <Field name="content" component={renderTextbox} type="text" label="Write your comment here..." />
                <p></p>
                <button type="submit" disabled={submitting} className="ui blue labeled submit icon button">
                    <i className="icon edit"></i>{saveMessage || "Save"}
                </button>
            </form>
        );
    }
}

const validate = values => {
    const errors = {};

    v.validateComment(errors, values);

    return errors;
};

export default reduxForm({
    // a unique name for the form
    form: formName,
    validate
})(CommentForm);