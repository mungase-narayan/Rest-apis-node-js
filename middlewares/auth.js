const customErrorHandler = require('../services/customErrorHandler');
const JwtService = require('../services/jwtService');

const auth = async  (req, res, next)=> {
    let authHeader = req.headers.authorization;
    if(!authHeader){
        return next(customErrorHandler.unauthorized());
    }

    const token = authHeader.split(' ')[1];

    try{
        const {_id, role} = await JwtService.veryfyToken(token);
        const user = {
            _id,
            role,
        }
        req.user = user;
        next();

    }catch(err){
        return next(customErrorHandler.unauthorized());
    }
}

module.exports = auth;