const pool = require('../utils/db');

async function checkAffiliationCode(req, res) {
    const { affiliationCode } = req.body;
    const query = 'SELECT * FROM admins WHERE access_code = ?;';

    try {
        const [results] = await pool.query(query, [affiliationCode]);

        if (results.length === 0) {
            res.status(401).send({
                status: 'fail',
                message: 'no such affiliation code',
            });
        } else if (results.length === 1) {
            req.session.user = {
                isAuthenticated: false,
                role: 'guest',
                name: 'guest',
                affiliationCode: affiliationCode,
            };

            res.status(200).send({
                status: 'success',
                message: 'affiliation code exists',
            });
        }
    } catch (err) {
        console.error('Error during checking affiliation code:', err);
        res.status(500).send({ status: 'error', message: 'Server error' });
    }
}

module.exports = checkAffiliationCode;
