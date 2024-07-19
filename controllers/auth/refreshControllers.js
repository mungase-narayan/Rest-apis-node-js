const Joi = require("joi");
const User = require('../../models/User');
const RefreshToken = require("../../models/refreshToken");
const CustomErrorHandler = require("../../services/customErrorHandler");
const JwtService = require("../../services/jwtService");
const { REFRESH_SECRET } = require("../../config/index");


const refreshController = {
    async refresh(req, res, next) {
        // CheckList
        // [] validate the request
        // [] authorize the request
        // [] Check if refresh token is in database
        // [] Check if user is in database
        // [] generate new access token
        // [] send the response

        // validations
        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required(),
        });

        const { error } = refreshSchema.validate(req.body);
        if (error) {
            return next(error);
        }

        //Check if refresh token is in database
        let refreshtoken;
        try{ 
           refreshtoken = await RefreshToken.findOne({ token: req.body.refresh_token });
            if(!refreshtoken){
                return next(  CustomErrorHandler.unauthorized('Invalid refresh token '));
            }

            let userId;
            try{
                const { _id } = await JwtService.veryfy(refreshtoken.token,REFRESH_SECRET);
                userId = _id;

            }catch(err){
                return next(  CustomErrorHandler.unauthorized('Invalid refresh token '));
            }

            const user = await  User.findOne({ _id: userId })
            if(!user){
                return next(  CustomErrorHandler.unauthorized('No such user'));
            }

            // Generate new access token and refresh token
            const access_token = await JwtService.sign({_id: user._id, role: user.role})
            const refresh_token = await JwtService.sign({_id: user._id, role: user.role}, '1y',REFRESH_SECRET) ;

            //Database whitelist
            await RefreshToken.create({token: refresh_token});
            res.json({ access_token: access_token, refresh_token: refresh_token}); 

        }catch(err){
            return next(new Error('Something went wrong' + err.message));
        }
    },
};
module.exports = refreshController;
