import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import Table from '../../../components/interactive/Table';
import { userActions } from '../../../actions';
import globalConstants from '../../../constants/global.constants';
import history from '../../../helpers/history';
import * as utils from '../../../helpers/utils';
import { groupOptions } from '../../../constants/table.options';
import paths from '../../../constants/path.constants';

class UserGroups extends React.Component {
    state = {
        name: undefined,
        page: 1,
        selectedOption: null
    };

    componentDidMount() {
        this.fetchUserGroups();
    }

    fetchUserGroups() {
        // Get dispatch function from props
        const { dispatch, groups } = this.props;

        // Fetch groups of user
        const userId = this.getUserId();
        const limit = globalConstants.TABLE_LIMIT;
        const { page, name, selectedOption } = this.state;
        let { sortOrder, sortBy } = {};
        if (selectedOption) {
            sortBy = selectedOption.sortBy;
            sortOrder = selectedOption.sortOrder;
        }

        // Check if information already exists
        if (groups && groups.data && groups.metadata) {
            if (groups.metadata.page === page && groups.other && groups.other.currentTab === userId) return;
        }
        dispatch(userActions.getUserGroups(userId, page, limit, name, sortBy, sortOrder));
    }

    getUserId = () => {
        return this.props.match.params.id;
    }

    onSearch = (name) => {
        if (!name) name = undefined;
        this.setState({ name }, this.fetchUserGroups);
    }

    onPageChange = (page) => {
        this.setState({ page }, this.fetchUserGroups);
    }

    handleSelectChange = selectedOption => {
        this.setState({ selectedOption }, this.fetchUserGroups);
    };

    buildRow(id, title, owner) {
        let ownerDiv = (owner ? <div className="ui yellow label">Owner</div> : null);
        let path = utils.convertUrlPath(paths.GROUP, { id });
        return (<tr key={id} style={{ cursor: 'pointer' }} onClick={() => history.push(path)}><td>{title} {ownerDiv}</td></tr>);
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
        let { groups } = this.props;

        let tableRows = this.createTableRows(groups.data);
        let totalRows = groups.metadata ? groups.metadata.total : 0;
        let loadingTable = groups.loading;
        return (
            <Fragment>
                <div className="ui container">
                    {groups && groups.error ?
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
            </Fragment>
        );
    }
}

function mapStateToProps(state) {
    let { userGroups } = state;
    return { groups: userGroups };
}

const connected = connect(mapStateToProps)(UserGroups);
export { connected as UserGroups };
