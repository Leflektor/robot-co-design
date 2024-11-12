const express = require('express');
const path = require('path');
const router = express.Router();
const {
    _sessionMiddleware,
    isCSVAuthorized,
    isAuthenticated,
} = require('./middleware');

const staticRoutes = [
    { path: '/', file: 'index.html' },
    { path: '/mainPage', file: 'mainPage.html' },
    { path: '/login', file: 'login.html' },
    { path: '/register', file: 'register.html' },
    { path: '/questionare', file: 'questionare.html' },
    { path: '/robotCoCreation', file: 'robotCoCreation.html' },
    { path: '/unraq2', file: 'unraq2.html' },
    { path: '/loginToCSV', file: 'loginToCSV.html' },
    { path: '/verified', file: 'verified.html' },
    { path: '/generateCSV', file: 'generateCSV.html', auth: isCSVAuthorized },
    { path: '/analytics', file: 'analytics.html', auth: isAuthenticated },
];

staticRoutes.forEach(route => {
    if (route.auth) {
        router.get(route.path, route.auth, (req, res) => {
            res.sendFile(path.join(__dirname, 'public/html', route.file));
        });
    } else {
        router.get(route.path, (req, res) => {
            res.sendFile(path.join(__dirname, 'public/html', route.file));
        });
    }
});

module.exports = router;
