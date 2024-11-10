const csvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const pool = require('../utils/db');

async function downloadToCSV(req, res) {
    const startDate = req.query.startDate; // startDate and endDate delivered as query params
    const endDate = req.query.endDate;

    if (!startDate || !endDate) {
        return res
            .status(400)
            .send('Missing required parameters: startDate and endDate');
    }

    const query =
        'SELECT * FROM robot_co_creation_answers WHERE DATE(date) BETWEEN ? AND ?';

    pool.query(query, [startDate, endDate], (err, results) => {
        if (err) {
            console.error('Error while fetching data:', err);
            return res.status(500).send('Data fetching error');
        }

        const filePath = 'filtered_records.csv';
        const userFileName = `filtered_records_~${startDate}-${endDate}.csv`;

        const csvWriterInstance = csvWriter({
            path: filePath,
            header: [
                { id: 'ID', title: 'ID' },
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
}

module.exports = downloadToCSV;
