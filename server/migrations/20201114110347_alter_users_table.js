
exports.up = function(knex) {
    return knex.raw(`
        ALTER TABLE users ADD CONSTRAINT users_email_key UNIQUE(email);
    `);
  };
  
  exports.down = function(knex) {
      return knex.raw(`
          ALTER TABLE users DROP CONSTRAINT users_email_key;
    `);
  };
  