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
  Hexagon,
  ArrowUpRight,
  Activity,
  Layers
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
        icon: Lightning,
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

            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
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
          <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/60 border border-gray-700/30 rounded-3xl p-8 mb-12 backdrop-blur-lg">
            <div className="text-center mb-8">
              <h4 className="text-2xl font-bold text-white mb-3 flex items-center gap-3">
                <
