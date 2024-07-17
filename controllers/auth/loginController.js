const Joi = require("joi");
const User = require("../../models");

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
                return next(customErrorHandler.notFound('User not found'));
            }

            const validPassword = await bcrypt.compare(req.body.password, user.password);

            if(!validPassword){
                return next(customErrorHandler.wrongPassword('Invalid password'));
            }

            const token = await JwtService.sign({_id: user._id, role: user.role});

            res.json({access_token: token});  // Send the token back to the client

        }catch(e){

        }

    },
};

module.exports = loginController;
