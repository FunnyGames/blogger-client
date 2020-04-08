import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, change } from 'redux-form';
import { renderInput } from '../render';
import * as v from '../validator';
import MultiSelect from '../../components/interactive/MultiSelect';
import { userActions } from '../../actions';

class NewGroupForm extends React.Component {
    state = {
        selectedOption: null,
    };

    inputChanged = val => {
        if (!val) return;
        this.loadUsers(val);
    }

    loadUsers = (name) => {
        const { dispatch } = this.props;
        const page = 1;
        const limit = 10;
        const sortBy = 'username';
        const sortOrder = 'asc';
        dispatch(userActions.getUsers(page, limit, name, sortBy, sortOrder));
    }

    handleChange = (selectedOption) => {
        this.setState({ selectedOption });
        this.props.dispatch(change('new_group', 'members', selectedOption));
    }

    buildOptions = (users) => {
        if (!users) return [];
        let list = [];
        list = users.map(u => { return { label: u.username, value: u._id }; });
        return list;
    }

    render() {
        const { handleSubmit, onCancel, submitting, users, loading } = this.props;
        const { selectedOption } = this.state;
        const options = this.buildOptions(users);
        return (
            <form onSubmit={handleSubmit} className="ui large form">
                <div className="ui stacked secondary segment">
                    Group name:
                    <Field name="name" component={renderInput} type="text" label="Group name" />
                    Group description:
                    <Field name="description" component={renderInput} type="text" label="Group description..." />
                    Members:
                    <MultiSelect
                        name="members"
                        placeholder="Enter username..."
                        options={options}
                        value={selectedOption}
                        onChange={this.handleChange}
                        inputChanged={this.inputChanged}
                        loading={loading}
                    />
                    <p></p>
                    <center>
                        <button type="submit" disabled={submitting} className="ui large blue submit button">
                            Submit
                        </button>
                        <button type="submit" onClick={onCancel} disabled={submitting} className="ui large blue submit button">
                            Cancel
                        </button>
                    </center>
                </div>
            </form>
        );
    }
}

const validate = values => {
    const errors = {};

    v.validateGroupName(errors, values);
    v.validateGroupDescription(errors, values);

    return errors;
};

// Set props to state fields
function mapStateToProps(state) {
    const { users } = state;
    return { users: users.data, loading: users.loading };
}

let NewGroup = connect(
    mapStateToProps
)(NewGroupForm);

export default reduxForm({
    // a unique name for the form
    form: 'new_group',
    validate
})(NewGroup);