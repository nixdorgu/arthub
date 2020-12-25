const express = require('express');
const cors = require('cors');
const pg = require('pg');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const middleware = require('./utils/middleware');
const initPassport = require('./config/passport.config');
const checkConfig = require('./config/envError');
const formatPayload = require('./src/formatPayload');
const apiRoutes = require('./routes/apiRoutes');
const authRoute = require('./routes/authRoutes');

dotenv.config();

const pool = new pg.Pool(JSON.parse(process.env.DATABASE_CONFIG));
const port = process.env.PORT ?? 3000;
const app = express();

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5000',
      'https://www.facebook.com',
    ],
    methods: ['GET', 'POST', 'OPTIONS', 'PATCH'],
    preflightContinue: true,
    optionsSuccessStatus: 200,
  }),
);

app.use(express.json({ limit: '25MB' }));
app.use(express.urlencoded({ limit: '25MB', extended: false }));
app.use(passport.initialize());

pool.connect((connectionError, client) => {
  checkConfig(connectionError);

  // protected - not logged in // MOVE TO AUTH/
  app.post(
    '/api/login',
    middleware.isNotAuthenticated,
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
        return jwt.sign(
          user,
          process.env.JWT_SECRET,
          { expiresIn: '1d' },
          (err, token) => {
            if (err) {
              return res
                .status(500)
                .json({ success: false, message: 'Something went wrong' });
            }
            return res.status(200).json({ token });
          },
        );
      });
    },
  );

  app.post('/api/register', (req, res) => {
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

          const onSuccessfulRegistration = (response) => response.status(200).json({ success: true, message: 'Account created successfully.' });

          const createReferenceToArtist = (response, user) => {
            const id = user.user_id;
            return client.query(
              'INSERT INTO artists (artist_id) VALUES ($1)',
              [id],
              // eslint-disable-next-line no-unused-vars
              (artistError, artistResult) => {
                if (artistError) return response.status(500).json({ success: false });
                return onSuccessfulRegistration(response);
              },
            );
          };

          const onError = (response, dbError, result) => {
            if (dbError) {
              return response
                .status(500)
                .json({ success: false, message: 'Something went wrong.' });
            }

            const user = result.rows[0];
            return user.user_classification !== 'artist'
              ? onSuccessfulRegistration(res)
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
  app.use('/auth', middleware.isNotAuthenticated, authRoute());
  app.use('/api', middleware.isAuthenticated, apiRoutes(client));

  app.listen(port, () => {
    initPassport(passport, client);
    // eslint-disable-next-line no-console
    console.log(`Server is listening on http://localhost:${port}`);
  });
});
