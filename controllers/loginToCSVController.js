async function loginToCSV(req, res) {
    const { password } = req.body;

    if (password === process.env.CORRECT_PASSWORD) {
        // Setting session flag after successful logging in
        req.session.isCSVAuthorized = true;
        res.status(200).send('Logged in successfully');
    } else {
        res.status(401).send('Incorecct password');
    }
}

module.exports = loginToCSV;
