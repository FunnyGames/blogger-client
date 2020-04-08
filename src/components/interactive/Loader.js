import React from 'react';

// Component for showing loader while page loads
const renderLoader = () => {
    return (
        <div className="ui segment" style={{ minHeight: '150px' }}>
            <div className="ui active inverted dimmer">
                <div className="ui large text loader">Loading...</div>
            </div>
            <p></p>
        </div>
    );
}

export default renderLoader;