import React from 'react';
import { FileData } from '../types';
import { FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ContentProps {
  files: FileData[];
}

export const Content: React.FC<ContentProps> = ({ files }) => {
  return (
    <div className="thin-border rounded p-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
        Content
      </h2>
      
      {files.length === 0 ? (
        <div className="text-center py-6" style={{ color: 'var(--text-secondary)' }}>
          No files match the current filters
        </div>
      ) : (
        <div className="space-y-6">
          {files.map((file) => (
            <div key={file.id} className="thin-border rounded overflow-hidden">
              <div className="p-3 thin-border flex items-center" style={{ borderWidth: '0 0 1px 0' }}>
                <FileText style={{ color: 'var(--text-secondary)' }} className="mr-2" size={18} />
                <h3 className="text-base font-medium" style={{ color: 'var(--text-primary)' }}>
                  {file.title || file.name.replace(/\.md$/, '')}
                </h3>
              </div>
              <div className="p-3 prose max-w-none" style={{ color: 'var(--text-secondary)' }}>
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
