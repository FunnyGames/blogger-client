import React from 'react';
import { connect } from 'react-redux';
import Table from '../../components/interactive/Table';
import { userActions } from '../../actions';
import globalConstants from '../../constants/global.constants';
import * as utils from '../../helpers/utils';
import { userOptions } from '../../constants/table.options';

class NewChat extends React.Component {
    state = {
        name: undefined,
        page: 1,
        selectedOption: null
    };

    componentDidMount() {
        this.fetchUsers();
    }

    fetchUsers() {
        // Get dispatch function from props
        const { dispatch } = this.props;

        // Fetch users
        const limit = globalConstants.TABLE_LIMIT;
        const { page, name, selectedOption } = this.state;
        let { sortOrder, sortBy } = {};
        if (selectedOption) {
            sortBy = selectedOption.sortBy;
            sortOrder = selectedOption.sortOrder;
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

    buildRow(id, title) {
        const { onUserSelect } = this.props;
        return (<tr key={id} style={{ cursor: 'pointer' }} onClick={() => onUserSelect(id)}><td>{title}</td></tr>);
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
            if (userId === row._id) continue;
            tableRows.push(this.buildRow(row._id, row.username));
        }
        if (tableRows.length === 0) return [this.noDataTableRows()];
        return tableRows;
    }

    render() {
        let { users } = this.props;

        let tableRows = this.createTableRows(users.data);
        let totalRows = users.metadata ? users.metadata.total : 0;
        let loadingTable = users.loading;
        return (
            <div style={{ marginBottom: '4em', marginTop: '4em', maxWidth: '500px' }}>
                <div className="ui header">
                    <div className="ui center aligned header">
                        <h1>Search Users:</h1>
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

const connected = connect(mapStateToProps)(NewChat);
export { connected as NewChat };
