import React, { useState, useEffect } from 'react';
import { FileList } from './components/FileList';
import { loadAndParseContentFiles } from './utils/contentLoader';
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

  // Load content files on component mount
  useEffect(() => {
    const loadContentFiles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Use the dynamic content loader to fetch and parse files
        const fileDataArray = await loadAndParseContentFiles();
        
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
    
    loadContentFiles();
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
    <div className="min-h-screen dark-theme bg-primary" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-6xl mx-auto">
        <header className="thin-border text-center p-4" >
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>AI Rules Helper</h1>
          <p style={{  marginTop: '0.5rem', fontStyle: 'italic' }}>
            View Markdown files from the content directory, filter by category and tags.
          </p>
        </header>
        <div className="px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="thin-border rounded p-4 mb-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4" role="alert">
            <p>{error}</p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-3">
            {/* Left Column - File List */}
            <div className="w-full md:w-1/3 thin-border rounded p-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
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
                <div className="thin-border rounded p-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                      Content {selectedFiles.length > 1 ? `(${selectedFiles.length} files)` : ''}
                    </h2>
                    <button 
                      className="flex items-center gap-1 px-3 py-1 text-sm rounded" 
                      style={{
                        backgroundColor: allCopied ? 'var(--button-secondary-bg)' : 'var(--button-primary-bg)', 
                        color: allCopied ? 'var(--button-secondary-text)' : 'var(--button-primary-text)'
                      }}
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
                  
                  <div className="space-y-6">
                    {selectedFiles.map((file) => (
                      <div key={file.id} className="thin-border rounded overflow-hidden">
                        <div className="p-3 thin-border flex items-center justify-between" style={{ borderWidth: '0 0 1px 0' }}>
                          <div className="flex items-center">
                            <FileText className="text-gray-500 mr-2" size={20} />
                            <h3 className="text-base font-medium" style={{ color: 'var(--text-primary)' }}>
                              {file.title || file.name.replace(/\.md$/, '')}
                            </h3>
                          </div>
                          <button 
                            className="flex items-center gap-1 px-2 py-1 text-xs rounded" style={{ backgroundColor: 'var(--button-secondary-bg)', color: 'var(--button-secondary-text)' }}
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
                        <div className="p-3 prose max-w-none" style={{ color: 'var(--text-secondary)' }}>
                          <ReactMarkdown>
                            {file.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="thin-border rounded p-4 flex items-center justify-center h-40" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <p style={{ color: 'var(--text-secondary)' }}>Select one or more files to view content</p>
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
