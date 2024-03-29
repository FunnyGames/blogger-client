import { alertConstants } from '../constants';

export function alert(state = {}, action) {
    switch (action.type) {
        case alertConstants.SUCCESS:
            return {
                type: 'alert-success',
                message: action.message
            };
        case alertConstants.ERROR:
            return {
                type: 'alert-error',
                error: action.error
            };
        case alertConstants.CLEAR:
            return {};
        case alertConstants.REFRESH:
            return {
                type: 'alert-refresh',
                forceRefresh: true,
                action: action.action
            }
        case alertConstants.LOGOUT:
            return {
                type: 'alert-logout',
                forceLogout: true
            }
        case alertConstants.NOTIFICATION:
            return {
                type: 'alert-notification',
                notification: action
            }
        case alertConstants.MESSAGE:
            return {
                type: 'alert-message',
                chatMessage: action
            }
        default:
            return state;
    }
}