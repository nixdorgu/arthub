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
