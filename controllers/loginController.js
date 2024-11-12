const pool = require('../utils/db');

async function login(req, res) {
    const { login, password } = req.body;
    const query = 'SELECT * FROM admins WHERE login = ? AND password = ?;';

    try {
        const [results] = await pool.query(query, [login, password]);

        if (results[0] && results[0].is_verified) {
            req.session.user = {
                isAuthenticated: true,
                role: results[0].permissions,
                name: `${results[0].first_name} ${results[0].last_name}`,
                affiliationCode: results[0].access_code,
            };

            res.status(200).send({
                status: 'success',
                message: 'Logged in successfully',
            });
        } else {
            res.status(401).send({
                status: 'fail',
                message: 'Invalid login or password',
            });
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send({ status: 'error', message: 'Server error' });
    }
}

module.exports = login;
