import React from 'react';
import { connect } from 'react-redux';

import '../../css/navbar.css';

class MessageButton extends React.Component {
    render() {
        const { messages } = this.props;
        const numberOfMessages = messages.data.length;
        return (
            <div className="navbar-icon">
                <div className="notification">
                    <i style={{ color: 'white' }} className="large icon mail"></i>
                    {numberOfMessages > 0 ? <span className="badge">{numberOfMessages}</span> : null}
                </div>
            </div>
        )
    }
}

const mapStateToProps = () => {
    let messages = { data: [] };
    return { messages };
};

export default connect(
    mapStateToProps,
    null
)(MessageButton);