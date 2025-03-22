const express = require('express');
const cors = require('cors');
const { getDirectory } = require('./api');

module.exports = async (app) => {
   app.use(express.json());
   app.use(cors());

   getDirectory(app)
}