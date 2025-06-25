import React, { useState, useEffect } from 'react';
import { FileList } from './components/FileList';
import { parseMarkdownFiles } from './utils/markdownParser';
import { FileData } from './types';
import { FileText, Copy, Check, Clipboard } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const App: React.FC = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<FileData[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileData[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [allCopied, setAllCopied] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // Load sample Markdown files on component mount
  useEffect(() => {
    const loadSampleFiles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Since we can't directly access the file system in the browser,
        // we need to use files from the public directory
        const contentFiles = [
          '/sample/rule1.md',
          '/sample/rule2.md',
          '/sample/rule3.md'
        ];
        
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
        const fileDataArray = await parseMarkdownFiles(validFiles as unknown as FileList);
        
        // Extract unique categories and tags
        const categories = new Set<string>();
        const tags = new Set<string>();
        
        console.log('Raw files data:', fileDataArray);
        
        fileDataArray.forEach(file => {
          console.log(`Processing file: ${file.name}`);
          console.log('  Category:', file.category);
          console.log('  Tags:', file.tags);
          
          if (Array.isArray(file.category)) {
            file.category.forEach((cat: string) => {
              console.log(`  Adding category: ${cat}`);
              categories.add(cat);
            });
          } else if (file.category) {
            console.log(`  Adding category: ${file.category}`);
            categories.add(file.category as string);
          }
          
          if (Array.isArray(file.tags)) {
            file.tags.forEach((tag: string) => {
              console.log(`  Adding tag: ${tag}`);
              tags.add(tag);
            });
          }
        });
        
        const categoriesArray = Array.from(categories);
        const tagsArray = Array.from(tags);
        
        console.log('Final categories:', categoriesArray);
        console.log('Final tags:', tagsArray);
        
        setFiles(fileDataArray);
        setFilteredFiles(fileDataArray);
        setAvailableCategories(Array.from(categories).sort());
        setAvailableTags(Array.from(tags).sort());
      } catch (err) {
        setError('Failed to load sample files. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSampleFiles();
  }, []);

  const handleFilterChange = (filters: { categories: string[], tags: string[] }) => {
    let result = [...files];
    
    // Filter by categories if any are selected
    if (filters.categories.length > 0) {
      result = result.filter(file => {
        // Handle both string and array categories
        if (Array.isArray(file.category)) {
          return file.category.some(cat => filters.categories.includes(cat));
        } else if (file.category) {
          return filters.categories.includes(file.category as string);
        }
        return false;
      });
    }
    
    // Filter by tags if any are selected
    if (filters.tags.length > 0) {
      result = result.filter(file => {
        if (Array.isArray(file.tags)) {
          return file.tags.some(tag => filters.tags.includes(tag));
        }
        return false;
      });
    }
    
    setFilteredFiles(result);
    // Reset selected files when filters change
    setSelectedFiles([]);
  };


  
  const handleFileSelection = (file: FileData, isSelected: boolean) => {
    if (isSelected) {
      setSelectedFiles(prev => [...prev, file]);
    } else {
      setSelectedFiles(prev => prev.filter(f => f.id !== file.id));
    }
  };
  
  const isFileSelected = (fileId: string) => {
    return selectedFiles.some(file => file.id === fileId);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">AI Rules Context Generator</h1>
          <p className="text-gray-600 mt-2">
            View Markdown files from the sample directory, filter by category and tags.
          </p>
        </header>
        <div className="px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4" role="alert">
            <p>{error}</p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Column - File List */}
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <FileList 
                files={filteredFiles} 
                onFilterChange={handleFilterChange}
                availableCategories={availableCategories}
                availableTags={availableTags}
                onFileSelect={handleFileSelection}
                selectedFiles={selectedFiles.map(file => file.id)}
              />
            </div>
            
            {/* Right Column - Content */}
            <div className="w-full md:w-2/3">
              {selectedFiles.length > 0 ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Content {selectedFiles.length > 1 ? `(${selectedFiles.length} files)` : ''}
                    </h2>
                    <button 
                      className="flex items-center gap-1 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                      onClick={() => {
                        const selectedContent = selectedFiles.map(file => file.content).join('\n\n---\n\n');
                        navigator.clipboard.writeText(selectedContent);
                        setAllCopied(true);
                        setTimeout(() => setAllCopied(false), 2000);
                      }}
                    >
                      {allCopied ? (
                        <>
                          <Check size={16} />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Clipboard size={16} />
                          <span>Copy Content</span>
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="space-y-8">
                    {selectedFiles.map((file) => (
                      <div key={file.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center justify-between">
                          <div className="flex items-center">
                            <FileText className="text-gray-500 mr-2" size={20} />
                            <h3 className="text-lg font-medium text-gray-900">
                              {file.title || file.name.replace(/\.md$/, '')}
                            </h3>
                          </div>
                          <button 
                            className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                            onClick={() => {
                              navigator.clipboard.writeText(file.content);
                              setCopiedIndex(selectedFiles.indexOf(file));
                              setTimeout(() => setCopiedIndex(null), 2000);
                            }}
                          >
                            {copiedIndex === selectedFiles.indexOf(file) ? (
                              <>
                                <Check size={16} className="text-green-600" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy size={16} />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <div className="p-4 prose max-w-none">
                          <ReactMarkdown>
                            {file.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center h-40">
                  <p className="text-gray-500">Select one or more files to view content</p>
                </div>
              )}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default App;
