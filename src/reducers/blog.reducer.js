import { blogConstants, userConstants } from '../constants';

export function blogs(state = {}, action) {
    switch (action.type) {
        case blogConstants.GET_BLOGS_REQUEST:
            return { loading: true, data: state.data };
        case blogConstants.GET_BLOGS_SUCCESS:
            return { data: action.payload.blogs, metadata: action.payload.metadata };
        case blogConstants.GET_BLOGS_FAILURE:
            return { error: action.error };

        case userConstants.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}

export function blog(state = {}, action) {
    switch (action.type) {
        case blogConstants.GET_BLOG_REQUEST:
            return { loading: true };
        case blogConstants.GET_BLOG_SUCCESS:
            return { ...action.payload };
        case blogConstants.GET_BLOG_FAILURE:
            let notFound = action.status === 404 || action.status === 400;
            let accessDenied = action.status === 403;
            return { error: action.error, status: action.status, notFound, accessDenied };

        case userConstants.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}

export function members(state = {}, action) {
    switch (action.type) {
        case blogConstants.GET_BLOG_MEMBERS_REQUEST:
            return { loading: true };
        case blogConstants.GET_BLOG_MEMBERS_SUCCESS:
            return { ...action.payload };
        case blogConstants.GET_BLOG_MEMBERS_FAILURE:
            let notFound = action.status === 404 || action.status === 400;
            let accessDenied = action.status === 403;
            return { error: action.error, status: action.status, notFound, accessDenied };

        case userConstants.LOGOUT_SUCCESS:
            return {};
        default:
            return state;
    }
}