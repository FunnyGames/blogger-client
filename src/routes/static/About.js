import React from 'react';

class About extends React.Component {
    render() {
        return (
            <div className="ui container" style={{ marginTop: '4em', marginBottom: '4em' }}>
                <h1 className="ui center aligned header">
                    About
                </h1>
                <div className="ui segment">
                    <p>Write your life stories here.</p>
                    <p>You can create public blogs, so you can share them with everyone.</p>
                    <p>You can also create private blogs for you only or for your friends.</p>
                    <p></p>
                    <p>Have something in common with few friends? Add them to a group and share your blogs with them.</p>
                    <p></p>
                    <p>Discover people's life stories now!</p>
                </div>
            </div>
        );
    }
}

export { About };
