import axios from 'axios';
import Cookies from 'js-cookie';
import globalConstants from '../constants/global.constants';
import env from '../environments/env';

const { COOKIE_JWT, HEADER_AUTH, LOCAL_STR_TOKEN } = globalConstants;

const baseApiAddress = env.api.serverAddress;

// Cancel request config
const CancelToken = axios.CancelToken;
export const source = CancelToken.source();

// Create an axios instance with default URL for all requests
const instance = axios.create({
    baseURL: baseApiAddress,
    headers: {
        'Content-Type': 'application/json',
    },
    cancelToken: source.token
});

// Add a request interceptor
instance.interceptors.request.use(
    config => {
        // Add token to headers before request is sent
        const cookie = Cookies.get(COOKIE_JWT);
        if (config.baseURL === baseApiAddress && !config.headers.Authorization && !cookie) {
            const token = localStorage.getItem(LOCAL_STR_TOKEN);

            if (token) {
                config.headers[HEADER_AUTH] = token;
            }
        }

        return config;
    },
    error => Promise.reject(error)
);

export default instance;

export const requests = [];

export const cancelPendingRequests = () => {
    const len = requests.length;
    for (let i = 0; i < len; ++i) {
        const cancel = requests[i];
        cancel();
    }
    requests.length = 0;
}