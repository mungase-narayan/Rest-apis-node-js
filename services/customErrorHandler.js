class customErrorHandler extends Error {
    constructor(status, msg){
        this.statusCode = status;
        this.message = msg;
    }

    static alreadyExist(message){
        return new customErrorHandler(409, message);
    }
}