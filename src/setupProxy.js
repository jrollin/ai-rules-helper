const directoryMiddleware = require('./server/directoryMiddleware');

/**
 * Setup proxy for development server
 * This file is automatically loaded by react-scripts during development
 */
module.exports = function(app) {
  // Apply directory middleware to handle ?list requests
  app.use(directoryMiddleware);
};
