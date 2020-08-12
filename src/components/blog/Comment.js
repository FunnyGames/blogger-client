import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as timeUtils from '../../helpers/time-utils';
import CommentForm from '../../forms/blogs/CommentForm';
import Modal from '../../components/interactive/Modal';
import { commentActions } from '../../actions';
import renderLoader from '../interactive/Loader';

import defaultProfileImage from '../../images/static/default-profile.png';

import '../../css/comment.css';

class Comment extends React.Component {
    state = {
        edit: false
    };

    openModal = {};

    handleEditChange = () => {
        const edit = !this.state.edit;
        if (this.props.openId && !this.isActive()) {
            return;
        }
        this.props.updateEditComment(edit ? this.props.commentId : null);
        this.setState({ edit });

    }

    showDeleteConfirm = () => {
        if (this.openModal.func) {
            const { commentId } = this.props;
            this.openModal.func(commentId);
        }
    }

    confirmDelete = (commentId) => {
        const { dispatch } = this.props;

        dispatch(commentActions.deleteComment(commentId));
    }

    onSubmit = (values) => {
        const { dispatch, commentId } = this.props;

        dispatch(commentActions.updateComment(commentId, values));
    }

    componentDidUpdate() {
        if (this.props.openId && !this.isActive() && this.state.edit) {
            this.setState({ edit: false });
        }
    }

    isActive = () => this.props.openId === this.props.commentId;

    render() {
        const { edit } = this.state;
        const { toLink, username, dateTooltip, createDate, content, lastUpdate, owner, updateComment, avatar } = this.props;
        const initialValues = { content };
        if (updateComment && updateComment.loading && this.isActive()) {
            return renderLoader();
        }
        const image = avatar || defaultProfileImage;
        return (
            <div className="comment">
                <b className="avatar">
                    <img src={image} alt="profile pic" />
                </b>
                <div className="content">
                    <Link to={toLink} className="author">{username}</Link>
                    <div className="metadata">
                        <span className="date" data-tooltip={dateTooltip} data-position="bottom center">{timeUtils.formatCommentDateTime(createDate)}</span>
                    </div>
                    {edit ?
                        <CommentForm onSubmit={this.onSubmit} initialValues={initialValues} />
                        :
                        <div className="text">
                            {content}
                        </div>
                    }
                    <p />
                    {lastUpdate && <div className="metadata">Edited at {timeUtils.formatBlogDateTime(lastUpdate)}</div>}
                    {owner &&
                        <div className="actions">
                            {edit ?
                                <i className="edit_comment" onClick={this.handleEditChange}>Cancel</i>
                                :
                                <i className="edit_comment" onClick={this.handleEditChange}>Edit</i>
                            }
                            <i className="delete_comment" onClick={this.showDeleteConfirm}> Delete</i>
                        </div>
                    }
                </div>
                <div className="ui divider"></div>

                <Modal
                    message="Are you sure you want to delete this comment?"
                    onConfirm={this.confirmDelete}
                    confirmLabel="Yes"
                    confirmColor="red"
                    denyLabel="No"
                    denyColor="grey"
                    openModal={this.openModal}
                />
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { update } = state;
    return { updateComment: update.updateComment };
}

const connected = connect(mapStateToProps)(Comment);
export default connected;