
exports.up = function(knex) {
    return knex.raw(`
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    
        CREATE TABLE message_rooms (
            room_id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
            artist_id INTEGER REFERENCES artists(artist_id),
            user_id INTEGER REFERENCES users(user_id)
        );
    `);
  };
  
  exports.down = function(knex) {
    return knex.raw(`
        DROP TABLE message_rooms;
        DROP EXTENSION IF EXISTS "uuid-oosp";
    `);
  };
  