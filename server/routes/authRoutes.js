const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const middleware = require('../utils/middleware');
const formatPayload = require('../src/formatPayload');

const authRoute = () => {
  const router = express.Router();

  router.get(
    '/facebook', middleware.isNotAuthenticated,
    passport.authenticate('facebook', { session: false, scope: ['email'] }),
  );

  router.get(
    '/facebook/callback',
    passport.authenticate('facebook', { session: false }),
    (req, res) => {
      let { user } = req;

      if (JSON.stringify(user) === JSON.stringify({})) {
        return res
          .status(401)
          .json({ success: false, message: 'Incorrect credentials.' });
      }

      user = formatPayload(user);

      return req.login(user, { session: false }, (error) => {
        if (error) {
          return res
            .status(500)
            .location('http://localhost:3000/register')
            .json({ success: false, message: 'Something went wrong' });
        }
        return jwt.sign(
          user,
          process.env.JWT_SECRET,
          { expiresIn: '3d' },
          (err, token) => {
            if (err) {
              return res
                .status(500)
                .location('http://localhost:3000/register')
                .json({ success: false, message: 'Something went wrong' });
            }
            return res
              .status(200)
              .redirect(`http://localhost:3000/success/${token}`);
          },
        );
      });
    },
  );

  router.get(
    '/google', middleware.isNotAuthenticated,
    passport.authenticate('google', { session: false, scope: ['profile', 'email'] }),
  );

  router.get(
    '/google/callback',
    passport.authenticate('google', { session: false }),
    (req, res) => {
      let { user } = req;

      if (JSON.stringify(user) === JSON.stringify({})) {
        return res
          .status(401)
          .json({ success: false, message: 'Incorrect credentials.' });
      }

      user = formatPayload(user);

      return req.login(user, { session: false }, (error) => {
        if (error) {
          return res
            .status(500)
            .location('http://localhost:3000/register')
            .json({ success: false, message: 'Something went wrong' });
        }
        return jwt.sign(
          user,
          process.env.JWT_SECRET,
          { expiresIn: '3d' },
          (err, token) => {
            if (err) {
              return res
                .status(500)
                .location('http://localhost:3000/register')
                .json({ success: false, message: 'Something went wrong' });
            }
            return res
              .status(200)
              .redirect(`http://localhost:3000/success/${token}`);
          },
        );
      });
    },
  );

  return router;
};

module.exports = authRoute;
