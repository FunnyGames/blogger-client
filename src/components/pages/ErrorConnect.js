import React from 'react';

function refreshPage() {
    window.location.reload(false);
}

// Component for "No internet connection" or "Server is down"
const ErrorConnect = () => {
    return (
        <div className="ui container" style={{ padding: '5em' }}>
            <center>
                <h1 className="ui icon header">
                    <i className="exclamation triangle icon"></i>
                    <div className="content">
                        Server unreachable
                    <div className="sub header">There was an error connecting to the server.</div>
                        <div className="sub header">Make sure you have internet connection.</div>
                        <div className="sub header">If connection exists, then our servers are probably down.</div>
                        <div className="sub header">Please try again later.</div>
                        <p></p>
                        <div className="sub header">Try to <u className="item" style={{ color: 'blue', cursor: 'pointer' }} onClick={refreshPage}>refresh</u>.</div>
                    </div>
                </h1>
            </center>
        </div>
    );
};

export default ErrorConnect;