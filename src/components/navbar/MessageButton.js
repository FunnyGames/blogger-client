import React from 'react';
import { connect } from 'react-redux';
import { chatActions } from '../../actions';
import history from '../../helpers/history';
import paths from '../../constants/path.constants';

import '../../css/navbar.css';

class MessageButton extends React.Component {
    componentDidMount() {
        const { dispatch } = this.props;

        dispatch(chatActions.getTotalMessages());
    }

    onMessagesClick = (e) => {
        history.push(paths.CHAT);
    }

    render() {
        const { totalMessages } = this.props;
        let numberOfMessages = 0;
        if (totalMessages && totalMessages.count) numberOfMessages = totalMessages.count.length;
        return (
            <div className="navbar-icon" onClick={this.onMessagesClick}>
                <div className="notification">
                    <i style={{ color: 'white' }} className="large icon mail"></i>
                    {numberOfMessages > 0 ? <span className="badge">{numberOfMessages}</span> : null}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const { totalMessages } = state;
    return { totalMessages };
};

export default connect(
    mapStateToProps,
    null
)(MessageButton);