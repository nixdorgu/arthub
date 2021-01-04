const express = require('express');
const jwt = require('jsonwebtoken');

const profileRoutes = (client) => {
  const router = express.Router();
  const DEFAULT_SOURCE = 'https://i.ibb.co/XV9b3h2/Untitled-1.png';

  router.get('/:id', (req, res) => client.query(
    'SELECT user_id, first_name, last_name, email, member_since, user_classification, link FROM users LEFT JOIN profile_images USING(user_id) WHERE user_id = $1', [req.params.id],
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

      const initialData = result.rows[0];

      const source = typeof initialData.link !== 'undefined' && initialData.link !== null ? initialData.link : DEFAULT_SOURCE;

      const data = {
        user_id: initialData.user_id,
        first_name: initialData.first_name,
        last_name: initialData.last_name,
        email: initialData.email,
        member_since: initialData.member_since,
        user_classification: initialData.user_classification,
        source,
      };

      return res.status(200).json(data);
    },
  ));

  router.post('/edit', (req, res) => {
    const token = req.headers.authorization.slice(7);
    const { user_id: id } = jwt.decode(token);
    const {
      link, firstName, lastName, biography, genres,
    } = req.body;

    return client.query('SELECT * FROM users WHERE user_id = $1', [id], (userError, userResult) => {
      if (userError) return res.status(500).json({ success: false, message: 'Something went wrong.' });
      const user = userResult.rows[0];

      if (link.trim().length > 0 && link !== DEFAULT_SOURCE) {
        client.query('INSERT INTO profile_images VALUES($1, $2) ON CONFLICT(user_id) DO UPDATE SET link = $2', [id, link], (error, result) => {
          if (error) return res.status(500).json({ success: false, message: 'Something went wrong.' });
        });
      }

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

  return router;
};

module.exports = profileRoutes;
