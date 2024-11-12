const session = require('express-session');

const sessionMiddleware = session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
});

function isCSVAuthorized(req, res, next) {
    if (req.session.isCSVAuthorized) {
        return next();
    }
    res.redirect('/loginToCSV');
}

function isAuthenticated(req, res, next) {
    if (req.session.user && req.session.user.isAuthenticated) {
        return next();
    }
    res.redirect('/login');
}

module.exports = { sessionMiddleware, isCSVAuthorized, isAuthenticated };
