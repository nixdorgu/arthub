const express = require("express");
const expressSession = require("express-session");
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
app.use(expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

pool.connect((error, client) => {
  checkConfig(error);
  
  app.get("/", (req, res) => res.sendFile('C:/Users/Acer/Documents/Code/arthub/server/pages/home.html'));
  app.get("/login", (req, res) => res.sendFile('C:/Users/Acer/Documents/Code/arthub/server/pages/log.html'));

  app.post("/login", passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login'
  }));

  app.get("/register", (req, res) => {
    res.sendFile('C:/Users/Acer/Documents/Code/arthub/server/pages/reg.html')
  });

  app.post("/register", (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    bcrypt.hash(password, 12, (hashError, hashedPassword) => {
      if (hashError) return res.status(500).redirect("/register");

      client.query(
        "INSERT INTO users VALUES (DEFAULT, $1, $2, $3, $4, DEFAULT, DEFAULT) RETURNING *",
        [firstName, lastName, email, hashedPassword],
        (dbError, result) => {
          if (dbError) return res.status(500).redirect("/register");
          res.redirect('/login');
        }
      );
    });
  });

  app.listen(port, () => {
    initPassport(passport, client);
    console.log(`Server is listening on http://localhost:${port}`);
  });
});
