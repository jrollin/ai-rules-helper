const fs = require('fs');
const path = require('path');

/**
 * Recursively scans a directory for markdown files
 * @param {string} dir - Directory to scan
 * @param {string} baseDir - Base directory for relative paths
 * @returns {string[]} - Array of file paths
 */
function scanDirectory(dir, baseDir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      // Recursively scan subdirectories
      const subFiles = scanDirectory(itemPath, baseDir);
      files.push(...subFiles);
    } else if (item.toLowerCase().endsWith('.md')) {
      // Add markdown files to the list with web-friendly paths
      const relativePath = path.relative(baseDir, itemPath);
      files.push('/' + relativePath.replace(/\\/g, '/'));
    }
  }
  
  return files;
}

/**
 * Generates a content manifest file
 */
function generateContentManifest() {
  const contentDir = path.join(__dirname, '../public/content');
  const publicDir = path.join(__dirname, '../public');
  
  try {
    // Scan the content directory for markdown files
    const files = scanDirectory(contentDir, publicDir);
    
    // Create the manifest object
    const manifest = {
      generated: new Date().toISOString(),
      files: files
    };
    
    // Write the manifest to a JSON file
    const manifestPath = path.join(publicDir, 'content-manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    
    console.log(`Content manifest generated with ${files.length} files`);
    console.log(files);
  } catch (error) {
    console.error('Error generating content manifest:', error);
    process.exit(1);
  }
}

// Run the generator
generateContentManifest();
