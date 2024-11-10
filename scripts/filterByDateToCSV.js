const dotenv = require('dotenv');
const mysql = require('mysql2');
const csvWriter = require('csv-writer').createObjectCsvWriter;

dotenv.config({ path: './config.env' });

// Pobieranie argumentów z linii poleceń
const startDate = process.argv[2];
const endDate = process.argv[3];

if (!startDate || !endDate) {
    console.error('Podaj początkową i końcową datę w formacie YYYY-MM-DD.');
    process.exit(1); // Zakończenie skryptu w przypadku braku argumentów
}

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }
    console.log('Connected as id ' + connection.threadId);
});

// Funkcja filtrowania rekordów po dacie
function filterRecordsByDate(startDate, endDate) {
    const query =
        'SELECT * FROM robot_co_creation_answers WHERE DATE(date) BETWEEN ? AND ?';

    connection.query(query, [startDate, endDate], (err, results) => {
        if (err) {
            console.error('Błąd podczas pobierania danych:', err);
            return;
        }

        console.log('Znalezione rekordy:', results);

        // Zapisanie wyników do pliku CSV
        saveRecordsToCSV(results);
    });
}

// Funkcja zapisywania wyników do pliku CSV
function saveRecordsToCSV(records) {
    const csvWriterInstance = csvWriter({
        path: 'filtered_records.csv',
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
        .writeRecords(records)
        .then(() => {
            console.log('Zapisano rekordy do pliku CSV.');
            // Zamknij połączenie z bazą danych po zakończeniu zapisu
            connection.end(err => {
                if (err) {
                    console.error('Błąd podczas zamykania połączenia:', err);
                } else {
                    console.log('Połączenie z bazą danych zamknięte.');
                }
            });
        })
        .catch(err => {
            console.error('Błąd podczas zapisywania do pliku CSV:', err);
            // Zamknij połączenie nawet w przypadku błędu
            connection.end();
        });
}

// Filtruj rekordy w przedziale dat
filterRecordsByDate(startDate, endDate);
