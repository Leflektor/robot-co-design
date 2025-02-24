async function createUserSession(req, res) {
    req.session.user = {
        isAuthenticated: false,
        role: 'guest',
        name: 'guest',
        affiliationCode: '',
        loggedIn: true,
    };

    res.status(200).send({
        status: 'success',
        message: 'User session created successfully',
    });
}

module.exports = createUserSession;
