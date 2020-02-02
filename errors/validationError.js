class ValidationError extends Error {
    constructor(message, code = 400) {
        super(message);

        Error.captureStackTrace(this, ValidationError);

        this.message = message;
        this.errorCode = code;
    }
}

module.exports = ValidationError;
