const dotenv = require('dotenv');
const express = require('express');
const app = express();
const session = require('express-session');
const mysql = require('mysql2');
const csvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');

dotenv.config({ path: './config.env' });

// Create the connection to database
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
});

// Connect to the database
connection.connect(err => {
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }
    console.log('Connected as id ' + connection.threadId);
});

// Middlewares
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use(
    session({
        secret: 'your-secret-key', // Klucz do szyfrowania sesji
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // Secure: true jeśli masz https
    }),
);

// Middleware for session authentication
function isAuthenticated(req, res, next) {
    if (req.session.isAuthenticated) {
        next();
    } else {
        res.redirect('/login'); // Przekierowanie do strony logowania, jeśli nie zalogowano
    }
}

const port = process.env.PORT || 3000;

// Endpoints
app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/html/index.html`);
});

app.get('/mainPage', (req, res) => {
    res.sendFile(`${__dirname}/public/html/mainPage.html`);
});

app.get('/questionare', (req, res) => {
    res.sendFile(`${__dirname}/public/html/questionare.html`);
});

app.get('/robotCoCreation', (req, res) => {
    res.sendFile(`${__dirname}/public/html/robotCoCreation.html`);
});

app.get('/unraq2', (req, res) => {
    res.sendFile(`${__dirname}/public/html/unraq2.html`);
});

app.get('/login', (req, res) => {
    res.sendFile(`${__dirname}/public/html/login.html`);
});

// Endpoint protected, accesable only after authentication
app.get('/generateCSV', isAuthenticated, (req, res) => {
    res.sendFile(`${__dirname}/public/html/generateCSV.html`);
});

// Endpoint for downloading records in CSV
app.get('/downloadDBRecordsToCSV', isAuthenticated, (req, res) => {
    const startDate = req.query.startDate; // startDate and endDate delivered as query params
    const endDate = req.query.endDate;

    if (!startDate || !endDate) {
        return res
            .status(400)
            .send('Missing required parameters: startDate and endDate');
    }

    const query =
        'SELECT * FROM robot_co_creation_answers WHERE DATE(date) BETWEEN ? AND ?';

    connection.query(query, [startDate, endDate], (err, results) => {
        if (err) {
            console.error('Error while fetching data:', err);
            return res.status(500).send('Data fetching error');
        }

        const filePath = 'filtered_records.csv';
        const userFileName = `filtered_records_~${startDate}-${endDate}.csv`;

        const csvWriterInstance = csvWriter({
            path: filePath,
            header: [
                { id: 'id', title: 'ID' },
                { id: 'date', title: 'Date' },
                { id: 'S0', title: 'S0' },
                { id: 'S1', title: 'S1' },
                { id: 'S2', title: 'S2' },
                { id: 'S3', title: 'S3' },
                { id: 'S4', title: 'S4' },
                { id: 'S5', title: 'S5' },
                { id: 'surveyedData', title: 'SurveyedData' },
            ],
        });

        csvWriterInstance
            .writeRecords(results)
            .then(() => {
                console.log('Data successfully saved to CSV file.');

                res.download(filePath, userFileName, err => {
                    if (err) {
                        console.error('Error while downloading the file:', err);
                        return res.status(500).send('File download error');
                    }

                    // Deleting file after sending
                    fs.unlink(filePath, err => {
                        if (err) {
                            console.error(
                                'Error while deleting the file:',
                                err,
                            );
                        }
                    });
                });
            })
            .catch(err => {
                console.error('Error while saving to CSV file:', err);
                return res.status(500).send('CSV file creation error');
            });
    });
});

// post requests
// Endpoint for password checking
app.post('/login', (req, res) => {
    const { password } = req.body;

    if (password === process.env.CORRECT_PASSWORD) {
        // Ustawiamy flagę sesji po poprawnym zalogowaniu
        req.session.isAuthenticated = true;
        res.status(200).send('Zalogowano pomyślnie');
    } else {
        res.status(401).send('Niepoprawne hasło');
    }
});

// Endpoint for sending data to DB
app.post('/', (req, res) => {
    const query =
        'INSERT INTO robot_co_creation_answers (date, S0, S1, S2, S3, S4, S5, surveyedData) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

    const data = req.body;

    // Execute the query
    connection.query(
        query,
        [
            data.date,
            JSON.stringify(data.S0),
            JSON.stringify(data.S1),
            JSON.stringify(data.S2),
            JSON.stringify(data.S3),
            JSON.stringify(data.S4),
            JSON.stringify(data.S5),
            JSON.stringify(data.surveyedData),
        ],
        (err, results, fields) => {
            if (err) {
                console.error('Error executing query: ', err);
                return res.status(500).send({ error: 'Error executing query' });
            }
            console.log('Inserted record ID: ', results.insertId);
            res.status(201).send({
                message: 'Record inserted succesfully',
                inseredId: results.insertId,
                data: data,
            });
        },
    );
});

app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
