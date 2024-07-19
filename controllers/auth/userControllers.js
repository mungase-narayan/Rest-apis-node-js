const User = require('../../models/User')
const customErrorHandler = require('../../services/customErrorHandler')


const userController = {
    async me(req, res, next) {
        // CheckList
        // [] validate the request
        // [] authorize the request
        // [] Check if user is in database
        // [] get user data
        // [] send the response

        try{
            const user = await User.findOne({ _id: req.user._id }).select(
                "-password -updatedAt -__v"
            ); 

            if(!user){
                return next(customErrorHandler.notFound());
            }

            res.json(user);

        }catch(err){
            return next(err);
        }
    },
};

module.exports = userController;