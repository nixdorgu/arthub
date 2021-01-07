exports.up = function (knex) {
  return knex.raw('ALTER TABLE transactions ADD COLUMN cancelled_by INTEGER REFERENCES users(user_id)');
};

exports.down = function (knex) {
  return knex.raw('ALTER TABLE transactions DROP COLUMN cancelled_by');
};
