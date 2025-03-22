const express = require('express')
const expressApp = require('./express-app')
const ErrorHandler = require('./utils/errors/error-handler')



const StartServer = async () => {

    const app = express();

    await expressApp(app)

    /**
     * ! Catch all errors
     */

    app.use((error, req,res, next) => {
        const statusCode = error.statusCode || 500;
        const data = error.data || error.message;

        ErrorHandler(error, req, res, next)

        return res.status(statusCode).json({msg : data})
    })

  
    app.listen(3000, () => {
        console.log('Server is running on port 3000')
    })
    .on('error', (err) => {
        console.error('Error starting server:', err)
        process.exit(1)
    })
}


StartServer()
