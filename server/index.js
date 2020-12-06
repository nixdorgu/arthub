const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const pg = require("pg");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const initPassport = require("./config/passport.config");
const checkConfig = require("./config/envError");
const formatPayload = require("./src/formatPayload");

dotenv.config();

const pool = new pg.Pool(JSON.parse(process.env.DATABASE_CONFIG));
const port = process.env.PORT ?? 3000;
const app = express();


app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5000', ],
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


  // protected
    app.get("/api/profile/:id", isAuthenticated, (req, res) => {
    return client.query(
      `SELECT user_id, CONCAT(first_name, ' ', last_name) AS name, email, member_since, user_classification FROM users WHERE user_id = $1`, [req.params.id],
      (error, result) => {
        if (error)
          return res
            .status(500)
            .json({ success: false, message: "Something went wrong." });

        if (result.rows.length === 0) {
          return res
          .status(404)
          .json({ success: false, message: "Profile not found." });
        }

        if (result.rows[0]['user_classification'] !== 'artist') {

        }
        return res.status(200).json(result.rows[0]);
      }
    );
  });


  // protected
  app.get("/api/artists/", (req, res) => {
    return client.query(
      `SELECT user_id, CONCAT(first_name, ' ', last_name) AS name, email, biography FROM users INNER JOIN artists ON user_id = artist_id`,
      (error, result) => {
        if (error)
          return res
            .status(500)
            .json({ success: false, message: "Something went wrong." });


        return res.status(200).json(result.rows);
      }
    );
  });

  app.get("/api/artists/:name", (req, res) => {
    return client.query(
      // `SELECT user_id, CONCAT(first_name, ' ', last_name) AS name, email, biography FROM users INNER JOIN artists ON user_id = artist_id INNER JOIN artist_focus USING (artist_id) INNER JOIN focus USING (focus_id) WHERE CONCAT(first_name, ' ', last_name) ILIKE '%${req.params.name}%'`,
      `SELECT user_id, CONCAT(first_name, ' ', last_name) AS name, email, biography FROM users INNER JOIN artists ON user_id = artist_id WHERE CONCAT(first_name, ' ', last_name) ILIKE '%${req.params.name}%'`,
      (error, result) => {
        if (error)
          return res
            .status(500)
            .json({ success: false, message: "Something went wrong." });

        return res.status(200).json(result.rows);
      }
    );
  });


  // protected
  app.post("/api/messages", (req, res) => {
    const {room_id, sender_id, content, timestamp} = req.body;
    client.query(`INSERT INTO messages VALUES ($1, $2, $3, $4)`, [room_id, sender_id, content, timestamp], (error, result) => {
      if (error) return res.status(500).json({message: "Something went wrong"});

      return res.status(200).json({message: "Message successfully sent!"})
    });
  });
  
  app.get("/api/messages/:id", (req, res) => {
    const id = req.params.id;

    const query = `SELECT room.room_id, room.user_id,
    CONCAT(users.first_name, ' ', users.last_name) AS user_name,
    room.artist_id,
    (SELECT CONCAT(first_name,' ', last_name) FROM users WHERE user_id = room.artist_id) AS artist_name,
    (SELECT content FROM messages WHERE room_id = room.room_id ORDER BY timestamp DESC LIMIT 1) AS last_message,
    (SELECT sender_id FROM messages WHERE room_id = room.room_id ORDER BY timestamp DESC LIMIT 1) AS sent_by,
    (SELECT timestamp FROM messages WHERE room_id = room.room_id ORDER BY timestamp DESC LIMIT 1) AS sent_at 
    FROM message_rooms AS room INNER JOIN users USING(user_id)
    WHERE EXISTS (SELECT content FROM messages WHERE room_id = room.room_id ORDER BY timestamp DESC LIMIT 1) 
    AND $1 = room.user_id OR $1 = room.artist_id 
    ORDER BY sent_at DESC;`

    client.query(query, [id], (err, result) => {
      if (err) {
        return res.status(500).json({message: 'Something wrong happened.'})
      }

      return res.status(200).json(result.rows)
    })
  });

  // protected
  app.post("/api/messages/room/", (req, res) => {
    const {user_id, user_classification, id, classification} = req.body;

    let roles = {
      artist: user_classification !== 'artist' && classification === 'artist' ? id : user_id,
      customer: user_classification !== 'artist' && classification === 'artist' ? user_id: id
    }

    if (user_id && id) {
      client.query('SELECT * FROM message_rooms WHERE (user_id = $1 OR artist_id = $1) AND (user_id = $2 OR artist_id = $2)', [user_id, id], (error, result) => {
        if (error) {
          return res.status(500).json({message: 'Uh-oh, server temporarily down.'})
        }

        if (result.rows.length === 0) {
          client.query('INSERT INTO message_rooms VALUES (DEFAULT, $1, $2)', [roles.artist, roles.customer], (error, roomResult) => {
            if (error) {
              return res.status(500).json({message: 'Uh-oh, server temporarily down.'})
            }

            return res.status(200).json({room: roomResult.rows[0]})
          })
        } else {
          return res.status(200).json({room: result.rows[0]});
        }
      });
    }
  });

  app.get("/api/messages/room/:room", (req, res) => {
    const room_id = req.params.room;

    // valid room
    return client.query('SELECT * FROM message_rooms WHERE $1 = room_id', [room_id], (roomError, room) => {
      if(roomError || room.rows.length === 0) return res.status(404).json({message: "Room not found."});

      return client.query('SELECT * FROM messages WHERE $1 = room_id', [room_id], (err, result) => {
        if (err) {
          return res.status(500).json({message: 'Something wrong happened.'})
        }
  
        return res.status(200).json(result.rows)
      })
    })
  });


  // protected
  app.post("/api/transactions", (req, res) => {
    const {title, shortDescription, description, price, artistId, userId} = req.body;

    client.query('INSERT INTO transactions VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, DEFAULT) RETURNING *', [artistId, userId, title, shortDescription, description, price], (error, result) => {
      if (error) {
        return res.status(500).json({success: false, message: "Something went wrong."})
      }

      return res.status(200).json({success: true, message: "Transaction completed successfully", data: result.rows[0]})
    })
  });

  // protected
  app.get("/api/transactions", (req, res) => {});

  // protected
  app.get("/api/transactions/:id", (req, res) => {});


  // protected
  app.post("/api/logout", (req, res) => {});

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

  // middleware - TODO: move to separate folder
  function isAuthenticated(req, res, next) {
    let token  = req.headers['authorization'];
    
    if (!token) {
      return res
      .status(403)
      .json({ success: false, message: "No token." });
    } else {
      token = token.slice(7);

      jwt.verify(token, process.env.JWT_SECRET, {}, (error, authentic) => {
        if (error)
          return res
            .status(403)
            .json({ success: false, message: "Invalid token." });
  
        if (authentic.exp < Date.now()) {
          // return res.status(403).json({success: false, message: "Expired token."})
          // refresh token here
        }
  
        next()
      });
    }

    
  };

  app.listen(port, () => {
    initPassport(passport, client);
    console.log(`Server is listening on http://localhost:${port}`);
  });
});