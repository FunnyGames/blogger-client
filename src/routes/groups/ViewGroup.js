import React from 'react';
import { connect } from 'react-redux';
import { userActions, groupActions, alertActions, alertRefersh } from '../../actions';
import paths from '../../constants/path.constants';
import globalConstants from '../../constants/global.constants';
import Table from '../../components/interactive/Table';
import setTitle from '../../environments/document';
import history from '../../helpers/history';
import ErrorConnect from '../../components/pages/ErrorConnect';
import renderLoader from '../../components/interactive/Loader';
import { NotFound } from '../../components/pages/NotFound';
import { userOptions } from '../../constants/table.options';
import * as utils from '../../helpers/utils';
import SearchSelect from '../../components/interactive/SearchSelect';
import * as validator from '../../forms/validator';
import Modal from '../../components/interactive/Modal';

import defaultProfileImage from '../../images/static/default-profile.png';

class ViewGroup extends React.Component {
    state = {
        edit: false,
        groupName: '',
        groupDesc: '',
        name: undefined,
        page: 1,
        selectedOption: null,
        selectedMemberOption: null,
        errors: {}
    };

    openModal = {};

    componentDidMount() {
        setTitle("Group");

        // Fetch group and the users
        this.reloadData();
    }

    componentDidUpdate() {
        const { group } = this.props;
        if (group && group._id) {
            const urlId = this.getGroupId();
            if (group._id !== urlId) {
                this.reloadData();
            }
        }
    }

    reloadData = () => {
        this.fetchGroup();
        this.fetchGroupUsers();
    }

    getGroupId = () => {
        return this.props.match.params.id;
    }

    fetchGroup() {
        // Get dispatch function from props
        const { dispatch } = this.props;

        // Fetch group info
        const groupId = this.getGroupId();

        dispatch(groupActions.getGroup(groupId));
    }

    fetchGroupUsers() {
        // Get dispatch function from props
        const { dispatch } = this.props;

        // Fetch groups of user
        const groupId = this.getGroupId();
        const limit = globalConstants.TABLE_LIMIT;
        const { page, name, selectedOption } = this.state;
        let { sortOrder, sortBy } = {};
        if (selectedOption) {
            sortBy = selectedOption.sortBy;
            sortOrder = selectedOption.sortOrder;
        }
        dispatch(groupActions.getGroupUsers(groupId, page, limit, name, sortBy, sortOrder));
    }

    loadUsers = (name) => {
        const { dispatch } = this.props;
        const page = 1;
        const limit = 10;
        const sortBy = 'username';
        const sortOrder = 'asc';
        dispatch(userActions.getUsers(page, limit, name, sortBy, sortOrder));
    }

    onSearch = (name) => {
        if (!name) name = undefined;
        this.setState({ name }, this.fetchGroupUsers);
    }

    onPageChange = (page) => {
        this.setState({ page }, this.fetchGroupUsers);
    }

    handleSelectChange = selectedOption => {
        this.setState({ selectedOption }, this.fetchGroupUsers);
    };

    isGroupOwner = (userId) => {
        return userId === utils.getUserId();
    }

    addMember = () => {
        const { selectedMemberOption } = this.state;
        if (!selectedMemberOption) return;
        let { label, value } = selectedMemberOption;

        // Get dispatch function from props
        const { dispatch } = this.props;

        // Add member to group
        const groupId = this.getGroupId();
        dispatch(groupActions.addMember(groupId, value, label));

        // Remove selection
        this.setState({ selectedMemberOption: null });
    }

    removeMember = (userId, username) => {
        // Get dispatch function from props
        const { dispatch } = this.props;

        // Add member to group
        const groupId = this.getGroupId();
        dispatch(groupActions.removeMember(groupId, userId, username));
    }

    changeMemberSelection = (selectedMemberOption) => {
        this.setState({ selectedMemberOption });
    }

