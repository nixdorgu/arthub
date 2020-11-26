
exports.up = function(knex) {
  return knex.raw(`
    CREATE TABLE messages (
        room_id uuid REFERENCES message_rooms(room_id),
        sender_id INTEGER REFERENCES users(user_id),
        content TEXT NOT NULL,
        timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

exports.down = function(knex) {
  return knex.raw(`DROP TABLE messages;`);
};
