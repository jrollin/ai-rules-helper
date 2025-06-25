import React from 'react';
import { FileData } from '../types';
import { FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ContentProps {
  files: FileData[];
}

export const Content: React.FC<ContentProps> = ({ files }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Content
      </h2>
      
      {files.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No files match the current filters
        </div>
      ) : (
        <div className="space-y-8">
          {files.map((file) => (
            <div key={file.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center">
                <FileText className="text-gray-500 mr-2" size={20} />
                <h3 className="text-lg font-medium text-gray-900">
                  {file.title || file.name.replace(/\.md$/, '')}
                </h3>
              </div>
              <div className="p-4 prose max-w-none">
                <ReactMarkdown className="markdown-content">
                  {file.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
