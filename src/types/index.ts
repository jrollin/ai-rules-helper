export interface FileData {
  id: string;
  name: string;
  title?: string;
  content: string;
  category: string | string[];
  tags: string[];
  lastModified?: number;
}

export interface FileState {
  files: FileData[];
  filteredFiles: FileData[];
  selectedFiles: string[];
  filters: {
    categories: string[];
    tags: string[];
  };
  sortBy: string;
  availableCategories: string[];
  availableTags: string[];
}

export type FileAction = 
  | { type: 'SET_FILES'; payload: FileData[] }
  | { type: 'TOGGLE_SELECTION'; payload: string }
  | { type: 'SET_FILTERS'; payload: { categories: string[], tags: string[] } }
  | { type: 'SET_SORT'; payload: string };
