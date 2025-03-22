const STATUS_CODES = {
    OK: 200,
    BAD_REQUEST: 400,
    UN_AUTHORISED: 403,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500,
}

class AppError extends Error {
    constructor(
        name,
        statusCode,
        description, 
    ){
        super(description);
        Object.setPrototypeOf(this,new.target.prototype);
        this.name = name;
        this.statusCode = statusCode;
        Error.captureStackTrace(this);
    }
}

//api Specific Errors
class APIError extends AppError {
    constructor(description ='Internal Server Error'){
        super('API Internal Server Error',STATUS_CODES.INTERNAL_ERROR,description);
    }
}

//400
class BadRequestError extends AppError {
    constructor(description = 'Bad request'){
        super('BAD REQUEST', STATUS_CODES.BAD_REQUEST,description);
    }
}

//404
class NotFoundError extends AppError {
    constructor(description = 'Not Found'){
        super('NOT FOUND', STATUS_CODES.NOT_FOUND,description);
    }
}


module.exports = {
    AppError,
    APIError,
    BadRequestError,
    NotFoundError,
    STATUS_CODES,
}
