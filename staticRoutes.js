const express = require('express');
const path = require('path');
const {
    _sessionMiddleware,
    isCSVAuthorized,
    isAuthenticated,
    isNotLoggedIn,
    isLoggedIn,
    hasSubmittedCoCreation,
} = require('./middleware');
const router = express.Router();

const staticRoutes = [
    { path: '/', file: 'index.html', auth: isLoggedIn },
    { path: '/mainPage', file: 'mainPage.html', auth: isNotLoggedIn },
    { path: '/login', file: 'login.html', auth: isLoggedIn },
    { path: '/register', file: 'register.html', auth: isLoggedIn },
    { path: '/questionare', file: 'questionare.html', auth: isNotLoggedIn },
    {
        path: '/robotCoCreation',
        file: 'robotCoCreation.html',
        auth: isNotLoggedIn,
    },
    { path: '/unraq2', file: 'unraq2.html' },
    { path: '/loginToCSV', file: 'loginToCSV.html' },
    { path: '/verified', file: 'verified.html' },
    { path: '/generateCSV', file: 'generateCSV.html', auth: isCSVAuthorized },
    { path: '/analytics', file: 'analytics.html', auth: isAuthenticated },
    {
        path: '/generateRobotImage',
        file: 'generateRobotImage.html',
        auth: isNotLoggedIn,
    },
    { path: '/test', file: 'test.html' },
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
