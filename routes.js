'use strict';

/**health check route */
const healthCheck = require('./server/utils/healthCheck');
const { plagiarismRouter } = require('./server/plagiarism/plagiarismRoute');

module.exports = function (app) {
  app.use('/healthcheck', healthCheck);
  app.use('/plagiarism', [], plagiarismRouter);
};
