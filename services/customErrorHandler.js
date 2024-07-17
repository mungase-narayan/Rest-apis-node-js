class customErrorHandler extends Error {
    constructor(status, msg){
        super();
        this.statusCode = status;
        this.message = msg;
    }

    static alreadyExist(message){
        return new customErrorHandler(409, message);
    }
}

module.exports = customErrorHandler;