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
};
