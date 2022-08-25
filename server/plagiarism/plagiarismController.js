'use strict';

const plagiarismService = require('./plagiarismService');
const responseHelper = require('../utils/responseHelper');
const responseMessage = require('../utils/responseMessage');

module.exports = {
  createIndex: async (req, res) => {
    const data = plagiarismService.fetchData(req.body);
  },
};
