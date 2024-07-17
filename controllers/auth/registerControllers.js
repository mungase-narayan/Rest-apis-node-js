const Joi = require("joi");
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
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            confirmPassword: Joi.ref('password')
        });
        
        const { error } = registerSchema.validate(req.body);
        if (error) {
            return next(error);
        }
         
        return res.json({ message: "registerUser Logic" });
    },
};

module.exports = registerController;
