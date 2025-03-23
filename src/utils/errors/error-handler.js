const {createLogger,format, transports} = require('winston');
const { AppError } = require('./app-errors');


const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'error.log', level: 'error' }),
    ]
})

class ErrorLogger {
   constructor(){}

   async logError(err) {
    console.log('====Start Error Logger ====');
    logger.log({
        private: true,
        level: 'error',
        message: `${new Date()}-${JSON.stringify(err)}`
    });
    console.log('====End Error Logger ====');
    return false;
   }


}

const ErrorHandler = async(err, req, res, next) => {
    const errorLogger = new ErrorLogger();

   if(err){
    await errorLogger.logError(err);
   }
  next()
}

module.exports = ErrorHandler;