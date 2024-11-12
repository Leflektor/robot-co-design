const express = require('express');
const router = express.Router();

const {
    _sessionMiddleware,
    isCSVAuthorized,
    isAuthenticated,
} = require('./middleware');

const register = require('./controllers/registerController');
const downloadToCSV = require('./controllers/downloadToCSVController');
const verify = require('./controllers/verifyController');
const sendToDB = require('./controllers/sendToDBController');
const loginToCSV = require('./controllers/loginToCSVController');
const login = require('./controllers/loginController');
const checkAffiliationCode = require('./controllers/checkAffiliationCodeController');
const userData = require('./controllers/userDataController');

const controlledRoutes = [
    { path: '/register', controller: register, method: 'post' },
    {
        path: '/downloadToCSV',
        controller: downloadToCSV,
        method: 'get',
        auth: isCSVAuthorized,
    },
    { path: '/sendToDB', controller: sendToDB, method: 'post' },
    { path: '/loginToCSV', controller: loginToCSV, method: 'post' },
    { path: '/verify', controller: verify, method: 'get' },
    { path: '/login', controller: login, method: 'post' },
    {
        path: '/checkAffiliationCode',
        controller: checkAffiliationCode,
        method: 'post',
    },
    { path: '/userData', controller: userData, method: 'get' },
];

controlledRoutes.forEach(route => {
    if (route.method === 'post') {
        if (route.auth) {
            route.post(route.path, route.auth, route.controller);
        } else {
            router.post(route.path, route.controller);
        }
    } else if (route.method === 'get') {
        if (route.auth) {
            router.get(route.path, route.auth, route.controller);
        } else {
            router.get(route.path, route.controller);
        }
    }
});

module.exports = router;