    selectSearchMember = (val) => {
        if (!val) return;
        this.loadUsers(val);
    }

    buildOptions = (users) => {
        if (!users) return [];
        let list = [];
        list = users.map(u => { return { label: u.username, value: u._id }; });
        return list;
    }

    buildRow(id, title, groupOwner, owner, avatar) {
        let ownerDiv = (groupOwner ? <span className="ui yellow label" style={{ marginLeft: '5px' }}>Owner</span> : null);
        let path = utils.convertUrlPath(paths.USER, { id });
        let image = avatar || defaultProfileImage;
        return (
            <tr key={id} style={{ cursor: 'pointer' }} onClick={() => history.push(path)}>
                <td><img src={image} alt="profile pic" className="profile-avatar" style={{ marginRight: '10px' }} /><p style={{ marginTop: '5px' }}>{title}{ownerDiv}</p></td>
                {owner && !groupOwner ?
                    <td><button className="ui right floated red button" onClick={e => { e.stopPropagation(); this.removeMember(id, title); }}>- Remove</button></td>
                    : <td />}
            </tr>
        );
    }

    onGroupNameChange = e => {
        const groupName = e.target.value;
        const errors = this.state.errors;
        delete errors.name;
        validator.validateGroupName(errors, { name: groupName });
        this.setState({ groupName, errors });
    }

    onGroupDescChange = e => {
        const groupDesc = e.target.value;
        const errors = this.state.errors;
        delete errors.description;
        validator.validateGroupDescription(errors, { description: groupDesc });
        this.setState({ groupDesc, errors });
    }

    changeEdit = () => {
        const { group } = this.props;
        let groupName = group.name;
        let groupDesc = group.description;
        const edit = !this.state.edit;
        let errors = {};
        this.setState({ edit, groupName, groupDesc, errors });
    }

    saveGroup = () => {
        const { groupName, groupDesc } = this.state;
        const values = {
            name: groupName,
            description: groupDesc
        };
        const errors = {};
        validator.validateGroupName(errors, values);
        validator.validateGroupDescription(errors, values);
        if (errors.name || errors.description) {
            this.setState({ errors });
            return;
        }
        const { dispatch, group } = this.props;
        const groupId = this.getGroupId();
        if (group && group.name === groupName && group.description === groupDesc) return;
        dispatch(groupActions.updateGroup(groupId, groupName, groupDesc));
    }

    showDeleteConfirm = () => {
        if (this.openModal.func) {
            const groupId = this.getGroupId();
            this.openModal.func(groupId);
        }
    }

    confirmDelete = (groupId) => {
        const { dispatch } = this.props;

        dispatch(groupActions.deleteGroup(groupId));
    }

    noDataTableRows = () => {
        return (<tr key={"no-data"}><td style={{ textAlign: 'center' }}>No Data</td></tr>);
    }

    createTableRows = (data, groupOwner) => {
        if (!data || data.length === 0) return [this.noDataTableRows()];
        const tableRows = [];
        let isOwner = this.isGroupOwner(groupOwner);
        for (let i = 0; i < data.length; ++i) {
            let row = data[i];
            let gOwner = groupOwner === row._id;
            tableRows.push(this.buildRow(row._id, row.username, gOwner, isOwner, row.avatar));
        }
        return tableRows;
    }

