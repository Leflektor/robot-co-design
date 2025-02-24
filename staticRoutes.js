const express = require('express');
const path = require('path');
const router = express.Router();
const {
    _sessionMiddleware,
    isCSVAuthorized,
    isAuthenticated,
    isLoggedIn,
} = require('./middleware');

const staticRoutes = [
    { path: '/', file: 'index.html' },
    { path: '/mainPage', file: 'mainPage.html', auth: isLoggedIn },
    { path: '/login', file: 'login.html' },
    { path: '/register', file: 'register.html' },
    { path: '/questionare', file: 'questionare.html', auth: isLoggedIn },
    {
        path: '/robotCoCreation',
        file: 'robotCoCreation.html',
        auth: isLoggedIn,
    },
    { path: '/unraq2', file: 'unraq2.html' },
    { path: '/loginToCSV', file: 'loginToCSV.html' },
    { path: '/verified', file: 'verified.html' },
    { path: '/generateCSV', file: 'generateCSV.html', auth: isCSVAuthorized },
    { path: '/analytics', file: 'analytics.html', auth: isAuthenticated },
    { path: '/generateImage', file: 'robotImage.html', auth: isLoggedIn },
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
