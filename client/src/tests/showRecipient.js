function showRecipient(data, user_id) {
    return user_id !== data.user_id ? data.user_name : data.artist_name
}

module.exports = showRecipient;