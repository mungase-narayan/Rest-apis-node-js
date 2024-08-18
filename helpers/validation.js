const { check } = require('express-validator');

exports.sendMailVarificationValidator = [
    check('email', 'Please enter a valid email address').isEmail().normalizeEmail({
        gmail_remove_dots: true,
    }),
]

exports.passwordResetValidator = [
    check("email", "Please enter a valid email address")
        .isEmail()
        .normalizeEmail({
            gmail_remove_dots: true,
        }),
];