// StartScreen.jsx (New Design Concept)

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, BookOpen, Play, Filter, GraduationCap, Target, Settings, CheckCircle, ArrowRight, Home, X, ChevronDown } from 'lucide-react'; // Added ChevronDown for select
import { useExamStore } from '../store/examStore';

// Assuming a new component for Accordion or Tabs if needed
// import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

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

  const [settings, setSettings] = useState(loadSavedSettings());
  const [isQuestionTypeModalOpen, setIsQuestionTypeModalOpen] = useState(false);
  const [isTimerDurationModalOpen, setIsTimerDurationModalOpen] = useState(false);

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

  const questionTypes = [
    { value: 'analogy', label: 'التناظر اللفظي', icon: '🔗', description: 'العلاقات بين الكلمات' },
    { value: 'completion', label: 'إكمال الجمل', icon: '📝', description: 'ملء الفراغات المناسبة' },
    { value: 'error', label: 'الخطأ السياقي', icon: '🔍', description: 'تحديد الأخطاء اللغوية' },
    { value: 'rc', label: 'استيعاب المقروء', icon: '📖', description: 'فهم النصوص والمقاطع' },
    { value: 'odd', label: 'المفردة الشاذة', icon: '🎯', description: 'تحديد الكلمة المختلفة' }
  ];

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

  const handleTimerModeChange = (mode) => {
    updateSetting('timerMode', mode);
  };

  const handleTimerDurationChange = (duration) => {
    updateSetting('selectedTimerDuration', parseInt(duration));
  };

  const openQuestionTypeModal = () => setIsQuestionTypeModalOpen(true);
  const closeQuestionTypeModal = () => setIsQuestionTypeModalOpen(false);
  const openTimerDurationModal = () => setIsTimerDurationModalOpen(true);
  const closeTimerDurationModal = () => setIsTimerDurationModalOpen(false);

  const handleQuestionTypeSelect = (type) => {
    updateSetting('selectedQuestionType', type);
    closeQuestionTypeModal();
  };

  const handleTimerDurationSelect = (duration) => {
    updateSetting('selectedTimerDuration', parseInt(duration));
    closeTimerDurationModal();
  };

  const getQuestionTypeInfo = () => {
    return questionTypes.find(type => type.value === selectedQuestionType);
  };

  const getSelectedQuestionTypeDisplay = () => {
    const selectedType = questionTypes.find(type => type.value === selectedQuestionType);
    return selectedType ? selectedType.label : 'اختر نوع الأسئلة';
  };

  const getSelectedTimerDurationDisplay = () => {
    return `${selectedTimerDuration} دقيقة`;
  };

  const shouldShowRCOrderSection = () => {
    return questionTypeFilter === 'all' ||
           (questionTypeFilter === 'specific' && selectedQuestionType === 'rc');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900" dir="rtl">
      {/* Question Type Modal - Re-styled */}
      {isQuestionTypeModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={closeQuestionTypeModal}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Filter className="h-5 w-5 text-blue-600" />
                اختر نوع الأسئلة
              </h3>
              <Button variant="ghost" size="icon" onClick={closeQuestionTypeModal} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-5 max-h-[60vh] overflow-y-auto">
              <div className="grid gap-3">
                {questionTypes.map(type => (
                  <button
                    key={type.value}
                    onClick={() => handleQuestionTypeSelect(type.value)}
                    className={`flex items-center justify-between p-4 rounded-md border transition-all duration-200
                      ${selectedQuestionType === type.value
                        ? 'bg-blue-50 border-blue-400 text-blue-800'
                        : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{type.icon}</span>
                      <div>
                        <div className="font-medium text-right">{type.label}</div>
                        <div className="text-sm text-gray-500 text-right">{type.description}</div>
                      </div>
                    </div>
                    {selectedQuestionType === type.value && (
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timer Duration Modal - Re-styled */}
      {isTimerDurationModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" onClick={closeTimerDurationModal}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                اختر مدة المؤقت
              </h3>
              <Button variant="ghost" size="icon" onClick={closeTimerDurationModal} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-5 max-h-[60vh] overflow-y-auto">
              <div className="grid gap-3">
                {[5, 10, 13, 15, 20, 25, 30, 45, 60, 90, 120].map(duration => (
                  <button
                    key={duration}
                    onClick={() => handleTimerDurationSelect(duration)}
                    className={`flex items-center justify-between p-4 rounded-md border transition-all duration-200
                      ${selectedTimerDuration === duration
                        ? 'bg-blue-50 border-blue-400 text-blue-800'
                        : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                  >
                    <div className="font-medium text-right">{duration} دقيقة</div>
                    {selectedTimerDuration === duration && (
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section - Completely New Design */}
      <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/path/to/subtle-pattern.svg')] bg-repeat"></div> {/* Optional subtle pattern */}
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-6">
            <GraduationCap className="h-20 w-20 mx-auto text-blue-200 opacity-80" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            محاكي اختبارات قياس
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            بواسطة our goal - بوابتك للتميز في اختبارات القدرات
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-blue-100 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-200" />
              <span>أكثر من 6000+ سؤال</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-200" />
              <span>5 أقسام مخصصة</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-200" />
              <span>تقييم فوري وشامل</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Settings Section */}
      <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">إعدادات الاختبار</h2>
          <p className="text-md text-gray-600 max-w-xl mx-auto">
            خصص تجربتك التدريبية لتناسب احتياجاتك وأهدافك.
          </p>
        </div>

        {/* Settings Grid - Modernized Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Question Type Filter */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mb-4 mx-auto">
              <Filter className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-center mb-2">نوع الأسئلة</h3>
            <p className="text-sm text-gray-500 text-center mb-5">اختر نوع الأسئلة التي ترغب في التدرب عليها.</p>
            <RadioGroup value={questionTypeFilter} onValueChange={(value) => updateSetting('questionTypeFilter', value)} className="space-y-3">
              <div
                className={`flex items-center p-3 rounded-md border cursor-pointer transition-colors duration-200
                  ${questionTypeFilter === 'all' ? 'bg-blue-50 border-blue-400' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                onClick={() => updateSetting('questionTypeFilter', 'all')}
              >
                <RadioGroupItem value="all" id="all-types" className="ml-3" />
                <Label htmlFor="all-types" className="flex-1 cursor-pointer text-right">
                  <span className="font-medium">جميع الأنواع</span>
                  <p className="text-xs text-gray-500">اختبار شامل على جميع أنواع الأسئلة.</p>
                </Label>
              </div>
              <div
                className={`flex items-center p-3 rounded-md border cursor-pointer transition-colors duration-200
                  ${questionTypeFilter === 'specific' ? 'bg-blue-50 border-blue-400' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                onClick={() => {
                  updateSetting('questionTypeFilter', 'specific');
                  openQuestionTypeModal();
                }}
              >
                <RadioGroupItem value="specific" id="specific-type" className="ml-3" />
                <Label htmlFor="specific-type" className="flex-1 cursor-pointer text-right">
                  <span className="font-medium">
                    {questionTypeFilter === 'specific' && selectedQuestionType ?
                      getSelectedQuestionTypeDisplay() :
                      'نوع معين'
                    }
                  </span>
                  <p className="text-xs text-gray-500">تدريب مركز على نوع واحد من الأسئلة.</p>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Exam Mode Configuration */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4 mx-auto">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-center mb-2">نمط الاختبار</h3>
            <p className="text-sm text-gray-500 text-center mb-5">اختر طريقة عرض الأسئلة أثناء الاختبار.</p>
            <RadioGroup value={examMode} onValueChange={(value) => updateSetting('examMode', value)} className="space-y-3">
              <div
                className={`flex items-center p-3 rounded-md border cursor-pointer transition-colors duration-200
                  ${examMode === 'sectioned' ? 'bg-blue-50 border-blue-400' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                onClick={() => updateSetting('examMode', 'sectioned')}
              >
                <RadioGroupItem value="sectioned" id="sectioned" className="ml-3" />
                <Label htmlFor="sectioned" className="flex-1 cursor-pointer text-right">
                  <span className="font-medium">أقسام مع مراجعة</span>
                  <p className="text-xs text-gray-500">اختبار مقسم مع إمكانية مراجعة الأقسام.</p>
                </Label>
              </div>
              <div
                className={`flex items-center p-3 rounded-md border cursor-pointer transition-colors duration-200
                  ${examMode === 'single' ? 'bg-blue-50 border-blue-400' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                onClick={() => updateSetting('examMode', 'single')}
              >
                <RadioGroupItem value="single" id="single" className="ml-3" />
                <Label htmlFor="single" className="flex-1 cursor-pointer text-right">
                  <span className="font-medium">مجمع في قسم واحد</span>
                  <p className="text-xs text-gray-500">جميع الأسئلة متتالية بدون توقف.</p>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Timer Configuration */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600 mb-4 mx-auto">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-center mb-2">إعدادات المؤقت</h3>
            <p className="text-sm text-gray-500 text-center mb-5">اختر نمط المؤقت المناسب لك.</p>
            <RadioGroup value={timerMode} onValueChange={handleTimerModeChange} className="space-y-3">
              <div
                className={`flex items-center p-3 rounded-md border cursor-pointer transition-colors duration-200
                  ${timerMode === 'none' ? 'bg-blue-50 border-blue-400' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                onClick={() => handleTimerModeChange('none')}
              >
                <RadioGroupItem value="none" id="no-timer" className="ml-3" />
                <Label htmlFor="no-timer" className="flex-1 cursor-pointer text-right">
                  <span className="font-medium">بدون مؤقت</span>
                  <p className="text-xs text-gray-500">اختبار بدون قيود زمنية.</p>
                </Label>
              </div>
              <div
                className={`flex items-center p-3 rounded-md border cursor-pointer transition-colors duration-200
                  ${timerMode === 'total' ? 'bg-blue-50 border-blue-400' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                onClick={() => {
                  handleTimerModeChange('total');
                  openTimerDurationModal();
                }}
              >
                <RadioGroupItem value="total" id="total-timer" className="ml-3" />
                <Label htmlFor="total-timer" className="flex-1 cursor-pointer text-right">
                  <span className="font-medium">
                    {timerMode === 'total' && selectedTimerDuration ?
                      `مؤقت ${selectedTimerDuration} دقيقة` :
                      'مع مؤقت'
                    }
                  </span>
                  <p className="text-xs text-gray-500">اختبار مع مؤقت زمني محدد.</p>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Reading Comprehension Order - Conditionally displayed */}
          {shouldShowRCOrderSection() && (
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mb-4 mx-auto">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-center mb-2">ترتيب استيعاب المقروء</h3>
              <p className="text-sm text-gray-500 text-center mb-5">اختر ترتيب أسئلة استيعاب المقروء.</p>
              <RadioGroup value={rcQuestionOrder} onValueChange={(value) => updateSetting('rcQuestionOrder', value)} className="space-y-3">
                <div
                  className={`flex items-center p-3 rounded-md border cursor-pointer transition-colors duration-200
                    ${rcQuestionOrder === 'sequential' ? 'bg-blue-50 border-blue-400' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                  onClick={() => updateSetting('rcQuestionOrder', 'sequential')}
                >
                  <RadioGroupItem value="sequential" id="sequential" className="ml-3" />
                  <Label htmlFor="sequential" className="flex-1 cursor-pointer text-right">
                    <span className="font-medium">متتالية</span>
                    <p className="text-xs text-gray-500">أسئلة من نفس النص تأتي متتابعة.</p>
                  </Label>
                </div>
                <div
                  className={`flex items-center p-3 rounded-md border cursor-pointer transition-colors duration-200
                    ${rcQuestionOrder === 'random' ? 'bg-blue-50 border-blue-400' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                  onClick={() => updateSetting('rcQuestionOrder', 'random')}
                >
                  <RadioGroupItem value="random" id="random" className="ml-3" />
                  <Label htmlFor="random" className="flex-1 cursor-pointer text-right">
                    <span className="font-medium">عشوائية</span>
                    <p className="text-xs text-gray-500">توزيع عشوائي كامل للأسئلة.</p>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}
        </div>

        {/* Start Button Section - Modernized */}
        <div className="text-center bg-white rounded-lg shadow-xl p-8 border border-gray-100 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-800 mb-3">جاهز للبدء؟</h3>
          <p className="text-gray-600 mb-6">
            ملخص إعداداتك الحالية:
            <span className="block font-medium text-blue-700 mt-2">
              {questionTypeFilter === 'specific'
                ? `${getQuestionTypeInfo()?.label} - `
                : `اختبار شامل - `
              }
              {examMode === 'sectioned' ? 'مع مراجعة' : 'متتالي'} -
              {timerMode === 'none' ? ' بدون مؤقت' : ` ${selectedTimerDuration} دقيقة`}
            </span>
          </p>

          <Button
            onClick={handleStartExam}
            size="lg"
            className="px-10 py-4 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center mx-auto"
          >
            <Play className="h-5 w-5 ml-2" />
            بدء الاختبار
            <ArrowRight className="h-5 w-5 mr-2" />
          </Button>
        </div>

        {/* Features Section - Modernized */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-10">لماذا تختار محاكينا؟</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 mx-auto mb-4">
                <Target className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">تدريب مخصص</h3>
              <p className="text-gray-600 text-sm">اختر نوع الأسئلة التي تريد التركيز عليها لتعزيز نقاط قوتك.</p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-50 text-green-600 mx-auto mb-4">
                <Settings className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">إعدادات مرنة</h3>
              <p className="text-gray-600 text-sm">تحكم كامل في وقت الاختبار ونمط العرض لتجربة مثالية.</p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-purple-50 text-purple-600 mx-auto mb-4">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">تقييم فوري</h3>
              <p className="text-gray-600 text-sm">احصل على النتائج والتحليل التفصيلي فور انتهاء الاختبار.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
