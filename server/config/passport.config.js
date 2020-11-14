const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function initPassport (passport, client) {
    const authenticateUser = async(email, password, done) => {      
        const user = await client.query('SELECT * FROM users WHERE email = $1', [email]);

        if (!user) {
            return done(null, false, {message: 'Incorrect credentials.'})
        }

        bcrypt.compare(password, user.rows[0].password, (error, match) => {
            if (error || !match) {
                return done (null, false, {message: 'Incorrect credentials'});
            }
            
            return done(null, user.rows[0]);
        })
    }

    passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser));
    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((user, done) => done(null, user))
}

module.exports = initPassport;