import React from 'react';
import ReactModal from 'react-modal';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    },
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000
    }
};

// Component for showing messages over the screen
class BasicModal extends React.Component {
    state = {
        showModal: false
    }

    openModal = (info) => {
        this.setState({ showModal: true, info });
    }

    closeModal = () => {
        this.setState({ showModal: false });
    }

    afterOpenModal = () => {
        const { afterOpen } = this.props;
        if (afterOpen) {
            afterOpen();
        }
    }

    afterCloseModal = () => {
        const { afterClose } = this.props;
        if (afterClose) {
            afterClose();
        }
    }

    render() {
        const { showModal } = this.state;
        const { children, openModal } = this.props;

        if (openModal) openModal.func = this.openModal;

        return (
            <ReactModal
                isOpen={showModal}
                contentLabel="Modal"
                onRequestClose={this.closeModal}
                onAfterOpen={this.afterOpenModal}
                onAfterClose={this.afterCloseModal}
                style={customStyles}
            >
                {children}
            </ReactModal>
        );
    }
}

export default BasicModal;