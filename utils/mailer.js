const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'localhost',
    port: 25, // Postfix port
    secure: false, // Bez SSL/TLS dla lokalnego serwera
    tls: {
	rejectUnauthorized: false,
    },
});

// Function for sending email with confirmation link
const sendConfirmationEmail = (recipient, confirmationLink) => {
    const mailOptions = {
        from: '"ROBOT CO-CREATION" <no-reply@robotCoCreation.com>',
        to: recipient,
        subject: 'Registration confirmation',
        text: `Click the link below to confirm your account: ${confirmationLink}`,
        html: `<p>Click the link below to confirm your account: <a href="${confirmationLink}">Confirm Registration</a></p>`,
    };

    // sending mail
    return transporter
        .sendMail(mailOptions)
        .then(info =>
            console.log('Message sent by nodeMailer:', info.response),
        )
        .catch(error => console.error('Error sending email:', error));
};

// exporting the function
module.exports = sendConfirmationEmail;
