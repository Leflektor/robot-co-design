const pool = require('../utils/db');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const sendConfirmationEmail = require('../utils/mailer');

exports.register = async (req, res) => {
    const {
        firstname,
        lastName,
        institution,
        email,
        login,
        password,
        description,
    } = req.body;

    hashedPassword = await bcrypt.hash(password, 12);

    const confirmationToken = uuidv4(); // example token: 'd21f1ab9-e2b0-4c3a-90ed-1a2d9a90c256'
    const accessCode = crypto.randomBytes(5).toString('hex'); // example code: 'a3f1e7b9d0'

    try {
        // makes sure that next id will be incremented from the last one in the table, not the ones which were deleted
        await pool.query(`ALTER TABLE admins AUTO_INCREMENT = 1;`);

        // inserting user data to 'admins' table
        const newRecord = await pool.query(
            'INSERT INTO admins (first_name, last_name, institution_name, email, login, password, purpose_of_use, permissions, verification_token, is_verified, access_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                firstname,
                lastName,
                institution,
                email,
                login,
                hashedPassword,
                description,
                'local admin',
                confirmationToken,
                false,
                accessCode,
            ],
        );

        console.log(`Added new user with ID: ${newRecord[0].insertId}`);

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
};

exports.verify = async (req, res) => {
    const { token } = req.query;

    try {
        // Checking if there is any token
        if (!token) {
            return res.redirect(
                `/verified?status=error&message=Invalid+or+missing+token`,
            );
        }

        // Searching for a user matching the token
        const [users] = await pool.query(
            'SELECT * FROM admins WHERE verification_token = ?',
            [token],
        );

        // Checking wheter user exists
        if (users.length === 0) {
            return res.redirect(
                `/verified?status=error&message=Invalid+token+or+user+does+not+exist`,
            );
        }

        const user = users[0];

        // Checking if account has been already verified
        if (user.is_verified) {
            return res.redirect(
                `/verified?status=error&message=Account+is+already+verified`,
            );
        }

        // Updating user's status to verified
        await pool.query('UPDATE admins SET is_verified = 1 WHERE id = ?', [
            user.id,
        ]);

        console.log(`User with ID: ${user.id} has been verified`);

        res.redirect(
            `/verified?status=success&message=Account+verified+successfully`,
        );
    } catch (error) {
        console.error(error);
        res.redirect(
            `/verified?status=error&message=An+error+occurred+while+verifying+the+account`,
        );
    }
};

exports.login = async (req, res) => {
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
};

exports.checkAffiliationCode = async (req, res) => {
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
                loggedIn: true,
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
};

exports.createUserSession = async (req, res) => {
    req.session.user = {
        isAuthenticated: false,
        role: 'guest',
        name: 'guest',
        affiliationCode: '',
        loggedIn: true,
    };

    res.status(200).send({
        status: 'success',
        message: 'User session created successfully',
    });
};

exports.userData = async (req, res) => {
    if (!req.session.user) {
        req.session.user = {
            isAuthenticated: false,
            role: 'guest',
            name: 'guest',
            affiliationCode: '',
        };
    }
    const userData = req.session.user;
    res.status(200).json({ status: 'success', userData: userData });
};

exports.logout = async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
            res.status(401).send({
                status: 'fail',
                message: 'Something went wrong',
            });
        } else {
            // sesja została zniszczona; np. przekieruj użytkownika:
            res.status(200).send({
                status: 'success',
                message: 'Logged out successfully',
            });
        }
    });
};

exports.sendToDB = async (req, res) => {
    const data = req.body;
    const { date, S0, S1, S2, S3, S4, S5, surveyedData } = req.body;

    // console.log('Received POST data:', JSON.stringify(data, null, 2));

    // checking whether all necessery data is present
    if (!date || !S0 || !S1 || !S2 || !S3 || !S4 || !S5 || !surveyedData) {
        console.error('Missing required fields:', req.body);
        return res.status(400).send('Missing required fields');
    }

    const {
        age,
        gender,
        maritalStatus,
        education,
        placeOfResidence,
        livingArrangement,
        profession,
        computerFamiliarity,
        techSysFamiliarity,
        loneliness,
        healthRating,
        fitnessRating,
        creativityBox,
        affiliationCode,
    } = surveyedData;

    const variables = [
        age,
        gender,
        maritalStatus,
        education,
        placeOfResidence,
        livingArrangement,
        profession,
        computerFamiliarity,
        techSysFamiliarity,
        loneliness,
        healthRating,
        fitnessRating,
        creativityBox,
        affiliationCode,
    ];

    // Sprawdź, które zmienne są undefined
    for (const [key, value] of Object.entries(variables)) {
        if (value === undefined) {
            return res.status(400).send('Missing required fields');
        }
    }

    // const query =
    //     'INSERT INTO robot_co_creation_answers (date, S0, S1, S2, S3, S4, S5, surveyedData) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

    const query = `
        INSERT INTO robot_co_creation_answers (
            date, age, gender, maritalStatus, education, placeOfResidence, livingArrangement, profession,
            computerFamiliarity, techSysFamiliarity, loneliness, healthRating, fitnessRating, creativityBox, affiliationCode,
            S0, S1, S2, S3, S4, S5
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    try {
        // Execute the query
        const [results] = await pool.query(query, [
            date,
            age,
            gender,
            maritalStatus,
            education,
            placeOfResidence,
            livingArrangement,
            profession,
            computerFamiliarity,
            techSysFamiliarity,
            loneliness,
            healthRating,
            fitnessRating,
            creativityBox,
            affiliationCode,
            JSON.stringify(S0),
            JSON.stringify(S1),
            JSON.stringify(S2),
            JSON.stringify(S3),
            JSON.stringify(S4),
            JSON.stringify(S5),
        ]);

        console.log('Inserted record ID: ', results.insertId);

        req.session.user.recordId = results.insertId;

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
};

exports.loginToCSV = async (req, res) => {
    const { password } = req.body;

    if (password === process.env.CORRECT_PASSWORD) {
        // Setting session flag after successful logging in
        req.session.isCSVAuthorized = true;
        res.status(200).send('Logged in successfully');
    } else {
        res.status(401).send('Incorecct password');
    }
};
