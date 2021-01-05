exports.up = function (knex) {
  return knex.raw(`
      ALTER TABLE profile_images DROP COLUMN link;
      ALTER TABLE profile_images ADD COLUMN type VARCHAR(11) NOT NULL, ADD COLUMN image BYTEA NOT NULL;
    `);
};

exports.down = function (knex) {
  return knex.raw(`
      ALTER TABLE profile_images DROP COLUMN type, DROP COLUMN image;
      ALTER TABLE profile_images ADD COLUMN link VARCHAR;
    `);
};
