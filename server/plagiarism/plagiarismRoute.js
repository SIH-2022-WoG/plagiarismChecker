'use strict';

const express = require('express');
const plagiarismController = require('./plagiarismController');

const plagiarismRouter = express.Router();

plagiarismRouter.post('/create', (req, res, next) => {
  plagiarismController.createIndex(req, res);
});

module.exports = {
  plagiarismRouter,
};
