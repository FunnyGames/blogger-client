import React from 'react';
import { connect } from 'react-redux';
import { userActions } from '../../actions';

// Component for logout in case of expired token
class ForceLogout extends React.Component {

    logout = () => {
        const { dispatch } = this.props;
        dispatch(userActions.logout('Token has expired, please login again'));
    }

    render() {
        const { alert } = this.props;
        if (alert && alert.forceLogout) this.logout();

        return null;
    }
}

const mapStateToProps = (state) => {
    const { alert } = state;
    return { alert };
};

export default connect(
    mapStateToProps,
    null
)(ForceLogout);