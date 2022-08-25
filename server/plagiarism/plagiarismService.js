'use strict';

const fetch = require('node-fetch');

module.exports = {
  fetchData: (body) => {
    return new Promise(async (resolve, reject) => {
      try {
        const fileUrl = body.fileUrl;
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

  searchIndex: (req) => {
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
};
