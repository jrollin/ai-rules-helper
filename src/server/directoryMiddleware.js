const fs = require('fs');
const path = require('path');

/**
 * Express middleware to handle directory listing requests
 * Only enabled in development mode
 */
function directoryMiddleware(req, res, next) {
  // Check if this is a directory listing request
  // In Express, req.query is an object, so we need to check if 'list' exists as a property
  const isListRequest = req.url.includes('?list');
  if (!isListRequest) {
    return next();
  }

  try {
    // Get the requested path from the URL
    const requestPath = req.path;
    // Map the request path to the file system path
    const fsPath = path.join(process.cwd(), 'public', requestPath);

    // Check if the path exists and is a directory
    if (!fs.existsSync(fsPath) || !fs.statSync(fsPath).isDirectory()) {
      return res.status(404).json({ error: 'Directory not found' });
    }

    // Read the directory contents
    const items = fs.readdirSync(fsPath);
    
    // Map the items to objects with name and isDirectory properties
    const listing = items.map(item => {
      const itemPath = path.join(fsPath, item);
      const stats = fs.statSync(itemPath);
      return {
        name: item,
        isDirectory: stats.isDirectory(),
        size: stats.size,
        lastModified: stats.mtime
      };
    });

    // Return the directory listing as JSON
    return res.json(listing);
  } catch (error) {
    console.error('Error in directory middleware:', error);
    return res.status(500).json({ error: 'Failed to read directory' });
  }
}

module.exports = directoryMiddleware;
