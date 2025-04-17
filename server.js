const dotenv = require('dotenv');
const express = require('express');
const rateLimit = require('express-rate-limit');

const app = express();
const {
    sessionMiddleware,
    _isCSVAuthorized,
    _isAuthenticated,
} = require('./middleware');
const staticRoutes = require('./staticRoutes');
const dynamicRoutes = require('./dynamicRoutes');

dotenv.config({ path: './config.env' });

const port = process.env.PORT || 3000;

// General Middlewares

// Limit requests from same IP
const limiter = rateLimit({
    max: 500,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this ip, please try again in an hour!',
});
app.use('/', limiter);

// Body parses, reading data from body into req.body
app.use(
    express.json({
        limit: '10kb',
    }),
);

// Initialization of user sessions
app.use(sessionMiddleware);

// Static and dynamic routing

// Serving static files
app.use(express.static(`${__dirname}/public`));
app.use(staticRoutes);

// Serving API for communication with frontend
app.use(dynamicRoutes);

app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
