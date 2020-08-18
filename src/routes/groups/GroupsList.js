import React from 'react';
import { connect } from 'react-redux';
import Table from '../../components/interactive/Table';
import { groupActions } from '../../actions';
import setTitle from '../../environments/document';
import globalConstants from '../../constants/global.constants';
import history from '../../helpers/history';
import * as utils from '../../helpers/utils';
import { groupOptions } from '../../constants/table.options';
import paths from '../../constants/path.constants';

class GroupsList extends React.Component {
    state = {
        name: undefined,
        page: 1,
        selectedOption: null
    };

    componentDidMount() {
        setTitle("Groups");
        this.fetchGroups();
    }

    fetchGroups() {
        // Get dispatch function from props
        const { dispatch, groups } = this.props;

        // Fetch groups
        const limit = globalConstants.TABLE_LIMIT;
        const { page, name, selectedOption } = this.state;
        let { sortOrder, sortBy } = {};
        if (selectedOption) {
            sortBy = selectedOption.sortBy;
            sortOrder = selectedOption.sortOrder;
        }

        // Check if information already exists
        if (groups && groups.data && groups.metadata) {
            if (groups.metadata.page === page) return;
        }
        dispatch(groupActions.getGroups(page, limit, name, sortBy, sortOrder));
    }

    onSearch = (name) => {
        if (!name) name = undefined;
        this.setState({ name }, this.fetchGroups);
    }

    onPageChange = (page) => {
        this.setState({ page }, this.fetchGroups);
    }

    handleSelectChange = selectedOption => {
        this.setState({ selectedOption }, this.fetchGroups);
    };

    buildRow(id, title, username, userId) {
        const groupUrl = utils.convertUrlPath(paths.GROUP, { id });
        const userUrl = utils.convertUrlPath(paths.USER, { id: userId });
        return (
            <tr key={id} style={{ cursor: 'pointer' }} onClick={() => history.push(groupUrl)}>
                <td>{title}</td>
                <td style={{ textAlign: 'right' }} onClick={e => { e.stopPropagation(); history.push(userUrl); }}>By: {username}</td>
            </tr>
        );
    }

    noDataTableRows = () => {
        return (<tr key={"no-data"}><td style={{ textAlign: 'center' }}>No Data</td></tr>);
    }

    createTableRows = (data) => {
        if (!data || data.length === 0) return [this.noDataTableRows()];
        const tableRows = [];
        for (let i = 0; i < data.length; ++i) {
            let row = data[i];
            let username = row.user.username;
            let userId = row.user._id;
            tableRows.push(this.buildRow(row._id, row.name, username, userId));
        }
        return tableRows;
    }

    render() {
        let { groups } = this.props;

        let tableRows = this.createTableRows(groups.data);
        let totalRows = groups.metadata ? groups.metadata.total : 0;
        let loadingTable = groups.loading;
        return (
            <div style={{ marginBottom: '4em', marginTop: '4em' }}>
                <div className="ui header">
                    <div className="ui center aligned header">
                        <h1>Groups:</h1>
                    </div>
                </div>
                <div className="ui container">
                    <button className="ui blue left floated button" onClick={() => history.push(paths.ADD_GROUP)}>Add group</button>

                    <div className="ui hidden clearing divider"></div>
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
            </div>
        );
    }
}

function mapStateToProps(state) {
    let { groups } = state;
    return { groups };
}

const connected = connect(mapStateToProps)(GroupsList);
export { connected as GroupsList };
