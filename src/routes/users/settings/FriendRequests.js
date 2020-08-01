import React, { Fragment } from 'react';
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

class FriendRequests extends React.Component {
    state = {
        name: undefined,
        page: 1,
        selectedOption: null,

        name2: undefined,
        page2: 1,
        selectedOption2: null
    };

    componentDidMount() {
        setTitle("Friends");
        this.fetchFriends();
    }

    fetchFriends() {
        // Get dispatch function from props
        const { dispatch } = this.props;

        // Fetch friends of user
        const limit = globalConstants.TABLE_LIMIT;
        const { page, name, selectedOption } = this.state;
        let { sortOrder, sortBy } = {};
        if (selectedOption) {
            sortBy = selectedOption.sortBy;
            sortOrder = selectedOption.sortOrder;
        }
        dispatch(friendActions.getAllFriendRequests(page, limit, name, sortBy, sortOrder));
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

    onAccept = (_id) => {
        const { dispatch } = this.props;
        dispatch(friendActions.friendAccept(_id));
    }

    onDecline = (_id) => {
        const { dispatch } = this.props;
        dispatch(friendActions.unfriend(_id));
    }

    buildRow = (data) => {
        const onAccept = e => { e.stopPropagation(); this.onAccept(_id); }
        const onDecline = e => { e.stopPropagation(); this.onDecline(_id); }
        const { _id, username1, username2, userId1, userId2, userRequested, avatar1, avatar2 } = data;
        const meUser1 = userId1 === utils.getUserId();
        const username = meUser1 ? username2 : username1;
        const fromUserId = meUser1 ? userId2 : userId1;
        const avatar = meUser1 ? avatar2 : avatar1;
        const image = avatar || defaultProfileImage;
        const userUrl = fromUserId ? utils.convertUrlPath(paths.USER, { id: fromUserId }) : '';
        const button = userRequested === utils.getUserId() ?
            (<button className="ui red button" onClick={onDecline}><i className="icon ban" />Cancel Request</button>) :
            (<Fragment>
                <button className="ui blue button" onClick={onAccept}><i className="icon user plus" />Accept</button>
                <button className="ui red button" onClick={onDecline}><i className="icon user times" />Decline</button>
            </Fragment>);
        return (
            <tr key={_id} style={{ cursor: 'pointer' }} onClick={() => history.push(userUrl)}>
                <td><img src={image} alt="profile pic" className="profile-avatar" style={{ marginRight: '10px' }} /><p style={{ marginTop: '5px' }}>{username}</p></td>
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
        for (let i = 0; i < data.length; ++i) {
            let row = data[i];
            tableRows.push(this.buildRow(row));
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

        return (
            <div>
                <div className="ui container">
                    <div className="ui center aligned header">
                        <h1>Friend Requests:</h1>
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
    const { user, allRequests, alert } = state;
    return { info: user, friends: allRequests, alert };
}

const connected = connect(mapStateToProps)(FriendRequests);
export { connected as FriendRequests };
