
exports.up = function(knex) {
  return knex.raw(`
    CREATE TABLE artist_focus(
        artist_id INTEGER REFERENCES users(user_id) NOT NULL,
        focus_id INTEGER REFERENCES focus(id) NOT NULL
    );
  `);
};

exports.down = function(knex) {
    return knex.raw(`DROP TABLE artist_focus;`);
};
