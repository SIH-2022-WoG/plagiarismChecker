'use strict';

const plagiarismService = require('./plagiarismService');
const responseHelper = require('../utils/responseHelper');
const responseMessage = require('../utils/responseMessage');

module.exports = {
  createIndex: async (req, res) => {
    let response;
    try {
      const thesisText = await plagiarismService.fetchData(req.body);
      req.body.thesisText = thesisText;
      const elasticResult = await plagiarismService.createIndex(req.body);
      response = new responseMessage.GenericSuccessMessage();
      response.data = elasticResult;
      return responseHelper(null, res, response, response.code);
    } catch (err) {
      console.log(err);
      response = new responseMessage.GenericFailureMessage();
      return responseHelper(null, res, response, response.code);
    }
  },

  searchIndices: async (req, res) => {
    let response;
    try {
      const searchResult = await plagiarismService.searchIndex(req);
      response = new responseMessage.GenericSuccessMessage();
      response.data = searchResult;
      return responseHelper(null, res, response, response.code);
    } catch (err) {
      console.log('Error in searchController', err);
      response = new responseMessage.GenericFailureMessage();
      return responseHelper(null, res, response, response.code);
    }
  },
};
