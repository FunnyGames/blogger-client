import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { blogActions, commentActions, alertActions, alertRefersh } from '../../actions';
import paths from '../../constants/path.constants';
import setTitle from '../../environments/document';
import history from '../../helpers/history';
import ErrorConnect from '../../components/pages/ErrorConnect';
import renderLoader from '../../components/interactive/Loader';
import { NotFound } from '../../components/pages/NotFound';
import { AccessDenied } from '../../components/pages/AccessDenied';
import * as utils from '../../helpers/utils';
import * as timeUtils from '../../helpers/time-utils';
import Comment from '../../components/blog/Comment';
import Reaction from '../../components/blog/Reaction';
import Modal from '../../components/interactive/Modal';
import _ from 'lodash';
import CommentForm from '../../forms/blogs/CommentForm';
import globalConstants from '../../constants/global.constants';

import defaultProfileImage from '../../images/static/default-profile.png';

import '../../css/search.css';

class ViewBlog extends React.Component {
    state = {
        addComment: false,
        openCommendId: null,
    };

    openModal = {};

    componentDidMount() {
        setTitle("Blog");

        // Fetch blog and the users
        this.reloadData();
    }

    componentDidUpdate() {
        const { blog } = this.props;
        if (blog && blog._id) {
            const urlId = this.getBlogId();
            if (blog._id !== urlId) {
                this.reloadData();
            }
        }
    }

    getBlogId = () => {
        return this.props.match.params.id;
    }

    reloadData = () => {
        this.fetchBlog();
        this.fetchBlogUsers();
        this.fetchBlogComments(true);
    }

    fetchBlog() {
        // Get dispatch function from props
        const { dispatch } = this.props;

        // Fetch group info
        const blogId = this.getBlogId();

        dispatch(blogActions.getBlog(blogId));
    }

    fetchBlogUsers() {
        // Get dispatch function from props
        const { dispatch, loggedIn } = this.props;

        if (!loggedIn) return;

        // Fetch users and groups of blog
        const blogId = this.getBlogId();

        dispatch(blogActions.getMembers(blogId));
    }

    fetchBlogComments(clear) {
        if (clear) {
            this.props.dispatch(commentActions.clear());
        }
        // Get dispatch function from props
        const { dispatch, comments } = this.props;

        // Fetch users and groups of blog
        const blogId = this.getBlogId();

        const limit = globalConstants.COMMENT_ROWS_LIMIT;
        let seenIds = undefined;
        if (comments && comments.data && !clear) {
            seenIds = comments.data.map(c => c._id);
        }
        dispatch(commentActions.getComments(blogId, limit, seenIds));
    }

    isBlogOwner = (userId) => {
        return userId === utils.getUserId();
    }

