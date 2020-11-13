const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');
const dotenv = require('dotenv');
const bcrypt = require("bcrypt");

dotenv.config();

const pool = new pg.Pool(JSON.parse(process.env.DATABASE_CONFIG));
const port = process.env.PORT ?? 3000;
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}))

pool.connect((error, client) => {
    if (error){
        console.log("Could not connect to database.");
        process.exit(1);
    }

    app.get('/', (req, res) => {});

    app.get('/register', (req, res) => {
        res.send('Register Here!');
    });

    app.post('/register', (req, res) => {
        const {firstName, lastName, email, password} = req.body;

        bcrypt.hash(password, 12, (hashError, hashedPassword) => {
            if (hashError) return res.status(500).redirect('/register');

            client.query('INSERT INTO users VALUES (DEFAULT, $1, $2, $3, $4, DEFAULT, DEFAULT) RETURNING *', [firstName, lastName, email, hashedPassword], (dbError, result) => {
                if (dbError) return res.status(500).redirect('/register');

                const user = result.rows[0];
                res.send(user);
                // res.redirect('/login');
            })
        }); 

    });

    app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
    });
})