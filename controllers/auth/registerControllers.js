const Joi = require("joi");
const User = require('../../models/User');
const RefreshToken = require('../../models/refreshToken');
const bcrypt = require('bcrypt');
const JwtService = require("../../services/jwtService")
const customErrorHandler = require('../../services/customErrorHandler');
const { REFRESH_SECRET } = require("../../config/index");
const { sendEmail } = require("../../helpers/mailer");


const registerController = {
    async registerUser(req, res, next) {
        // CheckList
        // [] validate the request
        // [] authorize the request
        // [] Check if user is in database already
        // [] prepare the model
        // [] store in the database
        // [] generate jwt token
        // [] send the response

        // validations
        const registerSchema = Joi.object({
            fullName: Joi.string().min(4).max(30).required(),
            userName: Joi.string().alphanum().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            confirmPassword: Joi.ref('password')
        });
        
        const { error } = registerSchema.validate(req.body);
        if (error) {
            return next(error);
        }

        // Check if user is in the database already
        try{
            const exist = await User.findOne({email : req.body.email});
            if(exist){
                return next(customErrorHandler.alreadyExist('This email is already taken'));
            }
        }catch(err){
            return next(err);
        }

        const { fullName, userName, email, password } = req.body;
        // Hash passwords 
        const hashedPassword = await bcrypt.hash(password, 10);

        // Prepare the model
        const user = new User({
            fullName,
            userName,
            email,
            password: hashedPassword,
        });


        const EmailSubject = "Verify your email";
        const EmailMessage = `<h2>Verify your email</h2> <p>Hi ${fullName} Thanks for Registering! 😊</p>`;
        const EmailBody = `<p>Click the link below to verify your email:</p> <a href="${APP_URL}/api/auth/verify-email/${user._id}">Verify Email</a>`;

        await sendEmail(email, EmailSubject, EmailMessage, EmailBody);

        
        let access_token;
        let refresh_token; 
        try {
            const result = await user.save(); 
            console.log("result :: ", result);
            // token
            access_token = await JwtService.sign({_id: result._id, role: result.role});
            refresh_token = await JwtService.sign({_id: result._id, role: result.role}, '1y',REFRESH_SECRET);

            //Database whitelist
            await RefreshToken.create({token: refresh_token})


        }catch(err) {
            console.log(err)
            return next(err); 
        }
         
        return res.json({ access_token: access_token, refresh_token: refresh_token});
    },
};

module.exports = registerController;
