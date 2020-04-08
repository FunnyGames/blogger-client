import * as http from './base.service';
import url from '../constants/url.constants';
import * as utils from '../helpers/utils';

export const blogService = {
    getBlogs,
    createBlog,
    getBlog,
    getMembers,
    updateBlog,
    deleteBlog
};

function getBlogs(page, limit, name, sortBy, sortOrder, query) {
    let params = {
        page,
        limit,
        name,
        sortBy,
        sortOrder,
        ...query
    };

    return http.get(url.GET_BLOGS, params);
}

function createBlog(data) {
    return http.post(url.CREATE_BLOG, data);
}

function getBlog(blogId) {
    let urlx = utils.convertUrlPath(url.GET_BLOG, { id: blogId });
    return http.get(urlx);
}

function getMembers(blogId) {
    let urlx = utils.convertUrlPath(url.GET_BLOG_MEMBERS, { id: blogId });
    return http.get(urlx);
}

function updateBlog(blogId, data) {
    let urlx = utils.convertUrlPath(url.UPDATE_BLOG, { id: blogId });
    return http.put(urlx, data);
}

function deleteBlog(blogId) {
    let urlx = utils.convertUrlPath(url.UPDATE_BLOG, { id: blogId });
    return http.del(urlx);
}
