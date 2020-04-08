import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { blogActions } from '../../actions';
import * as timeUtils from '../../helpers/time-utils';
import paths from '../../constants/path.constants';
import setTitle from '../../environments/document';
import history from '../../helpers/history';
import ErrorConnect from '../../components/pages/ErrorConnect';
import renderLoader from '../../components/interactive/Loader';
import { NotFound } from '../../components/pages/NotFound';
import { AccessDenied } from '../../components/pages/AccessDenied';
import * as utils from '../../helpers/utils';
import Modal from '../../components/interactive/Modal';
import _ from 'lodash';

import '../../css/search.css';

class ViewBlog extends React.Component {

    openModal = {};

    componentDidMount() {
        setTitle("Blog");

        // Fetch blog and the users
        this.fetchBlog();
        this.fetchBlogUsers();
    }

    fetchBlog() {
        // Get dispatch function from props
        const { dispatch } = this.props;

        // Fetch group info
        const { match } = this.props;
        const blogId = match.params.id;

        dispatch(blogActions.getBlog(blogId));
    }

    fetchBlogUsers() {
        // Get dispatch function from props
        const { dispatch, match, loggedIn } = this.props;

        if (!loggedIn) return;

        // Fetch users and groups of blog
        const blogId = match.params.id;

        dispatch(blogActions.getMembers(blogId));
    }

    isBlogOwner = (userId) => {
        return userId === utils.getUserId();
    }

    showDeleteConfirm = () => {
        if (this.openModal.func) {
            const { match } = this.props;
            const blogId = match.params.id;
            this.openModal.func(blogId);
        }
    }

    confirmDelete = (blogId) => {
        const { dispatch } = this.props;

        dispatch(blogActions.deleteBlog(blogId));
    }

    buildList = (data, linkTo, title) => {
        const list = [];
        if (data && data.length > 0) {
            const len = data.length;
            for (let i = 0; i < len; ++i) {
                const t = data[i];
                const toLink = linkTo(t);
                const seperator = ((i + 1) === len) ? '' : ', ';
                const key = title(t);
                const item = (<i key={"tag-" + key}><Link to={toLink}>{key}</Link>{seperator}</i>);
                list.push(item);
            }
        }
        return list;
    }

    buildTags = (tags) => {
        let linkTo = tag => paths.HOMEPAGE + '?tags=' + tag;
        let title = tag => tag;
        return this.buildList(tags, linkTo, title);
    }

    buildUsers = (users) => {
        let linkTo = user => utils.convertUrlPath(paths.USER, { id: user._id });
        let title = user => user && user.owner ? user.name + ' (owner)' : user.name;
        return this.buildList(users, linkTo, title);
    }

    buildGroups = (groups) => {
        let linkTo = group => utils.convertUrlPath(paths.GROUP, { id: group._id });
        let title = group => group.name;
        return this.buildList(groups, linkTo, title);
    }

    render() {
        const { deleteBlog, blog, members } = this.props;
        if (deleteBlog && deleteBlog.ok) {
            history.push(paths.BLOGS);
            return null;
        }
        if (!blog || blog.loading || _.isEmpty(blog)) return renderLoader();
        if (blog.notFound) return <NotFound title="Blog not found" />;
        if (blog.accessDenied) return <AccessDenied title="Private Blog" />;
        if (blog.error) return <ErrorConnect />;

        let title = blog.name;
        let text = blog.entry;
        let content = text ? text.split('\n').map((item, i) => {
            return <p key={i}>{item}</p>;
        }) : '';
        let owner = blog.owner._id;
        let ownerName = blog.owner.username;
        let createDate = blog.createDate;
        let tags = this.buildTags(blog.tags);

        const ownerUrl = owner ? utils.convertUrlPath(paths.USER, { id: owner }) : '';

        const isOwner = this.isBlogOwner(owner);

        const editLink = utils.convertUrlPath(paths.BLOG_EDIT, { id: blog._id });
        const editDeleteButton = isOwner ?
            (
                <div className="ui basic clearing segment">
                    <button className="ui right floated red button" onClick={this.showDeleteConfirm} > Delete Blog</button>
                    <Link className="ui right floated blue button" to={editLink} >Edit Blog</Link>
                </div >
            ) : null;

        const dateTooltip = timeUtils.formatBlogDateTime(createDate);

        const { users, groups } = members;
        const userList = this.buildUsers(users);
        const groupList = this.buildGroups(groups);

        return (
            <div style={{ marginBottom: '4em', marginTop: '4em' }}>
                <div className="ui header">
                    <div className="ui center aligned header">
                        <h1>
                            {title}
                        </h1>
                    </div>
                </div >
                <div className="ui container">
                    {editDeleteButton}
                    <div className="ui segment">
                        {content}
                        <div className="ui divider"></div>
                        <p style={{ float: 'right' }}><i data-tooltip={dateTooltip} data-position="bottom center">{timeUtils.formatBlogDate(createDate)}</i></p>
                        <p>By: <Link to={ownerUrl}>{ownerName}</Link></p>
                        <p>Tags: <i>{tags}</i></p>
                        {blog.permission === 'private' ?
                            <div style={{ fontSize: '1em' }}>
                                Users with access: {userList}<br />
                                Groups with access: {groupList}
                            </div>
                            : null
                        }
                    </div>
                </div>
                <Modal
                    message="Are you sure you want to delete this blog?"
                    onConfirm={this.confirmDelete}
                    confirmLabel="Yes"
                    confirmColor="red"
                    denyLabel="No"
                    denyColor="grey"
                    openModal={this.openModal}
                />
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { update, blog, members, user } = state;
    if (blog && blog.name) {
        setTitle(blog.name);
    }
    return { deleteBlog: update.deleteBlog, blog, members, loggedIn: user.loggedIn };
}

const connected = connect(mapStateToProps)(ViewBlog);
export { connected as ViewBlog };
