// backend/testPdfParsing.js

const fs = require('fs');
const path = require('path');
const importCandidateController = require('../src/controllers/importCandidateController');

// Create a dummy pool with a query method that logs the SQL and parameters.
const dummyPool = {
  query: async (sql, params) => {
    console.log('Simulated DB query:', sql, params);
    return [[], []]; // return an empty result set
  }
};

// Construct a fake request object
const req = {
  file: {
    // Adjust the path to point to your actual test PDF file.
    path: path.join(__dirname, 'data', 'sample_cv.pdf'),
    originalname: 'sample_cv.pdf'
  },
  app: {
    locals: {
      pool: dummyPool
    }
  }
};

// Create a fake response object with basic status and json functions.
const res = {
  status(code) {
    console.log('Status:', code);
    return this;
  },
  json(data) {
    console.log('Response JSON:', JSON.stringify(data, null, 2));
    return this;
  }
};

// Call the controller's uploadCandidates function.
importCandidateController.uploadCandidates(req, res)
  .then(() => {
    console.log('PDF parsing test completed.');
  })
  .catch(err => {
    console.error('Error during PDF parsing test:', err);
  });
