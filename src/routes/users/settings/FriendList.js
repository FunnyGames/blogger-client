import React from 'react';
import { connect } from 'react-redux';
import Table from '../../../components/interactive/Table';
import { alertActions, friendActions, alertRefersh } from '../../../actions';
import paths from '../../../constants/path.constants';
import setTitle from '../../../environments/document';
import ErrorConnect from '../../../components/pages/ErrorConnect';
import * as utils from '../../../helpers/utils';
import history from '../../../helpers/history';
import globalConstants from '../../../constants/global.constants';
import { friendOptions } from '../../../constants/table.options';

import defaultProfileImage from '../../../images/static/default-profile.png';

import '../../../css/profile.css';

class FriendList extends React.Component {
    state = {
        name: undefined,
        page: 1,
        selectedOption: null
    };

    componentDidMount() {
        setTitle("Friends");
        this.fetchFriends();
    }

    fetchFriends() {
        // Get dispatch function from props
        const { dispatch } = this.props;

        // Fetch friends of user
        const userId = utils.getUserId();
        const limit = globalConstants.TABLE_LIMIT;
        const { page, name, selectedOption } = this.state;
        let { sortOrder, sortBy } = {};
        if (selectedOption) {
            sortBy = selectedOption.sortBy;
            sortOrder = selectedOption.sortOrder;
        }
        dispatch(friendActions.getFriends(userId, page, limit, name, sortBy, sortOrder));
    }

    onSearch = (name) => {
        if (!name) name = undefined;
        this.setState({ name }, this.fetchFriends);
    }

    onPageChange = (page) => {
        this.setState({ page }, this.fetchFriends);
    }

    handleSelectChange = selectedOption => {
        this.setState({ selectedOption }, this.fetchFriends);
    };

    onRemoveFriend = (friendId) => {
        const { dispatch } = this.props;
        dispatch(friendActions.unfriend(friendId));
    }

    buildRow(id, title, fromUserId, avatar) {
        let button = (<button className="ui red button" onClick={e => { e.stopPropagation(); this.onRemoveFriend(id); }}>Remove Friend</button>);
        const userUrl = fromUserId ? utils.convertUrlPath(paths.USER, { id: fromUserId }) : '';
        let image = avatar || defaultProfileImage;
        return (
            <tr key={id} style={{ cursor: 'pointer' }} onClick={() => history.push(userUrl)}>
                <td><img src={image} alt="profile pic" className="profile-avatar" style={{ marginRight: '10px' }} /><p style={{ marginTop: '5px' }}>{title}</p></td>
                <td className="right aligned">{button}</td>
            </tr>
        );
    }

    noDataTableRows = () => {
        return (<tr key={"no-data"}><td style={{ textAlign: 'center' }}>No Data</td></tr>);
    }

    createTableRows = (data) => {
        if (!data || data.length === 0) return [this.noDataTableRows()];
        const tableRows = [];
        const userId = utils.getUserId();
        for (let i = 0; i < data.length; ++i) {
            let row = data[i];
            const { userId1, userId2, username1, username2, avatar1, avatar2 } = row;
            const meUser1 = userId1 === userId;
            let fromUserId = meUser1 ? userId2 : userId1;
            let fromUsername = meUser1 ? username2 : username1;
            const avatar = meUser1 ? avatar2 : avatar1;
            tableRows.push(this.buildRow(row._id, fromUsername, fromUserId, avatar));
        }
        return tableRows;
    }

    render() {
        const { info, friends, alert } = this.props;
        if (info.error) return <ErrorConnect />;

        if (alertRefersh.is(alert, alertRefersh.FRIEND_REQUEST)) {
            this.fetchFriends();
            const { dispatch } = this.props;
            dispatch(alertActions.clear());
        }

        let tableRows = this.createTableRows(friends.data);
        let totalRows = friends.metadata ? friends.metadata.total : 0;
        let loadingTable = friends.loading;
        let total = friends.metadata ? friends.metadata.total : 0;

        return (
            <div>
                <div className="ui container">
                    <div className="ui center aligned header">
                        <h1>My Friends: <span style={{ fontWeight: 'normal', fontSize: 'large' }}>({total})</span></h1>
                    </div>
                    {friends.error ?
                        <center>Error loading</center>
                        : <Table
                            loading={loadingTable}
                            tableRows={tableRows}
                            totalRows={totalRows}
                            onPageChange={this.onPageChange}
                            onSelectChange={this.handleSelectChange}
                            onSearch={this.onSearch}
                            options={friendOptions}
                            searchPlaceHolder={"Search friends..."}
                        />
                    }
                </div>
            </div >
        );
    }
}

function mapStateToProps(state) {
    const { user, friends, alert } = state;
    return { info: user, friends, alert };
}

const connected = connect(mapStateToProps)(FriendList);
export { connected as FriendList };
