const serverless = require('serverless-http');
const app = require('./app'); // Import the Express app

// Wrap the Express app with serverless-http
module.exports.main = serverless(app);
