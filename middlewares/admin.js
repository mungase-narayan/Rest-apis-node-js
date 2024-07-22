const User = require('../models/User')
const CustomErrorHandler = require('../services/customErrorHandler')

const admin = async (req, res, next)=> {
    try{
        const user = await User.findOne({_id: req.user._id});
        if(user.role == 'admin'){
            next();
        }else{
            return next(
                CustomErrorHandler.unAuthorized(
                    "You are not authorized to perform this action"
                )
            );
        }
    }catch(err){
        return next(CustomErrorHandler.serverError());
    }
}

module.exports = admin;