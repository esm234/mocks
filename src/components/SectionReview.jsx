import React, { useState } from "react";
import { useExamStore } from "../store/examStore";
import { Button } from "./ui/button";
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, Clock, ArrowLeft, ArrowRight, BookOpen, BarChart3, Target, Home, AlertTriangle } from 'lucide-react';

const SectionReview = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
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

  // Calculate total sections
  const totalSections = Math.max(...examQuestions.map(q => q.section));
  const isLastSection = currentSection === totalSections;

  // Get current section questions
  const sectionQuestions = examQuestions.filter(q => q.section === currentSection);
  
  // Calculate section statistics
  const sectionStats = {
    total: sectionQuestions.length,
    answered: 0,
    unanswered: 0,
    deferred: 0
  };

  sectionQuestions.forEach(question => {
    if (userAnswers[question.question_number] !== undefined) {
      sectionStats.answered++;
    } else {
      sectionStats.unanswered++;
    }
    
    if (deferredQuestions[question.question_number]) {
      sectionStats.deferred++;
    }
  });

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getQuestionTypeLabel = (type) => {
    const typeLabels = {
      analogy: 'التناظر اللفظي',
      completion: 'إكمال الجمل',
      error: 'الخطأ السياقي',
      rc: 'استيعاب المقروء',
      odd: 'المفردة الشاذة'
    };
    return typeLabels[type] || type;
  };

  const handleQuestionClick = (questionNumber) => {
    const globalIndex = examQuestions.findIndex(q => q.question_number === questionNumber);
    if (globalIndex !== -1) {
      goToQuestion(globalIndex);
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
    }
  };

  const handleNextSection = () => {
    setShowConfirmModal(true);
  };

  const confirmNextSection = () => {
    setShowConfirmModal(false);
    if (isLastSection) {
      completeExam();
    } else {
      moveToNextSectionFromReview();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelNextSection = () => {
    setShowConfirmModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white" dir="rtl">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-purple-800"></div>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            مراجعة القسم {currentSection}
          </h1>
          <p className="text-lg text-blue-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            راجع إجاباتك قبل الانتقال للقسم التالي
          </p>
          
          {/* Enhanced Progress Indicator */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 max-w-md mx-auto mb-8 border border-white/20 shadow-2xl">
            <div className="text-center mb-6">
              <div className="text-white text-xl sm:text-2xl font-bold mb-2">
                القسم {currentSection} من {totalSections}
              </div>
            </div>
            
            {/* Circular Progress */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="url(#progressGradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${(currentSection / totalSections) * 283} 283`}
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="50%" stopColor="#06D6A0" />
                    <stop offset="100%" stopColor="#00F5FF" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-lg sm:text-xl font-bold">
                  {Math.round((currentSection / totalSections) * 100)}%
                </span>
              </div>
            </div>
            
            {/* Timer inside the same box */}
            {timerActive && (
              <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 backdrop-blur-md rounded-lg px-4 py-2 inline-flex items-center gap-2 border border-red-300/30">
                <Clock className="w-4 h-4 text-red-200" />
                <span className="text-white font-bold text-base tracking-wider">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
          </div>
          
          <Button 
            variant="" 
            className="absolute top-3 right-3 sm:top-6 sm:right-6 text-white hover:bg-white/20 bg-white/10 backdrop-blur-sm border border-white/30 px-2 py-2 sm:px-6 sm:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" 
            onClick={() => window.location.href = '/'}
          >
            <Home className="h-4 w-4 sm:h-6 sm:w-6 sm:ml-2" />
            <span className="font-bold text-xs sm:text-base hidden sm:inline">الصفحة الرئيسية</span>
          </Button>
        </div>
      </div>

      {/* Main Content - Mobile Optimized */}
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-8 sm:px-6 lg:px-8">
        <div className="space-y-6 sm:space-y-8">
          {/* Enhanced Statistics Cards - Mobile Optimized */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white/80 rounded-lg shadow-md p-4 text-center">
              <h2 className="text-2xl font-bold text-blue-600">{sectionStats.total}</h2>
              <p className="text-gray-600">إجمالي الأسئلة</p>
            </div>

            <div className="bg-white/80 rounded-lg shadow-md p-4 text-center">
              <h2 className="text-2xl font-bold text-green-600">{sectionStats.answered}</h2>
              <p className="text-gray-600">مُجابة</p>
            </div>

            <div className="bg-white/80 rounded-lg shadow-md p-4 text-center">
              <h2 className="text-2xl font-bold text-red-600">{sectionStats.unanswered}</h2>
              <p className="text-gray-600">غير مُجابة</p>
            </div>
          </div>

          {/* Enhanced Questions Grid - Mobile Optimized */}
          <div className="bg-white/80 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 text-center mb-4">
              أسئلة القسم {currentSection}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sectionQuestions.map((question) => (
                <div 
                  key={question.question_number}
                  className={`relative p-4 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-lg border-2 ${
                    userAnswers[question.question_number] !== undefined 
                      ? 'border-green-300 bg-green-50' 
                      : deferredQuestions[question.question_number] 
                      ? 'border-yellow-300 bg-yellow-50' 
                      : 'border-gray-300 bg-gray-50'
                  }`}
                  onClick={() => handleQuestionClick(question.question_number)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-lg">السؤال {question.question_number}</span>
                    <Badge variant="outline" className={`text-xs font-medium ${
                      userAnswers[question.question_number] !== undefined 
                        ? 'bg-green-200 text-green-800' 
                        : deferredQuestions[question.question_number] 
                        ? 'bg-yellow-200 text-yellow-800' 
                        : 'bg-gray-200 text-gray-800'
                    }`}>
                      {userAnswers[question.question_number] !== undefined 
                        ? 'مُجابة' 
                        : deferredQuestions[question.question_number] 
                        ? 'مؤجلة' 
                        : 'غير مُجابة'}
                    </Badge>
                  </div>
                  <p className="text-gray-700 line-clamp-2">{question.question}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Action Buttons - Mobile Optimized */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 sm:pt-6">
            <Button
              onClick={() => { 
                exitSectionReview(); 
                // Navigate to the first question of the current section
                const firstQuestionOfSection = examQuestions.find(q => q.section === currentSection);
                if (firstQuestionOfSection) {
                  const questionIndex = examQuestions.findIndex(q => q.question_number === firstQuestionOfSection.question_number);
                  if (questionIndex !== -1) {
                    goToQuestion(questionIndex);
                  }
                }
                window.scrollTo({ top: 0, behavior: 'smooth' }); 
              }}
              className="bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white/90 transition-all duration-300 px-4 py-2 sm:px-8 sm:py-4 text-sm sm:text-lg font-bold rounded-lg shadow-lg hover:shadow-xl border-2 border-gray-300 transform hover:scale-105 w-full sm:w-auto"
              size="sm"
            >
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2" />
              العودة للقسم {currentSection}
            </Button>
            
            <Button
              onClick={handleNextSection}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all duration-300 px-4 py-2 sm:px-8 sm:py-4 text-sm sm:text-lg font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto"
              size="sm"
            >
              {isLastSection ? 'إنهاء الاختبار' : `الانتقال للقسم ${currentSection + 1}`}
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border border-gray-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                  <AlertTriangle className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                تأكيد الانتقال
              </h3>
              <p className="text-orange-100 text-sm">
                هذا الإجراء لا يمكن التراجع عنه
              </p>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="text-center mb-6">
                <p className="text-gray-700 text-base leading-relaxed">
                  الرجاء التأكيد على رغبتك في إنهاء هذه المراجعة. إذا نقرت فوق "نعم"، لن تكون هناك إمكانية للعودة إلى هذه المراجعة والإجابة على الأسئلة.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={cancelNextSection}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 transition-all duration-300 py-3 rounded-xl font-bold"
                >
                  إلغاء
                </Button>
                <Button
                  onClick={confirmNextSection}
                  className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white transition-all duration-300 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl"
                >
                  نعم
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionReview;
