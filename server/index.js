const express = require('express');
const cors = require('cors');
const pg = require('pg');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const socketio = require('socket.io');
const http = require('http');

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

  app.use('/auth', middleware.isNotAuthenticated, authRoute());
  app.use('/api', middleware.isAuthenticated, apiRoutes(client));

  // SocketIO ops
  io.on('connection', (socket) => {
    console.log('Connection!!!');

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

    socket.on('disconnect', () => {
      console.log('User left!');
    });
  });

  server.listen(port, () => {
    initPassport(passport, client);
    // eslint-disable-next-line no-console
    console.log(`Server is listening on http://localhost:${port}`);
  });
});
