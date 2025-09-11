// Storage utilities for handling localStorage issues

export const STORAGE_KEYS = {
  EXAM_STORAGE: 'exam-storage',
  EXAM_SETTINGS: 'examSettings',
  LANGUAGE: 'i18nextLng',
  APP_VERSION: 'app-version',
  FOLDER_STORAGE: 'folder-storage'
};

export const APP_VERSION = '1.0.0';

// Check if storage is corrupted
export const isStorageCorrupted = () => {
  try {
    // Check exam storage
    const examStorage = localStorage.getItem(STORAGE_KEYS.EXAM_STORAGE);
    if (examStorage) {
      JSON.parse(examStorage);
    }
    
    // Check exam settings
    const examSettings = localStorage.getItem(STORAGE_KEYS.EXAM_SETTINGS);
    if (examSettings) {
      JSON.parse(examSettings);
    }
    
    // Check folder storage
    const folderStorage = localStorage.getItem(STORAGE_KEYS.FOLDER_STORAGE);
    if (folderStorage) {
      JSON.parse(folderStorage);
    }
    
    return false;
  } catch (error) {
    console.error('Storage corruption detected:', error);
    return true;
  }
};

// Clear all app storage
export const clearAppStorage = () => {
  console.log('Clearing all app storage...');
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

// Check version and clear storage if needed
export const checkVersionAndClearStorage = () => {
  const storedVersion = localStorage.getItem(STORAGE_KEYS.APP_VERSION);
  
  if (storedVersion !== APP_VERSION) {
    console.log(`Version mismatch: stored=${storedVersion}, current=${APP_VERSION}`);
    clearAppStorage();
    localStorage.setItem(STORAGE_KEYS.APP_VERSION, APP_VERSION);
    return true; // Storage was cleared
  }
  
  return false; // No version mismatch
};

// Safe storage getter with error handling
export const safeGetStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading storage key ${key}:`, error);
    return defaultValue;
  }
};

// Safe storage setter with error handling
export const safeSetStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing storage key ${key}:`, error);
    return false;
  }
};

// Initialize storage with version check
export const initializeStorage = () => {
  // Check for corruption first
  if (isStorageCorrupted()) {
    console.log('Storage corruption detected, clearing...');
    clearAppStorage();
    localStorage.setItem(STORAGE_KEYS.APP_VERSION, APP_VERSION);
    return true;
  }
  
  // Check version
  return checkVersionAndClearStorage();
};
