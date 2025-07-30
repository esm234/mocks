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
  Gem,
  Folder
} from 'lucide-react';
import { useExamStore } from '../store/examStore';

const StartScreen = ({ onShowFolderManagement }) => {
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
      color: 'from-purple-500 to-pink-500',
      stats: '1200+ سؤال'
    },
    { 
      id: 'completion', 
      title: 'إكمال الجمل', 
      subtitle: 'ملء الفراغات بدقة', 
      icon: BookText,
      color: 'from-emerald-500 to-teal-500',
      stats: '950+ سؤال'
    },
    { 
      id: 'error', 
      title: 'الخطأ السياقي', 
      subtitle: 'تحديد الأخطاء', 
      icon: Target,
      color: 'from-rose-500 to-pink-500',
      stats: '800+ سؤال'
    },
    { 
      id: 'rc', 
      title: 'استيعاب المقروء', 
      subtitle: 'فهم النصوص', 
      icon: Lightbulb,
      color: 'from-amber-500 to-orange-500',
      stats: '1500+ سؤال'
    },
    { 
      id: 'odd', 
      title: 'المفردة الشاذة', 
      subtitle: 'تحديد المختلف', 
      icon: Sparkles,
      color: 'from-cyan-500 to-blue-500',
      stats: '700+ سؤال'
    }
  ];

  const timerDurations = [
    { value: 30, label: '30 دقيقة', recommended: false },
    { value: 45, label: '45 دقيقة', recommended: false },
    { value: 60, label: 'ساعة كاملة', recommended: true },
    { value: 90, label: 'ساعة ونصف', recommended: false },
    { value: 120, label: 'ساعتان', recommended: false }
  ];

  const handleStepChange = (step) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(step);
      setIsAnimating(false);
    }, 150);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white" dir="rtl">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cdefs%3E%3Cpattern%20id%3D%22grid%22%20width%3D%2220%22%20height%3D%2220%22%20patternUnits%3D%22userSpaceOnUse%22%3E%3Cpath%20d%3D%22M%2020%200%20L%200%200%200%2020%22%20fill%3D%22none%22%20stroke%3D%22%23ffffff%22%20stroke-width%3D%220.5%22%20opacity%3D%220.03%22/%3E%3C/pattern%3E%3C/defs%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22url(%23grid)%22/%3E%3C/svg%3E')] opacity-30"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="bg-black/20 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg">
                  <Diamond className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    محاكي أور جول
                  </h1>
                  <p className="text-sm text-gray-400">المرحلة {currentStep} من 3</p>
                </div>
              </div>
              
              <button
                onClick={onShowFolderManagement}
                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium hover:scale-105 transition-all duration-300 shadow-lg text-sm"
              >
                <Folder className="h-4 w-4" />
                مجلداتي
              </button>

              {/* Progress Steps */}
              <div className="flex items-center space-x-4 space-x-reverse">
                {[1, 2, 3].map((step) => (
                  <button
                    key={step}
                    onClick={() => handleStepChange(step)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                      currentStep >= step
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                    }`}
                  >
                    {currentStep > step ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span>{step}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-3 w-full bg-gray-700 rounded-full h-1">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Step 1: Question Type Selection */}
          {currentStep === 1 && (
            <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
              <div className="text-center mb-12">
                <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-xl mb-6 inline-block">
                  <Crown className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  اختر نمط التدريب
                </h2>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                  حدد المجال الذي تريد التركيز عليه في رحلتك التدريبية
                </p>
              </div>

              {/* Question Type Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* All Types Option */}
                <div 
                  onClick={() => updateSetting('questionTypeFilter', 'all')}
                  className={`group p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:scale-102 ${
                    questionTypeFilter === 'all'
                      ? 'border-purple-400 bg-gradient-to-br from-purple-900/30 to-pink-900/30 shadow-xl'
                      : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-4 rounded-xl ${
                      questionTypeFilter === 'all' 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg' 
                        : 'bg-gray-600 group-hover:bg-gray-500'
                    } transition-all duration-300`}>
                      <Gem className="h-8 w-8 text-white" />
                    </div>
                    {questionTypeFilter === 'all' && (
                      <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    تدريب شامل
                  </h3>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    اختبار متكامل يغطي جميع أنواع الأسئلة
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                      الأكثر شمولية
                    </span>
                    <span className="text-gray-400 font-medium">5000+ سؤال</span>
                  </div>
                </div>

                {/* Specific Type Option */}
                <div 
                  onClick={() => updateSetting('questionTypeFilter', 'specific')}
                  className={`group p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:scale-102 ${
                    questionTypeFilter === 'specific'
                      ? 'border-emerald-400 bg-gradient-to-br from-emerald-900/30 to-teal-900/30 shadow-xl'
                      : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-4 rounded-xl ${
                      questionTypeFilter === 'specific' 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg' 
                        : 'bg-gray-600 group-hover:bg-gray-500'
                    } transition-all duration-300`}>
                      <Target className="h-8 w-8 text-white" />
                    </div>
                    {questionTypeFilter === 'specific' && (
                      <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    تدريب مُركز
                  </h3>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    تركيز عالي على نوع محدد من الأسئلة
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm">
                      تخصصي
                    </span>
                    <span className="text-gray-400 font-medium">متغير</span>
                  </div>
                </div>
              </div>

              {/* Question Type Grid */}
              {questionTypeFilter === 'specific' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-in slide-in-from-bottom duration-500">
                  {questionTypeOptions.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <div
                        key={type.id}
                        onClick={() => updateSetting('selectedQuestionType', type.id)}
                        className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                          selectedQuestionType === type.id
                            ? 'border-white bg-gray-700/50 shadow-lg'
                            : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-3 rounded-lg bg-gradient-to-r ${type.color} shadow-md`}>
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
                <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-xl mb-6 inline-block">
                  <Settings2 className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  إعدادات التجربة
                </h2>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                  اختر نمط الاختبار والمؤقت المناسب لمستواك
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Exam Mode Section */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                      <Shuffle className="h-5 w-5 text-white" />
                    </div>
                    نمط الاختبار
                  </h3>
                  
                  <div className="space-y-4">
                    <div
                      onClick={() => updateSetting('examMode', 'sectioned')}
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-102 ${
                        examMode === 'sectioned'
                          ? 'border-blue-400 bg-blue-900/30 shadow-lg'
                          : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            examMode === 'sectioned' 
                              ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                              : 'bg-gray-600'
                          }`}>
                            <Layers className="h-5 w-5 text-white" />
                          </div>
                          <h4 className="text-lg font-semibold">أقسام مع مراجعة</h4>
                        </div>
                        {examMode === 'sectioned' && (
                          <Check className="h-5 w-5 text-blue-400" />
                        )}
                      </div>
                      <p className="text-gray-300 text-sm">
                        الاختبار مقسم إلى أجزاء مع إمكانية مراجعة ومعاينة الإجابات
                      </p>
                    </div>

                    <div
                      onClick={() => updateSetting('examMode', 'single')}
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-102 ${
                        examMode === 'single'
                          ? 'border-blue-400 bg-blue-900/30 shadow-lg'
                          : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            examMode === 'single' 
                              ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                              : 'bg-gray-600'
                          }`}>
                            <Zap className="h-5 w-5 text-white" />
                          </div>
                          <h4 className="text-lg font-semibold">متتالي ومجمع</h4>
                        </div>
                        {examMode === 'single' && (
                          <Check className="h-5 w-5 text-blue-400" />
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
                    <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
                      <Timer className="h-5 w-5 text-white" />
                    </div>
                    إعدادات المؤقت
                  </h3>
                  
                  <div className="space-y-4">
                    <div
                      onClick={() => updateSetting('timerMode', 'none')}
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-102 ${
                        timerMode === 'none'
                          ? 'border-emerald-400 bg-emerald-900/30 shadow-lg'
                          : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            timerMode === 'none' 
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                              : 'bg-gray-600'
                          }`}>
                            <Star className="h-5 w-5 text-white" />
                          </div>
                          <h4 className="text-lg font-semibold">بدون مؤقت</h4>
                        </div>
                        {timerMode === 'none' && (
                          <Check className="h-5 w-5 text-emerald-400" />
                        )}
                      </div>
                      <p className="text-gray-300 text-sm">
                        وقت مفتوح للتركيز الكامل على الإجابات بدون ضغط زمني
                      </p>
                    </div>

                    <div
                      onClick={() => updateSetting('timerMode', 'total')}
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-102 ${
                        timerMode === 'total'
                          ? 'border-emerald-400 bg-emerald-900/30 shadow-lg'
                          : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            timerMode === 'total' 
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                              : 'bg-gray-600'
                          }`}>
                            <Timer className="h-5 w-5 text-white" />
                          </div>
                          <h4 className="text-lg font-semibold">مع مؤقت زمني</h4>
                        </div>
                        {timerMode === 'total' && (
                          <Check className="h-5 w-5 text-emerald-400" />
                        )}
                      </div>
                      <p className="text-gray-300 text-sm mb-4">
                        تدريب واقعي مع مؤقت لمحاكاة ظروف الاختبار الحقيقي
                      </p>
                      
                      {timerMode === 'total' && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {timerDurations.map((timer) => (
                            <button
                              key={timer.value}
                              onClick={(e) => {
                                e.stopPropagation();
                                updateSetting('selectedTimerDuration', timer.value);
                              }}
                              className={`relative p-3 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
                                selectedTimerDuration === timer.value
                                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
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
                <div className="mt-12 p-6 bg-amber-900/20 rounded-2xl border border-amber-600/30">
                  <h3 className="text-xl font-bold flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
                      <BookText className="h-5 w-5 text-white" />
                    </div>
                    ترتيب أسئلة استيعاب المقروء
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div
                      onClick={() => updateSetting('rcQuestionOrder', 'sequential')}
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-102 ${
                        rcQuestionOrder === 'sequential'
                          ? 'border-amber-400 bg-amber-900/40 shadow-lg'
                          : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-semibold">ترتيب متتالي</h4>
                        {rcQuestionOrder === 'sequential' && (
                          <Check className="h-5 w-5 text-amber-400" />
                        )}
                      </div>
                      <p className="text-gray-300 text-sm">
                        أسئلة النص الواحد تأتي متتابعة ومجمعة
                      </p>
                    </div>

                    <div
                      onClick={() => updateSetting('rcQuestionOrder', 'random')}
                      className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-102 ${
                        rcQuestionOrder === 'random'
                          ? 'border-amber-400 bg-amber-900/40 shadow-lg'
                          : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-semibold">ترتيب عشوائي</h4>
                        {rcQuestionOrder === 'random' && (
                          <Check className="h-5 w-5 text-amber-400" />
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
                <div className="p-4 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl shadow-xl mb-6 inline-block">
                  <Rocket className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                  كل شيء جاهز!
                </h2>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                  راجع إعداداتك النهائية قبل بدء رحلة التدريب
                </p>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {/* Question Type Summary */}
                <div className="p-6 bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl border border-purple-600/30 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold">نوع التدريب</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-white font-medium">
                      {questionTypeFilter === 'all' ? 'تدريب شامل' : 'تدريب مُركز'}
                    </p>
                    {questionTypeFilter === 'specific' && (
                      <p className="text-purple-300 text-sm">
                        {getCurrentQuestionType()?.title}
                      </p>
                    )}
                    <p className="text-gray-400 text-sm">
                      {questionTypeFilter === 'all' ? '5000+ سؤال' : getCurrentQuestionType()?.stats}
                    </p>
                  </div>
                </div>

                {/* Exam Mode Summary */}
                <div className="p-6 bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-xl border border-blue-600/30 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
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
                <div className="p-6 bg-gradient-to-br from-emerald-900/30 to-teal-900/30 rounded-xl border border-emerald-600/30 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
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
                  className="group inline-flex items-center gap-4 px-12 py-6 text-xl font-bold text-white bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-2xl shadow-2xl hover:shadow-emerald-500/50 transition-all duration-500 hover:scale-105"
                >
                  <Rocket className="h-7 w-7 group-hover:translate-y-1 transition-transform duration-500" />
                  ابدأ الاختبار الآن
                  <ArrowUpRight className="h-6 w-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />
                </button>
                
                <p className="text-gray-400 text-sm mt-4">
                  * يمكنك تغيير الإعدادات من لوحة التحكم
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="bg-black/20 backdrop-blur-md border-t border-white/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <button
                onClick={handlePrev}
                disabled={currentStep === 1}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  currentStep === 1
                    ? 'text-gray-500 cursor-not-allowed'
                    : 'text-white bg-gray-700 hover:bg-gray-600 hover:scale-105'
                }`}
              >
                <ChevronRight className="h-5 w-5" />
                السابق
              </button>

              <div className="text-center">
                <p className="text-gray-400 text-sm font-medium">
                  {currentStep === 1 && 'اختر نمط التدريب المناسب'}
                  {currentStep === 2 && 'تخصيص إعدادات التجربة'}
                  {currentStep === 3 && 'مراجعة نهائية وبدء التدريب'}
                </p>
              </div>

              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg"
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
