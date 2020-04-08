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
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }
};

// Component for showing messages over the screen
class Modal extends React.Component {
    state = {
        showModal: false,
        info: null
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

    onConfirm = confirm => {
        if (confirm) confirm(this.state.info);
        this.closeModal();
    }

    onDeny = deny => {
        if (deny) deny();
        this.closeModal();
    }

    render() {
        const { showModal } = this.state;
        const { message, details, confirmColor, confirmLabel, denyColor, denyLabel, openModal, onConfirm, onDeny } = this.props;

        if (openModal) openModal.func = this.openModal;

        const conColor = confirmColor || 'green';
        const denColor = denyColor || 'red';
        const conBtnClass = `ui right floated ${conColor} button`;
        const denBtnClass = `ui right floated ${denColor} button`;

        const detailsDiv = details ? (<div className="ui">{details}</div>) : null;
        const btnConfirm = confirmLabel ? (<button className={conBtnClass} onClick={e => this.onConfirm(onConfirm)}>{confirmLabel}</button>) : null;
        const btnDeny = denyLabel ? (<button className={denBtnClass} onClick={e => this.onDeny(onDeny)}>{denyLabel}</button>) : null;

        return (
            <ReactModal
                isOpen={showModal}
                contentLabel="Modal"
                onRequestClose={this.closeModal}
                onAfterOpen={this.afterOpenModal}
                onAfterClose={this.afterCloseModal}
                style={customStyles}
            >
                <button className="ui black button" onClick={this.closeModal}>x</button>
                <h2>{message}</h2>
                {detailsDiv}
                <div className="ui basic segment"></div>
                {btnConfirm}
                {btnDeny}
            </ReactModal>
        );
    }
}

export default Modal;