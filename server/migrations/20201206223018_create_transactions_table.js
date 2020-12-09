
exports.up = function(knex) {
  return knex.raw(`
    CREATE TYPE transaction_status AS ENUM ('pending', 'declined', 'payment pending', 'cancelled', 'ongoing', 'completed');

    CREATE TABLE transactions (
        transaction_id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
        artist_id INTEGER REFERENCES artists(artist_id),
        user_id INTEGER REFERENCES users(user_id),
        title VARCHAR(30) NOT NULL,
        short_description VARCHAR(80) NOT NULL,
        description VARCHAR(300) NOT NULL,
        price NUMERIC NOT NULL,
        status transaction_status DEFAULT 'pending' NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

exports.down = function(knex) {
  return knex.raw(`
    DROP TABLE transactions;
    DROP TYPE transaction_status;
  `);
};
