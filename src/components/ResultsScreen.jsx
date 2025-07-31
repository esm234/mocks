import React, { useState, useEffect } from 'react';
import { useExamStore } from '../store/examStore';
import { Button } from './ui/button';
import {
  CheckCircle, XCircle, Home, Star, BookOpen, ChevronDown, ChevronUp,
  Brain, Rocket, BarChart4, Badge, Layers
} from 'lucide-react';

const ResultsScreen = () => {
  const examStore = useExamStore();
  const {
    examResults,
    examQuestions,
    userAnswers,
    correctAnswers,
    incorrectAnswers,
    unansweredQuestions
  } = examStore;

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [displayedQuestions, setDisplayedQuestions] = useState([]);
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // حساب النسبة المئوية
  const percentage = examResults.totalQuestions > 0
    ? parseFloat(((examResults.correctAnswers / examResults.totalQuestions) * 100).toFixed(1))
    : 0;

  // مستوى الأداء
  const getPerformanceLevel = (percentage) => {
    if (percentage >= 90) return { label: 'ممتاز', color: 'from-green-400 to-emerald-500', icon: Star };
    if (percentage >= 75) return { label: 'جيد جداً', color: 'from-blue-400 to-cyan-500', icon: Star };
    if (percentage >= 60) return { label: 'جيد', color: 'from-yellow-400 to-amber-500', icon: Star };
    return { label: 'يحتاج تحسين', color: 'from-red-400 to-rose-500', icon: Star };
  };
  const performance = getPerformanceLevel(percentage);

  // تحليل الأداء حسب نوع السؤال
  const getTypeStats = () => {
    const types = ['analogy', 'completion', 'error', 'rc', 'odd'];
    const labels = {
      analogy: 'التناظر اللفظي',
      completion: 'إكمال الجمل',
      error: 'الخطأ السياقي',
      rc: 'استيعاب المقروء',
      odd: 'المفردة الشاذة'
    };
    const icons = {
      analogy: Brain,
      completion: BookOpen,
      error: XCircle,
      rc: BookOpen,
      odd: Star
    };
    const stats = {};
    types.forEach(type => {
      stats[type] = { correct: 0, total: 0, label: labels[type], icon: icons[type] };
    });
    examQuestions.forEach(q => {
      if (stats[q.type]) {
        stats[q.type].total++;
        const userAnswer = userAnswers[q.question_number];
        if (userAnswer === q.answer) stats[q.type].correct++;
      }
    });
    return stats;
  };
  const typeStats = getTypeStats();

  // استعراض الأسئلة حسب الفئة
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setExpandedQuestion(null);
    let questionNumbers = [];
    if (category === 'correct') questionNumbers = correctAnswers || [];
    if (category === 'incorrect') questionNumbers = incorrectAnswers || [];
    if (category === 'unanswered') questionNumbers = unansweredQuestions || [];
    const questions = examQuestions.filter(q => questionNumbers.includes(q.question_number))
      .map(q => ({
        ...q,
        userAnswer: userAnswers[q.question_number],
        correctAnswer: q.answer
      }));
    setDisplayedQuestions(questions);
  };

  // ألوان الفئات
  const categoryColors = {
    correct: 'from-green-500 to-emerald-500',
    incorrect: 'from-red-500 to-rose-500',
    unanswered: 'from-amber-500 to-orange-500'
  };

  // أيقونات الفئات
  const categoryIcons = {
    correct: CheckCircle,
    incorrect: XCircle,
    unanswered: BookOpen
  };

  // عناوين الفئات
  const categoryTitles = {
    correct: 'الإجابات الصحيحة',
    incorrect: 'الإجابات الخاطئة',
    unanswered: 'الأسئلة غير المحلولة'
  };

  // عدد الأسئلة غير المحلولة
  const unansweredCount = examResults.totalQuestions - examResults.correctAnswers - examResults.incorrectAnswers;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 text-white overflow-x-hidden" dir="rtl">
      {/* رأس الصفحة */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-black/40 backdrop-blur-md border-b border-gray-700/30">
        <div className="flex items-center justify-between px-8 py-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <span className={`p-2 rounded-lg bg-gradient-to-r ${performance.color}`}>
              <performance.icon className="h-6 w-6 text-white" />
            </span>
            <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              نتائج الاختبار
            </span>
          </div>
          <Button
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 border border-gray-600 rounded-xl px-4 py-2 text-sm font-medium"
          >
            <Home className="h-4 w-4 ml-2" />
            الرئيسية
          </Button>
        </div>
      </div>

      {/* عرض النتيجة الرئيسية */}
      <div className="pt-32 pb-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative w-56 h-56 mx-auto mb-8">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="none" />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="url(#mainGradient)"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${(percentage / 100) * 282.7} 282.7`}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06D6A0" />
                  <stop offset="50%" stopColor="#00F5FF" />
                  <stop offset="100%" stopColor="#9333EA" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-6xl font-bold bg-gradient-to-r ${performance.color} bg-clip-text text-transparent`}>
                {percentage}%
              </span>
              <span className="text-xl text-gray-300 mt-2">
                {examResults.correctAnswers}/{examResults.totalQuestions}
              </span>
              <span className={`mt-4 px-4 py-2 rounded-full bg-gradient-to-r ${performance.color} text-white font-bold`}>
                {performance.label}
              </span>
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent">
            أحسنت! أنهيت الاختبار
          </h2>
          <p className="text-lg text-gray-400 mb-4">
            استكشف أدائك وراجع الأسئلة لتطوير مستواك
          </p>
        </div>
      </div>

      {/* الأداء حسب نوع السؤال */}
      <div className="max-w-4xl mx-auto px-4 mb-16">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent flex items-center justify-center gap-2">
            <BarChart4 className="h-6 w-6 text-cyan-400" />
            أداؤك حسب نوع السؤال
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Object.entries(typeStats).filter(([_, s]) => s.total > 0).map(([type, stat]) => {
            const Icon = stat.icon;
            const percent = stat.total ? Math.round((stat.correct / stat.total) * 100) : 0;
            const color = percent >= 80 ? 'bg-green-500/20 text-green-400 border-green-400/30'
              : percent >= 60 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30'
              : 'bg-red-500/20 text-red-400 border-red-400/30';
            return (
              <div key={type} className={`rounded-xl border p-5 flex flex-col items-center ${color}`}>
                <span className="mb-2 p-3 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400">
                  <Icon className="h-6 w-6 text-white" />
                </span>
                <span className="font-bold text-lg mb-1">{stat.label}</span>
                <span className="text-2xl font-bold mb-1">{percent}%</span>
                <span className="text-sm text-gray-400 mb-2">
                  {stat.correct} من {stat.total} صحيح
                </span>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className={`h-full rounded-full ${percent >= 80 ? 'bg-green-400' : percent >= 60 ? 'bg-yellow-400' : 'bg-red-400'}`}
                    style={{ width: `${percent}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* فئات النتائج */}
      <div className="max-w-4xl mx-auto px-4 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {['correct', 'incorrect', 'unanswered'].map(category => {
            const Icon = categoryIcons[category];
            const count = category === 'correct'
              ? examResults.correctAnswers
              : category === 'incorrect'
                ? examResults.incorrectAnswers
                : unansweredCount;
            return (
              <div
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`cursor-pointer group rounded-2xl border-2 p-8 text-center bg-gradient-to-br ${categoryColors[category]} border-opacity-30 hover:scale-105 transition-all duration-300
                  ${selectedCategory === category ? 'ring-2 ring-white scale-105' : ''}`}
              >
                <div className="flex flex-col items-center">
                  <span className="mb-4 p-4 rounded-full bg-white/10 border-2 border-white/20">
                    <Icon className="h-8 w-8" />
                  </span>
                  <span className="text-4xl font-bold mb-2">{count}</span>
                  <span className="font-semibold text-lg mb-2">{categoryTitles[category]}</span>
                  <Badge className="bg-white/10 text-white/80 border-white/20 text-xs px-3 py-1">
                    انقر للاستعراض
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* استعراض الأسئلة */}
      {selectedCategory && (
        <div className="max-w-4xl mx-auto px-4 mb-16">
          <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 border border-gray-700/50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                {categoryIcons[selectedCategory] && <categoryIcons[selectedCategory] className="h-7 w-7" />}
                {categoryTitles[selectedCategory]} ({displayedQuestions.length})
              </h3>
            </div>
            {displayedQuestions.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                <Layers className="h-12 w-12 mx-auto mb-4" />
                لا توجد أسئلة في هذه الفئة
              </div>
            ) : (
              <div className="space-y-6">
                {displayedQuestions.map((q, idx) => {
                  const isExpanded = expandedQuestion === idx;
                  return (
                    <div key={q.question_number || idx}
                      className={`bg-gradient-to-br from-gray-700/50 to-gray-800/50 border border-gray-600/50 rounded-xl overflow-hidden transition-all duration-300
                        ${isExpanded ? 'ring-2 ring-cyan-400' : ''}`}>
                      <div
                        className="p-6 cursor-pointer hover:bg-gray-600/20 transition-colors duration-200"
                        onClick={() => setExpandedQuestion(isExpanded ? null : idx)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className="p-2 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-400">
                              <Star className="h-5 w-5 text-white" />
                            </span>
                            <span className="font-bold text-lg">سؤال {q.question_number}</span>
                          </div>
                          <span>
                            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                          </span>
                        </div>
                        <p className="text-gray-300 mt-4 line-clamp-2">{q.question}</p>
                      </div>
                      {isExpanded && (
                        <div className="px-6 pb-6 border-t border-gray-600/50">
                          {q.passage && (
                            <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-600/30">
                              <span className="font-bold text-sm text-gray-300 mb-2 flex items-center gap-2">
                                <BookOpen className="h-4 w-4" /> نص السؤال:
                              </span>
                              <p className="text-gray-200 text-sm">{q.passage}</p>
                            </div>
                          )}
                          <div className="mb-6">
                            <span className="font-bold text-sm text-gray-300 mb-2">السؤال:</span>
                            <p className="text-white bg-gray-800/50 rounded-lg p-4">{q.question}</p>
                          </div>
                          {q.choices && q.choices.length > 0 && (
                            <div>
                              <span className="font-bold text-sm text-gray-300 mb-2">الخيارات:</span>
                              <div className="grid gap-3 mt-2">
                                {q.choices.map((choice, i) => {
                                  const isUser = q.userAnswer === i;
                                  const isCorrect = q.correctAnswer === i;
                                  return (
                                    <div key={i}
                                      className={`p-4 rounded-lg border-2 flex items-center justify-between
                                        ${isCorrect
                                          ? 'border-green-400 bg-green-900/30 text-green-200'
                                          : isUser
                                            ? 'border-red-400 bg-red-900/30 text-red-200'
                                            : 'border-gray-600 bg-gray-800/30 text-gray-300'
                                        }`}>
                                      <span>{choice}</span>
                                      {isCorrect && (
                                        <span className="flex items-center gap-1 text-green-400 text-xs font-bold">
                                          <CheckCircle className="h-4 w-4" /> صحيح
                                        </span>
                                      )}
                                      {isUser && !isCorrect && (
                                        <span className="flex items-center gap-1 text-red-400 text-xs font-bold">
                                          <XCircle className="h-4 w-4" /> إجابتك
                                        </span>
                                      )}
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
            )}
          </div>
        </div>
      )}

      {/* زر العودة */}
      <div className="max-w-4xl mx-auto px-4 pb-20 text-center">
        <div className="bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-cyan-900/30 border border-purple-500/30 rounded-3xl p-10 mb-8 backdrop-blur-lg">
          <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            رحلتك مستمرة!
          </h3>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            كل اختبار هو خطوة جديدة نحو هدفك. استمر في التعلم والتطوير، وراجع الأسئلة لتقوية نقاط ضعفك.
          </p>
          <Button
            onClick={() => window.location.href = '/'}
            size="lg"
            className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-500 hover:via-blue-500 hover:to-cyan-500 text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 group"
          >
            <Home className="h-6 w-6 ml-3 group-hover:rotate-12 transition-transform duration-300" />
            العودة للصفحة الرئيسية
            <Rocket className="h-6 w-6 mr-3 group-hover:-translate-y-1 transition-transform duration-300" />
          </Button>
        </div>
        <p className="text-gray-500 text-sm max-w-2xl mx-auto">
          تم تصميم هذه الصفحة لمساعدتك على فهم أدائك وتطوير مهاراتك. نتمنى لك التوفيق في رحلتك!
        </p>
      </div>
    </div>
  );
};

export default ResultsScreen;
