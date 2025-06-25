import { FileState, FileAction, FileData } from '../types';

export const initialState: FileState = {
  files: [],
  filteredFiles: [],
  selectedFiles: [],
  filters: {
    categories: [],
    tags: [],
  },
  sortBy: 'name',
  availableCategories: [],
  availableTags: [],
};

// Helper function to extract unique categories and tags from files
const extractMetadata = (files: FileData[]) => {
  const categories = new Set<string>();
  const tags = new Set<string>();
  
  files.forEach(file => {
    if (Array.isArray(file.category)) {
      file.category.forEach(cat => categories.add(cat));
    } else if (file.category) {
      categories.add(file.category as string);
    }
    
    if (Array.isArray(file.tags)) {
      file.tags.forEach(tag => tags.add(tag));
    }
  });
  
  return {
    categories: Array.from(categories).sort(),
    tags: Array.from(tags).sort(),
  };
};

// Helper function to apply filters and sorting
const applyFiltersAndSort = (
  files: FileData[],
  filters: { categories: string[], tags: string[] },
  sortBy: string
): FileData[] => {
  let result = [...files];
  
  // Apply category filter if any
  if (filters.categories.length > 0) {
    result = result.filter(file => {
      if (Array.isArray(file.category)) {
        return file.category.some(cat => filters.categories.includes(cat));
      }
      return filters.categories.includes(file.category as string);
    });
  }
  
  // Apply tag filter if any
  if (filters.tags.length > 0) {
    result = result.filter(file => 
      file.tags && file.tags.some(tag => filters.tags.includes(tag))
    );
  }
  
  // Apply sorting
  result.sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'lastModified':
        return (b.lastModified || 0) - (a.lastModified || 0);
      default:
        return 0;
    }
  });
  
  return result;
};

export const fileReducer = (state: FileState, action: FileAction): FileState => {
  switch (action.type) {
    case 'SET_FILES': {
      const metadata = extractMetadata(action.payload);
      const filteredFiles = applyFiltersAndSort(
        action.payload,
        state.filters,
        state.sortBy
      );
      
      return {
        ...state,
        files: action.payload,
        filteredFiles,
        availableCategories: metadata.categories,
        availableTags: metadata.tags,
      };
    }
    
    case 'TOGGLE_SELECTION': {
      const id = action.payload;
      const selectedFiles = state.selectedFiles.includes(id)
        ? state.selectedFiles.filter(fileId => fileId !== id)
        : [...state.selectedFiles, id];
      
      return {
        ...state,
        selectedFiles,
      };
    }
    
    case 'SET_FILTERS': {
      const filteredFiles = applyFiltersAndSort(
        state.files,
        action.payload,
        state.sortBy
      );
      
      return {
        ...state,
        filters: action.payload,
        filteredFiles,
      };
    }
    
    case 'SET_SORT': {
      const filteredFiles = applyFiltersAndSort(
        state.files,
        state.filters,
        action.payload
      );
      
      return {
        ...state,
        sortBy: action.payload,
        filteredFiles,
      };
    }
    
    default:
      return state;
  }
};
