import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '../utils/storageUtils';

export const useFolderStore = create(
  persist(
    (set, get) => ({
      folders: [],
      
      addFolder: (name) => {
        const newFolder = {
          id: Date.now().toString(),
          name,
          questionIds: [],
          createdAt: new Date().toISOString()
        };
        
        set((state) => ({
          folders: [...state.folders, newFolder]
        }));
        
        // Force save immediately
        setTimeout(() => {
          get().forceSave();
        }, 50);
        
        console.log('Added new folder:', newFolder);
        return newFolder; // Return the created folder
      },
      
      deleteFolder: (folderId) => {
        set((state) => ({
          folders: state.folders.filter(folder => folder.id !== folderId)
        }));
        
        // Force save immediately
        setTimeout(() => {
          get().forceSave();
        }, 50);
        
        console.log('Deleted folder:', folderId);
      },
      
      addQuestionToFolder: (folderId, questionId) => {
        if (!questionId) {
          console.warn('Cannot add question to folder: questionId is empty');
          return;
        }
        
        set((state) => ({
          folders: state.folders.map(folder => {
            if (folder.id === folderId) {
              // Check if question is already in folder
              if (folder.questionIds.includes(questionId)) {
                console.log('Question already in folder:', questionId);
                return folder;
              }
              
              console.log('Adding question to folder:', questionId, 'to folder:', folderId);
              return {
                ...folder,
                questionIds: [...folder.questionIds, questionId]
              };
            }
            return folder;
          })
        }));
      },
      
      removeQuestionFromFolder: (folderId, questionId) => {
        set((state) => ({
          folders: state.folders.map(folder => {
            if (folder.id === folderId) {
              console.log('Removing question from folder:', questionId, 'from folder:', folderId);
              return {
                ...folder,
                questionIds: folder.questionIds.filter(id => id !== questionId)
              };
            }
            return folder;
          })
        }));
      },
      
      updateFolderName: (folderId, newName) => {
        set((state) => ({
          folders: state.folders.map(folder => 
            folder.id === folderId 
              ? { ...folder, name: newName }
              : folder
          )
        }));
      },
      
      clearAllFolders: () => {
        set({ folders: [] });
      },
      
      // Initialize folders from storage with validation
      initializeFolders: () => {
        try {
          const stored = localStorage.getItem('folder-storage');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.state && Array.isArray(parsed.state.folders)) {
              console.log('Folders loaded from storage:', parsed.state.folders.length);
              return parsed.state.folders;
            }
          }
        } catch (error) {
          console.error('Error loading folders from storage:', error);
        }
        return [];
      },
      
      // Force save to localStorage
      forceSave: () => {
        try {
          const state = get();
          const dataToSave = {
            state: {
              folders: state.folders
            },
            version: 1
          };
          localStorage.setItem('folder-storage', JSON.stringify(dataToSave));
          console.log('Folders force saved to localStorage');
          return true;
        } catch (error) {
          console.error('Error force saving folders:', error);
          return false;
        }
      }
    }),
    {
      name: 'folder-storage',
      version: 1,
      getStorage: () => {
        // Use localStorage directly to prevent conflicts
        return localStorage;
      },
      // Only persist the folders array, not any temporary state
      partialize: (state) => ({
        folders: state.folders
      }),
      // Add onRehydrateStorage to handle loading
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log('Folders rehydrated from storage:', state.folders?.length || 0);
        }
      },
    }
  )
);
