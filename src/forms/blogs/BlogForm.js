import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, change } from 'redux-form';
import { renderInput, renderTextbox } from '../render';
import * as v from '../validator';
import MultiSelect from '../../components/interactive/MultiSelect';
import Tags from '../../components/interactive/Tags';
import { userActions } from '../../actions';
import * as utils from '../../helpers/utils';

const formName = 'blog';

class BlogForm extends React.Component {
    state = {
        selectedMemberOption: null,
        selectedGroupOption: null,
        isPrivate: false,
        isPublic: true,
        isFriends: false
    };

    componentDidMount() {
        const { initialValues } = this.props;
        if (!initialValues) return;
        const isPrivate = initialValues.permission === 'private';
        const isFriends = initialValues.permission === 'friends';
        const isPublic = initialValues.permission === 'public';
        const selectedMemberOption = initialValues.members;
        const selectedGroupOption = initialValues.groups;
        this.setState({ isPrivate, isFriends, isPublic, selectedMemberOption, selectedGroupOption });
    }

    inputMemberChanged = val => {
        if (!val) return;
        this.loadUsers(val);
    }

    inputGroupChanged = val => {
        if (!val) return;
        this.loadGroups(val);
    }

    loadUsers = (name) => {
        const { dispatch } = this.props;
        const page = 1;
        const limit = 10;
        const sortBy = 'username';
        const sortOrder = 'asc';
        dispatch(userActions.getUsers(page, limit, name, sortBy, sortOrder));
    }

    loadGroups = (name) => {
        const { dispatch } = this.props;
        const page = 1;
        const limit = 10;
        const sortBy = 'username';
        const sortOrder = 'asc';
        const userId = utils.getUserId();
        dispatch(userActions.getUserGroups(userId, page, limit, name, sortBy, sortOrder));
    }

    handleMemberChange = (selectedMemberOption) => {
        this.setState({ selectedMemberOption });
        this.props.dispatch(change(formName, 'members', selectedMemberOption));
    }

    handleGroupChange = (selectedGroupOption) => {
        this.setState({ selectedGroupOption });
        this.props.dispatch(change(formName, 'groups', selectedGroupOption));
    }

    handleTagsChange = (tags) => {
        this.setState({ tags });
        this.props.dispatch(change(formName, 'tags', tags));
    }

    changePrivacy = (e) => {
        let isPrivate = false;
        let isFriends = false;
        let isPublic = false;
        let permission = null;
        switch (e.target.name) {
            case 'permission_private': isPrivate = true; permission = 'private'; break;
            case 'permission_friends': isFriends = true; permission = 'friends'; break;
            case 'permission_public': isPublic = true; permission = 'public'; break;
            default: break;
        }
        this.setState({ isPrivate, isFriends, isPublic });
        this.props.dispatch(change(formName, 'isPrivate', isPrivate));
        this.props.dispatch(change(formName, 'permission', permission));
    }

    buildMemberOptions = (users) => {
        if (!users) return [];
        let list = [];
        list = users.map(u => { return { label: u.username, value: u._id }; });
        return list;
    }

    buildGroupOptions = (groups) => {
        if (!groups) return [];
        let list = [];
        list = groups.map(g => { return { label: g.name, value: g._id }; });
        return list;
    }

    render() {
        const { handleSubmit, onCancel, submitting, users, groups, userLoading, groupLoading, initialValues, disabled } = this.props;
        const { selectedMemberOption, selectedGroupOption, isPrivate, isFriends, isPublic } = this.state;
        const memberOptions = this.buildMemberOptions(users);
        const groupOptions = this.buildGroupOptions(groups);
        const tags = initialValues && initialValues.tags;

        const permissions = isPrivate ?
            <div>Members :
            <MultiSelect
                    name="members"
                    placeholder="Enter username..."
                    options={memberOptions}
                    value={selectedMemberOption}
                    onChange={this.handleMemberChange}
                    inputChanged={this.inputMemberChanged}
                    loading={userLoading}
                />
            Groups :
                <MultiSelect
                    name="groups"
                    placeholder="Enter group name..."
                    options={groupOptions}
                    value={selectedGroupOption}
                    onChange={this.handleGroupChange}
                    inputChanged={this.inputGroupChanged}
                    loading={groupLoading}
                />
            </div>
            : null;
        return (
            <form onSubmit={handleSubmit} className="ui large form">
                <div className="ui stacked secondary segment">
                    Title:
                    <Field name="title" component={renderInput} type="text" label="Post title" />
                    Content:
                    <Field name="content" component={renderTextbox} type="text" label="Write your story here..." />
                    Tags:
                    <Field name="tags" component={Tags} onTagChange={this.handleTagsChange} type="text" label="Enter tags" initialValues={tags} />
                    <p></p>
                    <div className="inline fields">
                        <label>Visibility:</label>
                        <div className="field">
                            <div className="ui radio checkbox">
                                <input type="radio" name="permission_public" onChange={this.changePrivacy} checked={isPublic} disabled={disabled} />
                                <label>Public</label>
                            </div>
                        </div>
                        <div className="field">
                            <div className="ui radio checkbox">
                                <input type="radio" name="permission_friends" onChange={this.changePrivacy} checked={isFriends} disabled={disabled} />
                                <label>Friends only</label>
                            </div>
                        </div>
                        <div className="field">
                            <div className="ui radio checkbox">
                                <input type="radio" name="permission_private" onChange={this.changePrivacy} checked={isPrivate} disabled={disabled} />
                                <label>Private</label>
                            </div>
                        </div>
                    </div>
                    <br />
                    {permissions}
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

    v.validateBlogTitle(errors, values);
    v.validateBlogContent(errors, values);

    return errors;
};

// Set props to state fields
function mapStateToProps(state) {
    const { users, userGroups } = state;
    return { users: users.data, userLoading: users.loading, groups: userGroups.data, groupLoading: userGroups.loading };
}

let Blog = connect(
    mapStateToProps
)(BlogForm);

export default reduxForm({
    // a unique name for the form
    form: formName,
    validate
})(Blog);