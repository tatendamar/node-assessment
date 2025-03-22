const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');
const DirectoryService = require('./directory-service');
const { NotFoundError, APIError } = require('../utils/errors/app-errors');

describe('DirectoryService', () => {
  let directoryService;
  let mockDirPath;
  let mockFiles;

  beforeEach(() => {
    directoryService = new DirectoryService();
    mockDirPath = path.join(__dirname, 'mockDir');
    mockFiles = [
      {
        name: 'file1.txt',
        isDirectory: () => false,
      },
      {
        name: 'subDir',
        isDirectory: () => true,
      },
    ];

   
    jest.spyOn(fs.promises, 'stat').mockImplementation((path) => {
      if (path === mockDirPath) {
        return Promise.resolve({ isDirectory: () => true });
      }
      if (path === path.join(mockDirPath, mockFiles[0].name)) {
        return Promise.resolve({
          size: 1024,
          birthtime: new Date(),
          mode: 33188, // Example mode for file
        });
      }
      if (path === path.join(mockDirPath, mockFiles[1].name)) {
        return Promise.resolve({
          size: 0,
          birthtime: new Date(),
          mode: 16877, // Example mode for directory
        });
      }
      return Promise.reject(new Error('ENOENT'));
    });

    jest.spyOn(fs.promises, 'readdir').mockImplementation(() => {
      return Promise.resolve(mockFiles);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return a readable stream with directory contents', async () => {
    const stream = await directoryService.getDirectory(mockDirPath);
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => {
      const result = Buffer.concat(chunks).toString();
      const expected = JSON.stringify([
        {
          name: 'file1.txt',
          fullPath: path.join(mockDirPath, 'file1.txt'),
          size: 1024,
          extension: '.txt',
          type: 'file',
          createdAt: expect.any(Date),
          permissions: '644',
        },
        {
          name: 'subDir',
          fullPath: path.join(mockDirPath, 'subDir'),
          size: 0,
          extension: '',
          type: 'directory',
          createdAt: expect.any(Date),
          permissions: '755',
        },
      ]);
      expect(result).toEqual(expected);
    });
  });


  it('should throw NotFoundError if the path does not exist', async () => {
    jest.spyOn(fs.promises, 'stat').mockImplementationOnce(() => {
      return Promise.reject(new Error('ENOENT'));
    });

    await expect(directoryService.getDirectory(mockDirPath)).rejects.toThrow(
      new NotFoundError('The specified path does not exist.')
    );
  });
});