
const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises
const { Readable } = require('stream');
const { NotFoundError, APIError } = require('../utils/errors/app-errors');

class DirectoryService {


    async getDirectory(dirPath){
        try {
    
            const checkDirectory = await fsPromises.stat(dirPath);

            if (!checkDirectory.isDirectory()) {
                throw new NotFoundError("Directory '" + dirPath + "' is not a directory")
            }

            const readableStream = new Readable({
                read() {}
            })

            const files = await fsPromises.readdir(dirPath,{
                withFileTypes: true
            });

            readableStream.push('[');

            const fileDetails = files.map(async (file) => {
                const fullPath = path.join(dirPath, file.name);
                const fileInfo = await fs.promises.stat(fullPath);

                return {
                    name: file.name,
                    fullPath: fullPath,
                    size: fileInfo.size,
                    extension: path.extname(file.name),
                    type: file.isDirectory() ? 'directory' : 'file',
                    createdAt: fileInfo.birthtime,
                    permissions: fileInfo.mode.toString(8).slice(-3)
                }
            });

            const fileInfo = await Promise.all(fileDetails);

            fileInfo.forEach((file, index) => {
                if(index > 0){
                    readableStream.push(',\n');
                }

                readableStream.push(JSON.stringify(file) + '\n')
            })


            readableStream.push('\n]');
            readableStream.push(null)

           return readableStream;
        } catch (error) {
            if (error) {
                 throw new NotFoundError('The specified path does not exist.');
            }
        }
        }
}

module.exports = DirectoryService;