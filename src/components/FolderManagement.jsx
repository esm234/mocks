import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  FolderPlus, 
  Folder, 
  Trash2, 
  Edit2, 
  ArrowLeft, 
  FileText,
  Plus,
  FolderOpen,
  Archive
} from 'lucide-react';
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
      initializeExam({
        examMode: 'folder',
        timerMode: 'none',
        timerDuration: 0,
        shuffleQuestions: false,
        shuffleChoices: false,
        questionTypeFilter: 'folder',
        selectedQuestionType: null,
        rcQuestionOrder: 'sequential',
        folderQuestions: questions
      });
      
      setSelectedFolderId(null);
      onBack();
    } catch (error) {
      console.error('Error starting folder test:', error);
      alert('حدث خطأ أثناء بدء الاختبار: ' + error.message);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 text-white" dir="rtl">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-r from-emerald-600/15 to-cyan-600/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="sticky top-0 bg-black/40 backdrop-blur-xl border-b border-gray-700/50 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Title and Back Button */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={onBack}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-800/80 border-gray-700 text-gray-300 rounded-lg font-medium hover:bg-gray-700 hover:text-white transition-all duration-300 text-sm sm:text-base"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">العودة للرئيسية</span>
                  <span className="sm:hidden">رجوع</span>
                </Button>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  مجلداتي
                </h1>
              </div>
              
              {/* Add Folder Button */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg sm:rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg text-sm sm:text-base w-full sm:w-auto">
                    <FolderPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">إضافة مجلد جديد</span>
                    <span className="sm:hidden">مجلد جديد</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-700 text-white rounded-xl shadow-2xl max-w-[90vw] sm:max-w-md" dir="rtl">
                  <DialogHeader>
                    <DialogTitle className="text-right text-xl sm:text-2xl font-bold text-blue-400">إضافة مجلد جديد</DialogTitle>
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
                        className="px-4 sm:px-5 py-2 border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white transition-all duration-300"
                      >
                        إلغاء
                      </Button>
                      <Button
                        onClick={handleAddFolder}
                        className="px-4 sm:px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md"
                      >
                        إضافة
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Folders Count */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-400">
                {folders.length > 0 ? `${folders.length} مجلد` : 'لا توجد مجلدات'}
              </p>
              <div className="h-1 flex-1 mx-4 bg-gray-700/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: folders.length > 0 ? `${Math.min((folders.length / 10) * 100, 100)}%` : '0%' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {folders.length === 0 ? (
            <div className="text-center py-16 sm:py-20 bg-gradient-to-br from-gray-800/40 to-gray-900/40 border border-gray-700/50 rounded-2xl shadow-xl backdrop-blur-sm">
              <div className="max-w-md mx-auto">
                <div className="relative mb-8">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-2xl"></div>
                  </div>
                  <Archive className="w-20 h-20 sm:w-24 sm:h-24 mx-auto text-gray-500 relative z-10" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-300 mb-4">لا توجد مجلدات بعد</h3>
                <p className="text-gray-400 text-base sm:text-lg mb-8 px-4">
                  ابدأ بإنشاء مجلدك الأول لتنظيم الأسئلة المفضلة لديك
                </p>
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  إنشاء أول مجلد
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  className="group bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 rounded-xl sm:rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 backdrop-blur-sm"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="p-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg group-hover:from-blue-600/30 group-hover:to-purple-600/30 transition-colors duration-300">
                        <FolderOpen className="w-6 h-6 text-blue-400" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white truncate flex-1">
                        {folder.name}
                      </h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFolder(folder.id);
                      }}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg p-1.5 transition-all duration-300 opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-400 mb-6">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm">
                      <span className="font-semibold text-blue-300">{folder.questionIds.length}</span> سؤال
                    </span>
                  </div>
                  
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-blue-500/50 text-blue-300 rounded-lg font-medium hover:bg-blue-900/30 hover:text-blue-200 hover:border-blue-400 transition-all duration-300"
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
    </div>
  );
};

export default FolderManagement;
