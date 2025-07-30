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
              
              <div className="flex items-center gap-6">
                {/* Folder Management Button */}
                <button
                  onClick={onShowFolderManagement}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-500/30"
                >
                  <Folder className="h-4 w-4" />
                  مجلداتي
                </button>

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
                            ? `${type.borderColor} ${type.bgColor} shadow-2xl ${type.shadow}`
                            : 'border-gray-700 bg-gradient-to-br from-gray-800/30 to-gray-900/30 hover:border-gray-600'
                        }`}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-r ${type.color.replace('from-', 'from-').replace('to-', 'to-')}/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                        <div className="relative">
                          <div className="flex items-center justify-between mb-6">
                            <div className={`p-4 rounded-xl ${
                              selectedQuestionType === type.id 
                                ? `bg-gradient-to-r ${type.color} shadow-lg ${type.shadow}` 
                                : 'bg-gray-700 group-hover:bg-gray-600'
                            } transition-all duration-500`}>
                              <IconComponent className="h-8 w-8 text-white" />
                            </div>
                            {selectedQuestionType === type.id && (
                              <div className={`p-2 bg-gradient-to-r ${type.color} rounded-full shadow-lg`}>
                                <Check className="h-5 w-5 text-white" />
                              </div>
                            )}
                          </div>
                          <h3 className={`text-2xl font-bold mb-3 ${
                            selectedQuestionType === type.id 
                              ? `bg-gradient-to-r ${type.color.replace('600', '400')} bg-clip-text text-transparent`
                              : 'text-white'
                          }`}>
                            {type.title}
                          </h3>
                          <p className="text-gray-300 mb-4 text-base leading-relaxed">
                            {type.subtitle}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className={`px-3 py-1 ${
                              selectedQuestionType === type.id 
                                ? `bg-gradient-to-r ${type.color}/20 text-${type.color.split('-')[1]}-300`
                                : 'bg-gray-700/50 text-gray-400'
                            } rounded-full text-sm font-medium`}>
                              متخصص
                            </span>
                            <span className="text-gray-400 font-medium text-sm">{type.stats}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Exam Mode Selection */}
          {currentStep === 2 && (
            <div className={`transition-all duration-500 ${isAnimating ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'}`}>
              <div className="text-center mb-16">
                <div className="relative inline-block">
                  <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl shadow-2xl shadow-emerald-500/30 mb-6">
                    <Settings2 className="h-20 w-20 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
                <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent animate-gradient">
                  إعدادات الاختبار
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                  اختر طريقة عرض الأسئلة والتوقيت المناسب لك
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Exam Mode Selection */}
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                      طريقة العرض
                    </h3>
                    <p className="text-gray-300 text-lg">اختر كيفية تنظيم الأسئلة</p>
                  </div>

                  <RadioGroup value={examMode} onValueChange={(value) => updateSetting('examMode', value)} className="space-y-6">
                    {/* Sectioned Mode */}
                    <div className={`group relative p-8 rounded-2xl border-2 cursor-pointer transition-all duration-500 hover:scale-105 ${
                      examMode === 'sectioned'
                        ? 'border-emerald-500 bg-gradient-to-br from-emerald-900/30 to-teal-900/30 shadow-2xl shadow-emerald-500/30'
                        : 'border-gray-700 bg-gradient-to-br from-gray-800/30 to-gray-900/30 hover:border-gray-600'
                    }`}>
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 to-teal-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative flex items-center space-x-4 space-x-reverse">
                        <RadioGroupItem value="sectioned" id="sectioned" className="text-emerald-500" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-4">
                            <div className={`p-4 rounded-xl ${
                              examMode === 'sectioned' 
                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg shadow-emerald-500/30' 
                                : 'bg-gray-700 group-hover:bg-gray-600'
                            } transition-all duration-500`}>
                              <Layers className="h-8 w-8 text-white" />
                            </div>
                            {examMode === 'sectioned' && (
                              <div className="p-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full shadow-lg">
                                <Check className="h-5 w-5 text-white" />
                              </div>
                            )}
                          </div>
                          <Label htmlFor="sectioned" className="text-2xl font-bold text-white cursor-pointer">
                            عرض مقسم
                          </Label>
                          <p className="text-gray-300 mt-2 text-lg leading-relaxed">
                            تنظيم الأسئلة حسب النوع مع إمكانية التنقل بينها
                          </p>
                          <div className="flex items-center mt-4">
                            <span className="px-3 py-1 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 text-emerald-300 rounded-full text-sm font-medium">
                              الأكثر تنظيماً
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mixed Mode */}
                    <div className={`group relative p-8 rounded-2xl border-2 cursor-pointer transition-all duration-500 hover:scale-105 ${
                      examMode === 'mixed'
                        ? 'border-purple-500 bg-gradient-to-br from-purple-900/30 to-pink-900/30 shadow-2xl shadow-purple-500/30'
                        : 'border-gray-700 bg-gradient-to-br from-gray-800/30 to-gray-900/30 hover:border-gray-600'
                    }`}>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-pink-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative flex items-center space-x-4 space-x-reverse">
                        <RadioGroupItem value="mixed" id="mixed" className="text-purple-500" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-4">
                            <div className={`p-4 rounded-xl ${
                              examMode === 'mixed' 
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/30' 
                                : 'bg-gray-700 group-hover:bg-gray-600'
                            } transition-all duration-500`}>
                              <Shuffle className="h-8 w-8 text-white" />
                            </div>
                            {examMode === 'mixed' && (
                              <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg">
                                <Check className="h-5 w-5 text-white" />
                              </div>
                            )}
                          </div>
                          <Label htmlFor="mixed" className="text-2xl font-bold text-white cursor-pointer">
                            عرض مختلط
                          </Label>
                          <p className="text-gray-300 mt-2 text-lg leading-relaxed">
                            خلط جميع أنواع الأسئلة في تسلسل عشوائي
                          </p>
                          <div className="flex items-center mt-4">
                            <span className="px-3 py-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 rounded-full text-sm font-medium">
                              الأكثر تحدياً
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>

                  {/* RC Question Order (only for specific RC type) */}
                  {questionTypeFilter === 'specific' && selectedQuestionType === 'rc' && (
                    <div className="mt-12 p-8 bg-gradient-to-br from-amber-900/20 to-orange-900/20 rounded-2xl border border-amber-500/30">
                      <h4 className="text-2xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                        ترتيب أسئلة استيعاب المقروء
                      </h4>
                      <RadioGroup value={rcQuestionOrder} onValueChange={(value) => updateSetting('rcQuestionOrder', value)} className="space-y-4">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <RadioGroupItem value="sequential" id="sequential" className="text-amber-500" />
                          <Label htmlFor="sequential" className="text-lg text-white cursor-pointer">
                            تسلسلي - عرض الأسئلة مع نصوصها
                          </Label>
                        </div>
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <RadioGroupItem value="grouped" id="grouped" className="text-amber-500" />
                          <Label htmlFor="grouped" className="text-lg text-white cursor-pointer">
                            مجمع - عرض النص مع جميع أسئلته
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}
                </div>

                {/* Timer Settings */}
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                      إعدادات التوقيت
                    </h3>
                    <p className="text-gray-300 text-lg">حدد مدة الاختبار</p>
                  </div>

                  <RadioGroup value={timerMode} onValueChange={(value) => updateSetting('timerMode', value)} className="space-y-6">
                    {/* No Timer */}
                    <div className={`group relative p-8 rounded-2xl border-2 cursor-pointer transition-all duration-500 hover:scale-105 ${
                      timerMode === 'none'
                        ? 'border-gray-500 bg-gradient-to-br from-gray-800/50 to-gray-900/50 shadow-2xl shadow-gray-500/30'
                        : 'border-gray-700 bg-gradient-to-br from-gray-800/30 to-gray-900/30 hover:border-gray-600'
                    }`}>
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-600/5 to-gray-700/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative flex items-center space-x-4 space-x-reverse">
                        <RadioGroupItem value="none" id="none" className="text-gray-400" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-4">
                            <div className={`p-4 rounded-xl ${
                              timerMode === 'none' 
                                ? 'bg-gradient-to-r from-gray-600 to-gray-700 shadow-lg shadow-gray-500/30' 
                                : 'bg-gray-700 group-hover:bg-gray-600'
                            } transition-all duration-500`}>
                              <Zap className="h-8 w-8 text-white" />
                            </div>
                            {timerMode === 'none' && (
                              <div className="p-2 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full shadow-lg">
                                <Check className="h-5 w-5 text-white" />
                              </div>
                            )}
                          </div>
                          <Label htmlFor="none" className="text-2xl font-bold text-white cursor-pointer">
                            بدون توقيت
                          </Label>
                          <p className="text-gray-300 mt-2 text-lg leading-relaxed">
                            تدرب بدون ضغط الوقت
                          </p>
                          <div className="flex items-center mt-4">
                            <span className="px-3 py-1 bg-gradient-to-r from-gray-600/20 to-gray-700/20 text-gray-300 rounded-full text-sm font-medium">
                              مريح
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timed Mode */}
                    <div className={`group relative p-8 rounded-2xl border-2 cursor-pointer transition-all duration-500 hover:scale-105 ${
                      timerMode === 'timed'
                        ? 'border-rose-500 bg-gradient-to-br from-rose-900/30 to-pink-900/30 shadow-2xl shadow-rose-500/30'
                        : 'border-gray-700 bg-gradient-to-br from-gray-800/30 to-gray-900/30 hover:border-gray-600'
                    }`}>
                      <div className="absolute inset-0 bg-gradient-to-r from-rose-600/5 to-pink-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative flex items-center space-x-4 space-x-reverse">
                        <RadioGroupItem value="timed" id="timed" className="text-rose-500" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-4">
                            <div className={`p-4 rounded-xl ${
                              timerMode === 'timed' 
                                ? 'bg-gradient-to-r from-rose-600 to-pink-600 shadow-lg shadow-rose-500/30' 
                                : 'bg-gray-700 group-hover:bg-gray-600'
                            } transition-all duration-500`}>
                              <Timer className="h-8 w-8 text-white" />
                            </div>
                            {timerMode === 'timed' && (
                              <div className="p-2 bg-gradient-to-r from-rose-600 to-pink-600 rounded-full shadow-lg">
                                <Check className="h-5 w-5 text-white" />
                              </div>
                            )}
                          </div>
                          <Label htmlFor="timed" className="text-2xl font-bold text-white cursor-pointer">
                            مع توقيت
                          </Label>
                          <p className="text-gray-300 mt-2 text-lg leading-relaxed">
                            محاكاة ظروف الاختبار الحقيقي
                          </p>
                          <div className="flex items-center mt-4">
                            <span className="px-3 py-1 bg-gradient-to-r from-rose-600/20 to-pink-600/20 text-rose-300 rounded-full text-sm font-medium">
                              واقعي
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>

                  {/* Timer Duration Selection */}
                  {timerMode === 'timed' && (
                    <div className="mt-8 p-8 bg-gradient-to-br from-rose-900/20 to-pink-900/20 rounded-2xl border border-rose-500/30 animate-in slide-in-from-bottom-6 duration-700">
                      <h4 className="text-2xl font-bold mb-6 bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
                        مدة الاختبار
                      </h4>
                      <Select value={selectedTimerDuration.toString()} onValueChange={(value) => updateSetting('selectedTimerDuration', parseInt(value))}>
                        <SelectTrigger className="w-full bg-gray-800/50 border-gray-600 text-white text-lg p-4 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          {timerDurations.map((duration) => (
                            <SelectItem 
                              key={duration.value} 
                              value={duration.value.toString()}
                              className="text-white hover:bg-gray-700 text-lg py-3"
                            >
                              <div className="flex items-center justify-between w-full">
                                <span>{duration.label}</span>
                                {duration.recommended && (
                                  <span className="mr-2 px-2 py-1 bg-gradient-to-r from-rose-600/20 to-pink-600/20 text-rose-300 rounded-full text-xs font-medium">
                                    مُوصى
                                  </span>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      {getSelectedTimerInfo()?.recommended && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-rose-600/10 to-pink-600/10 rounded-xl border border-rose-500/20">
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <Star className="h-5 w-5 text-rose-400" />
                            <span className="text-rose-300 font-medium">مدة موصى بها للتدريب الفعال</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Final Review */}
          {currentStep === 3 && (
            <div className={`transition-all duration-500 ${isAnimating ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'}`}>
              <div className="text-center mb-16">
                <div className="relative inline-block">
                  <div className="p-6 bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl shadow-2xl shadow-amber-500/30 mb-6">
                    <Rocket className="h-20 w-20 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
                <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 bg-clip-text text-transparent animate-gradient">
                  مراجعة الإعدادات
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                  تأكد من إعداداتك قبل بدء رحلة التدريب
                </p>
              </div>

              {/* Settings Summary */}
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  {/* Question Type Summary */}
                  <div className="p-8 bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-2xl border border-purple-500/30 shadow-2xl shadow-purple-500/20">
                    <div className="flex items-center mb-6">
                      <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg shadow-purple-500/30 ml-4">
                        {questionTypeFilter === 'all' ? (
                          <Gem className="h-8 w-8 text-white" />
                        ) : (
                          <Target className="h-8 w-8 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                          نمط التدريب
                        </h3>
                        <p className="text-gray-300">
                          {questionTypeFilter === 'all' ? 'تدريب شامل' : 'تدريب مُركز'}
                        </p>
                      </div>
                    </div>
                    {questionTypeFilter === 'specific' && (
                      <div className="p-4 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-xl border border-purple-500/20">
                        <div className="flex items-center">
                          {getCurrentQuestionType() && (
                            <>
                              <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg ml-3">
                                {React.createElement(getCurrentQuestionType().icon, { className: "h-5 w-5 text-white" })}
                              </div>
                              <div>
                                <p className="text-white font-medium">{getCurrentQuestionType().title}</p>
                                <p className="text-gray-300 text-sm">{getCurrentQuestionType().stats}</p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Exam Mode Summary */}
                  <div className="p-8 bg-gradient-to-br from-emerald-900/30 to-teal-900/30 rounded-2xl border border-emerald-500/30 shadow-2xl shadow-emerald-500/20">
                    <div className="flex items-center mb-6">
                      <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/30 ml-4">
                        {examMode === 'sectioned' ? (
                          <Layers className="h-8 w-8 text-white" />
                        ) : (
                          <Shuffle className="h-8 w-8 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                          طريقة العرض
                        </h3>
                        <p className="text-gray-300">
                          {examMode === 'sectioned' ? 'عرض مقسم' : 'عرض مختلط'}
                        </p>
                      </div>
                    </div>
                    {questionTypeFilter === 'specific' && selectedQuestionType === 'rc' && (
                      <div className="p-4 bg-gradient-to-r from-emerald-600/10 to-teal-600/10 rounded-xl border border-emerald-500/20">
                        <p className="text-white font-medium">
                          ترتيب أسئلة استيعاب المقروء: {rcQuestionOrder === 'sequential' ? 'تسلسلي' : 'مجمع'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Timer Summary */}
                  <div className="p-8 bg-gradient-to-br from-amber-900/30 to-orange-900/30 rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20">
                    <div className="flex items-center mb-6">
                      <div className="p-4 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl shadow-lg shadow-amber-500/30 ml-4">
                        {timerMode === 'none' ? (
                          <Zap className="h-8 w-8 text-white" />
                        ) : (
                          <Timer className="h-8 w-8 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                          التوقيت
                        </h3>
                        <p className="text-gray-300">
                          {timerMode === 'none' ? 'بدون توقيت' : 'مع توقيت'}
                        </p>
                      </div>
                    </div>
                    {timerMode === 'timed' && (
                      <div className="p-4 bg-gradient-to-r from-amber-600/10 to-orange-600/10 rounded-xl border border-amber-500/20">
                        <div className="flex items-center justify-between">
                          <p className="text-white font-medium">
                            المدة: {getSelectedTimerInfo()?.label}
                          </p>
                          {getSelectedTimerInfo()?.recommended && (
                            <span className="px-2 py-1 bg-gradient-to-r from-amber-600/20 to-orange-600/20 text-amber-300 rounded-full text-xs font-medium">
                              مُوصى
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Performance Prediction */}
                  <div className="p-8 bg-gradient-to-br from-rose-900/30 to-pink-900/30 rounded-2xl border border-rose-500/30 shadow-2xl shadow-rose-500/20">
                    <div className="flex items-center mb-6">
                      <div className="p-4 bg-gradient-to-r from-rose-600 to-pink-600 rounded-xl shadow-lg shadow-rose-500/30 ml-4">
                        <BarChart3 className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
                          توقعات الأداء
                        </h3>
                        <p className="text-gray-300">تحليل ذكي للإعدادات</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-rose-600/10 to-pink-600/10 rounded-lg border border-rose-500/20">
                        <span className="text-gray-300">مستوى التحدي</span>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${
                                i < (timerMode === 'timed' ? (examMode === 'mixed' ? 5 : 4) : (examMode === 'mixed' ? 3 : 2))
                                  ? 'text-rose-400 fill-current' 
                                  : 'text-gray-600'
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-rose-600/10 to-pink-600/10 rounded-lg border border-rose-500/20">
                        <span className="text-gray-300">التركيز المطلوب</span>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${
                                i < (questionTypeFilter === 'specific' ? 5 : 3)
                                  ? 'text-rose-400 fill-current' 
                                  : 'text-gray-600'
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Start Button */}
                <div className="text-center">
                  <Button
                    onClick={handleStartExam}
                    className="group relative px-16 py-6 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 hover:from-amber-500 hover:via-orange-500 hover:to-amber-500 text-white text-2xl font-bold rounded-2xl shadow-2xl shadow-amber-500/40 hover:shadow-amber-500/60 transition-all duration-500 hover:scale-110 transform"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative flex items-center space-x-4 space-x-reverse">
                      <Rocket className="h-8 w-8 group-hover:animate-bounce" />
                      <span>ابدأ التدريب الآن</span>
                      <ArrowUpRight className="h-8 w-8 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                    </div>
                  </Button>
                  
                  <p className="mt-6 text-gray-400 text-lg">
                    استعد لرحلة تدريبية مميزة تحاكي الاختبار الحقيقي
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-16">
            <Button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className={`flex items-center space-x-2 space-x-reverse px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300 ${
                currentStep === 1
                  ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white hover:scale-105 shadow-lg hover:shadow-xl'
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
              <span>السابق</span>
            </Button>

            {currentStep < 3 ? (
              <Button
                onClick={handleNext}
                className="flex items-center space-x-2 space-x-reverse px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl text-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
              >
                <span>التالي</span>
                <ChevronRight className="h-5 w-5" />
              </Button>
            ) : (
              <div className="w-32"></div> // Spacer to maintain layout
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;

