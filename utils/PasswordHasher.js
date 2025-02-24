const bcrypt = require('bcryptjs');

const passwords = ['password456', 'piespiespiesR4', 'asdfadsfasdfSDF3'];

passwords.forEach(async password => {
    hashedPassword = await bcrypt.hash(password, 12);
    console.log(
        `Orginal passowrd: ${password} , hashed password: ${hashedPassword}`,
    );
});
