import React from 'react';
import { connect } from 'react-redux';
import Table from '../../../components/interactive/Table';
import { userActions, groupActions, alertActions } from '../../../actions';
import paths from '../../../constants/path.constants';
import setTitle from '../../../environments/document';
import ErrorConnect from '../../../components/pages/ErrorConnect';
import * as utils from '../../../helpers/utils';
import history from '../../../helpers/history';
import globalConstants from '../../../constants/global.constants';
import { groupOptions } from '../../../constants/table.options';
import Modal from '../../../components/interactive/Modal';

import '../../../css/profile.css';

class ProfileGroups extends React.Component {
    state = {
        name: undefined,
        page: 1,
        selectedOption: null
    };

    openModal = {};
    openModal2 = {};

    componentDidMount() {
        setTitle("My Groups");
        this.fetchUserGroups();
    }

    fetchUserGroups() {
        // Get dispatch function from props
        const { dispatch } = this.props;

        // Fetch groups of user
        const userId = utils.getUserId();
        const limit = globalConstants.TABLE_LIMIT;
        const { page, name, selectedOption } = this.state;
        let { sortOrder, sortBy } = {};
        if (selectedOption) {
            sortBy = selectedOption.sortBy;
            sortOrder = selectedOption.sortOrder;
        }
        dispatch(userActions.getUserGroups(userId, page, limit, name, sortBy, sortOrder));
    }

    onSearch = (name) => {
        if (!name) name = undefined;
        this.setState({ name }, this.fetchUserGroups);
    }

    onPageChange = (page) => {
        this.setState({ page }, this.fetchUserGroups);
    }

    onExitGroup = (groupId) => {
        if (this.openModal2.func) {
            const userId = utils.getUserId();
            const info = {
                groupId,
                userId
            };
            this.openModal2.func(info);
        }
    }

    confirmExit = (info) => {
        const { dispatch } = this.props;
        const { groupId, userId } = info;
        dispatch(groupActions.exitGroup(groupId, userId));
    }

    onDeleteGroup = (id) => {
        if (this.openModal.func) {
            this.openModal.func(id);
        }
    }

    confirmDelete = (groupId) => {
        const { dispatch } = this.props;
        dispatch(groupActions.deleteGroup(groupId));
    }

    handleSelectChange = selectedOption => {
        this.setState({ selectedOption }, this.fetchUserGroups);
    };

    buildRow(id, title, owner) {
        let ownerDiv = (owner ? <div className="ui yellow label">Owner</div> : null);
        let button = (owner ?
            <button className="ui red button" onClick={e => { e.stopPropagation(); this.onDeleteGroup(id); }}>Delete Group</button>
            : <button className="ui red button" onClick={e => { e.stopPropagation(); this.onExitGroup(id); }}>- Exit</button>
        );
        let path = utils.convertUrlPath(paths.GROUP, { id });
        return (<tr key={id} style={{ cursor: 'pointer' }} onClick={() => history.push(path)}><td>{title} {ownerDiv}</td><td className="right aligned">{button}</td></tr>);
    }

    noDataTableRows = () => {
        return (<tr key={"no-data"}><td style={{ textAlign: 'center' }}>No Data</td></tr>);
    }

    createTableRows = (data) => {
        if (!data || data.length === 0) return [this.noDataTableRows()];
        const tableRows = [];
        for (let i = 0; i < data.length; ++i) {
            let row = data[i];
            tableRows.push(this.buildRow(row._id, row.name, row.owner));
        }
        return tableRows;
    }

    render() {
        const { info, groups, forceRefresh } = this.props;
        if (info.error) return <ErrorConnect />;

        if (forceRefresh) {
            this.fetchUserGroups();
            const { dispatch } = this.props;
            dispatch(alertActions.clear());
        }

        let tableRows = this.createTableRows(groups.data);
        let totalRows = groups.metadata ? groups.metadata.total : 0;
        let loadingTable = groups.loading;

        return (
            <div>
                <div className="ui container">
                    <div className="ui center aligned header">
                        <h1>My Groups:</h1>
                    </div>
                    {groups.error ?
                        <center>Error loading</center>
                        : <Table
                            loading={loadingTable}
                            tableRows={tableRows}
                            totalRows={totalRows}
                            onPageChange={this.onPageChange}
                            onSelectChange={this.handleSelectChange}
                            onSearch={this.onSearch}
                            options={groupOptions}
                            searchPlaceHolder={"Search groups..."}
                        />
                    }
                </div>
                <Modal
                    message="Are you sure you want to delete this group?"
                    onConfirm={this.confirmDelete}
                    confirmColor="red"
                    confirmLabel="Delete"
                    denyColor="grey"
                    denyLabel="No"
                    openModal={this.openModal}
                />
                <Modal
                    message="Are you sure you want to exit this group?"
                    onConfirm={this.confirmExit}
                    confirmColor="red"
                    confirmLabel="Exit"
                    denyColor="grey"
                    denyLabel="No"
                    openModal={this.openModal2}
                />
            </div >
        );
    }
}

function mapStateToProps(state) {
    const { user, userGroups, alert } = state;
    const { forceRefresh } = alert;
    return { info: user, groups: userGroups, forceRefresh };
}

const connected = connect(mapStateToProps)(ProfileGroups);
export { connected as ProfileGroups };
