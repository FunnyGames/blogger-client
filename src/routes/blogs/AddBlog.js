import React from 'react';
import { blogActions } from '../../actions';
import paths from '../../constants/path.constants';
import setTitle from '../../environments/document';
import history from '../../helpers/history';
import Blog from '../../forms/blogs/BlogForm';

class AddBlog extends React.Component {
    componentDidMount() {
        setTitle("Add new post");
    }

    handleCancel = (e) => {
        e.preventDefault();
        history.push(paths.BLOGS);
    }

    onSubmit = (values) => {
        // Get dispatch function from props
        let { dispatch } = this.props;

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
            let data = {
                name: title.trim(),
                entry: content.trim(),
                tags,
                permission: isPrivate ? 'private' : 'public',
                members,
                groups
            }
            dispatch(blogActions.createBlog(data));
        }
    }

    render() {
        return (
            <div style={{ marginBottom: '4em', marginTop: '4em' }}>
                <div className="ui header">
                    <div className="ui center aligned header">
                        <h1>Add Post:</h1>
                    </div>
                </div >
                <div className="ui container">
                    <Blog onSubmit={this.onSubmit} onCancel={this.handleCancel} />
                </div>
            </div>
        );
    }
}

export { AddBlog };