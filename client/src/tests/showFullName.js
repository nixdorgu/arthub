function showFullName(user) {
    if (user.hasOwnProperty('first_name') && user.hasOwnProperty('last_name')) {
        return `${user['first_name']} ${user['last_name']}`;
    } else if (user.hasOwnProperty('name')) {
        return user.name;
    } else {
        return '';
    } 
}

module.exports = showFullName;