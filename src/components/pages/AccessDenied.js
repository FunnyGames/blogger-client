import React from 'react';
import { Link } from 'react-router-dom';
import setTitle from '../../environments/document';
import paths from '../../constants/path.constants';

const AccessDenied = (props) => {
    let title = props.title || 'Access denied';
    setTitle(title);

    return (
        <div className="ui container" style={{ padding: '5em' }}>
            <center>
                <h1 className="ui icon header">
                    <i className="lock icon"></i>
                    <div className="content">
                        403 - {title}
                        <div className="sub header">You are not allowed to view this page content.</div>
                        <p></p>
                        <div className="sub header">Go to <Link className="item" style={{ color: 'blue', cursor: 'pointer' }} to={paths.HOMEPAGE}>Homepage</Link>.</div>
                    </div>
                </h1>
            </center>
        </div>
    );
};

export { AccessDenied };