const dotenv = require('dotenv');
const mysql = require('mysql2/promise');

dotenv.config({ path: './config.env' });

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
    waitForConnections: true,
    connectionLimit: 10, // limit of pool connections
    queueLimit: 0,
});

module.exports = pool;
