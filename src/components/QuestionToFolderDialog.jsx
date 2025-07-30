import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FolderPlus, Folder, Plus } from 'lucide-react';
import { useFolderStore } from '../store/folderStore';

const QuestionToFolderDialog = ({ isOpen, onClose, questionId, questionText }) => {
  const { folders, addFolder, addQuestionToFolder } = useFolderStore();
  const [selectedFolderId, setSelectedFolderId] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);

  const handleAddToFolder = () => {
    if (selectedFolderId && questionId) {
      console.log('Adding question to folder:', questionId, selectedFolderId);
      addQuestionToFolder(selectedFolderId, questionId);
      onClose();
      setSelectedFolderId('');
    }
  };

  const handleCreateNewFolder = () => {
    if (newFolderName.trim() && questionId) {
      console.log('Creating new folder and adding question:', newFolderName, questionId);
      const newFolder = addFolder(newFolderName.trim());
      // Add question to the newly created folder
      setTimeout(() => {
        addQuestionToFolder(newFolder.id, questionId);
      }, 100);
      setNewFolderName('');
      setShowNewFolderInput(false);
      onClose();
    }
  };

  const resetDialog = () => {
    setSelectedFolderId('');
    setNewFolderName('');
    setShowNewFolderInput(false);
  };

  const handleClose = () => {
    resetDialog();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right flex items-center gap-2">
            <Folder className="w-5 h-5 text-blue-400" />
            إضافة السؤال إلى مجلد
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Question Preview */}
          <div className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-300 line-clamp-2">
              {questionText || 'السؤال المحدد'}
            </p>
            {process.env.NODE_ENV === 'development' && questionId && (
              <p className="text-xs text-gray-500 mt-1">ID: {questionId}</p>
            )}
          </div>

          {!showNewFolderInput ? (
            <>
              {/* Existing Folders Selection */}
              {folders.length > 0 ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    اختر مجلد موجود:
                  </label>
                  <Select value={selectedFolderId} onValueChange={setSelectedFolderId}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="اختر مجلد..." />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {folders.map((folder) => (
                        <SelectItem key={folder.id} value={folder.id} className="text-white">
                          <div className="flex items-center gap-2">
                            <Folder className="w-4 h-4 text-blue-400" />
                            {folder.name}
                            <span className="text-xs text-gray-400">
                              ({folder.questionIds?.length || 0} سؤال)
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Folder className="w-12 h-12 mx-auto mb-2 text-gray-500" />
                  <p className="text-gray-400 text-sm">لا توجد مجلدات</p>
                </div>
              )}

              {/* Create New Folder Button */}
              <Button
                variant="outline"
                onClick={() => setShowNewFolderInput(true)}
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <FolderPlus className="w-4 h-4 ml-2" />
                إنشاء مجلد جديد
              </Button>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  إلغاء
                </Button>
                <Button
                  onClick={handleAddToFolder}
                  disabled={!selectedFolderId || !questionId}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
                >
                  إضافة
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* New Folder Creation */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  اسم المجلد الجديد:
                </label>
                <Input
                  placeholder="أدخل اسم المجلد"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateNewFolder()}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowNewFolderInput(false)}
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  رجوع
                </Button>
                <Button
                  onClick={handleCreateNewFolder}
                  disabled={!newFolderName.trim() || !questionId}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4 ml-2" />
                  إنشاء وإضافة
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionToFolderDialog;
