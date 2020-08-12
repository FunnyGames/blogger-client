import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import Table from '../../../components/interactive/Table';
import { blogActions, alertActions } from '../../../actions';
import history from '../../../helpers/history';
import globalConstants from '../../../constants/global.constants';
import * as utils from '../../../helpers/utils';
import * as timeUtils from '../../../helpers/time-utils';
import paths from '../../../constants/path.constants';
import { blogOptions } from '../../../constants/table.options';
import Modal from '../../../components/interactive/Modal';

class ProfileBlogs extends React.Component {
    state = {
        name: undefined,
        page: 1,
        selectedOption: null
    };

    openModal = {};

    componentDidMount() {
        let params = utils.getUrlParams();
        let tags = params.get('tags');
        let name = tags ? '#' + tags : undefined;
        this.setState({ name }, this.fetchBlogs);
    }

    fetchBlogs() {
        // Get dispatch function from props
        const { dispatch } = this.props;

        // Fetch blogs
        const limit = globalConstants.TABLE_LIMIT;
        const { page, name, selectedOption } = this.state;
        let { sortOrder, sortBy } = {};
        if (selectedOption) {
            sortBy = selectedOption.sortBy;
            sortOrder = selectedOption.sortOrder;
        }

        const query = {
            blogs: 'my'
        }
        dispatch(blogActions.getBlogs(page, limit, name, sortBy, sortOrder, query));
    }

    showDeleteConfirm = (blogId) => {
        if (this.openModal.func) {
            this.openModal.func(blogId);
        }
    }

    confirmDelete = (blogId) => {
        const { dispatch } = this.props;
        dispatch(blogActions.deleteBlog(blogId));
    }

    onSearch = (name) => {
        if (!name) name = undefined;
        this.setState({ name }, this.fetchBlogs);
    }

    onPageChange = (page) => {
        this.setState({ page }, this.fetchBlogs);
    }

    handleSelectChange = selectedOption => {
        this.setState({ selectedOption }, this.fetchBlogs);
    };

    buildRow(id, title, username, createDate, userId) {
        const blogUrl = utils.convertUrlPath(paths.BLOG, { id });
        const userUrl = userId ? utils.convertUrlPath(paths.USER, { id: userId }) : '';
        return (
            <tr key={id} style={{ cursor: 'pointer' }} onClick={() => history.push(blogUrl)}>
                <td>{title}
                    <br />
                    <div className="text" style={{ width: 'fit-content' }} onClick={e => { e.stopPropagation(); history.push(userUrl); }}>By: {username}</div>
                    <div style={{ width: '100%' }}></div>
                </td>
                <td style={{ textAlign: 'right' }}><i>{createDate}</i></td>
                {this.isOwner(userId) ?
                    <td style={{ textAlign: 'right', width: '1%' }}>
                        <button className="ui red button" onClick={e => { e.stopPropagation(); this.showDeleteConfirm(id); }}>Delete</button>
                    </td>
                    : <td />}
            </tr>
        );
    }

    noDataTableRows = () => {
        return (<tr key="no-data"><td style={{ textAlign: 'center' }}>No Data</td></tr>);
    }

    createTableRows = (data) => {
        if (!data || data.length === 0) return [this.noDataTableRows()];
        const tableRows = [];
        for (let i = 0; i < data.length; ++i) {
            const row = data[i];
            if (!row) continue;
            let user = row.user;
            if (!user) {
                user = {
                    username: 'Deleted user',
                    _id: null
                }
            }
            let username = user.username;
            let userId = user._id;
            let createDate = timeUtils.formatBlogDate(row.createDate);
            tableRows.push(this.buildRow(row._id, row.name, username, createDate, userId));
        }
        return tableRows;
    }

    isOwner = (userId) => {
        return userId === utils.getUserId();
    }

    render() {
        let { blogs, forceRefresh } = this.props;
        if (forceRefresh) {
            this.fetchBlogs();
            const { dispatch } = this.props;
            dispatch(alertActions.clear());
        }

        const tableRows = this.createTableRows(blogs.data);
        const totalRows = blogs.metadata ? blogs.metadata.total : 0;
        const loadingTable = blogs.loading;

        const tags = utils.getUrlParams().get('tags');
        const initialInput = tags ? '#' + tags : undefined;
        return (
            <Fragment>
                {blogs && blogs.error ?
                    <center>Error loading</center>
                    : <Table
                        loading={loadingTable}
                        tableRows={tableRows}
                        totalRows={totalRows}
                        onPageChange={this.onPageChange}
                        onSelectChange={this.handleSelectChange}
                        onSearch={this.onSearch}
                        options={blogOptions}
                        searchPlaceHolder={"Search blogs..."}
                        initialInput={initialInput}
                    />
                }
                <Modal
                    message="Are you sure you want to delete this blog?"
                    onConfirm={this.confirmDelete}
                    confirmLabel="Yes"
                    confirmColor="red"
                    denyLabel="No"
                    denyColor="grey"
                    openModal={this.openModal}
                />
            </Fragment>
        );
    }
}

function mapStateToProps(state) {
    let { user, blogs, profile, alert } = state;
    const { forceRefresh } = alert;
    return { user, blogs, profile, forceRefresh };
}

const connected = connect(mapStateToProps)(ProfileBlogs);
export { connected as ProfileBlogs };