import React, { useState } from 'react';
import { FileData } from '../types';
import { Copy, Check, FileText } from 'lucide-react';

interface ContextGeneratorProps {
  selectedFiles: FileData[];
}

export const ContextGenerator: React.FC<ContextGeneratorProps> = ({ selectedFiles }) => {
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Generate the concatenated context from selected files
  const generateContext = (): string => {
    return selectedFiles
      .map(file => file.content)
      .join('\n\n');
  };

  // Handle copying the generated context to clipboard
  const handleCopyToClipboard = () => {
    const context = generateContext();
    
    // Create a temporary textarea element to copy from
    const textarea = document.createElement('textarea');
    textarea.value = context;
    textarea.style.position = 'fixed';  // Prevent scrolling to bottom
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    
    try {
      // Use the older execCommand for maximum compatibility in iframe environments
      const successful = document.execCommand('copy');
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        console.error('Failed to copy text');
      }
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
    
    document.body.removeChild(textarea);
  };

  // Toggle the preview of the generated context
  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  // Calculate the total character count
  const totalCharCount = selectedFiles.reduce((sum, file) => sum + file.content.length, 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Context Generator
      </h2>
      
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-700">
              <span className="font-medium">{selectedFiles.length}</span> files selected
              {selectedFiles.length > 0 && (
                <span className="ml-2 text-gray-500">
                  (~{totalCharCount.toLocaleString()} characters)
                </span>
              )}
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={togglePreview}
              disabled={selectedFiles.length === 0}
              className={`flex items-center gap-2 py-2 px-4 rounded-lg transition-colors ${
                selectedFiles.length === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <FileText size={18} />
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
            
            <button
              onClick={handleCopyToClipboard}
              disabled={selectedFiles.length === 0}
              className={`flex items-center gap-2 py-2 px-4 rounded-lg transition-colors ${
                selectedFiles.length === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : copied
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
          </div>
        </div>
      </div>
      
      {showPreview && selectedFiles.length > 0 && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto">
          <pre className="whitespace-pre-wrap text-sm text-gray-800">
            {generateContext()}
          </pre>
        </div>
      )}
      
      {selectedFiles.length === 0 && (
        <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-lg">
          Select files from the list above to generate context
        </div>
      )}
    </div>
  );
};
