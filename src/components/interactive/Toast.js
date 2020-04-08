import React from 'react';
import { connect } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Component for showing toasts
class Toast extends React.Component {

    notify = (msg) => toast.success(msg);

    notifyError = (msg) => toast.error(msg);

    render() {
        // Show error toast if error exists
        const { alert } = this.props;
        if (alert && alert.error) this.notifyError(alert.error);

        // Show message toast if message exists
        if (alert && alert.message) this.notify(alert.message);

        return <ToastContainer />;
    }
}

const mapStateToProps = (state) => {
    const { alert } = state;
    return { alert };
};

export default connect(
    mapStateToProps,
    null
)(Toast);