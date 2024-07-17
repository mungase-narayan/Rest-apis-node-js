class customErrorHandler extends Error {
    constructor(status, msg) {
        super();
        this.statusCode = status;
        this.message = msg;
    }

    static alreadyExist(message) {
        return new customErrorHandler(409, message);
    }

    static wrongCredentials  (message = "Username or Password is wrong!") { 
        return new customErrorHandler(401, message);
    }
}

module.exports = customErrorHandler;