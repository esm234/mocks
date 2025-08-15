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
  Archive,
  Sparkle,
  LayoutGrid,
  Star // New icon for extra flair
} from 'lucide-react';
import { useFolderStore } from '../store/folderStore';
import { useExamStore } from '../store/examStore';
import FolderView from './FolderView';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils'; // Utility for classNames

// Enhanced Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { 
      delayChildren: 0.3, 
      staggerChildren: 0.15,
      type: 'spring',
      stiffness: 120,
      damping: 15
    } 
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.4 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, rotateX: -10 },
  visible: { 
    opacity: 1, 
    y: 0, 
    rotateX: 0,
    transition: { type: 'spring', stiffness: 150, damping: 20 }
  },
};

const cardVariants = {
  initial: { 
    scale: 1, 
    y: 0, 
    rotateX: 0, 
    boxShadow: '0px 8px 20px rgba(0,0,0,0.2)',
    transition: { type: 'spring', stiffness: 200, damping: 20 }
  },
  hover: { 
    scale: 1.05, 
    y: -10, 
    rotateX: 5,
    boxShadow: '0px 20px 40px rgba(0,0,0,0.4)', 
    transition: { type: 'spring', stiffness: 300, damping: 20 }
  },
  selected: { 
    scale: 1.03, 
    y: -5, 
    boxShadow: '0px 15px 50px rgba(0,0,0,0.5)', 
    transition: { type: 'spring', stiffness: 300, damping: 20 } 
  }
};

