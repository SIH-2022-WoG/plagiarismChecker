'use strict';

const fetch = require('node-fetch');

module.exports = {
  fetchData: (body) => {
    return new Promise(async (resolve, reject) => {
      try {
        const fileUrl = body.fileUrl;
        if (!fileUrl) {
          reject('please send file url');
        }
        const response = await fetch(fileUrl);
        const data = await response.text();
        return resolve(data);
      } catch (err) {
        console.log('Error in fetching :::: ', err);
        return reject(err);
      }
    });
  },

  createIndex: (body) => {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await elasticClient.index({
          index: 'thesis',
          document: {
            thesisId: body.thesisId,
            content: body.thesisText,
            title: body.title,
          },
        });
        await elasticClient.indices.refresh({ index: 'thesis' });
        resolve(result);
      } catch (err) {
        console.log('Error in createIndex service :::: ', err);
        return reject(err);
      }
    });
  },

  exactSearchs: (req) => {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await elasticClient.search({
          index: 'thesis',
          query: {
            match_phrase: { content: req.query.text },
          },
          allow_partial_search_results: false,
        });
        resolve(result);
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  },

  partialSearch: (req) => {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await elasticClient.search({
          index: 'thesis',
          query: {
            match: { content: req.query.text },
          },
          allow_partial_search_results: true,
        });
        resolve(result);
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  },

  calculatePlagiarism: async (req) => {
    return new Promise(async (resolve, reject) => {
      const body = req.body;
      const { thesisText } = body;
      const searches = [];
      const lang = req.query.lang;
      let arr;
      if (!lang || parseInt(lang) === 0) {
        arr = thesisText.split('. ');
      } else {
        arr = thesisText.split('| ');
      }

      arr.forEach((el) => {
        searches.push({ index: 'thesis' });
        searches.push({ query: { match_phrase: { content: el } } });
      });
      try {
        const searchResults = await elasticClient.msearch({
          searches,
        });
        resolve(searchResults.responses);
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  },
};
