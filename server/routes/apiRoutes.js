const express = require('express');
const jwt = require('jsonwebtoken');

const artistsRoutes = require('./api/artistsRoutes');
const messagesRoutes = require('./api/messagesRoutes');
const profileRoutes = require('./api/profileRoutes');
const transactionsRoutes = require('./api/transactionsRoutes');

const apiRoute = (client) => {
  const router = express.Router();

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

  router.use('/profile', profileRoutes(client));
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
