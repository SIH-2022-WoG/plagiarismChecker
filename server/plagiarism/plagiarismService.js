'use strict';

const fetch = require('node-fetch');

module.exports = {
  fetchData: async (body) => {
    const fileUrl = body.fileUrl;
    const response = await fetch(fileUrl);
    const res = await response.text();
    console.log(res);
  },
};
