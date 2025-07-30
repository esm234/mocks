import React, { useState, useEffect } from 'react';
import { 
  Zap, Brain, Trophy, Rocket, Star, Timer, Layers, Shuffle, 
  ChevronRight, ChevronLeft, Check, Settings2, Sparkles,
  Target, BookText, Lightbulb, ArrowUpRight, Diamond,
  Crown, Gem, Folder, Menu, X, ArrowRight
} from 'lucide-react';
import { useExamStore } from '../store/examStore';

const StartScreen = ({ onShowFolderManagement }) => {
  const { initializeExam } = useExamStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    document.documentElement.style.overflowY = 'scroll';
    return () => {
      document.documentElement.style.overflowY = '';
    };
  }, []);

  const loadSavedSettings = () => {
    try {
      const saved = localStorage.getItem('examSettings');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading saved settings:', error);
    }
    return {
      examMode: 'sectioned',
      timerMode: 'none',
      selectedTimerDuration: 60,
      questionTypeFilter: 'all',
      selectedQuestionType: 'analogy',
      rcQuestionOrder: 'sequential'
    };
  };

  const [currentStep, setCurrentStep] = useState(1);
  const [settings, setSettings] = useState(loadSavedSettings());
  const [isAnimating, setIsAnimating] = useState(false);

  const {
    examMode,
    timerMode,
    selectedTimerDuration,
    questionTypeFilter,
    selectedQuestionType,
    rcQuestionOrder
  } = settings;

  useEffect(() => {
    localStorage.setItem('examSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const questionTypeOptions = [
    { 
      id: 'analogy', 
      title: 'التناظر اللفظي', 
      subtitle: 'العلاقات والمقارنات', 
      icon: Brain,
      gradient: 'from-violet-600 to-purple-600',
      lightGradient: 'from-violet-500/20 to-purple-500/20',
      stats: '1200+ سؤال',
      description: 'تدرب على إيجاد العلاقات بين الكلمات'
    },
    { 
      id: 'completion', 
      title: 'إكمال الجمل', 
      subtitle: 'ملء الفراغات بدقة', 
      icon: BookText,
      gradient: 'from-emerald-600 to-teal-600',
      lightGradient: 'from-emerald-500/20 to-teal-500/20',
      stats: '950+ سؤال',
      description: 'أكمل الجمل بالكلمات المناسبة'
    },
    { 
      id: 'error', 
      title: 'الخطأ السياقي', 
      subtitle: 'تحديد الأخطاء', 
      icon: Target,
      gradient: 'from-rose-600 to-red-600',
      lightGradient: 'from-rose-500/20 to-red-500/20',
      stats: '800+ سؤال',
      description: 'اكتشف الأخطاء في السياق'
    },
    { 
      id: 'rc', 
      title: 'استيعاب المقروء', 
      subtitle: 'فهم النصوص', 
      icon: Lightbulb,
      gradient: 'from-amber-600 to-orange-600',
      lightGradient: 'from-amber-500/20 to-orange-500/20',
      stats: '1500+ سؤال',
      description: 'حلل وافهم النصوص المختلفة'
    },
    { 
      id: 'odd', 
      title: 'المفردة الشاذة', 
      subtitle: 'تحديد المختلف', 
      icon: Sparkles,
      gradient: 'from-cyan-600 to-blue-600',
      lightGradient: 'from-cyan-500/20 to-blue-500/20',
      stats: '700+ سؤال',
      description: 'ميز الكلمة المختلفة'
    }
  ];

  const timerDurations = [
    { value: 30, label: '30 دقيقة', recommended: false },
    { value: 45, label: '45 دقيقة', recommended: false },
    { value: 60, label: 'ساعة', recommended: true },
    { value: 90, label: 'ساعة ونصف', recommended: false },
    { value: 120, label: 'ساعتان', recommended: false }
  ];

  const handleStepChange = (step) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(step);
      setIsAnimating(false);
    }, 200);
  };

  const handleNext = () => {
    if (currentStep < 3) {
      handleStepChange(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      handleStepChange(currentStep - 1);
    }
  };

  const handleStartExam = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const config = {
      examMode,
      timerMode,
      timerDuration: timerMode === 'none' ? 0 : selectedTimerDuration,
      shuffleQuestions: true,
      shuffleAnswers: false,
      questionTypeFilter,
      selectedQuestionType: questionTypeFilter === 'specific' ? selectedQuestionType : null,
      rcQuestionOrder
    };
    initializeExam(config);
  };

  const getCurrentQuestionType = () => {
    return questionTypeOptions.find(type => type.id === selectedQuestionType);
  };

  const getSelectedTimerInfo = () => {
    return timerDurations.find(timer => timer.value === selectedTimerDuration);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 text-white" dir="rtl">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* Modern Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="p-2 sm:p-2.5 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg">
                  <Diamond className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  محاكي القدرات
                </h1>
                <p className="text-xs text-gray-400">نسخة احترافية</p>
              </div>
            </div>

            {/* Progress Steps - Desktop */}
            <div className="hidden lg:flex items-center gap-8">
              {[1, 2, 3].map((step, index) => (
                <div key={step} className="flex items-center">
                  <button
                    onClick={() => handleStepChange(step)}
                    className={`relative group transition-all duration-300 ${
                      currentStep >= step ? 'scale-110' : ''
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-500 ${
                      currentStep >= step
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                        : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                    }`}>
                      {currentStep > step ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <span>{step}</span>
                      )}
                    </div>
                    {currentStep === step && (
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 animate-ping opacity-20"></div>
                    )}
                    <span className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap transition-all duration-300 ${
                      currentStep >= step ? 'text-purple-400' : 'text-gray-500'
                    }`}>
                      {step === 1 && 'نوع التدريب'}
                      {step === 2 && 'الإعدادات'}
                      {step === 3 && 'المراجعة'}
                    </span>
                  </button>
                  {index < 2 && (
                    <div className={`w-16 h-0.5 mx-4 transition-all duration-500 ${
                      currentStep > step ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-slate-700'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={onShowFolderManagement}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <Folder className="h-4 w-4" />
                <span className="hidden md:inline">مجلداتي</span>
              </button>
              
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Progress */}
          <div className="lg:hidden py-3 flex items-center justify-center gap-2">
            {[1, 2, 3].map((step) => (
              <button
                key={step}
                onClick={() => handleStepChange(step)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  currentStep >= step
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-slate-800 text-gray-400'
                }`}
              >
                {currentStep > step ? <Check className="h-4 w-4" /> : step}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-900/95 backdrop-blur-xl border-t border-white/10">
            <div className="container mx-auto px-4 py-4">
              <button
                onClick={() => {
                  onShowFolderManagement();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium"
              >
                <Folder className="h-5 w-5" />
                مجلداتي
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Step 1: Question Type Selection */}
        {currentStep === 1 && (
          <div className={`transition-all duration-500 ${isAnimating ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'}`}>
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl mb-6">
                <Crown className="h-8 w-8 sm:h-10 sm:w-10 text-purple-400" />
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                اختر نمط التدريب
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
                حدد المجال الذي تريد التركيز عليه في رحلتك التدريبية
              </p>
            </div>

                        {/* Training Mode Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* All Types Option */}
              <div 
                onClick={() => updateSetting('questionTypeFilter', 'all')}
                className={`group relative p-6 sm:p-8 rounded-2xl border-2 cursor-pointer transition-all duration-500 hover:scale-[1.02] ${
                  questionTypeFilter === 'all'
                    ? 'border-purple-500 bg-gradient-to-br from-purple-900/30 to-pink-900/30 shadow-2xl shadow-purple-500/20'
                    : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-4 rounded-xl ${
                      questionTypeFilter === 'all' 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg' 
                        : 'bg-gray-700 group-hover:bg-gray-600'
                    } transition-all duration-500`}>
                      <Gem className="h-8 w-8 text-white" />
                    </div>
                    {questionTypeFilter === 'all' && (
                      <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    تدريب شامل
                  </h3>
                  <p className="text-gray-300 mb-4 text-base sm:text-lg">
                    اختبار متكامل يغطي جميع أنواع الأسئلة
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 rounded-full text-sm font-medium">
                      الأكثر شمولية
                    </span>
                    <span className="text-gray-400 font-medium">5000+ سؤال</span>
                  </div>
                </div>
              </div>

              {/* Specific Type Option */}
              <div 
                onClick={() => updateSetting('questionTypeFilter', 'specific')}
                className={`group relative p-6 sm:p-8 rounded-2xl border-2 cursor-pointer transition-all duration-500 hover:scale-[1.02] ${
                  questionTypeFilter === 'specific'
                    ? 'border-emerald-500 bg-gradient-to-br from-emerald-900/30 to-teal-900/30 shadow-2xl shadow-emerald-500/20'
                    : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-teal-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-4 rounded-xl ${
                      questionTypeFilter === 'specific' 
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg' 
                        : 'bg-gray-700 group-hover:bg-gray-600'
                    } transition-all duration-500`}>
                      <Target className="h-8 w-8 text-white" />
                    </div>
                    {questionTypeFilter === 'specific' && (
                      <div className="p-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-3 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    تدريب مُركز
                  </h3>
                  <p className="text-gray-300 mb-4 text-base sm:text-lg">
                    تركيز عالي على نوع محدد من الأسئلة
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 text-emerald-300 rounded-full text-sm font-medium">
                      تخصصي
                    </span>
                    <span className="text-gray-400 font-medium">
                      {questionTypeFilter === 'specific' && selectedQuestionType 
                        ? getCurrentQuestionType()?.stats 
                        : 'متغير'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Question Type Grid */}
            {questionTypeFilter === 'specific' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-in slide-in-from-bottom-6 duration-700">
                {questionTypeOptions.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <div
                      key={type.id}
                      onClick={() => updateSetting('selectedQuestionType', type.id)}
                      className={`group relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-500 hover:scale-[1.03] ${
                        selectedQuestionType === type.id
                          ? `border-white bg-gradient-to-br ${type.lightGradient} shadow-xl`
                          : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-3 rounded-lg bg-gradient-to-r ${type.gradient} shadow-lg`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          {selectedQuestionType === type.id && (
                            <div className="p-1.5 bg-white rounded-full">
                              <Check className="h-4 w-4 text-gray-900" />
                            </div>
                          )}
                        </div>
                        <h4 className="text-lg font-bold mb-2">{type.title}</h4>
                        <p className="text-gray-400 text-sm mb-3">{type.subtitle}</p>
                        <div className="text-xs text-gray-500 font-medium">{type.stats}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Exam Mode & Timer */}
        {currentStep === 2 && (
          <div className={`transition-all duration-500 ${isAnimating ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'}`}>
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-2xl mb-6">
                <Settings2 className="h-8 w-8 sm:h-10 sm:w-10 text-blue-400" />
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                إعدادات التجربة
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
                اختر نمط الاختبار والمؤقت المناسب لمستواك
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Exam Mode Section */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg shadow-lg">
                    <Shuffle className="h-5 w-5 text-white" />
                  </div>
                  نمط الاختبار
                </h3>
                
                <div className="space-y-4">
                  <div
                    onClick={() => updateSetting('examMode', 'sectioned')}
                    className={`group p-6 rounded-xl border-2 cursor-pointer transition-all duration-500 hover:scale-[1.02] ${
                      examMode === 'sectioned'
                        ? 'border-blue-500 bg-gradient-to-r from-blue-900/40 to-cyan-900/40 shadow-xl shadow-blue-500/20'
                        : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg ${
                          examMode === 'sectioned' 
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg' 
                            : 'bg-gray-700 group-hover:bg-gray-600'
                        } transition-all duration-500`}>
                          <Layers className="h-5 w-5 text-white" />
                        </div>
                        <h4 className="text-lg font-semibold">أقسام مع مراجعة</h4>
                      </div>
                      {examMode === 'sectioned' && (
                        <div className="p-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-gray-300 text-sm sm:text-base">
                      الاختبار مقسم إلى أجزاء مع إمكانية مراجعة ومعاينة الإجابات
                    </p>
                  </div>

                  <div
                    onClick={() => updateSetting('examMode', 'single')}
                    className={`group p-6 rounded-xl border-2 cursor-pointer transition-all duration-500 hover:scale-[1.02] ${
                      examMode === 'single'
                        ? 'border-blue-500 bg-gradient-to-r from-blue-900/40 to-cyan-900/40 shadow-xl shadow-blue-500/20'
                        : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg ${
                          examMode === 'single' 
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg' 
                            : 'bg-gray-700 group-hover:bg-gray-600'
                        } transition-all duration-500`}>
                          <Zap className="h-5 w-5 text-white" />
                        </div>
                        <h4 className="text-lg font-semibold">متتالي ومجمع</h4>
                      </div>
                      {examMode === 'single' && (
                        <div className="p-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-gray-300 text-sm sm:text-base">
                      جميع الأسئلة في قسم واحد متواصل بدون توقف أو مراجعة
                    </p>
                  </div>
                </div>
              </div>

              {/* Timer Settings */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg shadow-lg">
                    <Timer className="h-5 w-5 text-white" />
                  </div>
                  إعدادات المؤقت
                </h3>
                
                <div className="space-y-4">
                  <div
                    onClick={() => updateSetting('timerMode', 'none')}
                    className={`group p-6 rounded-xl border-2 cursor-pointer transition-all duration-500 hover:scale-[1.02] ${
                      timerMode === 'none'
                        ? 'border-emerald-500 bg-gradient-to-r from-emerald-900/40 to-teal-900/40 shadow-xl shadow-emerald-500/20'
                        : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg ${
                          timerMode === 'none' 
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg' 
                            : 'bg-gray-700 group-hover:bg-gray-600'
                        } transition-all duration-500`}>
                                                    <Star className="h-5 w-5 text-white" />
                        </div>
                        <h4 className="text-lg font-semibold">بدون مؤقت</h4>
                      </div>
                      {timerMode === 'none' && (
                        <div className="p-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-gray-300 text-sm sm:text-base">
                      وقت مفتوح للتركيز الكامل على الإجابات بدون ضغط زمني
                    </p>
                  </div>

                  <div
                    onClick={() => updateSetting('timerMode', 'total')}
                    className={`group p-6 rounded-xl border-2 cursor-pointer transition-all duration-500 hover:scale-[1.02] ${
                      timerMode === 'total'
                        ? 'border-emerald-500 bg-gradient-to-r from-emerald-900/40 to-teal-900/40 shadow-xl shadow-emerald-500/20'
                        : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg ${
                          timerMode === 'total' 
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg' 
                            : 'bg-gray-700 group-hover:bg-gray-600'
                        } transition-all duration-500`}>
                          <Timer className="h-5 w-5 text-white" />
                        </div>
                        <h4 className="text-lg font-semibold">مع مؤقت زمني</h4>
                      </div>
                      {timerMode === 'total' && (
                        <div className="p-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-gray-300 text-sm sm:text-base mb-4">
                      تدريب واقعي مع مؤقت لمحاكاة ظروف الاختبار الحقيقي
                    </p>
                    
                    {timerMode === 'total' && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                        {timerDurations.map((timer) => (
                          <button
                            key={timer.value}
                            onClick={(e) => {
                              e.stopPropagation();
                              updateSetting('selectedTimerDuration', timer.value);
                            }}
                            className={`relative p-4 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 ${
                              selectedTimerDuration === timer.value
                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            {timer.recommended && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                            )}
                            {timer.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Review & Start */}
        {currentStep === 3 && (
          <div className={`transition-all duration-500 ${isAnimating ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'}`}>
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-emerald-600/20 to-green-600/20 rounded-2xl mb-6">
                <Rocket className="h-8 w-8 sm:h-10 sm:w-10 text-emerald-400" />
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-400 bg-clip-text text-transparent">
                كل شيء جاهز!
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
                راجع إعداداتك النهائية قبل بدء رحلة التدريب
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {/* Question Type Summary */}
              <div className="p-6 bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-2xl border border-purple-700/30 shadow-xl shadow-purple-500/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">نوع التدريب</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-white font-medium text-lg">
                    {questionTypeFilter === 'all' ? 'تدريب شامل' : 'تدريب مُركز'}
                  </p>
                  {questionTypeFilter === 'specific' && (
                    <p className="text-purple-300 text-base">
                      {getCurrentQuestionType()?.title}
                    </p>
                  )}
                  <p className="text-gray-400 text-sm">
                    {questionTypeFilter === 'all' ? '5000+ سؤال' : getCurrentQuestionType()?.stats}
                  </p>
                </div>
              </div>

              {/* Exam Mode Summary */}
              <div className="p-6 bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-2xl border border-blue-700/30 shadow-xl shadow-blue-500/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-lg">
                    <Layers className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">نمط الاختبار</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-white font-medium text-lg">
                    {examMode === 'sectioned' ? 'أقسام مع مراجعة' : 'متتالي ومجمع'}
                  </p>
                  <p className="text-blue-300 text-base">
                    {examMode === 'sectioned' 
                      ? 'مع إمكانية المراجعة' 
                      : 'بدون توقف'}
                  </p>
                </div>
              </div>

              {/* Timer Summary */}
              <div className="p-6 bg-gradient-to-br from-emerald-900/30 to-teal-900/30 rounded-2xl border border-emerald-700/30 shadow-xl shadow-emerald-500/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-lg">
                    <Timer className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">المؤقت</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-white font-medium text-lg">
                    {timerMode === 'none' ? 'بدون مؤقت' : getSelectedTimerInfo()?.label}
                  </p>
                  <p className="text-emerald-300 text-base">
                    {timerMode === 'none' ? 'وقت مفتوح' : 'تدريب واقعي'}
                  </p>
                </div>
              </div>
            </div>

            {/* Start Exam Button */}
            <div className="text-center">
              <button
                onClick={handleStartExam}
                className="group relative inline-flex items-center gap-4 px-16 py-8 text-2xl font-bold text-white bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-3xl shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/60 transition-all duration-500 hover:scale-105 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                <div className="relative flex items-center gap-4">
                  <Rocket className="h-8 w-8 group-hover:translate-y-1 transition-transform duration-500" />
                  ابدأ الاختبار الآن
                  <ArrowUpRight className="h-7 w-7 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />
                </div>
              </button>
              
              <p className="text-gray-400 text-base mt-6">
                * يمكنك تغيير الإعدادات في أي وقت من لوحة التحكم
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Navigation Bar */}
      <div className="sticky bottom-0 bg-slate-900/80 backdrop-blur-xl border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg font-semibold transition-all duration-500 ${
              currentStep === 1
                ? 'text-gray-500 cursor-not-allowed'
                : 'text-white bg-gray-800/50 hover:bg-gray-700/50 hover:scale-105'
            }`}
          >
            <ChevronRight className="h-5 w-5" />
            السابق
          </button>

          <div className="text-center">
            <p className="text-gray-400 text-base font-medium">
              {currentStep === 1 && 'اختر نمط التدريب المناسب'}
              {currentStep === 2 && 'تخصيص إعدادات التجربة'}
              {currentStep === 3 && 'مراجعة نهائية وبدء التدريب'}
            </p>
          </div>

          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:scale-105 transition-all duration-500 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
            >
              التالي
              <ChevronLeft className="h-5 w-5" />
            </button>
          ) : (
            <div className="w-24"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
