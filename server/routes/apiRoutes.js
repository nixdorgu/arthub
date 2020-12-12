const express = require('express');
const artistsRoutes = require('./api/artistsRoutes');
const messagesRoutes = require('./api/messagesRoutes');
const transactionsRoutes = require('./api/transactionsRoutes');

const apiRoute = (client) => {
    const router = express.Router();

    router.get("/profile/:id", (req, res) => {
      return client.query(
        `SELECT user_id, CONCAT(first_name, ' ', last_name) AS name, email, member_since, user_classification FROM users WHERE user_id = $1`, [req.params.id],
        (error, result) => {
          if (error)
            return res
              .status(500)
              .json({ success: false, message: "Something went wrong." });
  
          if (result.rows.length === 0) {
            return res
            .status(404)
            .json({ success: false, message: "Profile not found." });
          }
  
          if (result.rows[0]['user_classification'] !== 'artist') {
  
          }
          return res.status(200).json(result.rows[0]);
        }
      );
    });

    router.use('/artists', artistsRoutes(client));
    router.use('/messages',  messagesRoutes(client));
    router.use('/transactions', transactionsRoutes(client));
  
    // router.get("/artists/", (req, res) => {
    //   return client.query(
    //     `SELECT user_id, CONCAT(first_name, ' ', last_name) AS name, email, biography FROM users INNER JOIN artists ON user_id = artist_id`,
    //     (error, result) => {
    //       if (error)
    //         return res
    //           .status(500)
    //           .json({ success: false, message: "Something went wrong." });
  
  
    //       return res.status(200).json(result.rows);
    //     }
    //   );
    // });
  
    // router.get("/artists/:name", (req, res) => {
    //   return client.query(
    //     // `SELECT user_id, CONCAT(first_name, ' ', last_name) AS name, email, biography FROM users INNER JOIN artists ON user_id = artist_id INNER JOIN artist_focus USING (artist_id) INNER JOIN focus USING (focus_id) WHERE CONCAT(first_name, ' ', last_name) ILIKE '%${req.params.name}%'`,
    //     `SELECT user_id, CONCAT(first_name, ' ', last_name) AS name, email, biography FROM users INNER JOIN artists ON user_id = artist_id WHERE CONCAT(first_name, ' ', last_name) ILIKE $1`, [`%${req.params.name}%`],
    //     (error, result) => {
    //       if (error)
    //         return res
    //           .status(500)
    //           .json({ success: false, message: "Something went wrong." });
  
    //       return res.status(200).json(result.rows);
    //     }
    //   );
    // });
  
  
    // // protected
    // router.post("/messages", (req, res) => {
    //   const {room_id, sender_id, content, timestamp} = req.body;
    //   client.query(`INSERT INTO messages VALUES ($1, $2, $3, $4)`, [room_id, sender_id, content, timestamp], (error, result) => {
    //     if (error) return res.status(500).json({message: "Something went wrong"});
  
    //     return res.status(200).json({message: "Message successfully sent!"})
    //   });
    // });
    
    // router.get("/messages/:id", (req, res) => {
    //   const id = req.params.id;
  
    //   const query = `SELECT room.room_id, room.user_id,
    //   CONCAT(users.first_name, ' ', users.last_name) AS user_name,
    //   room.artist_id,
    //   (SELECT CONCAT(first_name,' ', last_name) FROM users WHERE user_id = room.artist_id) AS artist_name,
    //   (SELECT content FROM messages WHERE room_id = room.room_id ORDER BY timestamp DESC LIMIT 1) AS last_message,
    //   (SELECT sender_id FROM messages WHERE room_id = room.room_id ORDER BY timestamp DESC LIMIT 1) AS sent_by,
    //   (SELECT timestamp FROM messages WHERE room_id = room.room_id ORDER BY timestamp DESC LIMIT 1) AS sent_at 
    //   FROM message_rooms AS room INNER JOIN users USING(user_id)
    //   WHERE EXISTS (SELECT content FROM messages WHERE room_id = room.room_id ORDER BY timestamp DESC LIMIT 1) 
    //   AND $1 = room.user_id OR $1 = room.artist_id 
    //   ORDER BY sent_at DESC;`
  
    //   client.query(query, [id], (err, result) => {
    //     if (err) {
    //       return res.status(500).json({message: 'Something wrong hrouterened.'})
    //     }
  
    //     return res.status(200).json(result.rows)
    //   })
    // });
  
    // // protected
    // router.post("/messages/room/", (req, res) => {
    //   const {user_id, user_classification, id, classification} = req.body;
  
    //   let roles = {
    //     artist: user_classification !== 'artist' && classification === 'artist' ? id : user_id,
    //     customer: user_classification !== 'artist' && classification === 'artist' ? user_id: id
    //   }
  
    //   if (user_id && id) {
    //     client.query('SELECT * FROM message_rooms WHERE (user_id = $1 OR artist_id = $1) AND (user_id = $2 OR artist_id = $2)', [user_id, id], (error, result) => {
    //       if (error) {
    //         return res.status(500).json({message: 'Uh-oh, server temporarily down.'})
    //       }
  
    //       if (result.rows.length === 0) {
    //         client.query('INSERT INTO message_rooms VALUES (DEFAULT, $1, $2)', [roles.artist, roles.customer], (error, roomResult) => {
    //           if (error) {
    //             return res.status(500).json({message: 'Uh-oh, server temporarily down.'})
    //           }
  
    //           return res.status(200).json({room: roomResult.rows[0]})
    //         })
    //       } else {
    //         return res.status(200).json({room: result.rows[0]});
    //       }
    //     });
    //   }
    // });
  
    // router.get("/messages/room/:room", (req, res) => {
    //   const room_id = req.params.room;
  
    //   // valid room
    //   return client.query('SELECT * FROM message_rooms WHERE $1 = room_id', [room_id], (roomError, room) => {
    //     if(roomError || room.rows.length === 0) return res.status(404).json({message: "Room not found."});
  
    //     return client.query('SELECT * FROM messages WHERE $1 = room_id', [room_id], (err, result) => {
    //       if (err) {
    //         return res.status(500).json({message: 'Something wrong hrouterened.'})
    //       }
    
    //       return res.status(200).json(result.rows)
    //     })
    //   })
    // });
  
  
    // // protected
    // router.post("/transactions", (req, res) => {
    //   const {title, shortDescription, description, price, artistId, userId} = req.body;
  
    //   client.query('INSERT INTO transactions VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, DEFAULT) RETURNING *', [artistId, userId, title, shortDescription, description, price], (error, result) => {
    //     if (error) {
    //       return res.status(500).json({success: false, message: "Something went wrong."})
    //     }
  
    //     return res.status(200).json({success: true, message: "Transaction completed successfully", data: result.rows[0]})
    //   })
    // });
  
    // // protected
    // router.get("/transactions/:id", (req, res) => {
    //   const id = req.params.id;
  
    //   if (id === "undefined" || id === "null") {
    //     return res.status(500).json({success: false, message: "Something went wrong."})
    //   } else {
    //     client.query("SELECT transaction_id, artist_id, CONCAT(first_name, ' ', last_name) AS artist_name, t.user_id, (SELECT CONCAT(first_name, ' ', last_name) FROM users AS sub WHERE sub.user_id = t.user_id) as customer_name, title, description, short_description, price, t.status FROM transactions AS t INNER JOIN users AS u ON u.user_id = t.artist_id WHERE t.artist_id = $1 OR t.user_id = $1", [id], (error, result) => {
    //       if (error) {
    //         console.log(error)
    //         return res.status(500).json({success: false, message: "Something went wrong."})
    //       }
  
    //       return res.status(200).json({success: true, message: "Transaction completed successfully", data: result.rows})
    //     })
    //   }
    // });
  
    // router.patch("/transactions/:id", (req, res) => {
    //   const id = req.params.id;
    //   const {classification} = req.body;
  
    //   client.query('SELECT * FROM transactions WHERE transaction_id = $1', [id], (error, result) => {
    //     if (error) {
    //       return res.status(500).json({success: false, message: "Something went wrong"});
    //     }
  
    //     if (result.rows.length === 0) {
    //       return res.status(404).json({success: false, message: "No corresponding transaction found"});
    //     } else {
    //       client.query('UPDATE transactions SET status = $1 WHERE transaction_id = $2', [ classification, id], (error, result) => {
    //         if (error) {
    //       console.log(error)
  
    //           return res.status(500).json({success: false, message: "Something went wrong"})
    //         } else {
    //           return res.status(200).json({success: true, message: "Transaction successfully updated."})
    //         }
    //       })
    //     }
    //   })
    // })

    return router;
}


module.exports = apiRoute;