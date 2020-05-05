import React from 'react';
import { connect } from 'react-redux';
import { ToastContainer, toast, Slide } from 'react-toastify';
import history from '../../helpers/history';

import 'react-toastify/dist/ReactToastify.css';
import '../../css/notification.css';

const toastNotificationOptions = {
    bodyClassName: 'notification-toast-body',
    progressClassName: 'notification-toast-progress',
}

// Component for showing toasts
class Toast extends React.Component {
    notify = (msg) => toast.success(msg);

    notifyError = (msg) => toast.error(msg);

    showNotification = (data) => {
        if (!data || !data.action) return;
        const { text, toLink, msgType } = data.action;
        const msg = (
            <div onClick={() => history.push(toLink)}>
                <div className="notification-header" allowclose="true">{msgType}</div>
                {text}
            </div>
        );
        toast(msg, toastNotificationOptions);
    }

    render() {
        const { alert } = this.props;

        if (alert) {
            // Show error toast if error exists
            if (alert.error) this.notifyError(alert.error);

            // Show message toast if message exists
            if (alert.message) this.notify(alert.message);

            // Show notification
            if (alert.notification) this.showNotification(alert.notification);
        }

        return <ToastContainer transition={Slide} />;
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