'use strict';

const express = require('express');
const plagiarismController = require('./plagiarismController');

const plagiarismRouter = express.Router();

plagiarismRouter.post('/create', (req, res, next) => {
  plagiarismController.createIndex(req, res);
});

plagiarismRouter.get('/search/exact', (req, res, next) => {
  plagiarismController.exactSearchs(req, res);
});

plagiarismRouter.get('/search/partial', (req, res, next) => {
  plagiarismController.partialSearch(req, res);
});

module.exports = {
  plagiarismRouter,
};
