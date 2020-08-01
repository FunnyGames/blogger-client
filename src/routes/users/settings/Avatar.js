import React, { Component, Fragment } from 'react';
import defaultProfileImage from '../../../images/static/default-profile.png';
import ReactAvatarEditor from 'react-avatar-editor';

import '../../../css/avatar.css';

const defaultEditorValues = {
    position: { x: 0.5, y: 0.5 },
    scale: 1,
    rotate: 0,
    borderRadius: 50,
    width: 350,
    height: 350,
};

class Avatar extends Component {
    state = {
        uploading: false,
        processing: false,
        edit: false,
        changed: false,
        ...defaultEditorValues
    }

    componentDidMount() {
        const image = this.getDefaultImage();
        this.setState({ image });
    }

    componentDidUpdate() {
        const { uploading, processing } = this.state;
        const { percentage, avatarUpdated } = this.props;
        if (uploading) {
            if (percentage === 1) {
                this.setState({ uploading: false, processing: true });
            }
        }
        if (avatarUpdated && processing) {
            this.setState({ ...defaultProfileImage, changed: false, edit: false, uploading: false, processing: false });
        }
    }

    getDefaultImage = () => {
        return this.props.src || defaultProfileImage;
    }

    handleNewImage = e => {
        let file = e.target.files[0];
        if (file && file.size > 5 * 1024 * 1024) {
            alert('File is too big!');
            return;
        }
        this.setState({ image: file, changed: true });
    }

    handleScale = e => {
        const scale = parseFloat(e.target.value)
        this.setState({ scale, changed: true });
    }

    handlePositionChange = position => {
        this.setState({ position, changed: true });
    }

    isDefaultImage = () => {
        return this.state.image === defaultProfileImage;
    }

    saveImageHandle = () => {
        if (this.isDefaultImage() || !this.state.changed || this.state.uploading) {
            return;
        }
        if (this.editor) {
            const canvasScaled = this.editor.getImage();
            const image = canvasScaled.toDataURL("image/png");
            this.props.onSaveImage(image);
            this.setState({ uploading: true, processing: false });
        }
    }

    deleteImageHandle = () => {
        if (!this.props.src) return;
        this.props.onDeleteImage(this.props.src);
    }

    toggleEdit = () => {
        if (this.state.uploading) return;
        this.setState({ edit: !this.state.edit, ...defaultEditorValues, changed: false, image: this.getDefaultImage() })
    }

    getEditButton = () => {
        const deleteImage = !this.state.edit && this.props.src ? <i className={`clickable big trash alternate red icon`} onClick={this.deleteImageHandle} /> : null;
        const edit = <i className="clickable big edit outline icon" onClick={this.toggleEdit} />;

        const saveColor = this.state.changed ? 'green' : 'gray';
        const saveClickable = this.state.changed ? 'clickable' : '';

        const saveImage = this.state.edit ? <i className={`${saveClickable} big check circle outline ${saveColor} icon`} onClick={this.saveImageHandle} /> : null;
        return (
            <div style={{ display: 'flex', marginTop: '4px' }}>
                {edit}
                {saveImage}
                {deleteImage}
            </div>
        );
    }

    getEditorButtons = () => {
        return (
            <div>
                Select File:
                <input name="newImage" type="file" onChange={this.handleNewImage} />
                <br />
                Zoom:
                <input
                    name="scale"
                    type="range"
                    onChange={this.handleScale}
                    min="1"
                    max="2"
                    step="0.01"
                    defaultValue="1"
                    disabled={this.isDefaultImage()}
                />
            </div>
        );
    }

    setEditorRef = (editor) => this.editor = editor

    render() {
        const { percentage } = this.props;
        const editButton = this.getEditButton();
        const editorButtons = this.getEditorButtons();
        const image = this.props.src || defaultProfileImage;
        return (
            <Fragment>
                {this.state.edit ?
                    <div>
                        {this.state.uploading ? <div>Uploading Image - {percentage * 100}%</div> : null}
                        {this.state.processing ? <div>Processing Image...</div> : null}
                        <ReactAvatarEditor
                            ref={this.setEditorRef}
                            scale={parseFloat(this.state.scale)}
                            width={this.state.width}
                            height={this.state.height}
                            position={this.state.position}
                            onPositionChange={this.handlePositionChange}
                            rotate={parseFloat(this.state.rotate)}
                            borderRadius={this.state.width / (100 / this.state.borderRadius)}
                            image={this.state.image}
                            className="editor-canvas"
                            crossOrigin="anonymous"
                        />
                        {editorButtons}
                        {editButton}
                    </div>
                    :
                    <div style={{ display: 'grid' }}>
                        <img src={image} alt="profile" width="350px" height="350px" />
                        {editButton}
                    </div>
                }
            </Fragment>
        );
    }
}

export default Avatar; 
