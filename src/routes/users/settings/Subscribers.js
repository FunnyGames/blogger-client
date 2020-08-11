import React from 'react';
import { connect } from 'react-redux';
import { userActions, alertRefersh, alertActions } from '../../../actions';
import setTitle from '../../../environments/document';
import ErrorConnect from '../../../components/pages/ErrorConnect';
import Table from '../../../components/interactive/Table';
import * as utils from '../../../helpers/utils';
import paths from '../../../constants/path.constants';
import history from '../../../helpers/history';
import { userOptions } from '../../../constants/table.options';
import globalConstants from '../../../constants/global.constants';

import defaultProfileImage from '../../../images/static/default-profile.png';

import '../../../css/profile.css';

class Subscribers extends React.Component {
    state = {
        name: undefined,
        page: 1,
        selectedOption: null
    };

    componentDidMount() {
        setTitle('Subscribers');
        this.fetchSubs();
    }

    fetchSubs = () => {
        // Get dispatch function from props
        const { dispatch } = this.props;

        // Fetch groups of user
        const limit = globalConstants.TABLE_LIMIT;
        const { page, name, selectedOption } = this.state;
        let { sortOrder, sortBy } = {};
        if (selectedOption) {
            sortBy = selectedOption.sortBy;
            sortOrder = selectedOption.sortOrder;
        }
        dispatch(userActions.subscribers(page, limit, name, sortBy, sortOrder));
    }

    onSearch = (name) => {
        if (!name) name = undefined;
        this.setState({ name }, this.fetchSubs);
    }

    onPageChange = (page) => {
        this.setState({ page }, this.fetchSubs);
    }

    handleSelectChange = selectedOption => {
        this.setState({ selectedOption }, this.fetchSubs);
    };

    buildRow(id, title, userId, avatar) {
        let path = utils.convertUrlPath(paths.USER, { id: userId });
        let image = avatar || defaultProfileImage;
        return (
            <tr key={id} style={{ cursor: 'pointer' }} onClick={() => history.push(path)}>
                <td><img src={image} alt="profile pic" className="profile-avatar" style={{ marginRight: '10px' }} /><p style={{ marginTop: '5px' }}>{title}</p></td>
            </tr>)
            ;
    }

    noDataTableRows = () => {
        return (<tr key={"no-data"}><td style={{ textAlign: 'center' }}>No Data</td></tr>);
    }

    createTableRows = (data) => {
        if (!data || data.length === 0) return [this.noDataTableRows()];
        const tableRows = [];
        for (let i = 0; i < data.length; ++i) {
            let row = data[i];
            let username = row.subToUsername;
            let userId = row.subToUserId;
            let avatar = row.avatar;
            tableRows.push(this.buildRow(row._id, username, userId, avatar));
        }
        return tableRows;
    }

    render() {
        const { info, subscribers, alert, dispatch } = this.props;
        if (info.error) return <ErrorConnect />;
        if (alertRefersh.is(alert, alertRefersh.UNSUBSCRIBE)) {
            this.fetchSubs();
            dispatch(alertActions.clear());
        }

        let tableRows = this.createTableRows(subscribers.data);
        let totalRows = subscribers.data ? subscribers.data.length : 0;
        let loadingTable = subscribers.loading;
        let total = subscribers.metadata ? subscribers.metadata.total : 0;

        return (
            <div>
                <div className="ui center aligned header">
                    <h1>{total > 0 ? total : null} Subscriber{total > 1 ? 's' : ''}:</h1>
                </div>
                <p></p>
                {subscribers.error ?
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
            </div >
        );
    }
}

function mapStateToProps(state) {
    const { user, subscribers, alert } = state;
    return { info: user, subscribers, alert };
}

const connected = connect(mapStateToProps)(Subscribers);
export { connected as Subscribers };
