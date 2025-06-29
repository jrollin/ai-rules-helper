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
          <div style={{ color: 'var(--text-secondary)' }}>{placeholder || 'No options available'}</div>
        ) : (
          options.map(option => (
            <button
              key={option.value}
              onClick={() => handleTagClick(option.value)}
              className={`px-2 py-1 rounded text-xs transition-colors thin-border`}
              style={{
                backgroundColor: selected.includes(option.value) ? 'var(--button-primary-bg)' : 'var(--button-secondary-bg)',
                color: selected.includes(option.value) ? 'var(--button-primary-text)' : 'var(--button-secondary-text)',
                borderColor: selected.includes(option.value) ? 'var(--button-primary-bg)' : 'var(--border-color)'
              }}
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
