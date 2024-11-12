async function userData(req, res) {
    if (!req.session.user) {
        req.session.user = {
            isAuthenticated: false,
            role: 'guest',
            name: 'guest',
            affiliationCode: '',
        };
    }
    const userData = req.session.user;
    res.status(200).json({ status: 'success', userData: userData });
}

module.exports = userData;
