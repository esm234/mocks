import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFolderStore = create(
  persist(
    (set, get) => ({
      folders: [],

      // Add a new folder
      addFolder: (folderName) => {
        set((state) => ({
          folders: [
            ...state.folders,
            { id: Date.now().toString(), name: folderName, questionIds: [] },
          ],
        }));
      },

      // Delete a folder
      deleteFolder: (folderId) => {
        set((state) => ({
          folders: state.folders.filter((folder) => folder.id !== folderId),
        }));
      },

      // Add a question to a folder
      addQuestionToFolder: (folderId, questionId) => {
        set((state) => ({
          folders: state.folders.map((folder) =>
            folder.id === folderId
              ? { ...folder, questionIds: [...folder.questionIds, questionId] }
              : folder
          ),
        }));
      },

      // Remove a question from a folder
      removeQuestionFromFolder: (folderId, questionId) => {
        set((state) => ({
          folders: state.folders.map((folder) =>
            folder.id === folderId
              ? { ...folder, questionIds: folder.questionIds.filter((id) => id !== questionId) }
              : folder
          ),
        }));
      },

      // Get questions for a specific folder
      getQuestionsInFolder: (folderId, allQuestions) => {
        const folder = get().folders.find((f) => f.id === folderId);
        if (!folder) return [];
        return allQuestions.filter((q) => folder.questionIds.includes(q.id));
      },
    }),
    {
      name: 'folder-storage', // unique name for localStorage
    }
  )
);


