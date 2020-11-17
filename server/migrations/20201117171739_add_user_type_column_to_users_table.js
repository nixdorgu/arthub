exports.up = function(knex) {
    return knex.raw(`
      CREATE TYPE user_type AS ENUM ('artist', 'customer');
  
      ALTER TABLE users ADD COLUMN user_classification user_type DEFAULT 'customer' NOT NULL;
    `);
  };
  
  exports.down = function(knex) {
      return knex.raw(`
          ALTER TABLE users DROP COLUMN user_classification;
          DROP TYPE user_type;
    `);
  };
  