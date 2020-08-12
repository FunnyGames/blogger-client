import React from 'react';
import { connect } from 'react-redux';
import { chatActions } from '../../../actions';
import setTitle from '../../../environments/document';
import ErrorConnect from '../../../components/pages/ErrorConnect';
import Table from '../../../components/interactive/Table';
import * as utils from '../../../helpers/utils';
import paths from '../../../constants/path.constants';
import history from '../../../helpers/history';

import defaultProfileImage from '../../../images/static/default-profile.png';

import '../../../css/profile.css';

class BlockedUsers extends React.Component {

    componentDidMount() {
        setTitle('Blocked Users');
        this.fetchBlockedUsers();
    }

    fetchBlockedUsers = () => {
        // Get dispatch function from props
        const { dispatch } = this.props;

        dispatch(chatActions.getBlockedUsers());
    }

    unblockUser = (id) => {
        // Get dispatch function from props
        const { dispatch } = this.props;

        dispatch(chatActions.unblockUser(id));
    }

    buildRow(id, title, userId, avatar) {
        let button = <button className="ui button" onClick={e => { e.stopPropagation(); this.unblockUser(id); }}>Unblock</button>;
        let path = utils.convertUrlPath(paths.USER, { id: userId });
        let image = avatar || defaultProfileImage;
        return (
            <tr key={id} style={{ cursor: 'pointer' }} onClick={() => history.push(path)}>
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
        const myUserId = utils.getUserId();
        for (let i = 0; i < data.length; ++i) {
            let row = data[i];
            let username, userId, avatar;
            if (row.userId1._id === myUserId) {
                username = row.username2;
                userId = row.userId2._id;
                avatar = row.userId2.avatar;
            } else {
                username = row.username1;
                userId = row.userId1._id;
                avatar = row.userId1.avatar;
            }
            tableRows.push(this.buildRow(row._id, username, userId, avatar));
        }
        return tableRows;
    }

    render() {
        const { info, blocked } = this.props;
        if (info.error) return <ErrorConnect />;

        let tableRows = this.createTableRows(blocked.blocked);
        let totalRows = blocked.blocked ? blocked.blocked.length : 0;
        let loadingTable = blocked.loading;

        return (
            <div>
                <div className="ui center aligned header">
                    <h1>Blocked users:</h1>
                </div>
                <p></p>
                {blocked.error ?
                    <center>Error loading</center>
                    : <Table
                        loading={loadingTable}
                        tableRows={tableRows}
                        totalRows={totalRows}
                        disableSearch={true}
                    />
                }
            </div >
        );
    }
}

function mapStateToProps(state) {
    const { user, blocked } = state;
    return { info: user, blocked };
}

const connected = connect(mapStateToProps)(BlockedUsers);
export { connected as BlockedUsers };
