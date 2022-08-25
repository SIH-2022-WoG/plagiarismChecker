'use strict';

const plagiarismService = require('./plagiarismService');
const responseHelper = require('../utils/responseHelper');
const responseMessage = require('../utils/responseMessage');

module.exports = {
  createIndex: async (req, res) => {
    let response;
    try {
      const data = await plagiarismService.fetchData(req.body);
      response = new responseMessage.GenericSuccessMessage();
      response.data = data;
      return responseHelper(null, res, response, response.code);
    } catch (err) {
      console.log(err);
      response = new responseMessage.GenericFailureMessage();
      return responseHelper(null, res, response, response.code);
    }
  },
};