const buttonVariants = {
  hover: { 
    scale: 1.1, 
    rotate: 2,
    boxShadow: '0px 8px 20px rgba(59, 130, 246, 0.3)',
    transition: { type: 'spring', stiffness: 400, damping: 10 }
  },
  tap: { scale: 0.95, rotate: 0 }
};

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-black text-white font-cairo overflow-hidden" dir="rtl">
      {/* Dynamic 3D Background with Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-10 right-20 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse' }}
        />
        <motion.div 
          className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-pink-500/20 to-blue-500/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse', delay: 2 }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-yellow-500/20 to-red-500/20 rounded-full blur-2xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, repeatType: 'reverse', delay: 1 }}
        />
        {/* Subtle Star Particles */}
        <div className="absolute inset-0 opacity-20" style={{ 
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M10 0l2.5 7.5H20l-6 4.5 2.3 7.5L10 14.5 3.7 19l2.3-7.5L0 7.5h7.5L10 0z\'/%3E%3C/g%3E%3C/svg%3E")',
          backgroundSize: '20px 20px',
          animation: 'moveStars 100s linear infinite'
        }} />
      </div>

      <style jsx global>{`
        @keyframes moveStars {
          from { background-position: 0 0; }
          to { background-position: -200px -200px; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 10px rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.8); }
        }
      `}</style>

      <div className="relative z-10">
        {/* Header */}
        <motion.div 
          className="sticky top-0 bg-black/70 backdrop-blur-2xl border-b border-indigo-500/30 z-50 shadow-2xl"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <motion.div 
                initial={{ x: -50, opacity: 0 }} 
                animate={{ x: 0, opacity: 1 }} 
                transition={{ duration: 0.6 }}
                className="flex items-center gap-3 w-full sm:w-auto"
              >
                <motion.button
                  onClick={onBack}
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 border border-indigo-500/50 text-indigo-300 rounded-xl font-medium hover:bg-indigo-900/50 hover:text-indigo-100 transition-all duration-300 text-sm sm:text-base relative overflow-hidden group"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                  <span className="hidden sm:inline">العودة للرئيسية</span>
                  <span className="sm:hidden">رجوع</span>
                  <span className="absolute inset-0 bg-indigo-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl" />
                </motion.button>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-indigo-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg flex items-center gap-3">
                  <LayoutGrid className="w-8 h-8 text-indigo-400 animate-pulse" />
                  مجلداتي
                  <Star className="w-6 h-6 text-yellow-400 animate-spin-slow" />
                </h1>
              </motion.div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <motion.button 
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 via-cyan-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:via-cyan-700 hover:to-purple-700 transition-all duration-300 shadow-lg text-sm sm:text-base relative overflow-hidden group animate-glow"
                  >
                    <FolderPlus className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    <span className="hidden sm:inline">إضافة مجلد جديد</span>
                    <span className="sm:hidden">مجلد جديد</span>
                    <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-15 transition-opacity duration-300 rounded-xl" />
                  </motion.button>
                </DialogTrigger>
                <DialogContent className="bg-gray-950/90 border border-indigo-500/30 text-white rounded-2xl shadow-2xl max-w-[90vw] sm:max-w-md backdrop-blur-xl">
                  <DialogHeader>
                    <DialogTitle className="text-right text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
                      <Sparkle className="w-6 h-6 text-cyan-400 animate-pulse" />
                      إضافة مجلد جديد
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 mt-4">
                    <Input
                      placeholder="اسم المجلد"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      className="bg-gray-900/80 border border-indigo-500/50 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-cyan-400 rounded-xl p-3 text-lg transition-all duration-300"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddFolder()}
                    />
                    <div className="flex gap-3 justify-end">
                      <motion.button
                        onClick={() => setIsDialogOpen(false)}
                        whileHover="hover"
                        whileTap="tap"
                        variants={buttonVariants}
                        className="px-5 py-2 border border-indigo-500/50 text-indigo-300 rounded-xl hover:bg-indigo-900/50 hover:text-indigo-100 transition-all duration-300 relative overflow-hidden group"
                      >
                        إلغاء
                        <span className="absolute inset-0 bg-indigo-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl" />
                      </motion.button>
                      <motion.button
                        onClick={handleAddFolder}
                        whileHover="hover"
                        whileTap="tap"
                        variants={buttonVariants}
                        className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-cyan-700 transition-all duration-300 shadow-md relative overflow-hidden group animate-glow"
                      >
                        إضافة
                        <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-15 transition-opacity duration-300 rounded-xl" />
                      </motion.button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Folders Count with Progress Bar */}
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-gray-300">
                <span className="font-bold text-cyan-400">{folders.length}</span> مجلد
              </p>
              <div className="h-2 flex-1 mx-4 bg-gray-800/50 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-indigo-500 via-cyan-500 to-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: folders.length > 0 ? `${Math.min((folders.length / 10) * 100, 100)}%` : '0%' }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <AnimatePresence mode='wait'>
            {folders.length === 0 ? (
              <motion.div 
                key="no-folders"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={containerVariants}
                className="text-center py-20 bg-gradient-to-br from-gray-900/80 to-indigo-950/80 border border-indigo-500/30 rounded-2xl shadow-2xl backdrop-blur-xl"
              >
                <motion.div variants={itemVariants} className="max-w-md mx-auto">
                  <div className="relative mb-8">
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-2xl"
                      animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
                      transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse' }}
                    />
                    <Archive className="w-24 h-24 mx-auto text-indigo-400 relative z-10 animate-pulse-slow" />
                  </div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-4">لا توجد مجلدات بعد</h3>
                  <p className="text-gray-300 text-lg mb-8 px-4">
                    ابدأ بتنظيم أسئلتك المفضلة بإنشاء أول مجلد الآن!
                  </p>
                  <motion.button
                    onClick={() => setIsDialogOpen(true)}
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 via-cyan-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:via-cyan-700 hover:to-purple-700 transition-all duration-300 shadow-lg relative overflow-hidden group animate-glow"
                  >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    إنشاء أول مجلد
                    <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-15 transition-opacity duration-300 rounded-xl" />
                  </motion.button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div 
                key="folders-list"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={containerVariants}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {folders.map((folder) => (
                  <motion.div
                    key={folder.id}
                    variants={cardVariants}
                    initial="initial"
                    whileHover="hover"
                    className="group bg-gradient-to-br from-gray-900/90 to-indigo-950/90 border border-indigo-500/30 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-xl cursor-pointer relative overflow-hidden"
                    onClick={() => handleViewFolder(folder.id)}
                  >
                    {/* Card Glow Effect */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      animate={{ opacity: [0, 0.2, 0] }}
                      transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
                    />
                    
                    <div className="flex items-start justify-between mb-4 relative z-10">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <motion.div 
                          className="p-2 bg-gradient-to-r from-indigo-600/30 to-purple-600/30 rounded-lg group-hover:from-indigo-600/50 group-hover:to-purple-600/50 transition-colors duration-300"
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                        >
                          <FolderOpen className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                        </motion.div>
                        <h3 className="text-xl font-bold text-white truncate flex-1">
                          {folder.name}
                        </h3>
                      </div>
                      <motion.button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFolder(folder.id);
                        }}
                        whileHover={{ scale: 1.2, rotate: 15 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg p-1.5 transition-all duration-300 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-300 mb-6 relative z-10">
                      <FileText className="w-5 h-5 text-cyan-400" />
                      <span className="text-sm">
                        <span className="font-semibold text-cyan-400">{folder.questionIds.length}</span> سؤال
                      </span>
                    </div>
                    
                    <motion.button
                      whileHover="hover"
                      whileTap="tap"
                      variants={buttonVariants}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-cyan-700 transition-all duration-300 shadow-md relative overflow-hidden group animate-glow"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewFolder(folder.id);
                      }}
                    >
                      عرض الأسئلة
                      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                      <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-15 transition-opacity duration-300 rounded-xl" />
                    </motion.button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default FolderManagement;
