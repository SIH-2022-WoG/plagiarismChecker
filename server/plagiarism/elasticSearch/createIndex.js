const elasticClient = require('./elasticClient');

const createIndex = async (indexName) => {
  await elasticClient.indices.create({ index: indexName });
  console.log('Index created');
};

createIndex('thesis');
