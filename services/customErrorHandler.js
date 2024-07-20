class customErrorHandler extends Error {
    constructor(status, msg) {
        super();
        this.statusCode = status;
        this.message = msg;
    }

    static alreadyExist(message) {
        return new customErrorHandler(409, message);
    }

    static wrongCredentials(message = "Email or Password is wrong!") {
        return new customErrorHandler(401, message);
    }

    static unAuthorized(message = "unAuthorized User") {
        return new customErrorHandler(401, message);
    }

    static notFound(message = "404 Not Found") {
        return new customErrorHandler(404, message);
    }
}

module.exports = customErrorHandler;