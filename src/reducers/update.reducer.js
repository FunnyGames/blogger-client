import {
    userConstants,
    groupConstants,
    alertConstants,
    blogConstants,
    commentConstants,
} from '../constants';

export function update(state = {}, action) {
    switch (action.type) {
        case alertConstants.CLEAR:
            return {};

        case userConstants.UPDATE_PROFILE_REQUEST:
            return { updateProfile: { loading: true } };
        case userConstants.UPDATE_PROFILE_SUCCESS:
            return { updateProfile: action.res };
        case userConstants.UPDATE_PROFILE_FAILURE:
            return { updateProfile: { error: action.error } };

        case userConstants.UPDATE_PASSWORD_REQUEST:
            return { updatePassword: { loading: true } };
        case userConstants.UPDATE_PASSWORD_SUCCESS:
            return { updatePassword: action.res };
        case userConstants.UPDATE_PASSWORD_FAILURE:
            return { updatePassword: { error: action.error } };

        case groupConstants.UPDATE_GROUP_REQUEST:
            return { updateGroup: { loading: true } };
        case groupConstants.UPDATE_GROUP_SUCCESS:
            return { updateGroup: action.payload };
        case groupConstants.UPDATE_GROUP_FAILURE:
            return { updateGroup: { error: action.error } };

        case groupConstants.DELETE_GROUP_REQUEST:
            return { deleteGroup: { loading: true } };
        case groupConstants.DELETE_GROUP_SUCCESS:
            return { deleteGroup: action.payload };
        case groupConstants.DELETE_GROUP_FAILURE:
            return { deleteGroup: { error: action.error } };

        case blogConstants.UPDATE_BLOG_REQUEST:
            return { updateBlog: { loading: true } };
        case blogConstants.UPDATE_BLOG_SUCCESS:
            return { updateBlog: action.payload };
        case blogConstants.UPDATE_BLOG_FAILURE:
            return { updateBlog: { error: action.error } };

        case blogConstants.DELETE_BLOG_REQUEST:
            return { deleteBlog: { loading: true } };
        case blogConstants.DELETE_BLOG_SUCCESS:
            return { deleteBlog: action.payload };
        case blogConstants.DELETE_BLOG_FAILURE:
            return { deleteBlog: { error: action.error } };

        case commentConstants.UPDATE_COMMENT_REQUEST:
            return { updateComment: { loading: true } };
        case commentConstants.UPDATE_COMMENT_SUCCESS:
            return { updateComment: action.payload };
        case commentConstants.UPDATE_COMMENT_FAILURE:
            return { updateComment: { error: action.error } };

        default:
            return state;
    }
}