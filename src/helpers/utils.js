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

export const nFormatter = (num, digits) => {
    const si = [
        { value: 1, symbol: '' },
        { value: 1E3, symbol: 'k' },
        { value: 1E6, symbol: 'M' },
        { value: 1E9, symbol: 'G' },
        { value: 1E12, symbol: 'T' },
        { value: 1E15, symbol: 'P' },
        { value: 1E18, symbol: 'E' }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let i;
    for (i = si.length - 1; i > 0; --i) {
        if (num >= si[i].value) {
            break;
        }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

export const shortenMessage = (msg, length = 50) => {
    if (!msg) return '';
    return (msg.length > length ? msg.substring(0, length - 3) + '...' : msg);
}