async function logout(req, res) {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
            res.status(401).send({
                status: 'fail',
                message: 'Something went wrong',
            });
        } else {
            // sesja została zniszczona; np. przekieruj użytkownika:
            res.status(200).send({
                status: 'success',
                message: 'Logged out successfully',
            });
        }
    });
}

module.exports = logout;
