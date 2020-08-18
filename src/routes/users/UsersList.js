import React from 'react';
import { connect } from 'react-redux';
import Table from '../../components/interactive/Table';
import { userActions } from '../../actions';
import setTitle from '../../environments/document';
import globalConstants from '../../constants/global.constants';
import history from '../../helpers/history';
import * as utils from '../../helpers/utils';
import { userOptions } from '../../constants/table.options';
import paths from '../../constants/path.constants';

import defaultProfileImage from '../../images/static/default-profile.png';

class UsersList extends React.Component {
    state = {
        name: undefined,
        page: 1,
        selectedOption: null
    };

    componentDidMount() {
        setTitle("Users");
        this.fetchUsers();
    }

    fetchUsers() {
        // Get dispatch function from props
        const { dispatch, users } = this.props;

        // Fetch users
        const limit = globalConstants.TABLE_LIMIT;
        const { page, name, selectedOption } = this.state;
        let { sortOrder, sortBy } = {};
        if (selectedOption) {
            sortBy = selectedOption.sortBy;
            sortOrder = selectedOption.sortOrder;
        }

        // Check if information already exists
        if (users && users.data && users.metadata) {
            if (users.metadata.page === page) return;
        }
        dispatch(userActions.getUsers(page, limit, name, sortBy, sortOrder));
    }

    onSearch = (name) => {
        if (!name) name = undefined;
        this.setState({ name }, this.fetchUsers);
    }

    onPageChange = (page) => {
        this.setState({ page }, this.fetchUsers);
    }

    handleSelectChange = selectedOption => {
        this.setState({ selectedOption }, this.fetchUsers);
    };

    buildRow(id, title, you, avatar) {
        let youDiv = (you ? <span className="ui yellow label">You</span> : null);
        let path = utils.convertUrlPath(paths.USER, { id });
        let image = avatar || defaultProfileImage;
        return (<tr key={id} style={{ cursor: 'pointer' }} onClick={() => history.push(path)}>
            <td><img src={image} alt="profile pic" className="profile-avatar" style={{ marginRight: '10px' }} /><p style={{ marginTop: '5px' }}>{title} {youDiv}</p></td>
        </tr>);
    }

    noDataTableRows = () => {
        return (<tr key={"no-data"}><td style={{ textAlign: 'center' }}>No Data</td></tr>);
    }

    createTableRows = (data) => {
        if (!data || data.length === 0) return [this.noDataTableRows()];
        const tableRows = [];
        let userId = utils.getUserId();
        for (let i = 0; i < data.length; ++i) {
            let row = data[i];
            let me = userId === row._id;
            tableRows.push(this.buildRow(row._id, row.username, me, row.avatar));
        }
        return tableRows;
    }

    render() {
        let { users } = this.props;

        let tableRows = this.createTableRows(users.data);
        let totalRows = users.metadata ? users.metadata.total : 0;
        let loadingTable = users.loading;
        return (
            <div style={{ marginBottom: '4em', marginTop: '4em' }}>
                <div className="ui header">
                    <div className="ui center aligned header">
                        <h1>Users:</h1>
                    </div>
                </div>
                <div className="ui container">
                    {users && users.error ?
                        <center>Error loading</center>
                        : <Table
                            loading={loadingTable}
                            tableRows={tableRows}
                            totalRows={totalRows}
                            onPageChange={this.onPageChange}
                            onSelectChange={this.handleSelectChange}
                            onSearch={this.onSearch}
                            options={userOptions}
                            searchPlaceHolder={"Search users..."}
                        />
                    }
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    let { users } = state;
    return { users };
}

const connected = connect(mapStateToProps)(UsersList);
export { connected as UsersList };
