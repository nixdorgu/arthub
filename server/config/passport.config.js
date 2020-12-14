const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const bcrypt = require("bcrypt");
require('dotenv').config();

function initPassport (passport, client) {
    // local
    const authenticateUser = async(email, password, done) => {      
        const user = await client.query('SELECT * FROM users WHERE email = $1', [email]);

        if (user.rows.length === 0) {
            return done(null, {}, {message: 'Incorrect credentials.'})
        }

        bcrypt.compare(password, user.rows[0].password, (error, match) => {
            if (error || !match) {
                return done(null, {}, {message: 'Incorrect credentials'});
            }

            if (user.rows[0]['status'] !== 'active') return done(null, {}, {message: 'Account suspended'})

            return done(null, user.rows[0]);
        })
    }

    const authenticateFacebookUser = async(accessToken, refreshToken, profile, done) => {
        const {first_name, last_name, email} = profile._json;

        const user = await client.query('SELECT * FROM users WHERE email = $1', [email]);

        if (user.rows.length === 0) {
            client.query(`INSERT INTO users (user_id, email, first_name, last_name, member_since, status, user_classification) VALUES (DEFAULT, $1, $2, $3, DEFAULT, DEFAULT, DEFAULT) RETURNING *`, [ email, first_name, last_name], (error, result) => {
                if (error) return done(null, {}, {message: 'Account not found.'});

                return done(null, result.rows[0])
            })
        } else {
            return (user.rows[0]['status'] !== 'active') ? done(null, {}, {message: 'Account suspended'}) : done(null, user.rows[0])
        }  
    };

    const localStrategy = new LocalStrategy({usernameField: 'email'}, authenticateUser)
    const facebookStrategy = new FacebookStrategy({clientID: process.env.FB_APP_ID, clientSecret: process.env.FB_APP_SECRET, callbackURL: "http://localhost:5000/auth/facebook/callback", profileFields: ['id', 'email', 'name']}, authenticateFacebookUser)

    passport.use(localStrategy);
    passport.use(facebookStrategy);
}

module.exports = initPassport;