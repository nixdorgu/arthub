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



    app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
    });
})