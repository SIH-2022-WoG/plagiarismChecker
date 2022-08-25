'use strict';

const plagiarismService = require('./plagiarismService');
const responseHelper = require('../utils/responseHelper');
const responseMessage = require('../utils/responseMessage');

function preprocessText(thesisText, referText, lang) {
  let thesisdata, referdata;
  if (lang) {
    thesisdata = thesisText.split('| ');
    referdata = referText.split('| ');
  } else {
    thesisdata = thesisText.split('. ');
    referdata = referText.split('. ');
  }

  const hash = new Set();
  referdata.forEach((el) => hash.add(el));
  const formattedText = [];
  thesisdata.forEach((el) => {
    if (!hash.has(el)) {
      formattedText.push(el);
    }
  });
  const ans = formattedText.join('\n');
  return ans;
}

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

  exactSearchs: async (req, res) => {
    let response;
    const phrase = req.query.text;
    if (!phrase) {
      return responseHelper(
        null,
        res,
        responseMessage.incorrectPayload,
        parseInt(responseMessage.incorrectPayload.code)
      );
    }

    try {
      const searchResult = await plagiarismService.exactSearchs(req);
      response = new responseMessage.GenericSuccessMessage();
      response.data = searchResult;
      return responseHelper(null, res, response, response.code);
    } catch (err) {
      console.log('Error in searchController', err);
      response = new responseMessage.GenericFailureMessage();
      return responseHelper(null, res, response, response.code);
    }
  },

  partialSearch: async (req, res) => {
    let response;
    const phrase = req.query.text;
    if (!phrase) {
      return responseHelper(
        null,
        res,
        responseMessage.incorrectPayload,
        parseInt(responseMessage.incorrectPayload.code)
      );
    }

    try {
      const searchResult = await plagiarismService.partialSearch(req);
      response = new responseMessage.GenericSuccessMessage();
      response.data = searchResult;
      return responseHelper(null, res, response, response.code);
    } catch (err) {
      console.log('Error in searchController', err);
      response = new responseMessage.GenericFailureMessage();
      return responseHelper(null, res, response, response.code);
    }
  },

  calculateReport: async (req, res) => {
    let response;
    try {
      let thesisText = await plagiarismService.fetchData(req.body);
      const referText = req.body.referText;
      const lang = req.query.lang || 0;
      if (referText) {
        thesisText = preprocessText(thesisText, referText, lang);
      }
      req.body.thesisText = thesisText;
      const results = await plagiarismService.calculatePlagiarism(req);
      let lines = 0;
      let count = 0;
      const plagReport = {};
      results.forEach((el) => {
        if (el.hits.max_score && el.hits.max_score > 0.5) {
          lines++;
          plagReport[count] = el.hits.hits[0]._source.thesisId;
        }
        count++;
      });
      const percentage = lines / (results.length * 1.0);
      response = new responseMessage.GenericSuccessMessage();
      response.percentage = percentage * 100;
      response.report = plagReport;
      return responseHelper(null, res, response, response.code);
    } catch (err) {
      console.log('error in calculate report', err);
      response = new responseMessage.GenericFailureMessage();
      return responseHelper(null, res, response, response.code);
    }
  },
};
