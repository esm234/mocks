import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FolderPlus, Folder, Plus, Check, X } from 'lucide-react';
import { useFolderStore } from '../store/folderStore';
import { motion, AnimatePresence } from 'framer-motion';

const buttonVariants = {
  hover: { scale: 1.05, transition: { type: 'spring', stiffness: 400, damping: 10 } },
  tap: { scale: 0.95 },
};

const dialogVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: 'easeIn' } },
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
      <DialogContent
        className="bg-gray-50 border border-gray-200 rounded-2xl shadow-xl max-w-lg w-full font-cairo p-8"
        dir="rtl"
      >
        <motion.div variants={dialogVariants} initial="hidden" animate="visible" exit="exit">
          <DialogHeader className="relative">
            <DialogTitle className="flex items-center gap-3 text-2xl font-semibold text-blue-700">
              <Folder className="w-6 h-6 text-blue-600" />
              إضافة السؤال إلى مجلد
            </DialogTitle>
            <motion.button
              onClick={handleClose}
              whileHover={{ rotate: 90 }}
              className="absolute left-0 top-0 p-2 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {/* Question Preview */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-100 p-4 rounded-xl border border-blue-200"
            >
              <p className="text-base text-gray-800 font-medium leading-relaxed">
                {questionText || 'السؤال المحدد'}
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              {!showNewFolderInput ? (
                <motion.div
                  key="select-folder"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Existing Folders Selection */}
                  {folders.length > 0 ? (
                    <div className="space-y-4">
                      <label className="text-sm font-medium text-gray-600">
                        اختر مجلد موجود:
                      </label>
                      <Select value={selectedFolderId} onValueChange={setSelectedFolderId}>
                        <SelectTrigger className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all">
                          <SelectValue placeholder="اختر مجلد..." />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg max-h-64">
                          {folders.map((folder) => (
                            <SelectItem
                              key={folder.id}
                              value={folder.id}
                              className="py-3 px-4 hover:bg-blue-50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <Folder className="w-5 h-5 text-blue-600" />
                                <span className="font-medium text-gray-800">{folder.name}</span>
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
                    <motion.div
                      className="text-center py-8 bg-blue-50 border border-blue-100 rounded-xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Folder className="w-16 h-16 mx-auto mb-4 text-blue-400" />
                      <p className="text-gray-600 text-base">لا توجد مجلدات حالياً.</p>
                    </motion.div>
                  )}

                  {/* Create New Folder Button */}
                  <motion.button
                    onClick={() => setShowNewFolderInput(true)}
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 mt-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 shadow-md transition-all"
                  >
                    <FolderPlus className="w-5 h-5" />
                    إنشاء مجلد جديد
                  </motion.button>

                  {/* Action Buttons */}
                  <div className="flex gap-4 mt-6">
                    <motion.button
                      onClick={handleClose}
                      whileHover="hover"
                      whileTap="tap"
                      variants={buttonVariants}
                      className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 shadow-sm transition-all"
                    >
                      إلغاء
                    </motion.button>
                    <motion.button
                      onClick={handleAddToFolder}
                      disabled={!selectedFolderId}
                      whileHover="hover"
                      whileTap="tap"
                      variants={buttonVariants}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 shadow-md transition-all disabled:opacity-50"
                     >
                      <Check className="w-5 h-5 ml-2" />
                      إضافة
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="new-folder"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* New Folder Creation */}
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-gray-600">
                      اسم المجلد الجديد:
                    </label>
                    <Input
                      placeholder="أدخل اسم المجلد"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all"
                      onKeyPress={(e) => e

.key === 'Enter' && handleCreateNewFolder()}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 mt-6">
                    <motion.button
                      onClick={() => setShowNewFolderInput(false)}
                      whileHover="hover"
                      whileTap="tap"
                      variants={buttonVariants}
                      className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 shadow-sm transition-all"
                    >
                      رجوع
                    </motion.button>
                    <motion.button
                      onClick={handleCreateNewFolder}
                      disabled={!newFolderName.trim()}
                      whileHover="hover"
                      whileTap="tap"
                      variants={buttonVariants}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 shadow-md transition-all disabled:opacity-50"
                    >
                      <Plus className="w-5 h-5 ml-2" />
                      إنشاء وإضافة
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionToFolderDialog;
