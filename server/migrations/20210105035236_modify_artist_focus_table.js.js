exports.up = function (knex) {
  return knex.raw(`
    DROP TABLE IF EXISTS artist_focus;

    CREATE TABLE artist_focus(
        id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY NOT NULL,
        artist_id INTEGER REFERENCES artists(artist_id),
        focus_id INTEGER REFERENCES focus(id) NOT NULL
    );
  `);
};

exports.down = function (knex) {
  return knex.raw(`
    DROP TABLE artist_focus;
    
    CREATE TABLE artist_focus(
        artist_id INTEGER REFERENCES users(user_id) PRIMARY KEY,
        focus_id INTEGER REFERENCES focus(id) NOT NULL
    );
  `);
};
