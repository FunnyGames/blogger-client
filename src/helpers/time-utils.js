import moment from 'moment';

export const formatBlogDate = (date) => {
    return moment(date).format('D MMM YYYY');
}

export const formatBlogDateTime = (date) => {
    return moment(date).format('DD/MM/YYYY, HH:mm');
}