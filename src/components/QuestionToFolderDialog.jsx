import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FolderPlus, Folder, Plus, Check } from 'lucide-react';
import { useFolderStore } from '../store/folderStore';
import { motion } from 'framer-motion';

const buttonVariants = {
  hover: { scale: 1.04, transition: { type: "spring", stiffness: 300, damping: 15 } },
  tap: { scale: 0.96 }
};

const QuestionToFolderDialog = ({ isOpen, onClose, questionId, questionText }) => {
  const { folders, addFolder, addQuestionToFolder } = useFolderStore();
  const [selectedFolderId, setSelectedFolderId] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);

  const handleAddToFolder = () => {
    if (selectedFolderId && questionId) {
      addQuestionToFolder(selectedFolderId, questionId);
      handleClose();
    }
  };

  const handleCreateNewFolder = () => {
    if (newFolderName.trim() && questionId) {
      const newFolder = addFolder(newFolderName.trim());
      setTimeout(() => {
        addQuestionToFolder(newFolder.id, questionId);
      }, 100);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedFolderId('');
    setNewFolderName('');
    setShowNewFolderInput(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white border border-gray-200 rounded-xl shadow-lg max-w-md font-cairo p-6" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl font-bold text-blue-600">
            <Folder className="w-6 h-6 text-blue-500" />
            إضافة السؤال إلى مجلد
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Question Preview */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <p className="text-base text-gray-700 font-medium">
              {questionText || 'السؤال المحدد'}
            </p>
          </div>

          {!showNewFolderInput ? (
            <>
              {/* Existing Folders Selection */}
              {folders.length > 0 ? (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">
                    اختر مجلد موجود:
                  </label>
                  <Select value={selectedFolderId} onValueChange={setSelectedFolderId}>
                    <SelectTrigger className="bg-white border border-gray-300 rounded-lg px-3 py-3 text-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-200">
                      <SelectValue placeholder="اختر مجلد..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                      {folders.map((folder) => (
                        <SelectItem key={folder.id} value={folder.id} className="py-2 hover:bg-blue-50">
                          <div className="flex items-center gap-3">
                            <Folder className="w-5 h-5 text-blue-500" />
                            <span className="font-medium">{folder.name}</span>
                            <span className="text-sm text-gray-500">
                              ({folder.questionIds?.length || 0} سؤال)
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="text-center py-6 bg-blue-50 border border-blue-100 rounded-lg">
                  <Folder className="w-14 h-14 mx-auto mb-3 text-blue-400" />
                  <p className="text-gray-500 text-base">لا توجد مجلدات حالياً.</p>
                </div>
              )}

              {/* Create New Folder Button */}
              <motion.button
                onClick={() => setShowNewFolderInput(true)}
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-blue-400 text-blue-500 rounded-lg font-semibold hover:bg-blue-50 shadow-sm"
              >
                <FolderPlus className="w-5 h-5" />
                إنشاء مجلد جديد
              </motion.button>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-3">
                <motion.button
                  onClick={handleClose}
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 shadow-sm"
                >
                  إلغاء
                </motion.button>
                <motion.button
                  onClick={handleAddToFolder}
                  disabled={!selectedFolderId}
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 shadow-sm disabled:opacity-50"
                >
                  <Check className="w-5 h-5 ml-2" />
                  إضافة
                </motion.button>
              </div>
            </>
          ) : (
            <>
              {/* New Folder Creation */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  اسم المجلد الجديد:
                </label>
                <Input
                  placeholder="أدخل اسم المجلد"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="bg-white border border-gray-300 rounded-lg px-3 py-3 text-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateNewFolder()}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-3">
                <motion.button
                  onClick={() => setShowNewFolderInput(false)}
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 shadow-sm"
                >
                  رجوع
                </motion.button>
                <motion.button
                  onClick={handleCreateNewFolder}
                  disabled={!newFolderName.trim()}
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 shadow-sm disabled:opacity-50"
                >
                  <Plus className="w-5 h-5 ml-2" />
                  إنشاء وإضافة
                </motion.button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionToFolderDialog;
