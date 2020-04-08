import jwt from 'jsonwebtoken';
import Cookies from 'js-cookie';
import globalConstants from '../constants/global.constants';


const { COOKIE_JWT, LOCAL_STR_TOKEN } = globalConstants;

// This function converts url with data: {id: 4}
// /api/v1/users/:id/groups
// to:
// /api/v1/users/4/groups
export const convertUrlPath = (url, data) => {
    let chunks = url.split('/');
    for (let i = 0; i < chunks.length; ++i) {
        let c = chunks[i];
        if (c[0] === ':') {
            let path = c.substring(1, c.length);
            let value = data[path];
            if (value) {
                chunks[i] = value;
            }
        }
    }
    return chunks.join('/');
}

export const getUserId = () => {
    let decoded = getDecodedToken();
    if (decoded && decoded.uid) return decoded.uid;
    return null;
}

export const getDecodedToken = () => {
    try {
        let token = Cookies.get(COOKIE_JWT) || localStorage.getItem(LOCAL_STR_TOKEN);
        if (token) {
            return jwt.decode(token);
        }
    } catch (err) {
        return {};
    }
    return {};
}

export const getUrlParams = () => {
    return new URLSearchParams(window.location.search);
}

export const getUrlPath = (path) => {
    return path && path.split('/');
}