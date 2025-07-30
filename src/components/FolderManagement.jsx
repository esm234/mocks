import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FolderPlus, Folder, Trash2, Edit2, ArrowLeft } from 'lucide-react';
import { useFolderStore } from '../store/folderStore';
import { useExamStore } from '../store/examStore';
import FolderView from './FolderView';

const FolderManagement = ({ onBack }) => {
  const { folders, addFolder, deleteFolder } = useFolderStore();
  const { initializeExam } = useExamStore();
  const [newFolderName, setNewFolderName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState(null);

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      addFolder(newFolderName.trim());
      setNewFolderName('');
      setIsDialogOpen(false);
    }
  };

  const handleDeleteFolder = (folderId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المجلد؟')) {
      deleteFolder(folderId);
    }
  };

  const handleViewFolder = (folderId) => {
    setSelectedFolderId(folderId);
  };

  const handleBackToFolders = () => {
    setSelectedFolderId(null);
  };

  const handleStartTest = (questions) => {
    if (!questions || questions.length === 0) {
      alert('لا توجد أسئلة في هذا المجلد لبدء الاختبار');
      return;
    }

    console.log('Starting folder test with questions:', questions.length);
    console.log('First question sample:', questions[0]);

    try {
      // Initialize exam with folder questions
      initializeExam({
        examMode: 'folder', // Use folder mode
        timerMode: 'none', // No timer by default for folder tests
        timerDuration: 0,
        shuffleQuestions: false, // Don't shuffle folder questions by default
        shuffleChoices: false,
        questionTypeFilter: 'folder', // Mark as folder type
        selectedQuestionType: null,
        rcQuestionOrder: 'sequential',
        folderQuestions: questions // Pass the questions directly
      });
      
      // Navigate back to main app (exam will start)
      setSelectedFolderId(null);
      onBack(); // This should trigger the exam to start
    } catch (error) {
      console.error('Error starting folder test:', error);
      alert('حدث خطأ أثناء بدء الاختبار: ' + error.message);
    }
  };

  // If a folder is selected, show FolderView
  if (selectedFolderId) {
    return (
      <FolderView
        folderId={selectedFolderId}
        onBack={handleBackToFolders}
        onStartTest={handleStartTest}
      />
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900 text-white min-h-screen" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 ml-2" />
              العودة للرئيسية
            </Button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              مجلداتي
            </h1>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                <FolderPlus className="w-4 h-4 ml-2" />
                إضافة مجلد
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700 text-white" dir="rtl">
              <DialogHeader>
                <DialogTitle className="text-right">إضافة مجلد جديد</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="اسم المجلد"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddFolder()}
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    إلغاء
                  </Button>
                  <Button
                    onClick={handleAddFolder}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    إضافة
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {folders.length === 0 ? (
          <div className="text-center py-12">
            <Folder className="w-16 h-16 mx-auto mb-4 text-gray-500" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">لا توجد مجلدات</h3>
            <p className="text-gray-500 mb-6">ابدأ بإنشاء مجلد جديد لتنظيم أسئلتك</p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <FolderPlus className="w-4 h-4 ml-2" />
                  إنشاء مجلد جديد
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {folders.map((folder) => (
              <div
                key={folder.id}
                className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:bg-gray-800/70 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Folder className="w-6 h-6 text-blue-400 ml-3" />
                    <h3 className="text-lg font-semibold">{folder.name}</h3>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteFolder(folder.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="text-sm text-gray-400 mb-4">
                  {folder.questionIds.length} سؤال
                </div>
                
                <Button
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                  onClick={() => handleViewFolder(folder.id)}
                >
                  عرض الأسئلة
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FolderManagement;
