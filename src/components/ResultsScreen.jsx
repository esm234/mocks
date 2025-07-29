import React, { useState, useEffect } from 'react';
import { useExamStore } from '../store/examStore';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  Home, 
  Trophy, 
  Award, 
  Star, 
  Target, 
  TrendingUp,
  Zap,
  Flame,
  Sparkles,
  Eye,
  Brain,
  Rocket,
  Crown,
  Medal,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Lightbulb,
  BarChart4
} from 'lucide-react';

const ResultsScreen = () => {
  const examStore = useExamStore();
  const {
    examResults,
    resetExam,
    examQuestions,
    userAnswers,
    correctAnswers,
    incorrectAnswers,
    unansweredQuestions
  } = examStore;

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [displayedQuestions, setDisplayedQuestions] = useState([]);
  const [isAnimating, setIsAnimating] = useState(true);
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  useEffect(() => {
    setTimeout(() => setIsAnimating(false), 1000);
  }, []);

  if (!examResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-spin"></div>
            <div className="absolute inset-2 bg-gray-900 rounded-full flex items-center justify-center">
              <Brain className="h-12 w-12 text-blue-400 animate-pulse" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">جاري تحليل النتائج...</h2>
          <p className="text-gray-400">يرجى الانتظار بينما نحضر تقريرك المفصل</p>
        </div>
      </div>
    );
  }

  const handleCategoryClick = (category) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
      setDisplayedQuestions([]);
    } else {
      setSelectedCategory(category);
      let questionsToShow = [];
      
      if (examQuestions && examQuestions.length > 0) {
        let questionNumbers = [];
        
        switch (category) {
          case 'correct':
            questionNumbers = correctAnswers || [];
            break;
          case 'incorrect':
            questionNumbers = incorrectAnswers || [];
            break;
          case 'unanswered':
            questionNumbers = unansweredQuestions || [];
            break;
          default:
            questionNumbers = [];
        }
        
        if (questionNumbers.length === 0) {
          examQuestions.forEach(q => {
            const userAnswer = userAnswers[q.question_number];
            const isAnswered = userAnswer !== undefined && userAnswer !== null;
            const isCorrect = isAnswered && userAnswer === q.answer;
            
            switch (category) {
              case 'correct':
                if (isCorrect) questionNumbers.push(q.question_number);
                break;
              case 'incorrect':
                if (isAnswered && !isCorrect) questionNumbers.push(q.question_number);
                break;
              case 'unanswered':
                if (!isAnswered) questionNumbers.push(q.question_number);
                break;
            }
          });
        }
        
        questionsToShow = examQuestions.filter(q => 
          questionNumbers.includes(q.question_number)
        ).map(q => ({
          ...q,
          userAnswer: userAnswers[q.question_number],
          correctAnswer: q.answer
        }));
      }
      
      setDisplayedQuestions(questionsToShow);
    }
  };

  const getPerformanceLevel = (percentage) => {
    if (percentage >= 95) return { level: 'أسطوري', icon: Crown, color: 'from-yellow-400 to-orange-500', glow: 'shadow-yellow-500/50' };
    if (percentage >= 90) return { level: 'ممتاز', icon: Trophy, color: 'from-emerald-400 to-green-500', glow: 'shadow-emerald-500/50' };
    if (percentage >= 80) return { level: 'جيد جداً', icon: Medal, color: 'from-blue-400 to-cyan-500', glow: 'shadow-blue-500/50' };
    if (percentage >= 70) return { level: 'جيد', icon: Star, color: 'from-purple-400 to-pink-500', glow: 'shadow-purple-500/50' };
    if (percentage >= 60) return { level: 'مقبول', icon: Target, color: 'from-amber-400 to-orange-500', glow: 'shadow-amber-500/50' };
    return { level: 'يحتاج تحسين', icon: Zap, color: 'from-red-400 to-rose-500', glow: 'shadow-red-500/50' };
  };

  const getQuestionTypeIcon = (type) => {
    const icons = {
      analogy: Brain,
      completion: Sparkles,
      error: Target,
      rc: Eye,
      odd: Star
    };
    return icons[type] || BookOpen;
  };

  const getQuestionTypeStyle = (type) => {
    const styles = {
      analogy: 'from-violet-500 to-purple-600',
      completion: 'from-emerald-500 to-teal-600',
      error: 'from-rose-500 to-pink-600',
      rc: 'from-amber-500 to-orange-600',
      odd: 'from-cyan-500 to-blue-600'
    };
    return styles[type] || 'from-gray-500 to-gray-600';
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

  const percentage = examResults.totalQuestions > 0 
    ? parseFloat(((examResults.correctAnswers / examResults.totalQuestions) * 100).toFixed(1))
    : 0;
  
  const performance = getPerformanceLevel(percentage);
  const PerformanceIcon = performance.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 text-white overflow-hidden relative" dir="rtl">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-r from-purple-600/15 to-pink-600/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="sticky top-0 bg-black/40 backdrop-blur-xl border-b border-gray-700/50 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className={`p-3 bg-gradient-to-r ${performance.color} rounded-xl ${performance.glow} shadow-xl`}>
                  <PerformanceIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className={`text-xl font-bold bg-gradient-to-r ${performance.color} bg-clip-text text-transparent`}>
                    تقرير النتائج النهائي
                  </h1>
                  <p className="text-sm text-gray-400">تحليل شامل لأدائك</p>
                </div>
              </div>
              
              <Button 
                onClick={() => window.location.href = '/'}
                variant="ghost"
                className="text-white hover:bg-white/10 bg-white/5 border border-white/20 rounded-xl"
              >
                <Home className="h-5 w-5 ml-2" />
                <span className="hidden sm:inline">الرئيسية</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Hero Results Section */}
        <div className="px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Score Display */}
            <div className={`relative mx-auto mb-16 transition-all duration-1000 ${isAnimating ? 'scale-0 rotate-180' : 'scale-100 rotate-0'}`}>
              <div className="relative w-80 h-80 mx-auto">
                {/* Outer Ring */}
                <svg className="w-80 h-80 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke={`url(#scoreGradient)`}
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${(percentage / 100) * 283} 283`}
                    className="transition-all duration-2000 ease-out drop-shadow-lg"
                  />
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="50%" stopColor="#06D6A0" />
                      <stop offset="100%" stopColor="#00F5FF" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className={`p-6 bg-gradient-to-r ${performance.color} rounded-full ${performance.glow} shadow-2xl mb-4`}>
                    <PerformanceIcon className="h-16 w-16 text-white" />
                  </div>
                  <div className={`text-6xl font-bold bg-gradient-to-r ${performance.color} bg-clip-text text-transparent mb-2`}>
                    {percentage}%
                  </div>
                  <div className="text-2xl font-semibold text-gray-300 mb-2">
                    {examResults.correctAnswers} / {examResults.totalQuestions}
                  </div>
                  <div className={`px-6 py-2 bg-gradient-to-r ${performance.color} rounded-full ${performance.glow} shadow-xl`}>
                    <span className="text-white font-bold text-lg">{performance.level}</span>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              تهانينا على إنجازك!
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12">
              لقد أكملت الاختبار بنجاح. إليك تحليل مفصل لأدائك ونصائح للتحسين
            </p>
          </div>
        </div>

        {/* Statistics Dashboard */}
        <div className="max-w-6xl mx-auto px-6 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Correct Answers */}
            <div 
              onClick={() => handleCategoryClick('correct')}
              className={`group relative bg-gradient-to-br from-green-900/50 to-emerald-900/50 border border-green-500/30 rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25 ${
                selectedCategory === 'correct' ? 'ring-2 ring-green-400 shadow-2xl shadow-green-500/50' : ''
              }`}
            >
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-500/30 text-green-400 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="h-10 w-10" />
              </div>
              <h3 className="text-4xl font-bold text-green-400 mb-2 text-center">{examResults.correctAnswers}</h3>
              <p className="text-green-300 text-center mb-4">إجابات صحيحة</p>
              <div className="bg-green-500/20 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-green-400 to-emerald-400 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${(examResults.correctAnswers / examResults.totalQuestions) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-green-300/70 text-center mt-3">انقر للعرض التفصيلي</p>
            </div>

            {/* Incorrect Answers */}
            <div 
              onClick={() => handleCategoryClick('incorrect')}
              className={`group relative bg-gradient-to-br from-red-900/50 to-rose-900/50 border border-red-500/30 rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25 ${
                selectedCategory === 'incorrect' ? 'ring-2 ring-red-400 shadow-2xl shadow-red-500/50' : ''
              }`}
            >
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-500/30 text-red-400 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <XCircle className="h-10 w-10" />
              </div>
              <h3 className="text-4xl font-bold text-red-400 mb-2 text-center">{examResults.incorrectAnswers}</h3>
              <p className="text-red-300 text-center mb-4">إجابات خاطئة</p>
              <div className="bg-red-500/20 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-red-400 to-rose-400 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${(examResults.incorrectAnswers / examResults.totalQuestions) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-red-300/70 text-center mt-3">انقر للمراجعة</p>
            </div>

            {/* Unanswered Questions */}
            <div 
              onClick={() => handleCategoryClick('unanswered')}
              className={`group relative bg-gradient-to-br from-amber-900/50 to-orange-900/50 border border-amber-500/30 rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/25 ${
                selectedCategory === 'unanswered' ? 'ring-2 ring-amber-400 shadow-2xl shadow-amber-500/50' : ''
              }`}
            >
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/30 text-amber-400 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="h-10 w-10" />
              </div>
              <h3 className="text-4xl font-bold text-amber-400 mb-2 text-center">
                {examResults.totalQuestions - examResults.correctAnswers - examResults.incorrectAnswers}
              </h3>
              <p className="text-amber-300 text-center mb-4">أسئلة غير محلولة</p>
              <div className="bg-amber-500/20 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-400 to-orange-400 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${((examResults.totalQuestions - examResults.correctAnswers - examResults.incorrectAnswers) / examResults.totalQuestions) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-amber-300/70 text-center mt-3">انقر للاستكشاف</p>
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="max-w-6xl mx-auto px-6 mb-16">
          <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 border border-gray-700/50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                <TrendingUp className="h-8 w-8 text-blue-400" />
                تحليل الأداء
              </h3>
              <p className="text-gray-300">نظرة عامة على نقاط القوة والتحسين</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Strengths */}
              <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-xl p-6">
                <h4 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
                  <Sparkles className="h-6 w-6" />
                  نقاط القوة
                </h4>
                <ul className="space-y-3">
                  {percentage >= 80 && (
                    <li className="flex items-center gap-3 text-green-300">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      أداء ممتاز في الاختبار
                    </li>
                  )}
                  {percentage >= 70 && (
                    <li className="flex items-center gap-3 text-green-300">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      فهم جيد للمفاهيم الأساسية
                    </li>
                  )}
                  <li className="flex items-center gap-3 text-green-300">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    إكمال الاختبار بنجاح
                  </li>
                  {examResults.correctAnswers > examResults.incorrectAnswers && (
                    <li className="flex items-center gap-3 text-green-300">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      إجابات صحيحة أكثر من الخاطئة
                    </li>
                  )}
                </ul>
              </div>

              {/* Improvement Areas */}
              <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 border border-orange-500/30 rounded-xl p-6">
                <h4 className="text-xl font-bold text-orange-400 mb-4 flex items-center gap-2">
                  <Target className="h-6 w-6" />
                  مجالات التحسين
                </h4>
                <ul className="space-y-3">
                  {percentage < 70 && (
                    <li className="flex items-center gap-3 text-orange-300">
                      <Lightbulb className="h-5 w-5 text-orange-400" />
                      مراجعة المفاهيم الأساسية
                    </li>
                  )}
                  {examResults.incorrectAnswers > 0 && (
                    <li className="flex items-center gap-3 text-orange-300">
                      <Lightbulb className="h-5 w-5 text-orange-400" />
                      تحليل الأخطاء والتعلم منها
                    </li>
                  )}
                  <li className="flex items-center gap-3 text-orange-300">
                    <Lightbulb className="h-5 w-5 text-orange-400" />
                    المزيد من التدريب المنتظم
                  </li>
                  {(examResults.totalQuestions - examResults.correctAnswers - examResults.incorrectAnswers) > 0 && (
                    <li className="flex items-center gap-3 text-orange-300">
                      <Lightbulb className="h-5 w-5 text-orange-400" />
                      تحسين إدارة الوقت
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Questions Display */}
        {selectedCategory && displayedQuestions.length > 0 && (
          <div className="max-w-6xl mx-auto px-6 mb-16">
            <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 border border-gray-700/50 rounded-2xl p-8">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                  {selectedCategory === 'correct' ? <CheckCircle className="h-8 w-8 text-green-400" /> :
                   selectedCategory === 'incorrect' ? <XCircle className="h-8 w-8 text-red-400" /> :
                   <BookOpen className="h-8 w-8 text-amber-400" />}
                  {selectedCategory === 'correct' ? `الأسئلة الصحيحة (${displayedQuestions.length})` :
                   selectedCategory === 'incorrect' ? `الأسئلة الخاطئة (${displayedQuestions.length})` :
                   `الأسئلة غير المحلولة (${displayedQuestions.length})`}
                </h3>
              </div>

              <div className="space-y-6">
                {displayedQuestions.map((question, index) => {
                  const TypeIcon = getQuestionTypeIcon(question.type);
                  const typeStyle = getQuestionTypeStyle(question.type);
                  const isExpanded = expandedQuestion === index;
                  
                  return (
                    <div 
                      key={question.question_number || index}
                      className={`bg-gradient-to-br from-gray-700/50 to-gray-800/50 border border-gray-600/50 rounded-xl overflow-hidden transition-all duration-300 ${
                        isExpanded ? 'ring-2 ring-gray-400' : ''
                      }`}
                    >
                      {/* Question Header - Clickable */}
                      <div 
                        className="p-6 cursor-pointer hover:bg-gray-600/20 transition-colors duration-200"
                        onClick={() => setExpandedQuestion(isExpanded ? null : index)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`p-3 bg-gradient-to-r ${typeStyle} rounded-lg`}>
                              <TypeIcon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h4 className="text-xl font-bold text-white">
                                السؤال {question.question_number}
                              </h4>
                              <Badge variant="outline" className="bg-gray-700/50 text-gray-300 border-gray-600">
                                {getQuestionTypeLabel(question.type)}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            {selectedCategory === 'correct' && (
                              <div className="flex items-center gap-2 text-green-400">
                                <CheckCircle className="h-5 w-5" />
                                <span className="text-sm font-medium">صحيح</span>
                              </div>
                            )}
                            {selectedCategory === 'incorrect' && (
                              <div className="flex items-center gap-2 text-red-400">
                                <XCircle className="h-5 w-5" />
                                <span className="text-sm font-medium">خاطئ</span>
                              </div>
                            )}
                            {selectedCategory === 'unanswered' && (
                              <div className="flex items-center gap-2 text-amber-400">
                                <BookOpen className="h-5 w-5" />
                                <span className="text-sm font-medium">غير محلول</span>
                              </div>
                            )}
                            
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </div>

                        {/* Question Preview */}
                        <p className="text-gray-300 mt-4 line-clamp-2">
                          {question.question}
                        </p>
                      </div>

                      {/* Expandable Content */}
                      {isExpanded && (
                        <div className="px-6 pb-6 border-t border-gray-600/50">
                          {/* Passage (for RC questions) */}
                          {question.passage && (
                            <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-600/30">
                              <h5 className="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                النص:
                              </h5>
                              <p className="text-gray-200 text-sm leading-relaxed">
                                {question.passage}
                              </p>
                            </div>
                          )}

                          {/* Full Question */}
                          <div className="mb-6">
                            <h5 className="text-sm font-bold text-gray-300 mb-3">السؤال:</h5>
                            <p className="text-white bg-gray-800/50 rounded-lg p-4">
                              {question.question}
                            </p>
                          </div>

                          {/* Answer Choices */}
                          {question.choices && question.choices.length > 0 && (
                            <div>
                              <h5 className="text-sm font-bold text-gray-300 mb-3">الخيارات:</h5>
                              <div className="grid gap-3">
                                {question.choices.map((choice, choiceIndex) => {
                                  const isUserAnswer = question.userAnswer === choiceIndex;
                                  const isCorrectAnswer = question.correctAnswer === choiceIndex;
                                  
                                  return (
                                    <div
                                      key={choiceIndex}
                                      className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                                        isCorrectAnswer
                                          ? 'border-green-400 bg-green-900/30 text-green-200'
                                          : isUserAnswer
                                          ? 'border-red-400 bg-red-900/30 text-red-200'
                                          : 'border-gray-600 bg-gray-800/30 text-gray-300'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="flex-1">{choice}</span>
                                        
                                        {isCorrectAnswer && (
                                          <div className="flex items-center gap-2 text-green-400">
                                            <CheckCircle className="h-4 w-4" />
                                            <span className="text-xs font-bold">صحيح</span>
                                          </div>
                                        )}
                                        {isUserAnswer && !isCorrectAnswer && (
                                          <div className="flex items-center gap-2 text-red-400">
                                            <XCircle className="h-4 w-4" />
                                            <span className="text-xs font-bold">إجابتك</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* No Questions Message */}
        {selectedCategory && displayedQuestions.length === 0 && (
          <div className="max-w-6xl mx-auto px-6 mb-16">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/70 border border-gray-700/50 rounded-2xl p-12 text-center">
              <div className="mx-auto w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mb-6">
                <BookOpen className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-300 mb-4">
                لا توجد أسئلة متاحة
              </h3>
              <p className="text-gray-400">
                {selectedCategory === 'correct' ? 'لا توجد أسئلة صحيحة لعرضها' :
                 selectedCategory === 'incorrect' ? 'لا توجد أسئلة خاطئة لعرضها' :
                 'لا توجد أسئلة غير محلولة لعرضها'}
              </p>
            </div>
          </div>
        )}

        {/* Final Action Button */}
        <div className="max-w-6xl mx-auto px-6 pb-16 text-center">
          <Button
            onClick={() => window.location.href = '/'}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105"
          >
            <Home className="h-6 w-6 ml-3" />
            العودة للصفحة الرئيسية
            <Rocket className="h-6 w-6 mr-3" />
          </Button>
          
          <p className="text-gray-400 text-sm mt-6 max-w-md mx-auto">
            شكراً لك على استخدام محاكي اور جول . نتمنى لك التوفيق في اختباراتك القادمة!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;

