const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const pg = require("pg");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const middleware = require("./middleware");
const initPassport = require("./config/passport.config");
const checkConfig = require("./config/envError");
const formatPayload = require("./src/formatPayload");
const apiRoutes = require('./routes/apiRoutes');

dotenv.config();

const pool = new pg.Pool(JSON.parse(process.env.DATABASE_CONFIG));
const port = process.env.PORT ?? 3000;
const app = express();

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5000', 'https://www.facebook.com'],
  methods: ['GET', 'POST', 'OPTIONS', 'PATCH'],
  preflightContinue: true,
  optionsSuccessStatus: 200,
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

pool.connect((error, client) => {
  checkConfig(error);

  // protected - not logged in
  app.post(
    "/api/login",
    passport.authenticate("local", { session: false }),
    (req, res, next) => {
      // try console req and see if error message shows up
      let user = req.user;

      if (JSON.stringify(user) === JSON.stringify({}))
        return res
          .status(401)
          .json({ success: false, message: "Incorrect credentials." });

      user = formatPayload(user);

      return req.login(user, { session: false }, (error) => {
        if (error) {
          return res
            .status(500)
            .json({ success: false, message: "Something went wrong" });
        } else {
          return jwt.sign(
            user,
            process.env.JWT_SECRET,
            { expiresIn: "1d" },
            (err, token) => {
              if (err)
                return res
                  .status(500)
                  .json({ success: false, message: "Something went wrong" });
              return res.status(200).json({ token });
            }
          );
        }
      });
    }
  );

  app.get('/auth/facebook', passport.authenticate('facebook', {session: false, scope: ["email"]}));
 
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {session: false, failureRedirect: 'http:localhost:3000/error'}), (req, res) => {
      console.log(req.user)
      let user = req.user;

      if (JSON.stringify(user) === JSON.stringify({}))
        return res
          .status(401)
          .json({ success: false, message: "Incorrect credentials." });

      user = formatPayload(user);

      return req.login(user, { session: false }, (error) => {
        if (error) {
          return res
            .status(500)
            .location('http://localhost:3000/register')
            .json({ success: false, message: "Something went wrong" });
        } else {
          return jwt.sign(
            user,
            process.env.JWT_SECRET,
            { expiresIn: "3d" },
            (err, token) => {
              if (err)
                return res
                  .status(500)
                  .location('http://localhost:3000/register')
                  .json({ success: false, message: "Something went wrong" });
              return res.status(200).redirect(`http://localhost:3000/success/${token}`).json({ token });
            }
          );
        }
      });
    });

  // protected - not logged in
  app.post("/api/register", (req, res) => {
    const { firstName, lastName, email, password, isArtist } = req.body;

    bcrypt.hash(password, 12, (hashError, hashedPassword) => {
      if (hashError)
        return res
          .status(500)
          .json({ success: "false", message: "Something went wrong." });

      client.query(
        "SELECT email FROM users WHERE email = $1",
        [email],
        (error, duplicate) => {
          if (error || duplicate.rows.length != 0) {
            return res
              .status(409)
              .json({ success: "false", message: "Email already in use." });
          } else {
            const userClassification = isArtist ? "artist" : "customer";

            const onSuccessfulRegistration = (res, user) => {
              const name = user.first_name + " " + user.last_name;

              Object.assign(user, { name });

              Reflect.deleteProperty(user, "user_id");
              Reflect.deleteProperty(user, "first_name");
              Reflect.deleteProperty(user, "last_name");
              Reflect.deleteProperty(user, "password");
              Reflect.deleteProperty(user, "status");
              Reflect.deleteProperty(user, "user_classification");

              return res.status(200).json({ success: true, user });
            };

            const createReferenceToArtist = (res, user) => {
              const id = user.user_id;
              return client.query(
                "INSERT INTO artists (artist_id) VALUES ($1)",
                [id],
                (error, result) => {
                  if (error) return res.status(500).json({ success: false });
                  return onSuccessfulRegistration(res, user);
                }
              );
            };

            const onError = (res, dbError, result) => {
              if (dbError)
                return res
                  .status(500)
                  .json({ success: false, message: "Something went wrong." });

              const user = result.rows[0];
              return user.user_classification !== "artist"
                ? onSuccessfulRegistration(res, user)
                : createReferenceToArtist(res, user);
            };

            client.query(
              "INSERT INTO users VALUES (DEFAULT, $1, $2, $3, $4, DEFAULT, DEFAULT, $5) RETURNING *",
              [firstName, lastName, email, hashedPassword, userClassification],
              (dbError, result) => onError(res, dbError, result)
            );
          }
        }
      );
    });
  });


  app.use('/api', middleware.isAuthenticated, apiRoutes(client));

  // TODO: delete
  app.post("/api/verify", (req, res) => {
    const { token } = req.body;

    jwt.verify(token, process.env.JWT_SECRET, {}, (error, authentic) => {
      if (error)
        return res
          .status(403)
          .json({ success: false, message: "Invalid token." });

      if (authentic.exp < Date.now()) {
        // res.json({success: false, message: "Expired token."})
        // refresh token here
      }

      res.status(200).json({ success: true, user: authentic });
    });
  });

  app.listen(port, () => {
    initPassport(passport, client);
    console.log(`Server is listening on http://localhost:${port}`);
  });
});

// __paypal_storage__
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozLCJmaXJzdF9uYW1lIjoiQW5pa2UiLCJsYXN0X25hbWUiOiJEb3JndSIsImVtYWlsIjoibml4ZG9yZ3VAZ21haWwuY29tIiwidXNlcl9jbGFzc2lmaWNhdGlvbiI6ImN1c3RvbWVyIiwiaWF0IjoxNjA3NTE3NTY3Nzk5LCJleHAiOjE2MDc1MTc2NTQxOTl9.mGhgIY4YF1lUeErF1cAX6P8S1r_bGPqYs_1b-3mEGc4