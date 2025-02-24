const dotenv = require('dotenv');
const express = require('express');
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
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use(sessionMiddleware);

app.use(staticRoutes);
app.use(dynamicRoutes);

app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
