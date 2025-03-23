"use strict";

var express = require('express');

var cors = require('cors');

var _require = require('./api'),
    getDirectory = _require.getDirectory;

module.exports = function _callee(app) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          app.use(express.json());
          app.use(cors());
          getDirectory(app);

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
};