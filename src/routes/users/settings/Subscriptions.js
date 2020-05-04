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

import '../../../css/profile.css';

class Subscriptions extends React.Component {
    state = {
        name: undefined,
        page: 1,
        selectedOption: null
    };

    componentDidMount() {
        setTitle('Subscriptions');
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
        dispatch(userActions.subscriptions(page, limit, name, sortBy, sortOrder));
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

    unsubUser = (id) => {
        // Get dispatch function from props
        const { dispatch } = this.props;

        dispatch(userActions.unsubscribe(id));
    }

    buildRow(id, title, userId) {
        let button = <button className="ui button" onClick={e => { e.stopPropagation(); this.unsubUser(userId); }}>UNSUBSCRIBE</button>;
        let path = utils.convertUrlPath(paths.USER, { id: userId });
        return (<tr key={id} style={{ cursor: 'pointer' }} onClick={() => history.push(path)}><td>{title}</td><td className="right aligned">{button}</td></tr>);
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
            console.log(row);
            tableRows.push(this.buildRow(row._id, username, userId));
        }
        return tableRows;
    }

    render() {
        const { info, subscriptions, alert, dispatch } = this.props;
        if (info.error) return <ErrorConnect />;
        console.log(subscriptions);
        if (alertRefersh.is(alert, alertRefersh.UNSUBSCRIBE)) {
            this.fetchSubs();
            dispatch(alertActions.clear());
        }

        let tableRows = this.createTableRows(subscriptions.data);
        let totalRows = subscriptions.data ? subscriptions.data.length : 0;
        let loadingTable = subscriptions.loading;

        return (
            <div>
                <div className="ui center aligned header">
                    <h1>Subscriptions:</h1>
                </div>
                <p></p>
                {subscriptions.error ?
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
    const { user, subscriptions, alert } = state;
    return { info: user, subscriptions, alert };
}

const connected = connect(mapStateToProps)(Subscriptions);
export { connected as Subscriptions };
