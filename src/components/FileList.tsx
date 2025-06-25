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
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 md:mb-0">
          Files ({files.length})
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <button
            onClick={toggleFilter}
            className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors"
          >
            <Filter size={18} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {isFilterOpen && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
        <div className="text-center py-8 text-gray-500">
          No files match the current filters
        </div>
      ) : (
        <div className="space-y-2">
          {files.map((file) => {
            const isSelected = selectedFiles.includes(file.id);
            return (
              <div
                key={file.id}
                className={`border ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} rounded-lg overflow-hidden hover:shadow-md transition-all cursor-pointer`}
                onClick={() => onFileSelect && onFileSelect(file, !isSelected)}
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 truncate flex items-center">
                      {isSelected && <Check size={18} className="text-blue-500 mr-2" />}
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
