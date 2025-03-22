const DirectoryService = require('../services/directory-service');


module.exports = (app) => {
    const directoryService = new DirectoryService();

    app.get('/list', async (req, res, next) => {
        const dirPath = req.query.path || './';

        try{
            const stream = await directoryService.getDirectory(dirPath);
            res.setHeader('Content-Type', 'application/json')
            stream.pipe (res)

        } catch (err) {
            next(err)
        }
        
    });
}