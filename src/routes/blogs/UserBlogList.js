import React from 'react';
import { connect } from 'react-redux';
import { BlogsList } from '../users/profile/Blogs';

class UserBlogs extends React.Component {
    render() {
        return <BlogsList />
    }
}

function mapStateToProps(state) {
    return {};
}

const connected = connect(mapStateToProps)(UserBlogs);
export { connected as UserBlogs };
