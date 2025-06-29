import React, { useState } from 'react';
import { FileData } from '../types';
import { Filter, Check } from 'lucide-react';
import { MultiSelect } from './MultiSelect';

interface FileListProps {
  files: FileData[];
  onFilterChange: (filters: { categories: string[], tags: string[] }) => void;
  availableCategories: string[];
  availableTags: string[];
  onFileSelect?: (file: FileData, isSelected: boolean) => void;
  selectedFiles?: string[];
}

export const FileList: React.FC<FileListProps> = ({
  files,
  onFilterChange,
  availableCategories,
  availableTags,
  onFileSelect,
  selectedFiles = []
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleCategoryChange = (selected: string[]) => {
    setSelectedCategories(selected);
    onFilterChange({
      categories: selected,
      tags: selectedTags
    });
  };

  const handleTagChange = (selected: string[]) => {
    setSelectedTags(selected);
    onFilterChange({
      categories: selectedCategories,
      tags: selected
    });
  };



  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="rounded p-4 mb-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-lg font-semibold mb-4 md:mb-0" style={{ color: 'var(--text-primary)' }}>
          Files ({files.length})
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <button
            onClick={toggleFilter}
            className="flex items-center justify-center gap-2 py-1 px-3 rounded transition-colors" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }}
          >
            <Filter size={18} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {isFilterOpen && (
        <div className="mb-4 p-3 rounded thin-border" >
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                Filter by Categories
              </label>
              <MultiSelect
                options={availableCategories.map(cat => ({ value: cat, label: cat }))}
                selected={selectedCategories}
                onChange={handleCategoryChange}
                placeholder="Select categories..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                Filter by Tags
              </label>
              <MultiSelect
                options={availableTags.map(tag => ({ value: tag, label: tag }))}
                selected={selectedTags}
                onChange={handleTagChange}
                placeholder="Select tags..."
              />
            </div>
          </div>
        </div>
      )}

      {files.length === 0 ? (
        <div className="text-center py-6" style={{ color: 'var(--text-secondary)' }}>
          No files match the current filters
        </div>
      ) : (
        <div className="space-y-2">
          {files.map((file) => {
            const isSelected = selectedFiles.includes(file.id);
            return (
              <div
                key={file.id}
                className={`thin-border ${isSelected ? 'border-yellow-400' : ''} rounded overflow-hidden transition-all cursor-pointer`}
                onClick={() => onFileSelect && onFileSelect(file, !isSelected)}
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-base font-medium truncate flex items-center" style={{ color: 'var(--text-primary)' }}>
                      {isSelected && <Check size={18} className="text-yellow-400 mr-2" />}
                      {file.title || file.name.replace(/\.md$/, '')}
                    </h3>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
