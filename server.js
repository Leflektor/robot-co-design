const dotenv = require('dotenv');
const express = require('express');
const app = express();
const mysql = require('mysql2');

dotenv.config({ path: './config.env' });

// Create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     database: 'projekt_przejsciowy',
// });

// Connect to the database
connection.connect(err => {
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }
    console.log('Connected as id ' + connection.threadId);
});

const query =
    'INSERT INTO questionare_entries (background, caregiver, computersFamiliarity, creativityBox, dateOfBirth, education, formal, gender, profession,techSysFamiliarity,typeOfCaregiver, sectionA, sectionB, sectionC, sectionD) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

// Middlewares
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
//

const port = process.env.PORT || 3000;

// Endpoints
app.post('/', (req, res) => {
    const data = req.body;

    // Execute the query
    connection.query(
        query,
        [
            data.background,
            data.caregiver,
            data.computersFamiliarity,
            data.creativityBox,
            data.dateOfBirth,
            data.education,
            data.formal,
            data.gender,
            data.profession,
            data.techSysFamiliarity,
            data.typeOfCaregiver,
            JSON.stringify(data.sectionA),
            JSON.stringify(data.sectionB),
            JSON.stringify(data.sectionC),
            JSON.stringify(data.sectionD),
        ],
        (err, results, fields) => {
            if (err) {
                console.error('Error executing query: ', err);
                return;
            }
            console.log('Inserted record ID: ', results.insertId);
        },
    );

    // console.log(data);
    res.status(201).send(JSON.stringify(data));
});

app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
