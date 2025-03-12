const dotenv = require('dotenv');
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

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

// Middlewares
// Set security HTTP headers
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                'default-src': ["'self'"],
                'img-src': [
                    "'self'",
                    'data:',
                    'https://oaidalleapiprodscus.blob.core.windows.net',
                ],
            },
        },
    }),
);

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

// Serving static files
app.use(express.static(`${__dirname}/public`));

app.use(sessionMiddleware);

app.use(staticRoutes);
app.use(dynamicRoutes);

app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
