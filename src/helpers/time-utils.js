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

export const formatNotificationDateTime = (date) => {
    date = new Date(date);
    let seconds = Math.floor((new Date() - date) / 1000);
    let interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
        return formatBlogDate(date);
    }
    return timeSince(date);
}

export const formatChatTime = (date) => {
    let otherDate = moment();
    if (moment(date).isSame(otherDate, 'day')) {
        return moment(date).format('HH:mm');
    } else if (moment(date).isSame(otherDate.subtract(1, 'day'), 'day')) {
        return 'Yesterday';
    }
    return moment(date).format('DD/MM/YY');
}

export const formatMessageTime = (date) => {
    return moment(date).format('HH:mm');
}

export const formatConversationTime = (date) => {
    let otherDate = moment();
    if (moment(date).isSame(otherDate, 'day')) {
        return 'Today';
    } else if (moment(date).isSame(otherDate.subtract(1, 'day'), 'day')) {
        return 'Yesterday';
    }
    return moment(date).format('DD/MM/YY');
}

export const dateEquals = (date1, date2) => {
    if (!date1 || !date2) return false;
    return moment(date1).isSame(date2, 'day');
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