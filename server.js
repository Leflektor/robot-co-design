const dotenv = require('dotenv');
const express = require('express');
const app = express();
const session = require('express-session');
const register = require('./controllers/registerController');
const downloadToCSV = require('./controllers/downloadToCSVController');
const verify = require('./controllers/verifyController');
const pool = require('./utils/db');

dotenv.config({ path: './config.env' });

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
        res.redirect('/loginToCSV'); // Przekierowanie do strony logowania, jeśli nie zalogowano
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

app.get('/login', (req, res) => {
    res.sendFile(`${__dirname}/public/html/login.html`);
});

app.get('/register', (req, res) => {
    res.sendFile(`${__dirname}/public/html/register.html`);
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

app.get('/loginToCSV', (req, res) => {
    res.sendFile(`${__dirname}/public/html/loginToCSV.html`);
});

app.get('/verified', (req, res) => {
    res.sendFile(`${__dirname}/public/html/verified.html`);
});

app.get('/verify', verify);

// Endpoint protected, accesable only after authentication
app.get('/generateCSV', isAuthenticated, (req, res) => {
    res.sendFile(`${__dirname}/public/html/generateCSV.html`);
});

// Endpoint for downloading records in CSV
app.get('/downloadToCSV', isAuthenticated, downloadToCSV);

// post requests
// Endpoint for password checking
app.post('/loginToCSV', (req, res) => {
    const { password } = req.body;

    if (password === process.env.CORRECT_PASSWORD) {
        // Ustawiamy flagę sesji po poprawnym zalogowaniu
        req.session.isAuthenticated = true;
        res.status(200).send('Zalogowano pomyślnie');
    } else {
        res.status(401).send('Niepoprawne hasło');
    }
});

// Endpoint for getting users registration data
app.post('/register', register);

// Endpoint for sending data to DB
app.post('/', (req, res) => {
    console.log('Received POST data:', JSON.stringify(req.body, null, 2));
    const data = req.body;
    const query =
        'INSERT INTO robot_co_creation_answers (date, S0, S1, S2, S3, S4, S5, surveyedData) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

    const { date, S0, S1, S2, S3, S4, S5, surveyedData } = req.body;
    // Sprawdź, czy wszystkie dane są obecne
    if (!date || !S0 || !S1 || !S2 || !S3 || !S4 || !S5 || !surveyedData) {
        console.error('Missing required fields:', req.body);
        return res.status(400).send('Missing required fields');
    }

    // Execute the query
    pool.query(
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
        (err, results) => {
            if (err) {
                console.error('Error executing query: ', err);
                return res.status(500).send({
                    status: 'error',
                    message:
                        'Error during data submission. Please click the button again to try submitting once more.',
                    data: data,
                });
            }
            console.log('Inserted record ID: ', results.insertId);
            res.status(201).send({
                status: 'success',
                message: 'Record inserted succesfully',
                insertedId: results.insertId,
                data: data,
            });
        },
    );
});

app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
