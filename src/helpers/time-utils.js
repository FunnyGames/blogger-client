import moment from 'moment';

export const formatBlogDate = (date) => {
    return moment(date).format('D MMM YYYY');
}

export const formatBlogDateTime = (date) => {
    return moment(date).format('DD/MM/YYYY, HH:mm');
}

export const formatCommentDateTime = (date) => {
    return timeSince(new Date(date));
}
function timeSince(date) {
    let seconds = Math.floor((new Date() - date) / 1000);
    let interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + ' years ago';
    } else if (interval === 1) {
        return 'about an year ago';
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + ' months ago';
    } else if (interval === 1) {
        return 'about a month ago';
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + ' days ago';
    } else if (interval === 1) {
        return 'about a day ago';
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + ' hours ago';
    } else if (interval === 1) {
        return 'about an hour ago';
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + ' minutes ago';
    } else if (interval === 1) {
        return 'about a minute ago';
    }
    return 'Just now';
}