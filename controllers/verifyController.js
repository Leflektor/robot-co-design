const pool = require('../utils/db');

async function verify(req, res) {
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
}

module.exports = verify;
