import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  FolderPlus, 
  Trash2, 
  ArrowLeft, 
  FileText,
  Plus,
  Archive,
  Sparkles, // أيقونة للتأثيرات البراقة
  LayoutGrid, // أيقونة جديدة لإدارة المجلدات
  PlayCircle, // أيقونة لبدء الاختبار
  FolderOpen // أيقونة لفتح المجلد
} from 'lucide-react';
import { useFolderStore } from '../store/folderStore';
import { useExamStore } from '../store/examStore';
import FolderView from './FolderView';
import { motion, AnimatePresence } from 'framer-motion';

// Framer Motion Variants for animations
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      delayChildren: 0.2, 
      staggerChildren: 0.1 
    } 
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } },
};

const buttonVariants = {
  hover: { scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 10 } },
  tap: { scale: 0.95 }
};

const FolderManagement = ({ onBack }) => {
  const { folders, addFolder, deleteFolder, getFolderById } = useFolderStore();
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
    // Using a more modern confirmation dialog could be a future improvement
    if (window.confirm('هل أنت متأكد من حذف هذا المجلد وكل ما بداخله؟')) {
      deleteFolder(folderId);
    }
  };

  const handleViewFolder = (folderId) => {
    setSelectedFolderId(folderId);
  };

  const handleBackToFolders = () => {
    setSelectedFolderId(null);
  };

  const handleStartTest = (folderId) => {
    const folder = getFolderById(folderId);
    const questions = folder?.questions || []; // Assuming questions are stored within the folder object

    if (!questions || questions.length === 0) {
      alert('لا توجد أسئلة في هذا المجلد لبدء الاختبار. أضف بعض الأسئلة أولاً.');
      return;
    }

    try {
      initializeExam({
        examMode: 'folder',
        timerMode: 'none',
        timerDuration: 0,
        shuffleQuestions: true, // Default to shuffle for better practice
        shuffleChoices: true,
        questionTypeFilter: 'folder',
        selectedQuestionType: null,
        rcQuestionOrder: 'sequential',
        folderQuestions: questions
      });
      
      onBack(); // Go back to the main screen to start the exam
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
        onStartTest={() => handleStartTest(selectedFolderId)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-cairo overflow-hidden" dir="rtl">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-slate-950 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 bg-slate-950/70 backdrop-blur-xl border-b border-white/10 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              <motion.div 
                initial={{ x: 50, opacity: 0 }} 
                animate={{ x: 0, opacity: 1 }} 
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex items-center gap-4"
              >
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
                  <LayoutGrid className="w-7 h-7 text-fuchsia-400 animate-spin-slow" />
                  مجلداتي
                </h1>
                <span className="hidden sm:inline-block h-6 w-px bg-white/20"></span>
                <p className="hidden sm:inline-block text-sm text-slate-400">
                  <span className="font-bold text-fuchsia-300">{folders.length}</span> مجلدات
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ x: -50, opacity: 0 }} 
                animate={{ x: 0, opacity: 1 }} 
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex items-center gap-2"
              >
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <motion.button 
                      whileHover="hover"
                      whileTap="tap"
                      variants={buttonVariants}
                      className="flex items-center gap-2 px-4 py-2 bg-fuchsia-600 text-white rounded-lg font-semibold hover:bg-fuchsia-500 transition-colors duration-300 shadow-lg shadow-fuchsia-600/20 text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="hidden sm:inline">مجلد جديد</span>
                    </motion.button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900/80 backdrop-blur-lg border-white/10 text-white rounded-xl shadow-2xl max-w-[90vw] sm:max-w-md" dir="rtl">
                    <DialogHeader>
                      <DialogTitle className="text-right text-xl font-bold text-fuchsia-400">إضافة مجلد جديد</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <Input
                        placeholder="اسم المجلد..."
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        className="bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-fuchsia-500 focus:ring-fuchsia-500 rounded-lg p-3 text-base"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddFolder()}
                      />
                      <div className="flex gap-3 justify-end">
                        <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="hover:bg-slate-800">إلغاء</Button>
                        <Button onClick={handleAddFolder} className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white">إضافة</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <motion.button
                  variant="outline"
                  onClick={onBack}
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 border-white/10 text-slate-300 rounded-lg font-medium hover:bg-slate-700 hover:text-white transition-colors duration-300 text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">الرئيسية</span>
                </motion.button>
              </motion.div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <AnimatePresence mode='wait'>
            {folders.length === 0 ? (
              <motion.div 
                key="no-folders"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={containerVariants}
                className="text-center py-16 sm:py-24 bg-slate-900/50 border border-white/10 rounded-2xl shadow-xl"
              >
                <motion.div variants={itemVariants} className="max-w-md mx-auto">
                  <div className="relative mb-8 flex justify-center">
                    <Archive className="w-24 h-24 text-slate-600" />
                    <Sparkles className="w-16 h-16 text-fuchsia-400 absolute -top-2 -right-1/3 animate-pulse" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">مجلداتك فارغة</h3>
                  <p className="text-slate-400 text-base sm:text-lg mb-8 px-4">
                    أنشئ مجلدات لتنظيم أسئلتك والبدء في اختبارات مخصصة.
                  </p>
                  <motion.button
                    onClick={() => setIsDialogOpen(true)}
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-fuchsia-600 text-white rounded-xl font-semibold hover:bg-fuchsia-500 transition-colors duration-300 shadow-lg shadow-fuchsia-600/30"
                  >
                    <Plus className="w-5 h-5" />
                    إنشاء أول مجلد
                  </motion.button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div 
                key="folders-list"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {folders.map((folder) => (
                  <motion.div
                    key={folder.id}
                    variants={itemVariants}
                    layout
                    className="group relative bg-slate-900/50 border border-white/10 rounded-xl p-5 shadow-lg hover:border-fuchsia-500/50 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div 
                        className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                        onClick={() => handleViewFolder(folder.id)}
                      >
                        <div className="p-2.5 bg-slate-800 rounded-lg">
                          <FolderOpen className="w-6 h-6 text-fuchsia-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white truncate group-hover:text-fuchsia-300 transition-colors">
                          {folder.name}
                        </h3>
                      </div>
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFolder(folder.id);
                        }}
                        whileHover={{ scale: 1.2, rotate: -10 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-slate-500 hover:text-red-500 transition-colors p-1 opacity-50 group-hover:opacity-100"
                        aria-label="حذف المجلد"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                    
                    <div className="flex items-center justify-between text-slate-400 mb-6">
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="w-4 h-4 text-slate-500" />
                        <span>
                          <span className="font-semibold text-white">{folder.questionIds?.length || 0}</span> سؤال
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                       <motion.button
                        onClick={() => handleViewFolder(folder.id)}
                        whileHover="hover"
                        variants={buttonVariants}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg font-medium hover:bg-slate-700 hover:border-slate-600 hover:text-white transition-all duration-300"
                      >
                        <LayoutGrid className="w-4 h-4" />
                        عرض
                      </motion.button>
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartTest(folder.id);
                        }}
                        whileHover="hover"
                        variants={buttonVariants}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-fuchsia-600/20 border border-fuchsia-600/30 text-fuchsia-300 rounded-lg font-medium hover:bg-fuchsia-600/30 hover:border-fuchsia-500/50 hover:text-fuchsia-200 transition-all duration-300"
                      >
                        <PlayCircle className="w-4 h-4" />
                        بدء الاختبار
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default FolderManagement;
