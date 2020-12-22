exports.up = function (knex) {
  return knex.raw(`
  CREATE TABLE profile_images (
      user_id INTEGER REFERENCES users(user_id) PRIMARY KEY,
      type VARCHAR(11),
      image BYTEA
  );
  `);
};

exports.down = function (knex) {
  return knex.raw(`DROP TABLE profile_images`);
};
