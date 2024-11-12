const pool = require('../utils/db');

async function sendToDB(req, res) {
    const data = req.body;
    const { date, S0, S1, S2, S3, S4, S5, surveyedData } = req.body;

    console.log('Received POST data:', JSON.stringify(data, null, 2));

    // Sprawdź, czy wszystkie dane są obecne
    if (!date || !S0 || !S1 || !S2 || !S3 || !S4 || !S5 || !surveyedData) {
        console.error('Missing required fields:', req.body);
        return res.status(400).send('Missing required fields');
    }

    const query =
        'INSERT INTO robot_co_creation_answers (date, S0, S1, S2, S3, S4, S5, surveyedData) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

    try {
        // Execute the query
        const [results] = await pool.query(query, [
            date,
            JSON.stringify(S0),
            JSON.stringify(S1),
            JSON.stringify(S2),
            JSON.stringify(S3),
            JSON.stringify(S4),
            JSON.stringify(S5),
            JSON.stringify(surveyedData),
        ]);

        console.log('Inserted record ID: ', results.insertId);
        res.status(201).send({
            status: 'success',
            message: 'Record inserted succesfully',
            insertedId: results.insertId,
            data: data,
        });
    } catch (err) {
        console.error('Error executing query: ', err);
        return res.status(500).send({
            status: 'error',
            message:
                'Error during data submission. Please click the button again to try submitting once more.',
            data: data,
        });
    }
}

module.exports = sendToDB;
