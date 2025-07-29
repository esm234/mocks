import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Clock, Flag, ArrowLeft, Home } from 'lucide-react';
import { useExamStore } from '../store/examStore';

const ReviewScreen = () => {
  const {
    examQuestions,
    userAnswers,
    deferredQuestions,
    reviewFilter,
    examMode,
    currentSection,
    exitReviewMode,
    goToQuestion,
    completeExam,
    getQuestionStats
  } = useExamStore();

  const stats = getQuestionStats();

  // Get filtered questions based on current filter
  const getFilteredQuestions = () => {
    switch (reviewFilter) {
      case 'answered':
        return examQuestions.filter(q => userAnswers[q.question_number] !== undefined);
      case 'unanswered':
        return examQuestions.filter(q => userAnswers[q.question_number] === undefined);
      case 'deferred':
        return examQuestions.filter(q => deferredQuestions[q.question_number]);
      default:
        return examQuestions;
    }
  };

  const filteredQuestions = getFilteredQuestions();

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

  const getQuestionStatus = (questionNumber) => {
    const isAnswered = userAnswers[questionNumber] !== undefined;
    const isDeferred = deferredQuestions[questionNumber];

    if (isAnswered && isDeferred) {
      return { status: 'answered-deferred', label: 'مجاب ومؤجل', color: 'bg-blue-100 text-blue-800' };
    } else if (isAnswered) {
      return { status: 'answered', label: 'مجاب', color: 'bg-green-100 text-green-800' };
    } else if (isDeferred) {
      return { status: 'deferred', label: 'مؤجل', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { status: 'unanswered', label: 'غير مجاب', color: 'bg-red-100 text-red-800' };
    }
  };

  const handleQuestionClick = (questionIndex) => {
    goToQuestion(questionIndex);
  };

  const getQuestionDisplayNumber = (question) => {
    const actualIndex = examQuestions.findIndex(q => q.question_number === question.question_number);
    return actualIndex + 1; // Display as 1-based index
  };

  const getQuestionSection = (question) => {
    const actualIndex = examQuestions.findIndex(q => q.question_number === question.question_number);
    return Math.floor(actualIndex / 13) + 1; // Calculate section (1-based)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-200" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white px-4 py-4 sm:px-6 lg:px-8 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-1 sm:mb-2">مراجعة جميع الأسئلة</h1>
          {examMode === 'sectioned' && (
            <p className="text-blue-200 text-sm sm:text-base">القسم {currentSection}</p>
          )}
          <Button 
            variant="ghost" 
            className="absolute top-3 right-3 sm:top-6 sm:right-6 text-white hover:bg-white/20 bg-white/10 backdrop-blur-sm border border-white/30 px-3 py-2 sm:px-6 sm:py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm sm:text-base" 
            onClick={() => window.location.href = '/'}
          >
            <Home className="h-4 w-4 sm:h-6 sm:w-6 ml-1 sm:ml-2" />
            <span className="font-bold hidden sm:inline">الصفحة الرئيسية</span>
            <span className="font-bold sm:hidden">الرئيسية</span>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <h2 className="text-2xl font-bold text-blue-600">{stats.total}</h2>
            <p className="text-gray-600">إجمالي الأسئلة</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <h2 className="text-2xl font-bold text-yellow-600">{stats.deferred}</h2>
            <p className="text-gray-600">أسئلة مؤجلة</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <h2 className="text-2xl font-bold text-red-600">{stats.unanswered}</h2>
            <p className="text-gray-600">أسئلة غير مجابة</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <h2 className="text-2xl font-bold text-green-600">{stats.answered}</h2>
            <p className="text-gray-600">أسئلة مجابة</p>
          </div>
        </div>

        {/* Filter Info */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="text-base sm:text-lg font-semibold text-center sm:text-right">
            {reviewFilter === 'all' && `عرض ${filteredQuestions.length} من ${stats.total} سؤال`}
            {reviewFilter === 'answered' && `عرض ${filteredQuestions.length} سؤال مجاب`}
            {reviewFilter === 'unanswered' && `عرض ${filteredQuestions.length} سؤال غير مجاب`}
            {reviewFilter === 'deferred' && `عرض ${filteredQuestions.length} سؤال مؤجل`}
          </div>
          <Button variant="outline" onClick={exitReviewMode} className="flex items-center gap-1 sm:gap-2 px-3 py-2 text-sm sm:text-base">
            <ArrowLeft className="h-4 w-4" />
            العودة للاختبار
          </Button>
        </div>

        {/* Questions Grid */}
        {filteredQuestions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 sm:mb-8">
            {filteredQuestions.map((question) => {
              const questionStatus = getQuestionStatus(question.question_number);
              const displayNumber = getQuestionDisplayNumber(question);
              const questionSection = getQuestionSection(question);
              
              return (
                <div 
                  key={question.question_number} 
                  className="bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-blue-500"
                  onClick={() => handleQuestionClick(examQuestions.findIndex(q => q.question_number === question.question_number))}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {questionStatus.status === 'answered' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-400" />
                        )}
                        <span className="font-bold text-lg">السؤال {displayNumber}</span>
                      </div>
                      <Badge variant="secondary" className={`${questionStatus.color} text-xs px-2 py-1`}>
                        {questionStatus.label}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{getQuestionTypeLabel(question.type)}</span>
                      {examMode === 'sectioned' && (
                        <span>القسم {questionSection}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4 border-t">
                    <div className="text-sm text-gray-700 line-clamp-3">
                      {question.passage && (
                        <div className="text-xs text-gray-500 mb-1 italic">
                          {question.passage.substring(0, 100)}...
                        </div>
                      )}
                      <div className="font-medium">
                        {question.question.length > 100 
                          ? `${question.question.substring(0, 100)}...`
                          : question.question
                        }
                      </div>
                    </div>
                    
                    {userAnswers[question.question_number] !== undefined && (
                      <div className="mt-2 p-2 bg-green-50 rounded text-xs">
                        <span className="font-medium text-green-800">الإجابة المختارة: </span>
                        <span className="text-green-700">
                          {question.choices[userAnswers[question.question_number]]}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 sm:py-12">
            <div className="text-gray-500 text-base sm:text-lg mb-3 sm:mb-4">
              {reviewFilter === 'answered' && 'لا توجد أسئلة مجابة'}
              {reviewFilter === 'unanswered' && 'لا توجد أسئلة غير مجابة'}
              {reviewFilter === 'deferred' && 'لا توجد أسئلة مؤجلة'}
              {reviewFilter === 'all' && 'لا توجد أسئلة'}
            </div>
            <Button onClick={exitReviewMode} className="px-4 py-2 text-sm sm:text-base">العودة للاختبار</Button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 sm:pt-6">
          <Button 
            onClick={exitReviewMode}
            variant="outline"
            className="flex items-center gap-1 sm:gap-2 px-4 py-2 text-sm sm:text-base w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            إنهاء المراجعة
          </Button>
          
          <Button 
            onClick={completeExam}
            className="bg-red-600 hover:bg-red-700 flex items-center gap-1 sm:gap-2 px-4 py-2 text-sm sm:text-base w-full sm:w-auto"
          >
            <Flag className="h-4 w-4" />
            إنهاء الاختبار
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewScreen;
