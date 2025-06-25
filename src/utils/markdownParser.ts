import { v4 as uuidv4 } from 'uuid';
import matter from 'gray-matter';
import { FileData } from '../types';

// Add Buffer polyfill for browser environment
import { Buffer } from 'buffer';
window.Buffer = Buffer;

/**
 * Parses a Markdown file and extracts its content and frontmatter
 * @param file - The file to parse
 * @returns A Promise that resolves to the parsed file data
 */
export const parseMarkdownFile = async (file: File): Promise<FileData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const { data, content: markdownContent } = matter(content);
        
        // Extract title, category and tags from frontmatter
        const title = data.title || null;
        const category = data.category || 'Uncategorized';
        const tags = Array.isArray(data.tags) ? data.tags : 
                    (data.tags ? [data.tags] : []);
        
        resolve({
          id: uuidv4(),
          name: file.name,
          title,
          content: markdownContent.trim(),
          category,
          tags,
          lastModified: file.lastModified,
        });
      } catch (error) {
        reject(new Error(`Failed to parse file ${file.name}: ${error}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error(`Failed to read file ${file.name}`));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Parses multiple Markdown files and extracts their content and frontmatter
 * @param files - The files to parse
 * @returns A Promise that resolves to an array of parsed file data
 */
export const parseMarkdownFiles = async (files: FileList): Promise<FileData[]> => {
  const filePromises: Promise<FileData>[] = [];
  
  // Filter for only Markdown files
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.name.toLowerCase().endsWith('.md')) {
      filePromises.push(parseMarkdownFile(file));
    }
  }
  
  return Promise.all(filePromises);
};
