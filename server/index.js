const express = require('express');
const cors = require('cors');
const pg = require('pg');
const dotenv = require('dotenv');
const passport = require('passport');
const socketio = require('socket.io');
const http = require('http');
const jwt = require('jsonwebtoken');

const middleware = require('./utils/middleware');
const initPassport = require('./config/passport.config');
const checkConfig = require('./config/envError');
const apiRoutes = require('./routes/apiRoutes');
const authRoute = require('./routes/authRoutes');
const sendEmail = require('./utils/sendEmail');

dotenv.config();

const pool = new pg.Pool(JSON.parse(process.env.DATABASE_CONFIG));
const port = process.env.PORT ?? 3000;
const app = express();

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

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

  app.use('/auth', middleware.isNotAuthenticated, authRoute(client));
  app.use('/api', middleware.isAuthenticated, apiRoutes(client));

  app.post('/email', middleware.isAuthenticated, (req, res) => {
    const { user_id: id } = jwt.decode(req.headers.authorization.slice(7));
    const {
      link, transaction: {
        transaction_id, artist_name, user_id, artist_id,
      },
    } = req.body;

    if (id !== artist_id) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions.' });
    }

    return client.query('SELECT email FROM users WHERE user_id = $1', [user_id], (error, result) => {
      if (error) return res.status(500).json({ success: false, message: 'Something went wrong.' });
      if (result.rows.length === 0) return res.status(400).json({ success: false, message: 'Could not find customer email.' });

      const recipient = result.rows[0].email;

      return client.query('SELECT email FROM users WHERE user_id = $1', [artist_id], (artistError, artistResult) => {
        if (artistError) return res.status(500).json({ success: false, message: 'Something went wrong.' });
        if (artistResult.rows.length === 0) return res.status(400).json({ success: false, message: 'Could not find customer email.' });

        const sender = artistResult.rows[0].email;

        const onSuccess = () => client.query('UPDATE transactions SET status = $1 WHERE transaction_id = $2', ['completed', transaction_id], (patchError, patchResult) => {
          if (patchError) return res.status(500).json({ success: false, message: 'Something went wrong' });
          return res.status(200).json({ success: false, message: 'Congratulations! Everything went smoothly!' })
        });

        const onError = () => res.status(500).json({ success: false, message: 'Something went wrong' });

        sendEmail({
          sender,
          recipient,
          transactionId: transaction_id,
          artist: artist_name,
          link,
          onSuccess,
          onError,
        });
      });
    });
  });

  // SocketIO ops
  io.on('connection', (socket) => {
    socket.on('join', (room) => {
      socket.join(room);
    });

    socket.on('send-message', (message) => {
      const roomId = message.room_id;
      socket.to(roomId).emit('new-message', message);
    });

    socket.on('leave', (room) => {
      socket.leave(room);
    });
  });

  server.listen(port, () => {
    initPassport(passport, client);
    // eslint-disable-next-line no-console
    console.log(`Server is listening on http://localhost:${port}`);
  });
});
