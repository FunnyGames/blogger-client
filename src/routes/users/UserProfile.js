import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Table from '../../components/interactive/Table';
import { userActions } from '../../actions';
import paths from '../../constants/path.constants';
import setTitle from '../../environments/document';
import ErrorConnect from '../../components/pages/ErrorConnect';
import renderLoader from '../../components/interactive/Loader';
import { NotFound } from '../../components/pages/NotFound';
import * as utils from '../../helpers/utils';
import history from '../../helpers/history';
import globalConstants from '../../constants/global.constants';
import { groupOptions } from '../../constants/table.options';

import '../../css/profile.css';


class UserProfile extends React.Component {
    state = {
        name: undefined,
        page: 1,
        selectedOption: null
    };

    openModal = {};

    componentDidMount() {
        setTitle("Loading Profile");

        // Fetch user profile
        const { match } = this.props;
        const userId = match.params.id;
        const myId = utils.getUserId();

        // Don't fetch if user is loading their profile
        if (userId === myId) {
            history.push(paths.PROFILE);
            return;
        }

        this.fetchUser();
        this.fetchUserGroups();
    }

    fetchUser() {
        // Get dispatch function from props
        const { dispatch } = this.props;

        // Fetch user profile
        const { match } = this.props;
        const userId = match.params.id;

        dispatch(userActions.getUserProfile(userId));
    }

    fetchUserGroups() {
        // Get dispatch function from props
        const { dispatch, match } = this.props;

        // Fetch groups of user
        const userId = match.params.id;
        const limit = globalConstants.TABLE_LIMIT;
        const { page, name, selectedOption } = this.state;
        let { sortOrder, sortBy } = {};
        if (selectedOption) {
            sortBy = selectedOption.sortBy;
            sortOrder = selectedOption.sortOrder;
        }
        dispatch(userActions.getUserGroups(userId, page, limit, name, sortBy, sortOrder));
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
        const { profile, groups } = this.props;
        if (!profile || profile.loading) return renderLoader();
        if (profile.notFound) return <NotFound title="User not found" />;
        if (profile.error) return <ErrorConnect />;

        const username = profile.username;
        const firstName = profile.firstName;
        const lastName = profile.lastName;

        let tableRows = this.createTableRows(groups.data);
        let totalRows = groups.metadata ? groups.metadata.total : 0;
        let loadingTable = groups.loading;

        const { match } = this.props;
        const userId = match.params.id;
        let userBlogsLink = utils.convertUrlPath(paths.USER_BLOGS, { id: userId });
        return (
            <div style={{ marginBottom: '4em', marginTop: '4em' }}>
                <div className="ui header">
                    <div className="ui center aligned header">
                        <h1>{username}`s Profile:</h1>
                    </div>
                </div>
                <div className="ui container">
                    <Link className="ui blue right floated button" to={userBlogsLink} >View Blogs</Link>
                    <div className="six wide column">
                        <div>First name: {firstName}</div>
                        <div>Last name: {lastName}</div>
                    </div>
                    <p></p>
                    <div className="">Groups:</div>
                    {groups.error ?
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
            </div >
        );
    }
}

function mapStateToProps(state) {
    const { userGroups, profile } = state;
    if (profile && profile.username) {
        setTitle(profile.username + "`s Profile");
    }
    return { groups: userGroups, profile };
}

const connected = connect(mapStateToProps)(UserProfile);
export { connected as UserProfile };
