const express = require('express');
const jwt = require('jsonwebtoken');

const artistsRoutes = require('./api/artistsRoutes');
const messagesRoutes = require('./api/messagesRoutes');
const transactionsRoutes = require('./api/transactionsRoutes');

const apiRoute = (client) => {
  const router = express.Router();

  router.get('/profile/:id', (req, res) => client.query(
    'SELECT user_id, CONCAT(first_name, \' \', last_name) AS name, email, member_since, user_classification FROM users WHERE user_id = $1', [req.params.id],
    (error, result) => {
      if (error) {
        return res
          .status(500)
          .json({ success: false, message: 'Something went wrong.' });
      }

      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: 'Profile not found.' });
      }

      return res.status(200).json(result.rows[0]);
    },
  ));

  router.patch('/profile/edit/', (req, res) => {
    const token = req.headers.authorization.slice(7);
    const { user_id: id } = jwt.decode(token);

    const { firstName, lastName, biography, genres } = req.body;
    // console.log(firstName, lastName, biography, genres, id);
    // console.log(JSON.stringify(jwt.decode(token)));

    // add for profile picture
    return client.query('SELECT * FROM users WHERE user_id = $1', [id], (userError, result) => {
      if (userError) return res.status(500).json({ success: false, message: 'Something went wrong.' });

      const user = result.rows[0];

      if (typeof firstName !== 'undefined' && firstName.trim() !== user.first_name) {
        client.query('UPDATE users SET first_name = $1 WHERE user_id = $2', [firstName, id], (error, result) => {
          if (error) return res.status(500).json({ success: false, message: 'Something went wrong.' });
        });
      }

      if (typeof lastName !== 'undefined' && lastName.trim() !== user.last_name) {
        return client.query('UPDATE users SET last_name = $1 WHERE user_id = $2', [lastName, id], (error, result) => {
          if (error) return res.status(500).json({ success: false, message: 'Something went wrong.' });
        });
      }

      if (user.user_classification === 'artist') {
        client.query('SELECT * FROM users INNER JOIN artists AS a ON user_id = a.artist_id  WHERE user_id = $1', [id], (error, artistResult) => {
          if (error) return res.status(500).json({ success: false, message: 'Something went wrong.' });

          const artistData = artistResult.rows[0];

          if (typeof biography !== 'undefined' && biography.trim() !== artistData.biography?.trim()) {
            client.query('UPDATE artists SET biography = $1 WHERE artist_id = $2', [biography, id], (artistError, result) => {
              if (artistError) return res.status(500).json({ success: false, message: 'Something went wrong.' });
            });
          }

          if (typeof genres !== 'undefined' && genres.length > 0) {
            // LOGIC HERE
          }
        });
      }

      return res.status(200).json({ success: true, message: 'Profile successfully updated.' });
    });
  });

  router.get('/focus', (req, res) => client.query(
    'SELECT * FROM focus',
    (error, result) => {
      if (error) {
        return res
          .status(500)
          .json({ success: false, message: 'Something went wrong.' });
      }

      return res.status(200).json(result.rows);
    },
  ));

  router.use('/artists', artistsRoutes(client));
  router.use('/messages', messagesRoutes(client));
  router.use('/transactions', transactionsRoutes(client));

  router.post('/verify', (req, res) => {
    const { token } = req.body;
    const user = jwt.decode(token);
    return res.status(200).json({ success: true, user });
  });

  return router;
};

module.exports = apiRoute;
