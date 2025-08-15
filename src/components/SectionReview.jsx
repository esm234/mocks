import React, { useState, useMemo } from "react";
import { useExamStore } from "../store/examStore";
import { Button } from "./ui/button";
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  Home, 
  AlertTriangle,
  Layers,
  Play,
  Award,
  Eye,
  Star,
  Target,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};
const buttonVariants = {
  hover: { scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 10 } },
  tap: { scale: 0.95 }
};

const SectionReview = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [questionFilter, setQuestionFilter] = useState('all'); // 'all', 'answered', 'deferred', 'unanswered'
  
  const {
    currentSection,
    examQuestions,
    userAnswers,
    deferredQuestions,
    exitSectionReview,
    goToQuestion,
    timerActive,
    timeRemaining,
    examMode,
    completeExam,
    moveToNextSectionFromReview
  } = useExamStore();

  const isSingleMode = examMode === 'single';
  const totalSections = isSingleMode ? 1 : Math.max(...examQuestions.map(q => q.section));
  const isLastSection = isSingleMode || currentSection === totalSections;
  
  const allSectionQuestions = useMemo(() => isSingleMode 
    ? examQuestions 
    : examQuestions.filter(q => q.section === currentSection), 
    [isSingleMode, examQuestions, currentSection]
  );
  
  const sectionStats = useMemo(() => {
    const stats = { total: allSectionQuestions.length, answered: 0, unanswered: 0, deferred: 0 };
    allSectionQuestions.forEach(q => {
      if (deferredQuestions[q.question_number]) stats.deferred++;
      else if (userAnswers[q.question_number] !== undefined) stats.answered++;
      else stats.unanswered++;
    });
    return stats;
  }, [allSectionQuestions, userAnswers, deferredQuestions]);

  const filteredQuestions = useMemo(() => {
    switch (questionFilter) {
      case 'answered': return allSectionQuestions.filter(q => userAnswers[q.question_number] !== undefined && !deferredQuestions[q.question_number]);
      case 'deferred': return allSectionQuestions.filter(q => deferredQuestions[q.question_number]);
      case 'unanswered': return allSectionQuestions.filter(q => userAnswers[q.question_number] === undefined && !deferredQuestions[q.question_number]);
      default: return allSectionQuestions;
    }
  }, [questionFilter, allSectionQuestions, userAnswers, deferredQuestions]);

  const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;

  const handleQuestionClick = (questionNumber) => {
    const globalIndex = examQuestions.findIndex(q => q.question_number === questionNumber);
    if (globalIndex !== -1) {
      goToQuestion(globalIndex);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const confirmAction = () => {
    setShowConfirmModal(false);
    if (isLastSection || isSingleMode) completeExam();
    else moveToNextSectionFromReview();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const returnToExam = () => {
    exitSectionReview();
    const targetQuestion = isSingleMode ? examQuestions[0] : allSectionQuestions[0];
    if (targetQuestion) {
      const questionIndex = examQuestions.findIndex(q => q.question_number === targetQuestion.question_number);
      if (questionIndex !== -1) goToQuestion(questionIndex);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCompletionPercentage = () => Math.round((sectionStats.answered / sectionStats.total) * 100) || 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-cairo" dir="rtl">
      <div className="absolute inset-0 -z-10 h-full w-full bg-slate-950 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div>
      </div>

      <div className="relative z-10">
        <header className="sticky top-0 bg-slate-950/70 backdrop-blur-xl border-b border-white/10 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-slate-800 rounded-lg"><Eye className="w-6 h-6 text-fuchsia-400" /></div>
              <div>
                <h1 className="font-bold text-white text-lg">{isSingleMode ? "مراجعة الاختبار" : `مراجعة القسم ${currentSection}`}</h1>
                <p className="text-xs text-slate-400">{`${sectionStats.answered} من ${sectionStats.total} سؤال تمت الإجابة عليه`}</p>
              </div>
            </div>
            {timerActive && (
              <div className="flex items-center gap-2 bg-red-900/30 border border-red-500/30 rounded-full px-4 py-2">
                <Clock className="h-5 w-5 text-red-400 animate-pulse" />
                <span className="text-red-300 font-bold font-mono">{formatTime(timeRemaining)}</span>
              </div>
            )}
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <div className="text-center mb-12">
              <div className="relative mx-auto mb-8 w-48 h-48">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                  <motion.circle
                    cx="50" cy="50" r="45" stroke="url(#progressGradient)" strokeWidth="8" fill="none" strokeLinecap="round"
                    strokeDasharray="283"
                    initial={{ strokeDashoffset: 283 }}
                    animate={{ strokeDashoffset: 283 - (getCompletionPercentage() / 100) * 283 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                  <defs><linearGradient id="progressGradient"><stop offset="0%" stopColor="#a855f7" /><stop offset="100%" stopColor="#d946ef" /></linearGradient></defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold text-white">{getCompletionPercentage()}%</span>
                  <span className="text-slate-400 text-sm mt-1">مكتمل</span>
                </div>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">{isSingleMode ? "مراجعة شاملة" : `مراجعة القسم ${currentSection} من ${totalSections}`}</h2>
              <p className="text-slate-400 max-w-xl mx-auto">تأكد من إجاباتك قبل المتابعة. هذا هو الوقت المناسب للمراجعة النهائية.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <StatCard type="answered" count={sectionStats.answered} total={sectionStats.total} icon={CheckCircle} color="green" label="أسئلة مُجابة" currentFilter={questionFilter} setFilter={setQuestionFilter} />
              <StatCard type="deferred" count={sectionStats.deferred} total={sectionStats.total} icon={Clock} color="amber" label="أسئلة مؤجلة" currentFilter={questionFilter} setFilter={setQuestionFilter} />
              <StatCard type="unanswered" count={sectionStats.unanswered} total={sectionStats.total} icon={Circle} color="red" label="أسئلة غير مُجابة" currentFilter={questionFilter} setFilter={setQuestionFilter} />
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={questionFilter} variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredQuestions.sort((a, b) => a.question_number - b.question_number).map(q => (
                  <QuestionCard key={q.question_number} question={q} userAnswers={userAnswers} deferredQuestions={deferredQuestions} onClick={handleQuestionClick} />
                ))}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </main>

        <footer className="sticky bottom-0 bg-slate-950/70 backdrop-blur-xl border-t border-white/10 z-30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-center gap-4">
            <motion.button onClick={returnToExam} whileHover="hover" variants={buttonVariants} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 rounded-lg font-semibold">
              <ArrowRight className="w-5 h-5" /> العودة للأسئلة
            </motion.button>
            <motion.button onClick={() => setShowConfirmModal(true)} whileHover="hover" variants={buttonVariants} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-fuchsia-600 rounded-lg font-semibold">
              {isLastSection || isSingleMode ? <><Award className="w-5 h-5" /> إنهاء الاختبار</> : <><Play className="w-5 h-5" /> القسم التالي</>}
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
          </div>
        </footer>
      </div>

      <AnimatePresence>
        {showConfirmModal && <ConfirmationModal isLast={isLastSection || isSingleMode} nextSection={currentSection + 1} onConfirm={confirmAction} onCancel={() => setShowConfirmModal(false)} />}
      </AnimatePresence>
    </div>
  );
};

const StatCard = ({ type, count, total, icon: Icon, color, label, currentFilter, setFilter }) => {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  const isSelected = currentFilter === type;
  const colors = {
    green: { border: 'border-green-500', bg: 'bg-green-500/10', text: 'text-green-400', progress: 'bg-green-500' },
    amber: { border: 'border-amber-500', bg: 'bg-amber-500/10', text: 'text-amber-400', progress: 'bg-amber-500' },
    red: { border: 'border-red-500', bg: 'bg-red-500/10', text: 'text-red-400', progress: 'bg-red-500' },
  };
  const c = colors[color];

  return (
    <motion.div
      onClick={() => setFilter(currentFilter === type ? 'all' : type)}
      variants={itemVariants}
      className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? `${c.border} ${c.bg}` : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${c.bg}`}><Icon className={`w-6 h-6 ${c.text}`} /></div>
        <span className={`text-3xl font-bold ${c.text}`}>{count}</span>
      </div>
      <p className="font-semibold text-white mb-2">{label}</p>
      <div className="w-full bg-slate-700 rounded-full h-1.5"><div className={`${c.progress} h-1.5 rounded-full`} style={{ width: `${percentage}%` }}></div></div>
    </motion.div>
  );
};

const QuestionCard = ({ question, userAnswers, deferredQuestions, onClick }) => {
  const isDeferred = deferredQuestions[question.question_number];
  const isAnswered = userAnswers[question.question_number] !== undefined;
  const status = isDeferred ? 'deferred' : isAnswered ? 'answered' : 'unanswered';
  const statusStyles = {
    answered: { border: 'border-green-500/50', bg: 'bg-green-500/10', text: 'text-green-400' },
    deferred: { border: 'border-amber-500/50', bg: 'bg-amber-500/10', text: 'text-amber-400' },
    unanswered: { border: 'border-red-500/50', bg: 'bg-red-500/10', text: 'text-red-400' },
  };
  const s = statusStyles[status];

  return (
    <motion.button
      onClick={() => onClick(question.question_number)}
      variants={itemVariants}
      whileHover={{ scale: 1.05 }}
      className={`p-4 rounded-lg text-center transition-colors border ${s.border} ${s.bg} hover:bg-slate-700`}
    >
      <span className={`text-2xl font-bold ${s.text}`}>{question.question_number}</span>
    </motion.button>
  );
};

const ConfirmationModal = ({ isLast, nextSection, onConfirm, onCancel }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center z-50 p-4"
  >
    <motion.div
      initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
      className="bg-slate-900 rounded-2xl shadow-2xl max-w-sm w-full border border-white/10 p-6 text-center"
    >
      <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-red-500/10 border-2 border-red-500/30 mb-4">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">هل أنت متأكد؟</h3>
      <p className="text-slate-400 mb-6">
        {isLast ? 'أنت على وشك إنهاء الاختبار. لا يمكن التراجع عن هذا الإجراء.' : `ستنتقل إلى القسم ${nextSection} ولا يمكنك العودة لهذا القسم.`}
      </p>
      <div className="flex gap-3">
        <Button onClick={onCancel} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-lg font-bold">إلغاء</Button>
        <Button onClick={onConfirm} className="flex-1 bg-fuchsia-600 hover:bg-fuchsia-500 text-white py-3 rounded-lg font-bold">نعم، متابعة</Button>
      </div>
    </motion.div>
  </motion.div>
);

export default SectionReview;
