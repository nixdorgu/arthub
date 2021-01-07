const express = require('express');
const jwt = require('jsonwebtoken');
const shallowEquality = require('../../src/shallowEquality');
const validate = require('../../src/validate');

const profileRoutes = (client) => {
  const router = express.Router();
  const DEFAULT_SOURCE = 'https://i.ibb.co/XV9b3h2/Untitled-1.png';

  router.get('/:id', (req, res) => client.query(
    'SELECT user_id, first_name, last_name, email, member_since, user_classification, type, image FROM users LEFT JOIN profile_images USING(user_id) WHERE user_id = $1', [req.params.id],
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

      const source = initialData.image !== null ? (
        `data:${initialData.type};base64,${Buffer.from(initialData.image).toString('base64')}`
      ) : DEFAULT_SOURCE;

      const data = {
        user_id: initialData.user_id,
        first_name: initialData.first_name,
        last_name: initialData.last_name,
        email: initialData.email,
        member_since: initialData.member_since,
        user_classification: initialData.user_classification,
        source,
      };

      if (initialData.user_classification === 'artist') {
        client.query('SELECT biography from artists WHERE artist_id = $1', [req.params.id], (artistError, artistResult) => {
          if (artistError) return res.status(503).json({ message: 'Something went wrong.' });

          const artistData = { ...data, biography: artistResult.rows[0].biography };
          return res.status(200).json(artistData);
        });
      } else {
        return res.status(200).json(data);
      }
    },
  ));

  router.get('/rating/:id', (req, res) => client.query('SELECT COUNT(*), (SELECT COUNT(*) FROM transactions WHERE cancelled_by = $1) AS cancellations FROM transactions WHERE $1 in (user_id, artist_id)', [req.params.id], (error, result) => {
    if (error) return res.status(500).json({ success: false });

    const { cancellations, count } = result.rows[0];
    const compute = (all, cancelled) => Number(((count - cancellations) / count) * 100).toFixed(2);

    const data = validate(count, { type: 'NUMBER' }) ? compute(count, cancellations) : 100;

    return res.status(200).json({ success: true, data });
  }));

  router.post('/edit', (req, res) => {
    const token = req.headers.authorization.slice(7);
    const { user_id: id } = jwt.decode(token);
    const {
      result, firstName, lastName, biography, focus,
    } = req.body;

    return client.query('SELECT * FROM users WHERE user_id = $1', [id], (userError, userResult) => {
      if (userError) return res.status(500).json({ success: false, message: 'Something went wrong.' });
      const user = userResult.rows[0];

      if (typeof result !== 'undefined' && !shallowEquality(result, {})) {
        client.query('INSERT INTO profile_images VALUES($1, $2, $3) ON CONFLICT(user_id) DO UPDATE SET type = $2, image = $3', [id, result.type, Buffer.from(result.buffer, 'utf-8')], (error, result) => {
          if (error) return res.status(500).json({ success: false, message: 'Something went wrong.' });
        });
      }

      if (typeof firstName !== 'undefined' && firstName.trim() !== user.first_name) {
        client.query('UPDATE users SET first_name = $1 WHERE user_id = $2', [firstName, id], (error, result) => {
          if (error) return res.status(500).json({ success: false, message: 'Something went wrong.' });
        });
      }

      if (typeof lastName !== 'undefined' && lastName.trim() !== user.last_name) {
        client.query('UPDATE users SET last_name = $1 WHERE user_id = $2', [lastName, id], (error, result) => {
          if (error) return res.status(500).json({ success: false, message: 'Something went wrong.' });
        });
      }

      if (user.user_classification === 'artist') {
        client.query('SELECT * FROM users INNER JOIN artists AS a ON user_id = a.artist_id  WHERE user_id = $1', [id], (error, artistResult) => {
          if (error) return res.status(500).json({ success: false, message: 'Something went wrong.' });

          const artistData = artistResult.rows[0];

          if (typeof biography !== 'undefined' && biography.trim() !== artistData.biography?.trim()) {
            return client.query('UPDATE artists SET biography = $1 WHERE artist_id = $2', [biography, id], (artistError, result) => {
              if (artistError) return res.status(500).json({ success: false, message: 'Something went wrong.' });
            });
          }

          if (focus !== 'undefined' && focus.length > 0) {
            client.query('SELECT focus.id, focus.focus_description FROM artist_focus AS artist INNER JOIN focus ON focus.id = artist.focus_id WHERE artist_id = $1', [id], (focusError, result) => {
              if (focusError) return res.status(500).json({ message: 'Something went wrong.' });

              const priorFocus = result.rows.map((initial) => initial.id);

              const add = focus.filter((item) => !priorFocus.includes(item.id));
              const remove = priorFocus
                .filter((item) => !focus.map((newItem) => newItem.id).includes(item))
                .map((item) => Number(item));

              remove.forEach((item) => client.query('DELETE FROM artist_focus WHERE artist_id = $1 AND focus_id = $2 RETURNING *', [id, item], (deleteError, deleteResult) => {
                if (deleteError) return res.status(500).json({ message: 'Something went wrong.' });
              }));

              add.forEach((item) => client.query('INSERT INTO artist_focus VALUES (DEFAULT, $1, $2)', [id, item.id], (insertError, insertResult) => {
                if (insertError) return res.status(500).json({ message: 'Something went wrong.' });
              }));
            });
          }

          return res.status(200).json({ success: true, message: 'Profile successfully updated.' });
        });
      }
    });
  });

  return router;
};

module.exports = profileRoutes;
