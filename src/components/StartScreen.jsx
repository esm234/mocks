import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Zap, 
  Brain, 
  Trophy, 
  Rocket, 
  Star, 
  Timer, 
  Layers, 
  Shuffle, 
  BarChart3,
  ChevronRight,
  ChevronLeft,
  Check,
  Settings2,
  Sparkles,
  Flame,
  Target,
  BookText,
  Lightbulb,
  ArrowUpRight,
  Diamond,
  Crown,
  Gem
} from 'lucide-react';
import { useExamStore } from '../store/examStore';

const StartScreen = () => {
  const { initializeExam } = useExamStore();
  
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
      selectedTimerDuration: 13,
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
      color: 'from-purple-600 to-pink-600',
      bgColor: 'bg-purple-900/20',
      borderColor: 'border-purple-500',
      shadow: 'shadow-purple-500/20',
      stats: '1200+ سؤال'
    },
    { 
      id: 'completion', 
      title: 'إكمال الجمل', 
      subtitle: 'ملء الفراغات بدقة', 
      icon: BookText,
      color: 'from-emerald-600 to-teal-600',
      bgColor: 'bg-emerald-900/20',
      borderColor: 'border-emerald-500',
      shadow: 'shadow-emerald-500/20',
      stats: '950+ سؤال'
    },
    { 
      id: 'error', 
      title: 'الخطأ السياقي', 
      subtitle: 'تحديد الأخطاء', 
      icon: Target,
      color: 'from-rose-600 to-pink-600',
      bgColor: 'bg-rose-900/20',
      borderColor: 'border-rose-500',
      shadow: 'shadow-rose-500/20',
      stats: '800+ سؤال'
    },
    { 
      id: 'rc', 
      title: 'استيعاب المقروء', 
      subtitle: 'فهم النصوص', 
      icon: Lightbulb,
      color: 'from-amber-600 to-orange-600',
      bgColor: 'bg-amber-900/20',
      borderColor: 'border-amber-500',
      shadow: 'shadow-amber-500/20',
      stats: '1500+ سؤال'
    },
    { 
      id: 'odd', 
      title: 'المفردة الشاذة', 
      subtitle: 'تحديد المختلف', 
      icon: Sparkles,
      color: 'from-cyan-600 to-blue-600',
      bgColor: 'bg-cyan-900/20',
      borderColor: 'border-cyan-500',
      shadow: 'shadow-cyan-500/20',
      stats: '700+ سؤال'
    }
  ];

  const timerDurations = [
    { value: 5, label: '5 دقائق', recommended: false },
    { value: 10, label: '10 دقائق', recommended: false },
    { value: 13, label: '13 دقيقة', recommended: true },
    { value: 15, label: '15 دقيقة', recommended: false },
    { value: 20, label: '20 دقيقة', recommended: false },
    { value: 25, label: '25 دقيقة', recommended: false },
    { value: 30, label: '30 دقيقة', recommended: true },
    { value: 45, label: '45 دقيقة', recommended: false },
    { value: 60, label: 'ساعة كاملة', recommended: false },
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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900 text-white overflow-hidden relative" dir="rtl">
      {/* Premium Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs */}
        <div className="absolute top-10 right-20 w-96 h-96 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-gradient-to-r from-emerald-600/8 to-cyan-600/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-gradient-to-r from-amber-600/5 to-rose-600/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Subtle Grid Pattern - Fixed */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        {/* Light Beams */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-white/1 to-transparent transform rotate-45"></div>
      </div>

      <div className="relative z-10">
        {/* Premium Header */}
        <div className="sticky top-0 bg-black/60 backdrop-blur-2xl border-b border-white/10 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="relative">
                  <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg shadow-purple-500/30">
                    <Diamond className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    محاكي أور جول 
                  </h1>
                  <p className="text-sm text-gray-400">المرحلة {currentStep} من 3</p>
                </div>
              </div>
              
              {/* Luxury Progress Steps */}
              <div className="flex items-center space-x-6 space-x-reverse">
                {[1, 2, 3].map((step) => (
                  <button
                    key={step}
                    onClick={() => handleStepChange(step)}
                    className={`relative w-14 h-14 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${
                      currentStep >= step
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl shadow-purple-500/30'
                        : 'bg-gray-800/50 text-gray-500 hover:bg-gray-700/50'
                    }`}
                  >
                    {currentStep > step ? (
                      <Check className="h-6 w-6" />
                    ) : (
                      <span className="text-lg">{step}</span>
                    )}
                    {currentStep >= step && (
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-30 animate-pulse"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Elegant Progress Bar */}
            <div className="mt-4 w-full bg-gray-800/30 rounded-full h-1.5 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-700 ease-out shadow-lg shadow-purple-500/30"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Step 1: Question Type Selection */}
          {currentStep === 1 && (
            <div className={`transition-all duration-500 ${isAnimating ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'}`}>
              <div className="text-center mb-16">
                <div className="relative inline-block">
                  <div className="p-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl shadow-2xl shadow-purple-500/30 mb-6">
                    <Crown className="h-20 w-20 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
                <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
                  اختر نمط التدريب
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                  حدد المجال الذي تريد التركيز عليه في رحلتك التدريبية
                </p>
              </div>

              {/* Premium Question Type Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* All Types Option */}
                <div 
                  onClick={() => updateSetting('questionTypeFilter', 'all')}
                  className={`group relative p-10 rounded-3xl border-2 cursor-pointer transition-all duration-500 hover:scale-105 ${
                    questionTypeFilter === 'all'
                      ? 'border-purple-500 bg-gradient-to-br from-purple-900/30 to-pink-900/30 shadow-2xl shadow-purple-500/30'
                      : 'border-gray-700 bg-gradient-to-br from-gray-800/30 to-gray-900/30 hover:border-gray-600'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-pink-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative flex items-center justify-between mb-8">
                    <div className={`p-5 rounded-2xl ${
                      questionTypeFilter === 'all' 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/30' 
                        : 'bg-gray-700 group-hover:bg-gray-600'
                    } transition-all duration-500`}>
                      <Gem className="h-10 w-10 text-white" />
                    </div>
                    {questionTypeFilter === 'all' && (
                      <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg">
                        <Check className="h-6 w-6 text-white" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    تدريب شامل
                  </h3>
                  <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                    اختبار متكامل يغطي جميع أنواع الأسئلة
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 rounded-full text-sm font-medium">
                      الأكثر شمولية
                    </span>
                    <span className="text-gray-400 font-medium">5000+ سؤال</span>
                  </div>
                </div>

                {/* Specific Type Option */}
                <div 
                  onClick={() => updateSetting('questionTypeFilter', 'specific')}
                  className={`group relative p-10 rounded-3xl border-2 cursor-pointer transition-all duration-500 hover:scale-105 ${
                    questionTypeFilter === 'specific'
                      ? 'border-emerald-500 bg-gradient-to-br from-emerald-900/30 to-teal-900/30 shadow-2xl shadow-emerald-500/30'
                      : 'border-gray-700 bg-gradient-to-br from-gray-800/30 to-gray-900/30 hover:border-gray-600'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 to-teal-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative flex items-center justify-between mb-8">
                    <div className={`p-5 rounded-2xl ${
                      questionTypeFilter === 'specific' 
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg shadow-emerald-500/30' 
                        : 'bg-gray-700 group-hover:bg-gray-600'
                    } transition-all duration-500`}>
                      <Target className="h-10 w-10 text-white" />
                    </div>
                    {questionTypeFilter === 'specific' && (
                      <div className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full shadow-lg">
                        <Check className="h-6 w-6 text-white" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    تدريب مُركز
                  </h3>
                  <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                    تركيز عالي على نوع محدد من الأسئلة
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="px-4 py-2 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 text-emerald-300 rounded-full text-sm font-medium">
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

              {/* Enhanced Question Type Grid */}
              {questionTypeFilter === 'specific' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-6 duration-700">
                  {questionTypeOptions.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <div
                        key={type.id}
                        onClick={() => updateSetting('selectedQuestionType', type.id)}
                        className={`group relative p-8 rounded-2xl border-2 cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                          selectedQuestionType === type.id
                            ? `border-white ${type.bgColor} shadow-2xl ${type.shadow}`
                            : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                        }`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative flex items-center justify-between mb-6">
                          <div className={`p-4 rounded-xl bg-gradient-to-r ${type.color} shadow-lg`}>
                            <IconComponent className="h-8 w-8 text-white" />
                          </div>
                          {selectedQuestionType === type.id && (
                            <div className="p-2 bg-white rounded-full shadow-lg">
                              <Check className="h-5 w-5 text-gray-900" />
                            </div>
                          )}
                        </div>
                        <h4 className="text-xl font-bold mb-3">{type.title}</h4>
                        <p className="text-gray-400 text-base mb-4 leading-relaxed">{type.subtitle}</p>
                        <div className="text-sm text-gray-500 font-medium">{type.stats}</div>
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
              <div className="text-center mb-16">
                <div className="relative inline-block">
                  <div className="p-6 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl shadow-2xl shadow-blue-500/30 mb-6">
                    <Settings2 className="h-20 w-20 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-400 rounded-full animate-pulse"></div>
                </div>
                <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
                  إعدادات التجربة
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                  اختر نمط الاختبار والمؤقت المناسب لمستواك
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Exam Mode Section */}
                <div className="space-y-8">
                  <h3 className="text-3xl font-bold flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-lg">
                      <Shuffle className="h-7 w-7 text-white" />
                    </div>
                    نمط الاختبار
                  </h3>
                  
                  <div className="space-y-6">
                    <div
                      onClick={() => updateSetting('examMode', 'sectioned')}
                      className={`group p-8 rounded-2xl border-2 cursor-pointer transition-all duration-500 hover:scale-102 ${
                        examMode === 'sectioned'
                          ? 'border-blue-500 bg-gradient-to-r from-blue-900/40 to-cyan-900/40 shadow-2xl shadow-blue-500/30'
                          : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${
                            examMode === 'sectioned' 
                              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg' 
                              : 'bg-gray-700 group-hover:bg-gray-600'
                          } transition-all duration-500`}>
                            <Layers className="h-6 w-6 text-white" />
                          </div>
                          <h4 className="text-xl font-semibold">أقسام مع مراجعة</h4>
                        </div>
                        {examMode === 'sectioned' && (
                          <div className="p-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full shadow-lg">
                            <Check className="h-5 w-5 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-gray-300 text-base leading-relaxed">
                        الاختبار مقسم إلى أجزاء مع إمكانية مراجعة ومعاينة الإجابات
                      </p>
                    </div>

                    <div
                      onClick={() => updateSetting('examMode', 'single')}
                      className={`group p-8 rounded-2xl border-2 cursor-pointer transition-all duration-500 hover:scale-102 ${
                        examMode === 'single'
                          ? 'border-blue-500 bg-gradient-to-r from-blue-900/40 to-cyan-900/40 shadow-2xl shadow-blue-500/30'
                          : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${
                            examMode === 'single' 
                              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg' 
                              : 'bg-gray-700 group-hover:bg-gray-600'
                          } transition-all duration-500`}>
                            <Zap className="h-6 w-6 text-white" />
                          </div>
                          <h4 className="text-xl font-semibold">متتالي ومجمع</h4>
                        </div>
                        {examMode === 'single' && (
                          <div className="p-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full shadow-lg">
                            <Check className="h-5 w-5 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-gray-300 text-base leading-relaxed">
                        جميع الأسئلة في قسم واحد متواصل بدون توقف أو مراجعة
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timer Settings */}
                <div className="space-y-8">
                  <h3 className="text-3xl font-bold flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-lg">
                      <Timer className="h-7 w-7 text-white" />
                    </div>
                    إعدادات المؤقت
                  </h3>
                  
                  <div className="space-y-6">
                    <div
                      onClick={() => updateSetting('timerMode', 'none')}
                      className={`group p-8 rounded-2xl border-2 cursor-pointer transition-all duration-500 hover:scale-102 ${
                        timerMode === 'none'
                          ? 'border-emerald-500 bg-gradient-to-r from-emerald-900/40 to-teal-900/40 shadow-2xl shadow-emerald-500/30'
                          : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${
                            timerMode === 'none' 
                              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg' 
                              : 'bg-gray-700 group-hover:bg-gray-600'
                          } transition-all duration-500`}>
                            <Star className="h-6 w-6 text-white" />
                          </div>
                          <h4 className="text-xl font-semibold">بدون مؤقت</h4>
                        </div>
                        {timerMode === 'none' && (
                          <div className="p-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full shadow-lg">
                            <Check className="h-5 w-5 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-gray-300 text-base leading-relaxed">
                        وقت مفتوح للتركيز الكامل على الإجابات بدون ضغط زمني
                      </p>
                    </div>

                    <div
                      onClick={() => updateSetting('timerMode', 'total')}
                      className={`group p-8 rounded-2xl border-2 cursor-pointer transition-all duration-500 hover:scale-102 ${
                        timerMode === 'total'
                          ? 'border-emerald-500 bg-gradient-to-r from-emerald-900/40 to-teal-900/40 shadow-2xl shadow-emerald-500/30'
                          : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${
                            timerMode === 'total' 
                              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg' 
                              : 'bg-gray-700 group-hover:bg-gray-600'
                          } transition-all duration-500`}>
                            <Timer className="h-6 w-6 text-white" />
                          </div>
                          <h4 className="text-xl font-semibold">مع مؤقت زمني</h4>
                        </div>
                        {timerMode === 'total' && (
                          <div className="p-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full shadow-lg">
                            <Check className="h-5 w-5 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-gray-300 text-base leading-relaxed mb-6">
                        تدريب واقعي مع مؤقت لمحاكاة ظروف الاختبار الحقيقي
                      </p>
                      
                      {timerMode === 'total' && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                          {timerDurations.slice(0, 6).map((timer) => (
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

              {/* Reading Comprehension Order */}
              {(questionTypeFilter === 'all' || (questionTypeFilter === 'specific' && selectedQuestionType === 'rc')) && (
                <div className="mt-16 p-10 bg-gradient-to-r from-amber-900/20 to-orange-900/20 rounded-3xl border border-amber-700/30 shadow-xl">
                  <h3 className="text-2xl font-bold flex items-center gap-4 mb-8">
                    <div className="p-3 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl shadow-lg">
                      <BookText className="h-6 w-6 text-white" />
                    </div>
                    ترتيب أسئلة استيعاب المقروء
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div
                      onClick={() => updateSetting('rcQuestionOrder', 'sequential')}
                      className={`group p-8 rounded-2xl border-2 cursor-pointer transition-all duration-500 hover:scale-102 ${
                        rcQuestionOrder === 'sequential'
                          ? 'border-amber-500 bg-amber-900/40 shadow-2xl shadow-amber-500/30'
                          : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-xl font-semibold">ترتيب متتالي</h4>
                        {rcQuestionOrder === 'sequential' && (
                          <div className="p-2 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full shadow-lg">
                            <Check className="h-5 w-5 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-gray-300 text-base leading-relaxed">
                        أسئلة النص الواحد تأتي متتابعة ومجمعة
                      </p>
                    </div>

                    <div
                      onClick={() => updateSetting('rcQuestionOrder', 'random')}
                      className={`group p-8 rounded-2xl border-2 cursor-pointer transition-all duration-500 hover:scale-102 ${
                        rcQuestionOrder === 'random'
                          ? 'border-amber-500 bg-amber-900/40 shadow-2xl shadow-amber-500/30'
                          : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-xl font-semibold">ترتيب عشوائي</h4>
                        {rcQuestionOrder === 'random' && (
                          <div className="p-2 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full shadow-lg">
                            <Check className="h-5 w-5 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-gray-300 text-base leading-relaxed">
                        توزيع عشوائي كامل لجميع الأسئلة
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Review & Start */}
          {currentStep === 3 && (
            <div className={`transition-all duration-500 ${isAnimating ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'}`}>
              <div className="text-center mb-16">
                <div className="relative inline-block">
                  <div className="p-6 bg-gradient-to-r from-emerald-600 to-green-600 rounded-3xl shadow-2xl shadow-emerald-500/30 mb-6">
                    <Rocket className="h-20 w-20 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-400 bg-clip-text text-transparent animate-gradient">
                  كل شيء جاهز!
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                  راجع إعداداتك النهائية قبل بدء رحلة التدريب
                </p>
              </div>

              {/* Premium Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {/* Question Type Summary */}
                <div className="p-8 bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-2xl border border-purple-700/30 shadow-xl shadow-purple-500/20">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg">
                      <Brain className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">نوع التدريب</h3>
                  </div>
                  <div className="space-y-3">
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
                <div className="p-8 bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-2xl border border-blue-700/30 shadow-xl shadow-blue-500/20">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-lg">
                      <Layers className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">نمط الاختبار</h3>
                  </div>
                  <div className="space-y-3">
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
                <div className="p-8 bg-gradient-to-br from-emerald-900/30 to-teal-900/30 rounded-2xl border border-emerald-700/30 shadow-xl shadow-emerald-500/20">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-lg">
                      <Timer className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">المؤقت</h3>
                  </div>
                  <div className="space-y-3">
                    <p className="text-white font-medium text-lg">
                      {timerMode === 'none' ? 'بدون مؤقت' : getSelectedTimerInfo()?.label}
                    </p>
                    <p className="text-emerald-300 text-base">
                      {timerMode === 'none' ? 'وقت مفتوح' : 'تدريب واقعي'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Premium Start Button */}
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
        </div>

        {/* Premium Navigation */}
        <div className="sticky bottom-0 bg-black/60 backdrop-blur-2xl border-t border-white/10">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex justify-between items-center">
              <button
                onClick={handlePrev}
                disabled={currentStep === 1}
                className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-500 ${
                  currentStep === 1
                    ? 'text-gray-500 cursor-not-allowed'
                    : 'text-white bg-gray-800/50 hover:bg-gray-700/50 hover:scale-105'
                }`}
              >
                <ChevronRight className="h-6 w-6" />
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
                  className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:scale-105 transition-all duration-500 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
                >
                  التالي
                  <ChevronLeft className="h-6 w-6" />
                </button>
              ) : (
                <div className="w-24"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
