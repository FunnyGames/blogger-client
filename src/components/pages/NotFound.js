import React from 'react';
import { Link } from 'react-router-dom';
import setTitle from '../../environments/document';
import paths from '../../constants/path.constants';

const NotFound = (props) => {
    let title = props.title || 'Not Found';
    setTitle(title);

    return (
        <div className="ui container" style={{ padding: '5em' }}>
            <center>
                <h1 className="ui icon header">
                    <i className="compass outline icon"></i>
                    <div className="content">
                        404 - {title}
                        <div className="sub header">The page was not found.</div>
                        <div className="sub header">Make sure you have typed the address correctly.</div>
                        <p></p>
                        <div className="sub header">Go to <Link className="item" style={{ color: 'blue', cursor: 'pointer' }} to={paths.HOMEPAGE}>Homepage</Link>.</div>
                    </div>
                </h1>
            </center>
        </div>
    );
};

export { NotFound };