const LocalStrategy = require("passport-local").Strategy;
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

    const localStrategy = new LocalStrategy({usernameField: 'email'}, authenticateUser)
    passport.use(localStrategy);
}

module.exports = initPassport;