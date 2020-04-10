import axios, { requests } from '../helpers/axios';
import Axios from 'axios';

export function get(url, params = {}, denyCancel) {
    const CancelToken = Axios.CancelToken;
    let cancel;

    const ax = axios.get(url,
        {
            params,
            cancelToken: new CancelToken(function executor(c) {
                cancel = c;
            })
        })
        .then(response => {
            return response.data;
        })
        .catch(err => {
            if (Axios.isCancel(err)) {
                return Promise.reject({ cancel: true });
            }
            return Promise.reject(err);
        });

    addCancelToReq(cancel, denyCancel);
    return ax;
}

export function post(url, data, params = {}, denyCancel) {
    const CancelToken = Axios.CancelToken;
    let cancel;

    const ax = axios.post(url, { ...data },
        {
            params,
            cancelToken: new CancelToken(function executor(c) {
                cancel = c;
            })
        })
        .then(response => {
            return response.data;
        })
        .catch(err => {
            if (Axios.isCancel(err)) {
                return Promise.reject({ cancel: true });
            }
            return Promise.reject(err);
        });

    addCancelToReq(cancel, denyCancel);
    return ax;
}

export function del(url, params = {}, denyCancel) {
    const CancelToken = Axios.CancelToken;
    let cancel;

    const ax = axios.delete(url,
        {
            params,
            cancelToken: new CancelToken(function executor(c) {
                cancel = c;
            })
        })
        .then(response => {
            return response.data;
        })
        .catch(err => {
            if (Axios.isCancel(err)) {
                return Promise.reject({ cancel: true });
            }
            return Promise.reject(err);
        });

    addCancelToReq(cancel, denyCancel);
    return ax;
}

export function put(url, data, params = {}, denyCancel) {
    const CancelToken = Axios.CancelToken;
    let cancel;

    const ax = axios.put(url, { ...data },
        {
            params,
            cancelToken: new CancelToken(function executor(c) {
                cancel = c;
            })
        })
        .then(response => {
            return response.data;
        })
        .catch(err => {
            if (Axios.isCancel(err)) {
                return Promise.reject({ cancel: true });
            }
            return Promise.reject(err);
        });

    addCancelToReq(cancel, denyCancel);
    return ax;
}

function addCancelToReq(cancel, denyCancel) {
    if (!denyCancel) {
        requests.push(cancel);
    }
}

let denyCancelFields = {};

export function denyCancelOnFirstCall(field) {
    let deny = !denyCancelFields[field];
    denyCancelFields[field] = false;
    return deny;
}