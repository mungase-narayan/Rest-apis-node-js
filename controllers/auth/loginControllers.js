const Joi = require("joi");
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const JwtService = require("../../services/jwtService");
const customErrorHandler = require("../../services/customErrorHandler");

const loginController = {
    async loginUser(req, res, next) {
        // CheckList
        // [] validate the request
        // [] authorize the request
        // [] Check if user is in database
        // [] check password
        // [] generate jwt token
        // [] send the response


        // Validation 
        const loginSchema = Joi.object({ 
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        });

        const { error } = loginSchema.validate(req.body);
        if(error){
            return next(error); 
        }

        try {
            const user = await User.findOne({email: req.body.email});
            if(!user){
                return next(customErrorHandler.wrongCredentials()); 
            }


            // Compare the password
            const match = await bcrypt.compare(req.body.password, user.password);
            if(!match){
                return next(customErrorHandler.wrongCredentials()); 
            } 
 
            // Token Generation
            const access_token = await JwtService.sign({_id: user._id, role: user.role})
            return res.json({ access_token: access_token}); 

        }catch(err){
            return next(err);
        }

        // return res.json({message: "Login Failed"});

    },
};

module.exports = loginController;
