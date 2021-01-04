const express = require('express');
const jwt = require('jsonwebtoken');

const artistsRoutes = (client) => {
  const router = express.Router();

  router.get('/', (req, res) => client.query(
    'SELECT user_id, CONCAT(first_name, \' \', last_name) AS name, email, biography FROM users INNER JOIN artists ON user_id = artist_id',
    (error, result) => {
      if (error) {
        return res
          .status(500)
          .json({ success: false, message: 'Something went wrong.' });
      }

      console.log('prof')
      return res.status(200).json(result.rows);
    },
  ));

  router.get('/:name', (req, res) => client.query(
    // `SELECT user_id, CONCAT(first_name, ' ', last_name) AS name, email, biography FROM
    // users INNER JOIN artists ON user_id = artist_id
    //  INNER JOIN artist_focus USING (artist_id) INNER JOIN focus USING (focus_id) WHERE
    //  CONCAT(first_name, ' ', last_name) ILIKE '%${req.params.name}%'`,
    'SELECT user_id, CONCAT(first_name, \' \', last_name) AS name, email, biography FROM users INNER JOIN artists ON user_id = artist_id WHERE CONCAT(first_name, \' \', last_name) ILIKE $1', [`%${req.params.name}%`],
    (error, result) => {
      if (error) {
        return res
          .status(500)
          .json({ success: false, message: 'Something went wrong.' });
      }

      return res.status(200).json(result.rows);
    },
  ));

  router.get('/artist/focus', (req, res) => {
    const token = req.headers.authorization.slice(7);
    const { user_id: id } = jwt.decode(token);

    return client.query('SELECT focus.id, focus.focus_description FROM artist_focus AS artist INNER JOIN focus ON focus.id = artist.focus_id WHERE artist_id = $1', [id], (error, result) => {
      if (error) return res.status(500).json({ message: 'Something went wrong.' });

      return res.status(200).json(result.rows);
    });
  });

  return router;
};

module.exports = artistsRoutes;
