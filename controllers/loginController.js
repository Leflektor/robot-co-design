const pool = require('../utils/db');
const bcrypt = require('bcryptjs');

async function login(req, res) {
    const { login, password } = req.body;
    const query = 'SELECT * FROM admins WHERE login = ?';

    try {
        const [results] = await pool.query(query, [login]);

        // Jeżeli nie ma takiego użytkownika, zwracamy błąd
        if (!results.length) {
            return res.status(401).send({
                status: 'fail',
                message: 'Invalid login or password',
            });
        }

        const user = results[0];

        // Porównujemy hasło z użyciem bcrypt.compare
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).send({
                status: 'fail',
                message: 'Invalid login or password',
            });
        }

        // Dodatkowo sprawdzamy inne warunki, np. czy konto jest aktywne
        if (!user.is_verified) {
            return res.status(401).send({
                status: 'fail',
                message: 'Account not verified',
            });
        }

        // Jeśli wszystko się zgadza, tworzymy sesję
        req.session.user = {
            isAuthenticated: true,
            role: user.permissions,
            name: `${user.first_name} ${user.last_name}`,
            affiliationCode: user.access_code,
            loggedIn: true,
        };

        return res.status(200).send({
            status: 'success',
            message: 'Logged in successfully',
        });
    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).send({
            status: 'error',
            message: 'Server error',
        });
    }
}

module.exports = login;
