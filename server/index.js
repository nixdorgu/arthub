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
  
  app.get("/", (req, res) => res.sendFile('C:/Users/Acer/Documents/Code/arthub/server/pages/home.html'));
  app.get("/login", (req, res) => res.sendFile('C:/Users/Acer/Documents/Code/arthub/server/pages/log.html'));

  app.post("/api/login", passport.authenticate('local', {session: false, failureRedirect: '/api/login'}), (req, res, next) => {
    const user = req.user;

    Reflect.deleteProperty(user, "password");
    Reflect.deleteProperty(user, "member_since");
    Reflect.deleteProperty(user, "status");
    Object.assign(user, {iat: Date.now()})

    return req.login(user, {session: false}, (error) => {
      if (error) {
        return res.redirect(500, '/login');
      } else {
        jwt.sign(user, process.env.JWT_SECRET, {expiresIn: '1d'}, (err, token) => {
          if (err) return res.status(500).redirect('/login');
          return res.cookie('Authorization', `Bearer ${token}`, {expires: new Date(Date.now() + 86400) , httpOnly: true});
        })

        return res.status(200).json({success: true, user: user})
      }
    })
  });

  app.get("/api/register", (req, res) => {
    res.sendFile('C:/Users/Acer/Documents/Code/arthub/server/pages/reg.html')
  });

  app.post("/api/register", (req, res) => {
    const { firstName, lastName, email, password, isArtist } = req.body;

    bcrypt.hash(password, 12, (hashError, hashedPassword) => {
      if (hashError) return res.status(500).json({success: "false", error: "Something went wrong."});

      client.query('SELECT email FROM users WHERE email = $1', [email], (error, duplicate) => {
        if (error || duplicate.rows.length != 0) {
          return res.status(409).json({success: "false", error: "Email already in use."})
        } else {
          const userClassification = isArtist ? "artist": "customer";

          const onError = (res, dbError, result) => {
            if (dbError) return res.status(500).json({success: false, error: "Something went wrong."});

            const user = result.rows[0];
            const name = `${user.first_name} ${user.last_name}`;
            return res.json({success: true, user: {name}});
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

  app.get('/api/artists/:id', (req, res) => {});

  app.listen(port, () => {
    initPassport(passport, client);
    console.log(`Server is listening on http://localhost:${port}`);
  });
});
