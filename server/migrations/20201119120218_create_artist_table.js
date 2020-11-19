
exports.up = function(knex) {
    return knex.raw(`
        CREATE TABLE artists(
            artist_id INTEGER REFERENCES users(user_id) PRIMARY KEY,
            biography VARCHAR(80)
        );
  `);
};

exports.down = function(knex) {
    return knex.raw(`
        DROP TABLE artists;
  `);
};
