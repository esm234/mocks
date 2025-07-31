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
  BarChart4,
  Shield,
  Compass,
  Diamond,
  ArrowUpRight,
  Layers,
  Activity,
  Radio
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
  const [activeInsight, setActiveInsight] = useState(0);

  useEffect(() => {
    // Scroll to top when the component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => setIsAnimating(false), 1000);
    
    // Auto-cycle through insights
    const interval = setInterval(() => {
      setActiveInsight(prev => (prev + 1) % 4);
    }, 3000);
    
    return () => clearInterval(interval);
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

  // Smart Insights Generator
  const generateSmartInsights = () => {
    const insights = [
      {
        icon: Activity,
        title: "معدل الدقة",
        value: `${percentage.toFixed(1)}%`,
        description: percentage >= 85 ? "أداء استثنائي!" : percentage >= 70 ? "أداء جيد ومستقر" : "متاح للتحسين",
        color: percentage >= 85 ? "from-green-400 to-emerald-500" : percentage >= 70 ? "from-blue-400 to-cyan-500" : "from-orange-400 to-red-500"
      },
      {
        icon: Zap, // استخدمنا Zap بدلاً من Lightning
        title: "معدل الإكمال",
        value: `${Math.round(((examResults.correctAnswers + examResults.incorrectAnswers) / examResults.totalQuestions) * 100)}%`,
        description: "من الأسئلة تم حلها",
        color: "from-purple-400 to-pink-500"
      },
      {
        icon: Shield,
        title: "مؤشر الثقة",
        value: examResults.correctAnswers > examResults.incorrectAnswers ? "عالي" : "متوسط",
        description: "مستوى الثقة في الإجابات",
        color: "from-indigo-400 to-purple-500"
      },
      {
        icon: Compass,
        title: "توصية التطوير",
        value: percentage >= 80 ? "التخصص" : "التوسع",
        description: percentage >= 80 ? "ركز على مجالات متقدمة" : "عزز المهارات الأساسية",
        color: "from-teal-400 to-cyan-500"
      }
    ];
    return insights;
  };

  const smartInsights = generateSmartInsights();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 text-white overflow-hidden relative" dir="rtl">
      {/* Dynamic Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
        <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-r from-emerald-600/10 to-teal-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Floating Navigation Header */}
        <div className="fixed top-6 left-6 right-6 bg-black/30 backdrop-blur-2xl border border-gray-700/30 rounded-2xl z-50">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className={`p-2 bg-gradient-to-r ${performance.color} rounded-lg ${performance.glow} shadow-lg`}>
                <PerformanceIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className={`text-lg font-bold bg-gradient-to-r ${performance.color} bg-clip-text text-transparent`}>
                  تحليل الأداء المتقدم
                </h1>
              </div>
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

        {/* Revolutionary Score Display */}
        <div className="pt-32 pb-20">
          <div className="max-w-5xl mx-auto px-6 text-center">
            {/* Hexagonal Score Display */}
            <div className={`relative mx-auto mb-16 transition-all duration-1000 ${isAnimating ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
              <div className="relative w-80 h-80 mx-auto">
                {/* Score Ring */}
                <svg className="absolute inset-4 w-72 h-72 transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="3" fill="none" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    stroke="url(#hexGradient)"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${(percentage / 100) * 251} 251`}
                    className="transition-all duration-2000 ease-out"
                  />
                  <defs>
                    <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06D6A0" />
                      <stop offset="50%" stopColor="#00F5FF" />
                      <stop offset="100%" stopColor="#9333EA" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className={`text-6xl font-bold bg-gradient-to-r ${performance.color} bg-clip-text text-transparent mb-2`}>
                    {percentage}%
                  </div>
                  <div className="text-xl text-gray-300 mb-3">
                    {examResults.correctAnswers}/{examResults.totalQuestions}
                  </div>
                  <div className={`px-4 py-2 bg-gradient-to-r ${performance.color} rounded-full ${performance.glow} shadow-lg`}>
                    <span className="text-white font-bold">{performance.level}</span>
                  </div>
                </div>
                
                {/* Floating Particles Around Score */}
                <div className="absolute inset-0">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className={`absolute w-3 h-3 bg-gradient-to-r ${performance.color} rounded-full animate-pulse`}
                      style={{
                        left: `${50 + 45 * Math.cos((i * 60 * Math.PI) / 180)}%`,
                        top: `${50 + 45 * Math.sin((i * 60 * Math.PI) / 180)}%`,
                        animationDelay: `${i * 0.3}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent">
              انجاز رقمي متميز!
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-16 leading-relaxed">
              تم تحليل أدائك باستخدام خوارزميات ذكية لتقديم رؤى شخصية ونصائح مُخصصة لتطوير مهاراتك
            </p>
          </div>
        </div>

        {/* Smart Insights Dashboard - Completely New Design */}
        <div className="max-w-6xl mx-auto px-6 mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              رؤى ذكية ومؤشرات متقدمة
            </h3>
            <p className="text-gray-400">تحليل متطور يكشف أنماط أدائك وإمكانياتك الحقيقية</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {smartInsights.map((insight, index) => {
              const IconComponent = insight.icon;
              return (
                <div 
                  key={index}
                  className={`relative bg-gradient-to-br from-gray-800/60 to-gray-900/80 border border-gray-700/50 rounded-2xl p-6 hover:scale-105 transition-all duration-500 overflow-hidden group ${
                    activeInsight === index ? 'ring-2 ring-cyan-400 shadow-2xl shadow-cyan-500/25' : ''
                  }`}
                >
                  {/* Animated Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${insight.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className={`p-3 bg-gradient-to-r ${insight.color} rounded-xl w-fit mb-4 shadow-lg`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    
                    <h4 className="text-lg font-bold text-white mb-2">{insight.title}</h4>
                    <div className={`text-3xl font-bold bg-gradient-to-r ${insight.color} bg-clip-text text-transparent mb-2`}>
                      {insight.value}
                    </div>
                    <p className="text-gray-400 text-sm">{insight.description}</p>
                  </div>

                  {/* Pulse Animation */}
                  <div className={`absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r ${insight.color} rounded-full animate-ping ${
                    activeInsight === index ? 'opacity-75' : 'opacity-0'
                  }`}></div>
                </div>
              );
            })}
          </div>

          {/* Advanced Analytics Section */}
          <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 border border-gray-700/30 rounded-3xl p-8 backdrop-blur-lg">
            <div className="text-center mb-8">
              <h4 className="text-2xl font-bold text-white mb-3 flex items-center justify-center gap-3">
                <Radio className="h-7 w-7 text-cyan-400" />
                خريطة الأداء التفاعلية
              </h4>
              <p className="text-gray-400">تصور بياني لنقاط قوتك ومساحات النمو</p>
            </div>

            {/* Custom Progress Visualization */}
            <div className="grid grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="rgba(34, 197, 94, 0.2)" strokeWidth="8" fill="none" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      stroke="rgb(34, 197, 94)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${(examResults.correctAnswers / examResults.totalQuestions) * 251} 251`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-green-400 font-bold">{examResults.correctAnswers}</span>
                  </div>
                </div>
                <h5 className="text-green-400 font-semibold mb-1">اتقان</h5>
                <p className="text-gray-500 text-sm">إجابات صحيحة</p>
              </div>

              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="rgba(239, 68, 68, 0.2)" strokeWidth="8" fill="none" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      stroke="rgb(239, 68, 68)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${(examResults.incorrectAnswers / examResults.totalQuestions) * 251} 251`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-red-400 font-bold">{examResults.incorrectAnswers}</span>
                  </div>
                </div>
                <h5 className="text-red-400 font-semibold mb-1">تطوير</h5>
                <p className="text-gray-500 text-sm">تحتاج مراجعة</p>
              </div>

              <div className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="rgba(245, 158, 11, 0.2)" strokeWidth="8" fill="none" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      stroke="rgb(245, 158, 11)"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${((examResults.totalQuestions - examResults.correctAnswers - examResults.incorrectAnswers) / examResults.totalQuestions) * 251} 251`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-amber-400 font-bold">{examResults.totalQuestions - examResults.correctAnswers - examResults.incorrectAnswers}</span>
                  </div>
                </div>
                <h5 className="text-amber-400 font-semibold mb-1">استكشاف</h5>
                <p className="text-gray-500 text-sm">لم يتم حلها</p>
              </div>
            </div>

            {/* AI-Powered Recommendations */}
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl p-6">
              <h5 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-3">
                <Brain className="h-6 w-6" />
                توصيات ذكية مخصصة
              </h5>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h6 className="font-semibold text-white flex items-center gap-2">
                    <Diamond className="h-5 w-5 text-cyan-400" />
                    نقاط التميز
                  </h6>
                  {percentage >= 85 ? (
                    <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                      <p className="text-cyan-300 text-sm">أداءك متفوق! ركز على التخصص في المجالات المتقدمة</p>
                    </div>
                  ) : percentage >= 70 ? (
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                      <p className="text-blue-300 text-sm">مستوى جيد، اعمل على صقل مهارات حل المسائل المعقدة</p>
                    </div>
                  ) : (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                      <p className="text-green-300 text-sm">بناء أساسي قوي، ركز على ترسيخ المفاهيم الأساسية</p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <h6 className="font-semibold text-white flex items-center gap-2">
                    <ArrowUpRight className="h-5 w-5 text-emerald-400" />
                    خطة النمو
                  </h6>
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                    <p className="text-emerald-300 text-sm">
                      {examResults.incorrectAnswers > 5 
                        ? "راجع الأسئلة الخاطئة وحلل أنماط الأخطاء" 
                        : percentage < 80 
                        ? "توسع في مصادر التعلم وزد من التدريب المنتظم"
                        : "متابعة ممتازة! حافظ على هذا المستوى واستكشف تحديات أصعب"
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Results Categories */}
        <div className="max-w-6xl mx-auto px-6 mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
              استكشاف تفصيلي للنتائج
            </h3>
            <p className="text-gray-400">انقر على أي فئة لاستكشاف تفاصيل الأسئلة والحلول</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Correct Answers */}
            <div 
              onClick={() => handleCategoryClick('correct')}
              className={`group relative bg-gradient-to-br from-green-900/30 to-emerald-900/50 border border-green-500/30 rounded-2xl p-8 cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25 ${
                selectedCategory === 'correct' ? 'ring-2 ring-green-400 shadow-2xl shadow-green-400/50 scale-105' : ''
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-400/30 text-green-400 mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <CheckCircle className="h-10 w-10" />
                </div>
                <h3 className="text-4xl font-bold text-green-400 mb-2 text-center group-hover:scale-110 transition-transform duration-300">
                  {examResults.correctAnswers}
                </h3>
                <p className="text-green-300 text-center mb-4 font-medium">إجابات دقيقة</p>
                <div className="bg-green-500/20 rounded-full h-2 overflow-hidden mb-4">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-emerald-400 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${(examResults.correctAnswers / examResults.totalQuestions) * 100}%` }}
                  ></div>
                </div>
                <div className="text-center">
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs px-3 py-1">
                    انقر للاستكشاف
                  </Badge>
                </div>
              </div>
            </div>

            {/* Incorrect Answers */}
            <div 
              onClick={() => handleCategoryClick('incorrect')}
              className={`group relative bg-gradient-to-br from-red-900/30 to-rose-900/50 border border-red-500/30 rounded-2xl p-8 cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25 ${
                selectedCategory === 'incorrect' ? 'ring-2 ring-red-400 shadow-2xl shadow-red-400/50 scale-105' : ''
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-rose-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-400/30 text-red-400 mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <XCircle className="h-10 w-10" />
                </div>
                <h3 className="text-4xl font-bold text-red-400 mb-2 text-center group-hover:scale-110 transition-transform duration-300">
                  {examResults.incorrectAnswers}
                </h3>
                <p className="text-red-300 text-center mb-4 font-medium">فرص التحسين</p>
                <div className="bg-red-500/20 rounded-full h-2 overflow-hidden mb-4">
                  <div 
                    className="bg-gradient-to-r from-red-400 to-rose-400 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${(examResults.incorrectAnswers / examResults.totalQuestions) * 100}%` }}
                  ></div>
                </div>
                <div className="text-center">
                  <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-xs px-3 py-1">
                    انقر للمراجعة
                  </Badge>
                </div>
              </div>
            </div>

            {/* Unanswered Questions */}
            <div 
              onClick={() => handleCategoryClick('unanswered')}
              className={`group relative bg-gradient-to-br from-amber-900/30 to-orange-900/50 border border-amber-500/30 rounded-2xl p-8 cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/25 ${
                selectedCategory === 'unanswered' ? 'ring-2 ring-amber-400 shadow-2xl shadow-amber-400/50 scale-105' : ''
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600/10 to-orange-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-400/30 text-amber-400 mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <BookOpen className="h-10 w-10" />
                </div>
                <h3 className="text-4xl font-bold text-amber-400 mb-2 text-center group-hover:scale-110 transition-transform duration-300">
                  {examResults.totalQuestions - examResults.correctAnswers - examResults.incorrectAnswers}
                </h3>
                <p className="text-amber-300 text-center mb-4 font-medium">منطقة الاستكشاف</p>
                <div className="bg-amber-500/20 rounded-full h-2 overflow-hidden mb-4">
                  <div 
                    className="bg-gradient-to-r from-amber-400 to-orange-400 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${((examResults.totalQuestions - examResults.correctAnswers - examResults.incorrectAnswers) / examResults.totalQuestions) * 100}%` }}
                  ></div>
                </div>
                <div className="text-center">
                  <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs px-3 py-1">
                    انقر للاستكشاف
                  </Badge>
                </div>
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
                <Layers className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-300 mb-4">
                لا توجد عناصر في هذه الفئة
              </h3>
              <p className="text-gray-400">
                {selectedCategory === 'correct' ? 'لا توجد أسئلة صحيحة لعرضها' :
                 selectedCategory === 'incorrect' ? 'لا توجد أسئلة خاطئة لعرضها' :
                 'لا توجد أسئلة غير محلولة لعرضها'}
              </p>
            </div>
          </div>
        )}

        {/* Revolutionary Final Section */}
        <div className="max-w-6xl mx-auto px-6 pb-20 text-center">
          <div className="bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-cyan-900/30 border border-purple-500/30 rounded-3xl p-12 mb-12 backdrop-blur-lg">
            <h3 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              رحلتك التعليمية مستمرة
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              كل اختبار خطوة نحو هدفك. استخدم هذه النتائج كدليل لتطوير استراتيجيتك القادمة
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
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
          </div>
          
          <p className="text-gray-500 text-sm max-w-2xl mx-auto">
            تم تصميم هذا التحليل باستخدام خوارزميات متقدمة لمساعدتك في تحقيق أقصى استفادة من تجربة التعلم. 
            نتمنى لك التوفيق في رحلتك الأكاديمية!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
