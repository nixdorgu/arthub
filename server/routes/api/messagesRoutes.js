/* eslint-disable camelcase */
const express = require('express');
const jwt = require('jsonwebtoken');

const messagesRoutes = (client) => {
  const router = express.Router();

  router.post('/', (req, res) => {
    const {
      room_id, sender_id, content, timestamp,
    } = req.body;
    // eslint-disable-next-line no-unused-vars
    client.query('INSERT INTO messages VALUES ($1, $2, $3, $4)', [room_id, sender_id, content, timestamp], (error, result) => {
      if (error) return res.status(500).json({ message: 'Something went wrong' });

      return res.status(200).json({ message: 'Message successfully sent!' });
    });
  });

  router.get('/:id', (req, res) => {
    const { id } = req.params;

    const query = `SELECT room.room_id, room.user_id,
      CONCAT(users.first_name, ' ', users.last_name) AS user_name,
      room.artist_id,
      (SELECT CONCAT(first_name,' ', last_name) FROM users WHERE user_id = room.artist_id) AS artist_name,
      (SELECT content FROM messages WHERE room_id = room.room_id ORDER BY timestamp DESC LIMIT 1) AS last_message,
      (SELECT sender_id FROM messages WHERE room_id = room.room_id ORDER BY timestamp DESC LIMIT 1) AS sent_by,
      (SELECT timestamp FROM messages WHERE room_id = room.room_id ORDER BY timestamp DESC LIMIT 1) AS sent_at 
      FROM message_rooms AS room INNER JOIN users USING(user_id)
      WHERE $1 IN (room.user_id, room.artist_id) AND
      (SELECT (CASE WHEN COUNT(content) > 0 THEN TRUE ELSE FALSE END) FROM (SELECT content FROM messages WHERE room_id = room.room_id ORDER BY timestamp DESC LIMIT 1) AS sub) IS TRUE
      ORDER BY sent_at DESC;`;

    return client.query(query, [id], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Something went wrong.' });
      }

      // const data = result.rows.filter((message) => message.last_message !== null);
      const data = result.rows;
      return res.status(200).json(data);
    });
  });

  router.post('/room/', (req, res) => {
    const {
      user_id, user_classification, id, classification,
    } = req.body;

    const roles = {
      artist: user_classification !== 'artist' && classification === 'artist' ? id : user_id,
      customer: user_classification !== 'artist' && classification === 'artist' ? user_id : id,
    };

    if (user_id && id) {
      return client.query('SELECT * FROM message_rooms WHERE (user_id = $1 OR artist_id = $1) AND (user_id = $2 OR artist_id = $2)', [user_id, id], (error, result) => {
        if (error) {
          return res.status(500).json({ message: 'Uh-oh, server temporarily down.' });
        }

        if (result.rows.length === 0) {
          return client.query('INSERT INTO message_rooms VALUES (DEFAULT, $1, $2) RETURNING *', [roles.artist, roles.customer], (roomError, roomResult) => {
            if (roomError) {
              return res.status(500).json({ message: 'Uh-oh, server temporarily down.' });
            }

            return res.status(200).json({ room: roomResult.rows[0] });
          });
        }

        return res.status(200).json({ room: result.rows[0] });
      });
    }

    return res.status(500).json({ message: 'Error getting messages' });
  });

  router.get('/room/:room', (req, res) => {
    const room_id = req.params.room;
    const token = req.headers.authorization.slice(7);
    const { user_id: id } = jwt.decode(token);

    // only users part of conversation can access
    return client.query('SELECT * FROM message_rooms WHERE $1 = room_id', [room_id], (roomError, room) => {
      if (roomError || room.rows.length === 0 || ![room.rows[0].artist_id, room.rows[0].user_id].includes(id)) return res.status(404).json({ message: 'Room not found.' });

      const user = id === room.rows[0].artist_id ? room.rows[0].user_id : room.rows[0].artist_id;

      return client.query('SELECT CONCAT(first_name, \' \', last_name) FROM users WHERE $1 = user_id', [user], (userError, userResult) => {
        if (userError) {
          return res.status(500).json({ message: 'Something wrong happened.' });
        }

        return client.query('SELECT * FROM messages WHERE $1 = room_id', [room_id], (err, result) => {
          if (err) {
            return res.status(500).json({ message: 'Something wrong happened.' });
          }

          return res.status(200).json({ data: result.rows, name: userResult.rows[0].concat });
        });
      });
    });
  });

  return router;
};

module.exports = messagesRoutes;
