import React from 'react';
import { connect } from 'react-redux';
import { BlogsList } from './BlogsList';
import setTitle from '../../environments/document';

class UserBlogs extends React.Component {
    componentDidMount() {
        setTitle("Homepage");
    }

    render() {
        return <BlogsList />
    }
}

function mapStateToProps(state) {
    return {};
}

const connected = connect(mapStateToProps)(UserBlogs);
export { connected as UserBlogs };
