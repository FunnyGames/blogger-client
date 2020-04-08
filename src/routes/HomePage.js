import React from 'react';
import { connect } from 'react-redux';
import { BlogsList } from './blogs/BlogsList';
import setTitle from '../environments/document';

class HomePage extends React.Component {
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

const connected = connect(mapStateToProps)(HomePage);
export { connected as HomePage };
