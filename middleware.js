const session = require('express-session');

const sessionMiddleware = session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
});

function isCSVAuthorized(req, res, next) {
    if (req.session?.isCSVAuthorized) {
        return next();
    }
    res.redirect('/loginToCSV');
}

function isAuthenticated(req, res, next) {
    if (req.session?.user?.isAuthenticated) {
        return next();
    }
    res.redirect('/login');
}

function isNotLoggedIn(req, res, next) {
    if (req.session?.user?.loggedIn) {
        return next();
    }
    res.redirect('/login');
}

function isLoggedIn(req, res, next) {
    if (!req.session?.user?.loggedIn) {
        return next();
    }
    res.redirect('/mainPage');
}

function hasSubmittedCoCreation(req, res, next) {
    if (req.session?.user?.recordId) {
        return next();
    }
    res.redirect('/mainPage');
}

module.exports = {
    sessionMiddleware,
    isCSVAuthorized,
    isAuthenticated,
    isNotLoggedIn,
    isLoggedIn,
    hasSubmittedCoCreation,
};
