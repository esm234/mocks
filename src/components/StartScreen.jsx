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
  ArrowUpRight
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
      color: 'from-violet-500 to-purple-600',
      stats: '1200+ سؤال'
    },
    { 
      id: 'completion', 
      title: 'إكمال الجمل', 
      subtitle: 'ملء الفراغات بدقة', 
      icon: BookText,
      color: 'from-emerald-500 to-teal-600',
      stats: '950+ سؤال'
    },
    { 
      id: 'error', 
      title: 'الخطأ السياقي', 
      subtitle: 'تحديد الأخطاء', 
      icon: Target,
      color: 'from-rose-500 to-pink-600',
      stats: '800+ سؤال'
    },
    { 
      id: 'rc', 
      title: 'استيعاب المقروء', 
      subtitle: 'فهم النصوص', 
      icon: Lightbulb,
      color: 'from-amber-500 to-orange-600',
      stats: '1500+ سؤال'
    },
    { 
      id: 'odd', 
      title: 'المفردة الشاذة', 
      subtitle: 'تحديد المختلف', 
      icon: Sparkles,
      color: 'from-cyan-500 to-blue-600',
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 text-white overflow-hidden relative" dir="rtl">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-r from-emerald-600/15 to-cyan-600/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-amber-600/10 to-rose-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10">
        {/* Header with Dynamic Progress */}
        <div className="sticky top-0 bg-black/40 backdrop-blur-xl border-b border-gray-700/50 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
                  <Flame className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    محاكي أور جول 
                  </h1>
                  <p className="text-sm text-gray-400">المرحلة {currentStep} من 3</p>
                </div>
              </div>
              
              {/* Progress Steps */}
              <div className="flex items-center space-x-4 space-x-reverse">
                {[1, 2, 3].map((step) => (
                  <button
                    key={step}
                    onClick={() => handleStepChange(step)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                      currentStep >= step
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    }`}
                  >
                    {currentStep > step ? <Check className="h-5 w-5" /> : step}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4 w-full bg-gray-700/50 rounded-full h-1">
              <div 
                className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* Step 1: Question Type Selection */}
          {currentStep === 1 && (
            <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
              <div className="text-center mb-12">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl">
                    <BarChart3 className="h-16 w-16 text-white" />
                  </div>
                </div>
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                  اختر نمط التدريب
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  حدد المجال الذي تريد التركيز عليه في رحلتك التدريبية
                </p>
              </div>

              {/* Question Type Filter Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* All Types Option */}
                <div 
                  onClick={() => updateSetting('questionTypeFilter', 'all')}
                  className={`group relative p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                    questionTypeFilter === 'all'
                      ? 'border-emerald-500 bg-gradient-to-br from-emerald-900/50 to-teal-900/50 shadow-xl shadow-emerald-500/20'
                      : 'border-gray-600 bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-4 rounded-xl ${
                      questionTypeFilter === 'all' ? 'bg-emerald-600' : 'bg-gray-700 group-hover:bg-gray-600'
                    } transition-colors duration-300`}>
                      <Layers className="h-8 w-8 text-white" />
                    </div>
                    {questionTypeFilter === 'all' && (
                      <div className="p-2 bg-emerald-600 rounded-full">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">تدريب شامل</h3>
                  <p className="text-gray-300 mb-4">اختبار متكامل يغطي جميع أنواع الأسئلة</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="px-3 py-1 bg-emerald-600/20 text-emerald-300 rounded-full">الأكثر شمولية</span>
                    <span className="text-gray-400">5000+ سؤال</span>
                  </div>
                </div>

                {/* Specific Type Option */}
                <div 
                  onClick={() => updateSetting('questionTypeFilter', 'specific')}
                  className={`group relative p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                    questionTypeFilter === 'specific'
                      ? 'border-purple-500 bg-gradient-to-br from-purple-900/50 to-indigo-900/50 shadow-xl shadow-purple-500/20'
                      : 'border-gray-600 bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-4 rounded-xl ${
                      questionTypeFilter === 'specific' ? 'bg-purple-600' : 'bg-gray-700 group-hover:bg-gray-600'
                    } transition-colors duration-300`}>
                      <Target className="h-8 w-8 text-white" />
                    </div>
                    {questionTypeFilter === 'specific' && (
                      <div className="p-2 bg-purple-600 rounded-full">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">تدريب مُركز</h3>
                  <p className="text-gray-300 mb-4">تركيز عالي على نوع محدد من الأسئلة</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full">تخصصي</span>
                    <span className="text-gray-400">
                      {questionTypeFilter === 'specific' && selectedQuestionType 
                        ? getCurrentQuestionType()?.stats 
                        : 'متغير'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Question Type Selection Grid */}
              {questionTypeFilter === 'specific' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                  {questionTypeOptions.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <div
                        key={type.id}
                        onClick={() => updateSetting('selectedQuestionType', type.id)}
                        className={`group relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                          selectedQuestionType === type.id
                            ? 'border-white bg-gradient-to-br from-white/10 to-white/5 shadow-2xl'
                            : 'border-gray-700 bg-gradient-to-br from-gray-800/30 to-gray-900/30 hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-3 rounded-lg bg-gradient-to-r ${type.color}`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          {selectedQuestionType === type.id && (
                            <div className="p-1 bg-white rounded-full">
                              <Check className="h-4 w-4 text-gray-900" />
                            </div>
                          )}
                        </div>
                        <h4 className="text-lg font-bold mb-2">{type.title}</h4>
                        <p className="text-gray-400 text-sm mb-3">{type.subtitle}</p>
                        <div className="text-xs text-gray-500">{type.stats}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Exam Mode & Timer */}
          {currentStep === 2 && (
            <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
              <div className="text-center mb-12">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl">
                    <Settings2 className="h-16 w-16 text-white" />
                  </div>
                </div>
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  إعدادات التجربة
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  اختر نمط الاختبار والمؤقت المناسب لمستواك
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Exam Mode Section */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <Shuffle className="h-6 w-6 text-blue-400" />
                    نمط الاختبار
                  </h3>
                  
                  <div className="space-y-4">
                    <div
                      onClick={() => updateSetting('examMode', 'sectioned')}
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        examMode === 'sectioned'
                          ? 'border-blue-500 bg-gradient-to-r from-blue-900/40 to-indigo-900/40'
                          : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${examMode === 'sectioned' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                            <Layers className="h-5 w-5 text-white" />
                          </div>
                          <h4 className="text-lg font-semibold">أقسام مع مراجعة</h4>
                        </div>
                        {examMode === 'sectioned' && (
                          <div className="p-1 bg-blue-600 rounded-full">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm">
                        الاختبار مقسم إلى أجزاء مع إمكانية مراجعة ومعاينة الإجابات
                      </p>
                    </div>

                    <div
                      onClick={() => updateSetting('examMode', 'single')}
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        examMode === 'single'
                          ? 'border-blue-500 bg-gradient-to-r from-blue-900/40 to-indigo-900/40'
                          : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${examMode === 'single' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                            <Zap className="h-5 w-5 text-white" />
                          </div>
                          <h4 className="text-lg font-semibold">متتالي ومجمع</h4>
                        </div>
                        {examMode === 'single' && (
                          <div className="p-1 bg-blue-600 rounded-full">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm">
                        جميع الأسئلة في قسم واحد متواصل بدون توقف أو مراجعة
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timer Settings */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <Timer className="h-6 w-6 text-emerald-400" />
                    إعدادات المؤقت
                  </h3>
                  
                  <div className="space-y-4">
                    <div
                      onClick={() => updateSetting('timerMode', 'none')}
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        timerMode === 'none'
                          ? 'border-emerald-500 bg-gradient-to-r from-emerald-900/40 to-teal-900/40'
                          : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${timerMode === 'none' ? 'bg-emerald-600' : 'bg-gray-700'}`}>
                            <Star className="h-5 w-5 text-white" />
                          </div>
                          <h4 className="text-lg font-semibold">بدون مؤقت</h4>
                        </div>
                        {timerMode === 'none' && (
                          <div className="p-1 bg-emerald-600 rounded-full">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm">
                        وقت مفتوح للتركيز الكامل على الإجابات بدون ضغط زمني
                      </p>
                    </div>

                    <div
                      onClick={() => updateSetting('timerMode', 'total')}
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        timerMode === 'total'
                          ? 'border-emerald-500 bg-gradient-to-r from-emerald-900/40 to-teal-900/40'
                          : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${timerMode === 'total' ? 'bg-emerald-600' : 'bg-gray-700'}`}>
                            <Timer className="h-5 w-5 text-white" />
                          </div>
                          <h4 className="text-lg font-semibold">مع مؤقت زمني</h4>
                        </div>
                        {timerMode === 'total' && (
                          <div className="p-1 bg-emerald-600 rounded-full">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm mb-4">
                        تدريب واقعي مع مؤقت لمحاكاة ظروف الاختبار الحقيقي
                      </p>
                      
                      {timerMode === 'total' && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                          {timerDurations.slice(0, 6).map((timer) => (
                            <button
                              key={timer.value}
                              onClick={(e) => {
                                e.stopPropagation();
                                updateSetting('selectedTimerDuration', timer.value);
                              }}
                              className={`relative p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                                selectedTimerDuration === timer.value
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              }`}
                            >
                              {timer.recommended && (
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"></div>
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
                <div className="mt-12 p-8 bg-gradient-to-r from-amber-900/20 to-orange-900/20 rounded-2xl border border-amber-700/30">
                  <h3 className="text-xl font-bold flex items-center gap-3 mb-6">
                    <BookText className="h-6 w-6 text-amber-400" />
                    ترتيب أسئلة استيعاب المقروء
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div
                      onClick={() => updateSetting('rcQuestionOrder', 'sequential')}
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        rcQuestionOrder === 'sequential'
                          ? 'border-amber-500 bg-amber-900/40'
                          : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold">ترتيب متتالي</h4>
                        {rcQuestionOrder === 'sequential' && (
                          <div className="p-1 bg-amber-600 rounded-full">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm">
                        أسئلة النص الواحد تأتي متتابعة ومجمعة
                      </p>
                    </div>

                    <div
                      onClick={() => updateSetting('rcQuestionOrder', 'random')}
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                        rcQuestionOrder === 'random'
                          ? 'border-amber-500 bg-amber-900/40'
                          : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold">ترتيب عشوائي</h4>
                        {rcQuestionOrder === 'random' && (
                          <div className="p-1 bg-amber-600 rounded-full">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm">
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
            <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
              <div className="text-center mb-12">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl">
                    <Rocket className="h-16 w-16 text-white" />
                  </div>
                </div>
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                  كل شيء جاهز!
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  راجع إعداداتك النهائية قبل بدء رحلة التدريب
                </p>
              </div>

              {/* Settings Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {/* Question Type Summary */}
                <div className="p-6 bg-gradient-to-br from-violet-900/30 to-purple-900/30 rounded-xl border border-violet-700/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-violet-600 rounded-lg">
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold">نوع التدريب</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-white font-medium">
                      {questionTypeFilter === 'all' ? 'تدريب شامل' : 'تدريب مُركز'}
                    </p>
                    {questionTypeFilter === 'specific' && (
                      <p className="text-violet-300 text-sm">
                        {getCurrentQuestionType()?.title}
                      </p>
                    )}
                    <p className="text-gray-400 text-xs">
                      {questionTypeFilter === 'all' ? '5000+ سؤال' : getCurrentQuestionType()?.stats}
                    </p>
                  </div>
                </div>

                {/* Exam Mode Summary */}
                <div className="p-6 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-xl border border-blue-700/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <Layers className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold">نمط الاختبار</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-white font-medium">
                      {examMode === 'sectioned' ? 'أقسام مع مراجعة' : 'متتالي ومجمع'}
                    </p>
                    <p className="text-blue-300 text-sm">
                      {examMode === 'sectioned' 
                        ? 'مع إمكانية المراجعة' 
                        : 'بدون توقف'}
                    </p>
                  </div>
                </div>

                {/* Timer Summary */}
                <div className="p-6 bg-gradient-to-br from-emerald-900/30 to-teal-900/30 rounded-xl border border-emerald-700/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-emerald-600 rounded-lg">
                      <Timer className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold">المؤقت</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-white font-medium">
                      {timerMode === 'none' ? 'بدون مؤقت' : getSelectedTimerInfo()?.label}
                    </p>
                    <p className="text-emerald-300 text-sm">
                      {timerMode === 'none' ? 'وقت مفتوح' : 'تدريب واقعي'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Start Button */}
              <div className="text-center">
                <button
                  onClick={handleStartExam}
                  className="group relative inline-flex items-center gap-3 px-12 py-6 text-xl font-bold text-white bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-2xl shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-3">
                    <Rocket className="h-7 w-7" />
                    ابدأ الاختبار الآن
                    <ArrowUpRight className="h-6 w-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                  </div>
                </button>
                
                <p className="text-gray-400 text-sm mt-4">
                  * يمكنك تغيير الإعدادات في أي وقت من لوحة التحكم
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Controls */}
        <div className="sticky bottom-0 bg-black/40 backdrop-blur-xl border-t border-gray-700/50">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <button
                onClick={handlePrev}
                disabled={currentStep === 1}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  currentStep === 1
                    ? 'text-gray-500 cursor-not-allowed'
                    : 'text-white bg-gray-700 hover:bg-gray-600 hover:scale-105'
                }`}
              >
                <ChevronRight className="h-5 w-5" />
                السابق
              </button>

              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  {currentStep === 1 && 'اختر نمط التدريب المناسب'}
                  {currentStep === 2 && 'تخصيص إعدادات التجربة'}
                  {currentStep === 3 && 'مراجعة نهائية وبدء التدريب'}
                </p>
              </div>

              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-medium hover:scale-105 transition-all duration-300"
                >
                  التالي
                  <ChevronLeft className="h-5 w-5" />
                </button>
              ) : (
                <div className="w-20"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;

