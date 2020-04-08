import React from 'react';
import { connect } from 'react-redux';
import { blogActions } from '../../actions';
import paths from '../../constants/path.constants';
import setTitle from '../../environments/document';
import * as utils from '../../helpers/utils';
import history from '../../helpers/history';
import ErrorConnect from '../../components/pages/ErrorConnect';
import renderLoader from '../../components/interactive/Loader';
import { NotFound } from '../../components/pages/NotFound';
import { AccessDenied } from '../../components/pages/AccessDenied';
import Modal from '../../components/interactive/Modal';
import NewBlog from '../../forms/blogs/NewBlogForm';
import _ from 'lodash';

class EditBlog extends React.Component {

    openModal = {
        opened: false
    };

    componentDidMount() {
        setTitle("Edit");

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
        const { dispatch, match } = this.props;

        // Fetch users and groups of blog
        const blogId = match.params.id;

        dispatch(blogActions.getMembers(blogId));
    }

    isBlogOwner = (userId) => {
        return userId === utils.getUserId();
    }

    handleCancel = (e) => {
        e.preventDefault();
        const { blog } = this.props;
        this.redirectToViewBlog(blog._id);
    }

    redirectToViewBlog = (id) => {
        const urlx = utils.convertUrlPath(paths.BLOG, { id });
        history.push(urlx);
    }

    onSubmit = (values) => {
        // Get dispatch function from props
        let { dispatch, match } = this.props;

        // Get values from form
        let { title, content, tags, isPrivate, members, groups } = values;

        // Try to update
        if (title && content) {
            if (isPrivate) {
                if (members) {
                    members = members.map(m => m.value);
                }
                if (groups) {
                    groups = groups.map(g => g.value);
                }
            } else {
                members = [];
                groups = [];
            }
            if (tags) {
                tags = tags.map(t => t.value);
            }

            const blogId = match.params.id;
            let data = {
                name: title.trim(),
                entry: content.trim(),
                tags,
                permission: isPrivate ? 'private' : 'public',
                members,
                groups
            }
            dispatch(blogActions.updateBlog(blogId, data));
        }
    }

    showDeleteConfirm = () => {
        if (this.openModal.func) {
            const { match } = this.props;
            const blogId = match.params.id;
            this.openModal.func(blogId);
            this.openModal.opened = true;
        }
    }

    confirmDelete = (blogId) => {
        const { dispatch } = this.props;

        dispatch(blogActions.deleteBlog(blogId));
    }

    convertTags = tags => {
        return tags.map(t => { return { label: t, value: t } });
    }

    convertUsers = users => {
        return users.map(u => { return { label: u.name, value: u._id } });
    }

    convertGroups = groups => {
        return groups.map(g => { return { label: g.name, value: g._id } });
    }

    afterOpen = () => {
        this.setState({});
    }

    afterClose = () => {
        this.openModal.opened = false;
        this.setState({});
    }

    render() {
        const { deleteBlog, blog, members, forceRefresh } = this.props;
        if (deleteBlog && deleteBlog.ok) {
            history.push(paths.BLOGS);
            return null;
        }
        if (!blog || blog.loading || _.isEmpty(blog) || !members || members.loading) return renderLoader();
        if (blog.notFound) return <NotFound title="Blog not found" />;
        if (blog.accessDenied) return <AccessDenied title="Private Blog" />;
        if (blog.error) return <ErrorConnect />;

        let title = blog.name;
        let content = blog.entry;
        let tags = blog.tags;
        let permission = blog.permission;
        let owner = blog.owner._id;

        const isOwner = this.isBlogOwner(owner);
        if (!isOwner || forceRefresh) {
            this.redirectToViewBlog(blog._id);
            return null;
        }

        const { users, groups } = members;

        let initialValues = {
            title,
            content,
            tags: this.convertTags(tags),
            permission,
            members: this.convertUsers(users),
            groups: this.convertGroups(groups)
        };
        return (
            <div style={{ marginBottom: '4em', marginTop: '4em' }}>
                <div className="ui header">
                    <div className="ui center aligned header">
                        <h1>Edit - {title}
                            <button className="ui red button" style={{ marginLeft: '1em' }} onClick={this.showDeleteConfirm} > Delete Blog</button>
                        </h1>
                    </div>
                </div >
                <div className="ui container">
                    <NewBlog
                        onSubmit={this.onSubmit}
                        onCancel={this.handleCancel}
                        initialValues={initialValues}
                        disabled={this.openModal.opened}
                    />
                </div>
                <Modal
                    message="Are you sure you want to delete this blog?"
                    onConfirm={this.confirmDelete}
                    confirmLabel="Yes"
                    confirmColor="red"
                    denyLabel="No"
                    denyColor="grey"
                    openModal={this.openModal}
                    afterOpen={this.afterOpen}
                    afterClose={this.afterClose}
                />
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { update, blog, members, alert } = state;
    if (blog && blog.name) {
        setTitle(blog.name + ' Edit');
    }
    const { forceRefresh } = alert;
    return { deleteBlog: update.deleteBlog, blog, members, forceRefresh };
}

const connected = connect(mapStateToProps)(EditBlog);
export { connected as EditBlog };