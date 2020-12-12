const isArtist = (transaction, user) => transaction.artist_id === user.id;

module.exports = isArtist;