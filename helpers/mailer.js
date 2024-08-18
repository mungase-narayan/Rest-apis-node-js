const { SMTP_EMAIL, SMTP_PASSWORD, SMTP_PORT,} = require('../config/index');
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: SMTP_EMAIL,
    pass: SMTP_PASSWORD
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function sendEmail(email, subject, message, html) {
    const info = await transporter.sendMail({
        from: SMTP_EMAIL, 
        to: email,
        subject: subject,
        text: message,
        html: html,
    });

    
    console.log("Message sent: %s", info.messageId);
}

module.exports = { sendEmail };