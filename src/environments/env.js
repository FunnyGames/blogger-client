// This file is different fron 'constants/global.constants.js' as these constants are based on environment
// Develpoment config
const dev = {
    api: {
        serverAddress: 'http://localhost:5000'
    }
};

// Production config
const prod = {
    api: {
        serverAddress: 'http://fg-blogger-server.herokuapp.com/'
    }
};

// Set config based on OS environment variable
const config = process.env.NODE_ENV === 'production' ? prod : dev;

export default {
    ...config
}