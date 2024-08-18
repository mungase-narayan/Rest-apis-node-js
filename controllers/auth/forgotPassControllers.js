const CustomErrorHandler = require('../../services/customErrorHandler')
const passwordReset = require('../../models/passwordReset')
const randomstring = require('randomstring');
const User = require('../../models/User');
const { sendEmail } = require("../../helpers/mailer");

const { validationResult } = require('express-validator');


const forgotPassControllers = {
    async forgotPassword(req, res, next) {
        // [] check if user exists in the database
        try {

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    msg: "Error",
                    errors: errors.array(),
                });
            }

            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return next(CustomErrorHandler.wrongCredentials());
            }

            const randomString = randomstring.generate();
            // await PasswordReset.deleteOne({ user_id: user._id });
            // Save the token in the database
            const PasswordReset = new passwordReset({
                userId: user._id,
                token: randomString,
            });

            const EmailSubject = "Password Reset Request";
            const EmailMessage = "<p>You requested a password reset for your account.</p>";
            const EmailBody = `
                <p>Click the link below to reset your password:</p>
                <a href="http://localhost:3000/api/auth/forgot-password?tolen=${randomString}">Reset Password</a>
                <p>This link will expire in 10 min.</p>
            `;

            // Send email
             await sendEmail(user.email, EmailSubject, EmailMessage, EmailBody);

            res.json({ message: "Password reset link sent to your email" });

        } catch (error) {
            return res.status(403).json({ message: error.message });
        }
        res.status(201).json({ message: "Password reset link sent to your email, Please Check!"});
    },
};
module.exports = forgotPassControllers;
