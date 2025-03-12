const express = require('express');
const router = express.Router();

const {
    _sessionMiddleware,
    isCSVAuthorized,
    isAuthenticated,
    isNotLoggedIn,
    isLoggedIn,
    hasSubmittedCoCreation,
} = require('./middleware');

const userController = require('./controllers/userController');

const downloadToCSV = require('./controllers/downloadToCSVController');
const generateImage = require('./controllers/generateRobotPictureController');
const saveOpinionOnImage = require('./controllers/saveOpinionOnImageController');

const controlledRoutes = [
    { path: '/register', controller: userController.register, method: 'post' },
    {
        path: '/downloadToCSV',
        controller: downloadToCSV,
        method: 'get',
        auth: isCSVAuthorized,
    },
    {
        path: '/sendToDB',
        controller: userController.sendToDB,
        method: 'post',
        auth: isNotLoggedIn,
    },
    {
        path: '/loginToCSV',
        controller: userController.loginToCSV,
        method: 'post',
    },
    { path: '/verify', controller: userController.verify, method: 'get' },
    { path: '/login', controller: userController.login, method: 'post' },
    {
        path: '/checkAffiliationCode',
        controller: userController.checkAffiliationCode,
        method: 'post',
    },
    {
        path: '/userData',
        controller: userController.userData,
        method: 'get',
        auth: isNotLoggedIn,
    },
    {
        path: '/generateImage',
        controller: generateImage,
        method: 'post',
        auth: hasSubmittedCoCreation,
    },
    {
        path: '/logout',
        controller: userController.logout,
        method: 'post',
        auth: isNotLoggedIn,
    },
    {
        path: '/createUserSession',
        controller: userController.createUserSession,
        method: 'post',
    },
    {
        path: '/saveOpinionOnImage',
        controller: saveOpinionOnImage,
        method: 'post',
        auth: hasSubmittedCoCreation,
    },
];

controlledRoutes.forEach(route => {
    if (route.method === 'post') {
        if (route.auth) {
            router.post(route.path, route.auth, route.controller);
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
