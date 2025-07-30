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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white" dir="rtl">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cdefs%3E%3Cpattern%20id%3D%22grid%22%20width%3D%2220%22%20height%3D%2220%22%20patternUnits%3D%22userSpaceOnUse%22%3E%3Cpath%20d%3D%22M%2020%200%20L%200%200%200%2020%22%20fill%3D%22none%22%20stroke%3D%22%23ffffff%22%20stroke-width%3D%220.5%22%20opacity%3D%220.03%22/%3E%3C/pattern%3E%3C/defs%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22url(%23grid)%22/%3E%3C/svg%3E')] opacity-30"></div>

      <div className="relative z-10 max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 border-gray-700 text-gray-300 rounded-lg font-medium hover:bg-gray-700 hover:text-white transition-all duration-300 shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              العودة للرئيسية
            </Button>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              مجلداتي
            </h1>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg">
                <FolderPlus className="w-5 h-5" />
                إضافة مجلد جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700 text-white rounded-xl shadow-2xl" dir="rtl">
              <DialogHeader>
                <DialogTitle className="text-right text-2xl font-bold text-blue-400">إضافة مجلد جديد</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 mt-4">
                <Input
                  placeholder="اسم المجلد"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-lg p-3"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddFolder()}
                />
                <div className="flex gap-3 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="px-5 py-2 border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-all duration-300"
                  >
                    إلغاء
                  </Button>
                  <Button
                    onClick={handleAddFolder}
                    className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md"
                  >
                    إضافة
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {folders.length === 0 ? (
          <div className="text-center py-20 bg-gray-800/40 border border-gray-700 rounded-2xl shadow-xl">
            <Folder className="w-20 h-20 mx-auto mb-6 text-gray-500 animate-bounce-slow" />
            <h3 className="text-3xl font-bold text-gray-300 mb-4">لا توجد مجلدات بعد</h3>
            <p className="text-gray-400 text-lg mb-8">استخدم زر "إضافة مجلد جديد" في الأعلى لإنشاء مجلدك الأول.</p>
            {/* Removed the duplicate button here */}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {folders.map((folder) => (
              <div
                key={folder.id}
                className="bg-gray-800/60 border border-gray-700 rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:scale-102 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Folder className="w-8 h-8 text-blue-400 ml-4" />
                    <h3 className="text-2xl font-bold text-white">{folder.name}</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteFolder(folder.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-full p-2 transition-all duration-300"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
                
                <div className="text-lg text-gray-400 mb-6">
                  <span className="font-semibold text-blue-300">{folder.questionIds.length}</span> سؤال
                </div>
                
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2 px-6 py-3 border-blue-500 text-blue-300 rounded-xl font-semibold hover:bg-blue-900/30 hover:text-blue-200 transition-all duration-300 shadow-md"
                  onClick={() => handleViewFolder(folder.id)}
                >
                  عرض الأسئلة
                  <ArrowLeft className="w-4 h-4" />
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
