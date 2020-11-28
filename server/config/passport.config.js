const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcrypt");

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

    // jwt
    const options = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
    }

    const jwtAuthenticateUser = (payload, done) => {   
        return client.query('SELECT * FROM users WHERE user_id = $1', [payload.user_id], (err, user) => {
            if (err) {
                return done(err, false);
            }

            if (user) {
                return done(null, user.rows[0]);
            } else {
                return done(null, false);
            }
        });
    }

    const localStrategy = new LocalStrategy({usernameField: 'email'}, authenticateUser)
    const jwtStrategy = new JwtStrategy(options, jwtAuthenticateUser);

    passport.use(localStrategy);
    passport.use(jwtStrategy);
}

module.exports = initPassport;