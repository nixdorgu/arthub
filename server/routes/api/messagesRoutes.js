const express = require('express');

const messagesRoutes = (client) => {
    const router = express.Router();

    router.post("/", (req, res) => {
      const {room_id, sender_id, content, timestamp} = req.body;
      client.query(`INSERT INTO messages VALUES ($1, $2, $3, $4)`, [room_id, sender_id, content, timestamp], (error, result) => {
        if (error) return res.status(500).json({message: "Something went wrong"});
  
        return res.status(200).json({message: "Message successfully sent!"})
      });
    });
    
    router.get("/:id", (req, res) => {
      const id = req.params.id;
  
      const query = `SELECT room.room_id, room.user_id,
      CONCAT(users.first_name, ' ', users.last_name) AS user_name,
      room.artist_id,
      (SELECT CONCAT(first_name,' ', last_name) FROM users WHERE user_id = room.artist_id) AS artist_name,
      (SELECT content FROM messages WHERE room_id = room.room_id ORDER BY timestamp DESC LIMIT 1) AS last_message,
      (SELECT sender_id FROM messages WHERE room_id = room.room_id ORDER BY timestamp DESC LIMIT 1) AS sent_by,
      (SELECT timestamp FROM messages WHERE room_id = room.room_id ORDER BY timestamp DESC LIMIT 1) AS sent_at 
      FROM message_rooms AS room INNER JOIN users USING(user_id)
      WHERE EXISTS (SELECT content FROM messages WHERE room_id = room.room_id ORDER BY timestamp DESC LIMIT 1) 
      AND $1 = room.user_id OR $1 = room.artist_id 
      ORDER BY sent_at DESC;`
  
      client.query(query, [id], (err, result) => {
        if (err) {
          return res.status(500).json({message: 'Something wrong hrouterened.'})
        }
  
        return res.status(200).json(result.rows)
      })
    });
  
    router.post("/room/", (req, res) => {
      const {user_id, user_classification, id, classification} = req.body;
  
      let roles = {
        artist: user_classification !== 'artist' && classification === 'artist' ? id : user_id,
        customer: user_classification !== 'artist' && classification === 'artist' ? user_id: id
      }
  
      if (user_id && id) {
        client.query('SELECT * FROM message_rooms WHERE (user_id = $1 OR artist_id = $1) AND (user_id = $2 OR artist_id = $2)', [user_id, id], (error, result) => {
          if (error) {
            return res.status(500).json({message: 'Uh-oh, server temporarily down.'})
          }
  
          if (result.rows.length === 0) {
            client.query('INSERT INTO message_rooms VALUES (DEFAULT, $1, $2)', [roles.artist, roles.customer], (error, roomResult) => {
              if (error) {
                return res.status(500).json({message: 'Uh-oh, server temporarily down.'})
              }
  
              return res.status(200).json({room: roomResult.rows[0]})
            })
          } else {
            return res.status(200).json({room: result.rows[0]});
          }
        });
      }
    });
  
    router.get("/room/:room", (req, res) => {
      const room_id = req.params.room;
  
      return client.query('SELECT * FROM message_rooms WHERE $1 = room_id', [room_id], (roomError, room) => {
        if(roomError || room.rows.length === 0) return res.status(404).json({message: "Room not found."});
  
        return client.query('SELECT * FROM messages WHERE $1 = room_id', [room_id], (err, result) => {
          if (err) {
            return res.status(500).json({message: 'Something wrong hrouterened.'})
          }
    
          return res.status(200).json(result.rows)
        })
      })
    });


    return router;
}


module.exports = messagesRoutes;