function outputError(message) {
    if (!message) return;

    console.log(message);
    return process.exit(1);
}

function checkConfig(error = '') {
    let message = '';

    if (!process.env.JWT_SECRET) {
        message = 'No JWT secret set.'
    } else if (!process.env.DATABASE_CONFIG) {
        message = 'Missing database configuration.'
    } else if (error) {
        message = 'Could not connect to database.'
    }

    return outputError(message);
}

module.exports = checkConfig;