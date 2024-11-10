const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const sendConfirmationEmail = require('../utils/mailer');
const pool = require('../utils/db');

function generateConfirmationToken() {
    return uuidv4(); // example token: 'd21f1ab9-e2b0-4c3a-90ed-1a2d9a90c256'
}

function generateAccessCode() {
    return crypto.randomBytes(5).toString('hex'); // example code: 'a3f1e7b9d0'
}

async function register(req, res) {
    const {
        firstname,
        lastName,
        institution,
        email,
        login,
        password,
        description,
    } = req.body;

    const confirmationToken = generateConfirmationToken();
    const accessCode = generateAccessCode();

    try {
        // makes sure that next id will be incremented from the last one in the table, not the ones which were deleted
        await pool.query(`ALTER TABLE admins AUTO_INCREMENT = 1;`);

        const [lastRecord] = await pool.query(
            'SELECT MAX(id) AS maxId FROM admins',
        );

        const nextId = (lastRecord[0].maxId || 0) + 1;
        const userGroupTableName = `user_group_${nextId}`;

        // inserting user data to 'admins' table
        await pool.query(
            'INSERT INTO admins (first_name, last_name, institution_name, email, login, password, purpose_of_use, permissions, verification_token, is_verified, access_code, user_answers_group) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                firstname,
                lastName,
                institution,
                email,
                login,
                password,
                description,
                'user',
                confirmationToken,
                false,
                accessCode,
                userGroupTableName,
            ],
        );

        console.log(`Added new user with ID: ${nextId}`);

        // creating new table for common users answers affiliated with local admin code
        await pool.query(`
                    CREATE TABLE ${userGroupTableName} (
                      ID int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
                      date timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
                      S0 longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(S0)),
                      S1 longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(S1)),
                      S2 longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(S2)),
                      S3 longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(S3)),
                      S4 longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(S4)),
                      S5 longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(S5)),
                      surveyedData longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(surveyedData))
                    )
                `);

        // generating confirmation link after succesfull database operations
        const confirmationLink = `http://localhost:3000/verify?token=${confirmationToken}`;

        // sending e-mail with comfirmation link
        sendConfirmationEmail(email, confirmationLink);

        res.status(200).send({
            status: 'success',
            message:
                'Registration successful, please check your email inbox for registartion confirmation link.',
        });
    } catch (error) {
        console.error(error);

        // checking wheter it is a duplication error
        if (error.code === 'ER_DUP_ENTRY') {
            // checking wheter error is regarding the email
            if (error.sqlMessage.includes('email')) {
                return res.status(400).send({
                    status: 'email taken',
                    message:
                        'This email addres is already taken. Please use a different email addres.',
                });
            }
            // checking wheter error is regarding the login
            if (error.sqlMessage.includes('login')) {
                return res.status(400).send({
                    status: 'login taken',
                    message:
                        'this login is already taken. Please use a different login.',
                });
            }
        }

        res.status(500).send({
            status: 'error',
            message: 'An error occurred during registration. Try again.',
        });
    }
}

module.exports = register;
