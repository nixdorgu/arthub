const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const formatPayload = require('../src/formatPayload');
const signJwt = require('../utils/signJwt');

const authRoute = (client) => {
  const router = express.Router();

  router.post(
    '/login',
    passport.authenticate('local', { session: false }),
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
            .json({ success: false, message: 'Something went wrong' });
        }

        const FIVE_DAYS = 432000000;

        return signJwt(res, user, FIVE_DAYS);
      });
    },
  );

  router.post('/register', (req, res) => {
    const {
      firstName, lastName, email, password, isArtist,
    } = req.body;

    bcrypt.hash(password, 12, (hashError, hashedPassword) => {
      if (hashError) {
        return res
          .status(500)
          .json({ success: 'false', message: 'Something went wrong.' });
      }

      return client.query(
        'SELECT email FROM users WHERE email = $1',
        [email],
        (error, duplicate) => {
          if (error || duplicate.rows.length !== 0) {
            return res
              .status(409)
              .json({ success: 'false', message: 'Email already in use.' });
          }

          const userClassification = isArtist ? 'artist' : 'customer';

          const onSuccessfulRegistration = (response, user) => signJwt(response, user);

          const createReferenceToArtist = (response, user) => {
            const id = user.user_id;
            return client.query(
              'INSERT INTO artists (artist_id) VALUES ($1)',
              [id],
              // eslint-disable-next-line no-unused-vars
              (artistError, artistResult) => {
                if (artistError) return response.status(500).json({ success: false });
                return onSuccessfulRegistration(response, user);
              },
            );
          };

          const onError = (response, dbError, result) => {
            if (dbError) {
              return response
                .status(500)
                .json({ success: false, message: 'Something went wrong.' });
            }

            const user = formatPayload(result.rows[0]);

            return user.user_classification !== 'artist'
              ? onSuccessfulRegistration(res, user)
              : createReferenceToArtist(res, user);
          };

          return client.query(
            'INSERT INTO users VALUES (DEFAULT, $1, $2, $3, $4, DEFAULT, DEFAULT, $5) RETURNING *',
            [firstName, lastName, email, hashedPassword, userClassification],
            (dbError, result) => onError(res, dbError, result),
          );
        },
      );
    });
  });

  router.get(
    '/facebook',
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
    '/google',
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