    render() {
        const { group, users, searhUsers, alert, update, deleteGroup, dispatch } = this.props;
        if (deleteGroup && deleteGroup.ok) {
            history.push(paths.GROUPS);
            return null;
        }
        if (!group || group.loading) return renderLoader();
        if (group.notFound) return <NotFound title="Group not found" />;
        if (group.error) return <ErrorConnect />;
        const { edit, errors, selectedMemberOption } = this.state;

        if (update && update.loading && edit) this.setState({ edit: false });
        if (alertRefersh.is(alert, alertRefersh.UPDATE_GROUP_USERS)) {
            this.fetchGroupUsers();
            dispatch(alertActions.clear());
        } else if (alertRefersh.is(alert, alertRefersh.UPDATE_GROUP)) {
            this.fetchGroup();
            dispatch(alertActions.clear());
        }

        let name = group.name;
        let description = group.description;
        let owner = group.owner;

        let tableRows = this.createTableRows(users.data, owner);
        let totalRows = users.metadata ? users.metadata.total : 0;
        let loadingTable = users.loading;

        let loadingUsers = searhUsers.loading;
        const options = this.buildOptions(searhUsers.data);

        const isOwner = this.isGroupOwner(owner);

        const editDeleteButton = isOwner ?
            (
                <div className="ui basic clearing segment">
                    <button className="ui right floated red button" onClick={this.showDeleteConfirm} > Delete Group</button>
                    <button className="ui right floated blue button" onClick={this.changeEdit} > {edit ? "Cancel" : "Edit Group"}</button>
                    {edit ? <button className="ui right floated green button" onClick={this.saveGroup} > Save Changes</button> : null}
                </div >
            ) : null;

        const addMemberDiv = isOwner ?
            (
                <div className="ui grid">
                    <div className="ten wide column">
                        <SearchSelect
                            name="member"
                            placeholder="Search member..."
                            loading={loadingUsers}
                            value={selectedMemberOption}
                            onChange={this.changeMemberSelection}
                            options={options}
                            inputChanged={this.selectSearchMember}
                        />
                    </div>
                    <div className="four wide column">
                        <button className="ui green button" disabled={!selectedMemberOption} onClick={this.addMember}>+ Add member</button>
                    </div>
                </div>
            ) : null;

        const groupNameClass = `ui mini input ${edit && errors && errors.name ? 'field error' : ''}`;
        const groupDescClass = `ui fluid input ${edit && errors.description ? 'field error' : ''}`;
        const tooltipName = edit && errors && errors.name;
        const tooltipDesc = edit && errors && errors.description;

        return (
            <div style={{ marginBottom: '4em', marginTop: '4em' }}>
                <div className="ui header">
                    <div className="ui center aligned header">
                        <h1>
                            {edit ?
                                <div className={groupNameClass} data-tooltip={tooltipName} data-position="right center" data-toggle="tooltip">
                                    <input label="name" placeholder={name} value={this.state.groupName} autoComplete="off" onChange={this.onGroupNameChange}></input>
                                </div>
                                : name}
                        </h1>
                    </div>
                </div>
                <div className="ui container">
                    <div className="ui inverted secondary blue segment">
                        {edit ?
                            <div className={groupDescClass} data-tooltip={tooltipDesc} data-position="bottom center">
                                <input label="description" placeholder={description} value={this.state.groupDesc} autoComplete="off" onChange={this.onGroupDescChange}></input>
                            </div>
                            : description}
                    </div>
                    {editDeleteButton}
                    <h2>Members:</h2>
                    <p></p>
                    {addMemberDiv}
                    <p />
                    <Table
                        loading={loadingTable}
                        tableRows={tableRows}
                        totalRows={totalRows}
                        onPageChange={this.onPageChange}
                        onSelectChange={this.handleSelectChange}
                        onSearch={this.onSearch}
                        options={userOptions}
                        searchPlaceHolder={"Search members..."}
                    />
                </div>
                <Modal
                    message="Are you sure you want to delete this group?"
                    onConfirm={this.confirmDelete}
                    confirmLabel={"Yes"}
                    denyLabel={"No"}
                    openModal={this.openModal}
                />
            </div >
        );
    }
}

function mapStateToProps(state) {
    const { group, groupUsers, users, alert, update } = state;
    if (group && group.name) {
        setTitle(group.name);
    }
    return { group, users: groupUsers, searhUsers: users, alert, update: update.updateGroup, deleteGroup: update.deleteGroup };
}

const connected = connect(mapStateToProps)(ViewGroup);
export { connected as ViewGroup };
