import { FileData } from '../types';
import { parseMarkdownFiles } from './markdownParser';

/**
 * Dynamically loads content files from the content directory
 * @returns A Promise that resolves to an array of file paths
 */
export const loadContentFiles = async (): Promise<string[]> => {
  try {
    // In development mode, fetch the directory listing
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: Fetching directory listing');
      return await fetchDirectoryListing('/content');
    } 
    // In production mode, use the pregenerated list
    else {
      const response = await fetch('/content-manifest.json');
      if (!response.ok) {
        throw new Error('Failed to load content manifest');
      }
      const manifest = await response.json();
      return manifest.files;
    }
  } catch (error) {
    console.error('Error loading content files:', error);
    return [];
  }
};

/**
 * Recursively fetches directory listing
 * @param path - The directory path to fetch
 * @returns A Promise that resolves to an array of file paths
 */
const fetchDirectoryListing = async (path: string): Promise<string[]> => {
  try {
    console.log(`Fetching directory listing for: ${path}`);
    // Fetch the directory listing
    const response = await fetch(`${path}?list`);
    if (!response.ok) {
      console.error(`Failed to fetch directory listing for ${path}:`, response.status, response.statusText);
      throw new Error(`Failed to fetch directory listing for ${path}`);
    }
    
    const listing = await response.json();
    console.log(`Directory listing for ${path}:`, listing);
    let files: string[] = [];
    
    // Process each item in the directory
    for (const item of listing) {
      const itemPath = `${path}/${item.name}`;
      
      // If it's a directory, recursively fetch its contents
      if (item.isDirectory) {
        console.log(`Found directory: ${itemPath}`);
        const subFiles = await fetchDirectoryListing(itemPath);
        files = [...files, ...subFiles];
      } 
      // If it's a markdown file, add it to the list
      else if (item.name.toLowerCase().endsWith('.md')) {
        console.log(`Found markdown file: ${itemPath}`);
        files.push(itemPath);
      }
    }
    
    console.log(`Files found in ${path}:`, files);
    return files;
  } catch (error) {
    console.error(`Error fetching directory listing for ${path}:`, error);
    return [];
  }
};

/**
 * Loads and parses content files
 * @returns A Promise that resolves to an array of parsed file data
 */
export const loadAndParseContentFiles = async (): Promise<FileData[]> => {
  try {
    const contentFiles = await loadContentFiles();
    
    const filePromises = contentFiles.map(async (path: string) => {
      try {
        const response = await fetch(path);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${path}`);
        }
        const text = await response.text();
        const fileName = path.split('/').pop() || '';
        
        // Create a File object from the fetched content
        const file = new File([text], fileName, { type: 'text/markdown' });
        return file;
      } catch (error) {
        console.error(`Error loading ${path}:`, error);
        return null;
      }
    });
    
    const fileList = await Promise.all(filePromises);
    // Filter out any null values from failed fetches
    const validFiles = fileList.filter((file: any) => file !== null);
    
    return await parseMarkdownFiles(validFiles as unknown as FileList);
  } catch (error) {
    console.error('Error loading and parsing content files:', error);
    return [];
  }
};