    showDeleteConfirm = () => {
        if (this.openModal.func) {
            const blogId = this.getBlogId();
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
        let title = tag => '#' + tag;
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

    addReply = () => {
        const addComment = !this.state.addComment;
        const openCommendId = addComment ? '0' : null;
        this.setState({ addComment, openCommendId });
    }

    onAddReply = (values) => {
        const { dispatch } = this.props;
        const blogId = this.getBlogId();
        dispatch(commentActions.createComment(blogId, values));
        this.setState({ addComment: false, openCommendId: null });
    }

    updateEditComment = (openCommendId) => {
        this.setState({ openCommendId, addComment: false });
    }

    buildComments = (comments, metadata) => {
        const list = [];
        if (!comments || comments.loading) return renderLoader();
        if (comments && comments.length > 0) {
            const decodeId = utils.getUserId();
            const len = comments.length;
            for (let i = 0; i < len; ++i) {
                const c = comments[i];
                const { _id, user, content, lastUpdate, createDate } = c;
                const userId = user._id;
                const toLink = utils.convertUrlPath(paths.USER, { id: userId });
                const dateTooltip = timeUtils.formatBlogDateTime(createDate);
                const owner = userId === decodeId;
                const { openCommendId } = this.state;
                const item = (
                    <Comment
                        key={_id}
                        openId={openCommendId}
                        dispatch={this.props.dispatch}
                        commentId={_id}
                        username={user.username}
                        avatar={user.avatar}
                        content={content}
                        toLink={toLink}
                        dateTooltip={dateTooltip}
                        owner={owner}
                        lastUpdate={lastUpdate}
                        createDate={createDate}
                        updateEditComment={this.updateEditComment}
                    />);
                list.push(item);
            }
            if (metadata && metadata.total) {
                if (metadata.total > globalConstants.COMMENT_ROWS_LIMIT) {
                    const loadMore = (<div key="loadMore"><p style={{ cursor: 'pointer', color: 'blue' }} onClick={() => this.fetchBlogComments()}>Load More...</p></div>);
                    list.push(loadMore);
                }
            }
        } else {
            return (<div>No comments. Be the first one to comment!</div>);
        }
        return list;
    }

    render() {
        const { deleteBlog, blog, members, comments, alert } = this.props;
        const { addComment } = this.state;
        if (deleteBlog && deleteBlog.ok) {
            history.push(paths.BLOGS);
            return null;
        }
        if (!blog || blog.loading || _.isEmpty(blog)) return renderLoader();
        if (blog.notFound) return <NotFound title="Blog not found" />;
        if (blog.accessDenied) return <AccessDenied title="Private Blog" />;
        if (blog.error) return <ErrorConnect />;

        if (alertRefersh.isIn(alert, [alertRefersh.DELETE_COMMENT, alertRefersh.CREATE_COMMENT, alertRefersh.UPDATE_COMMENT])) {
            this.fetchBlogComments(true);
            const { dispatch } = this.props;
            dispatch(alertActions.clear());
        }

        const loggedIn = utils.getUserId();
        const blogId = this.getBlogId();

        let title = blog.name;
        let text = blog.entry;
        let content = text ? text.split('\n').map((item, i) => {
            return <p key={i}>{item}</p>;
        }) : '';
        let owner = blog.owner._id;
        let ownerName = blog.owner.username;
        let avatar = blog.owner.avatar;
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

        const commentList = this.buildComments(comments.data, comments.metadata);
        const numberOfComments = comments && comments.metadata ? comments.metadata.overall : '-';
        const addCommentButton = loggedIn ? this.addReply : null;
        const image = avatar || defaultProfileImage;

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
                        <p>Tags: <i>{tags}</i></p>
                        <p>By:<br />
                            <Link to={ownerUrl}>
                                <img src={image} alt="profile pic" className="profile-avatar" style={{ marginRight: '10px' }} />
                                <p style={{ marginTop: '5px' }}>{ownerName}</p>
                            </Link>
                        </p>
                        {blog.permission === 'private' ?
                            <div style={{ fontSize: '1em' }}>
                                Users with access: {userList}<br />
                                Groups with access: {groupList}
                            </div>
                            : null
                        }
                    </div>
                    <div className="ui segment">
                        <Reaction loggedIn={loggedIn} blogId={blogId} />
                        <div className="ui left labeled button" tabIndex="0">
                            <p className="ui basic right pointing label">
                                {numberOfComments}
                            </p>
                            <div className="ui blue button" onClick={addCommentButton}>
                                <i className="comment icon"></i> Comment
                            </div>
                        </div>
                    </div>
                    {addComment ?
                        <div className="ui segment">
                            <CommentForm saveMessage="Add Reply" onSubmit={this.onAddReply} />
                        </div>
                        : null}
                    <div className="ui segment">
                        <div className="ui comments" style={{ maxWidth: '100%' }}>
                            <h3 className="ui dividing header">Comments</h3>
                            {commentList}
                        </div>
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
    const { update, blog, members, user, comments, alert } = state;
    if (blog && blog.name) {
        setTitle(blog.name);
    }
    return { deleteBlog: update.deleteBlog, blog, members, loggedIn: user.loggedIn, comments, alert };
}

const connected = connect(mapStateToProps)(ViewBlog);
export { connected as ViewBlog };
