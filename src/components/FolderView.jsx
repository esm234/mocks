import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Folder, 
  Trash2, 
  Play, 
  BookOpen,
  Target,
  Brain,
  Lightbulb,
  Sparkles,
  FileText,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useFolderStore } from '../store/folderStore';
import { getAllQuestions } from '../utils/dataLoader';
import { motion, AnimatePresence } from 'framer-motion';

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.07 } 
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 25 } },
};

const buttonVariants = {
  hover: { scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 10 } },
  tap: { scale: 0.95 }
};

// Helper to get question type details
const getQuestionTypeDetails = (type) => {
  switch (type) {
    case 'analogy': return { Icon: Brain, label: 'التناظر اللفظي', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
    case 'completion': return { Icon: BookOpen, label: 'إكمال الجمل', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
    case 'error': return { Icon: Target, label: 'الخطأ السياقي', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
    case 'rc': return { Icon: Lightbulb, label: 'استيعاب المقروء', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
    case 'odd': return { Icon: Sparkles, label: 'المفردة الشاذة', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' };
    default: return { Icon: FileText, label: type, color: 'bg-slate-600/20 text-slate-300 border-slate-500/30' };
  }
};

const FolderView = ({ folderId, onBack, onStartTest }) => {
  const { folders, removeQuestionFromFolder } = useFolderStore();
  const [allQuestions, setAllQuestions] = useState([]);
  
  const folder = useMemo(() => folders.find(f => f.id === folderId), [folders, folderId]);

  useEffect(() => {
    const questions = getAllQuestions();
    setAllQuestions(questions);
  }, []);

  const folderQuestions = useMemo(() => {
    if (!folder) return [];
    const questionMap = new Map(allQuestions.map(q => [q.id, q]));
    return folder.questionIds.map(id => questionMap.get(id)).filter(Boolean);
  }, [folder, allQuestions]);

  if (!folder) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4" dir="rtl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-slate-900/50 border border-white/10 rounded-2xl shadow-xl max-w-md"
        >
          <AlertTriangle className="w-16 h-16 mx-auto mb-6 text-red-500" />
          <h2 className="text-2xl font-bold text-white mb-4">المجلد غير موجود</h2>
          <p className="text-slate-400 mb-8">ربما تم حذف هذا المجلد. يرجى العودة واختيار مجلد آخر.</p>
          <motion.button 
            onClick={onBack} 
            whileHover="hover"
            variants={buttonVariants}
            className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-fuchsia-600 text-white rounded-xl font-semibold hover:bg-fuchsia-500 transition-colors duration-300 shadow-lg shadow-fuchsia-600/20"
          >
            <ArrowLeft className="w-5 h-5" />
            العودة إلى المجلدات
          </motion.button>
        </motion.div> {/* ✅ تم تصحيح الوسم هنا */}
      </div>
    );
  }

  const handleRemoveQuestion = (questionId) => {
    if (window.confirm('هل أنت متأكد من إزالة هذا السؤال من المجلد؟')) {
      removeQuestionFromFolder(folderId, questionId);
    }
  };

  const handleStartTest = () => {
    onStartTest(folderQuestions);
  };

  const getCorrectAnswerText = (question) => {
    if (typeof question.answer === 'string') return question.answer;
    if (typeof question.answer === 'number' && question.choices?.[question.answer]) {
      return question.choices[question.answer];
    }
    return "لا توجد إجابة محددة";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-cairo" dir="rtl">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-slate-950 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 h-[400px] w-[400px] rounded-full bg-fuchsia-500/20 blur-[120px]"></div>

      <div className="relative z-10 max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-6">
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center gap-4"
          >
            <motion.button
              onClick={onBack}
              whileHover="hover"
              variants={buttonVariants}
              className="p-2.5 bg-slate-800/80 border border-white/10 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div className="flex items-center gap-3">
              <Folder className="w-10 h-10 text-fuchsia-400" />
              <div>
                <h1 className="text-3xl font-extrabold text-white">{folder.name}</h1>
                <p className="text-slate-400">{folderQuestions.length} سؤال</p>
              </div>
            </div>
          </motion.div>

          {folderQuestions.length > 0 && (
            <motion.button
              onClick={handleStartTest}
              whileHover="hover"
              variants={buttonVariants}
              className="flex items-center gap-2 w-full sm:w-auto justify-center px-6 py-3 bg-fuchsia-600 text-white rounded-xl font-semibold hover:bg-fuchsia-500 transition-colors duration-300 shadow-lg shadow-fuchsia-600/20"
            >
              <Play className="w-5 h-5" />
              بدء الاختبار الآن
            </motion.button>
          )}
        </header>

        {/* Questions List */}
        <AnimatePresence mode="wait">
          {folderQuestions.length === 0 ? (
            <motion.div
              key="no-questions"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-20 bg-slate-900/50 border border-white/10 rounded-2xl shadow-xl"
            >
              <FileText className="w-20 h-20 mx-auto mb-6 text-slate-600" />
              <h3 className="text-2xl font-bold text-white mb-3">المجلد فارغ</h3>
              <p className="text-slate-400 max-w-md mx-auto">
                لم تقم بإضافة أي أسئلة إلى هذا المجلد بعد. تصفح الأسئلة وأضفها هنا لتنظيمها.
              </p>
            </motion.div>
          ) : (
            <motion.div 
              key="questions-list"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-5"
            >
              {folderQuestions.map((question, index) => {
                const { Icon, label, color } = getQuestionTypeDetails(question.type);
                const correctAnswerText = getCorrectAnswerText(question);
                
                return (
                  <motion.div
                    key={question.id}
                    variants={itemVariants}
                    layout
                    className="bg-slate-900/50 border border-white/10 rounded-xl shadow-lg overflow-hidden"
                  >
                    <header className="p-4 flex items-center justify-between bg-slate-800/50 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <Badge className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-sm font-medium border ${color}`}>
                          <Icon className="w-4 h-4" />
                          {label}
                        </Badge>
                        <span className="text-sm text-slate-400 font-medium">
                          السؤال #{index + 1}
                        </span>
                      </div>
                      <motion.button
                        onClick={() => handleRemoveQuestion(question.id)}
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-all"
                        aria-label="إزالة السؤال"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </header>

                    <div className="p-5">
                      <p className="text-white text-lg leading-relaxed font-medium mb-5">
                        {question.question}
                      </p>

                      {question.passage && (
                        <div className="mb-5 p-4 bg-slate-800/60 rounded-lg border border-white/10">
                          <h4 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-fuchsia-400" />
                            النص المرفق
                          </h4>
                          <p className="text-slate-300 text-base leading-relaxed whitespace-pre-line">
                            {question.passage}
                          </p>
                        </div>
                      )}

                      {question.choices && question.choices.length > 0 ? (
                        <div className="space-y-3">
                          {question.choices.map((choice, choiceIndex) => {
                            const isCorrect = correctAnswerText === choice;
                            return (
                              <div
                                key={choiceIndex}
                                className={`p-3 rounded-lg border flex items-start gap-3 transition-all ${
                                  isCorrect
                                    ? 'bg-green-500/10 border-green-500/30 text-green-300'
                                    : 'bg-slate-800/40 border-slate-700 text-slate-300'
                                }`}
                              >
                                <span className={`font-bold text-base ${isCorrect ? 'text-green-400' : 'text-slate-500'}`}>
                                  {String.fromCharCode(1575 + choiceIndex)})
                                </span>
                                <span className="flex-1">{choice}</span>
                                {isCorrect && <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <span className="text-green-300 font-medium">الإجابة:</span>
                          <span className="text-white font-semibold">{correctAnswerText}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FolderView;
