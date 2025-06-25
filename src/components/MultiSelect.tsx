import React from 'react';
import { X } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selected,
  onChange,
  placeholder = 'Select options...'
}) => {
  const handleTagClick = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter(item => item !== value)
      : [...selected, value];
    
    onChange(newSelected);
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2">
        {options.length === 0 ? (
          <div className="text-gray-500">{placeholder || 'No options available'}</div>
        ) : (
          options.map(option => (
            <button
              key={option.value}
              onClick={() => handleTagClick(option.value)}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                selected.includes(option.value)
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
              }`}
              aria-pressed={selected.includes(option.value)}
            >
              {option.label}
            </button>
          ))
        )}
      </div>
    </div>
  );
};
