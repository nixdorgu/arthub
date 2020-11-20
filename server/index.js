const express = require("express");
const bodyParser = require("body-parser");
const pg = require("pg");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const initPassport = require("./config/passport.config");
const checkConfig = require("./config/envError");

dotenv.config();

const pool = new pg.Pool(JSON.parse(process.env.DATABASE_CONFIG));
const port = process.env.PORT ?? 3000;
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

pool.connect((error, client) => {
  checkConfig(error);
  
  // protected - not logged in
  app.get("/", (req, res) => res.sendFile('C:/Users/Acer/Documents/Code/arthub/server/pages/home.html'));

  // protected - not logged in
  app.get("/login", (req, res) => res.sendFile('C:/Users/Acer/Documents/Code/arthub/server/pages/log.html'));

  // protected - not logged in
  app.post("/api/login", passport.authenticate('local', {session: false}), (req, res, next) => {
    const user = req.user;

    if (JSON.stringify(user) === JSON.stringify({})) return res.status(401).json({success: false, message: "Incorrect credentials."})

    Reflect.deleteProperty(user, "password");
    Reflect.deleteProperty(user, "member_since");
    Reflect.deleteProperty(user, "status");
    Object.assign(user, {iat: Date.now()})

    return req.login(user, {session: false}, (error) => {
      if (error) {
        return res.status(500).json({success: false, message: "Something went wrong"});
      } else {
        return jwt.sign(user, process.env.JWT_SECRET, {expiresIn: '1d'}, (err, token) => {
          if (err) return res.status(500).json({success: false, message: "Something went wrong"});
          return res.status(200).json({token});
        })
      }
    })
  });

  // protected - not logged in
  app.get("/api/register", (req, res) => {
    res.sendFile('C:/Users/Acer/Documents/Code/arthub/server/pages/reg.html')
  });

  // protected - not logged in
  app.post("/api/register", (req, res) => {
    const { firstName, lastName, email, password, isArtist } = req.body;

    bcrypt.hash(password, 12, (hashError, hashedPassword) => {
      if (hashError) return res.status(500).json({success: "false", message: "Something went wrong."});

      client.query('SELECT email FROM users WHERE email = $1', [email], (error, duplicate) => {
        if (error || duplicate.rows.length != 0) {
          return res.status(409).json({success: "false", message: "Email already in use."})
        } else {
          const userClassification = isArtist ? "artist": "customer";

          const onSuccessfulRegistration = (res, user) => {
            const name = user.first_name + ' ' + user.last_name;

            Object.assign(user, {name});

            Reflect.deleteProperty(user, "user_id");
            Reflect.deleteProperty(user, "first_name");
            Reflect.deleteProperty(user, "last_name");
            Reflect.deleteProperty(user, "password");
            Reflect.deleteProperty(user, "status");
            Reflect.deleteProperty(user, "user_classification");
            
            return res.status(200).json({success: true, user});
          }

          const createReferenceToArtist = (res, user) => {
            const id = user.user_id;
            return client.query('INSERT INTO artists (artist_id) VALUES ($1)', [id], (error, result) => {
              if (error) return res.status(500).json({success: false});
              return onSuccessfulRegistration(res, user);
            });
          }

          const onError = (res, dbError, result) => {
            if (dbError) return res.status(500).json({success: false, message: "Something went wrong."});

            const user = result.rows[0];
            return user.user_classification !== 'artist' ? onSuccessfulRegistration(res, user): createReferenceToArtist(res, user);
          }

          client.query(
            "INSERT INTO users VALUES (DEFAULT, $1, $2, $3, $4, DEFAULT, DEFAULT, $5) RETURNING *",
            [firstName, lastName, email, hashedPassword, userClassification],
            (dbError, result) => onError(res, dbError, result)
          );
        }
      });
    })
  });

  // protected
  app.get('api/profile', (req, res) => {
    res.send('Profile')
  });

  // protected
  app.get('/api/artists/:id', (req, res) => {});

  // protected
  app.get('/api/transactions', (req, res) => {});

  // protected
  app.get('/api/transactions/:id', (req, res) => {});
  
  // protected
  app.post('/api/logout', (req, res) => {})

  app.listen(port, () => {
    initPassport(passport, client);
    console.log(`Server is listening on http://localhost:${port}`);
  });
});
