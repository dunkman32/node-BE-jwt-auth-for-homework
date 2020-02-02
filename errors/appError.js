module.exports = class AppError extends Error {
    constructor(message, status) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
        this.message = message;
        this.status = status || 500;
    }
};
