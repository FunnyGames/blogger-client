import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import Table from '../../../components/interactive/Table';
import { friendActions } from '../../../actions';
import globalConstants from '../../../constants/global.constants';
import history from '../../../helpers/history';
import * as utils from '../../../helpers/utils';
import { friendOptions } from '../../../constants/table.options';
import paths from '../../../constants/path.constants';

import defaultProfileImage from '../../../images/static/default-profile.png';

class UserFriends extends React.Component {
    state = {
        name: undefined,
        page: 1,
        selectedOption: null
    };

    componentDidMount() {
        this.fetchUserFriends();
    }

    fetchUserFriends() {
        // Get dispatch function from props
        const { dispatch } = this.props;

        // Fetch groups of user
        const userId = this.getUserId();
        const limit = globalConstants.TABLE_LIMIT;
        const { page, name, selectedOption } = this.state;
        let { sortOrder, sortBy } = {};
        if (selectedOption) {
            sortBy = selectedOption.sortBy;
            sortOrder = selectedOption.sortOrder;
        }
        dispatch(friendActions.getFriends(userId, page, limit, name, sortBy, sortOrder));
    }

    getUserId = () => {
        return this.props.match.params.id;
    }

    onSearch = (name) => {
        if (!name) name = undefined;
        this.setState({ name }, this.fetchUserFriends);
    }

    onPageChange = (page) => {
        this.setState({ page }, this.fetchUserFriends);
    }

    handleSelectChange = selectedOption => {
        this.setState({ selectedOption }, this.fetchUserFriends);
    };

    buildRow(id, title, avatar) {
        let path = utils.convertUrlPath(paths.USER, { id });
        let image = avatar || defaultProfileImage;
        return (
            <tr key={id} style={{ cursor: 'pointer' }} onClick={() => history.push(path)}>
                <td><img src={image} alt="profile pic" className="profile-avatar" style={{ marginRight: '10px' }} /><p style={{ marginTop: '5px' }}>{title}</p></td>
            </tr>);
    }

    noDataTableRows = () => {
        return (<tr key={"no-data"}><td style={{ textAlign: 'center' }}>No Data</td></tr>);
    }

    createTableRows = (data) => {
        if (!data || data.length === 0) return [this.noDataTableRows()];
        const tableRows = [];
        const userId = this.getUserId();
        for (let i = 0; i < data.length; ++i) {
            let row = data[i];
            const meUser1 = userId === row.userId1;
            const name = meUser1 ? row.username2 : row.username1;
            const id = meUser1 ? row.userId2 : row.userId1;
            const avatar = meUser1 ? row.avatar2 : row.avatar1;
            tableRows.push(this.buildRow(id, name, avatar));
        }
        return tableRows;
    }

    render() {
        let { friends } = this.props;

        let tableRows = this.createTableRows(friends.data);
        let totalRows = friends.metadata ? friends.metadata.total : 0;
        let loadingTable = friends.loading;
        return (
            <Fragment>
                <div className="ui container">
                    {friends && friends.error ?
                        <center>Error loading</center>
                        : <Table
                            loading={loadingTable}
                            tableRows={tableRows}
                            totalRows={totalRows}
                            onPageChange={this.onPageChange}
                            onSelectChange={this.handleSelectChange}
                            onSearch={this.onSearch}
                            options={friendOptions}
                            searchPlaceHolder={"Search Friends..."}
                        />
                    }
                </div>
            </Fragment>
        );
    }
}

function mapStateToProps(state) {
    let { friends } = state;
    return { friends };
}

const connected = connect(mapStateToProps)(UserFriends);
export { connected as UserFriends };