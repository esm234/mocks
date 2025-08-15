import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Brain, 
  Rocket, 
  Timer, 
  Layers, 
  Shuffle, 
  BarChart3,
  ChevronRight,
  ChevronLeft,
  Check,
  Settings2,
  Sparkles,
  Target,
  BookText,
  Lightbulb,
  FolderOpen,
  Search
} from 'lucide-react';
import { useExamStore } from '../store/examStore';
import { motion, AnimatePresence } from 'framer-motion';
import SearchComponent from './SearchComponent';

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 120, staggerChildren: 0.1 } },
  exit: { opacity: 0, y: -30, transition: { duration: 0.3 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20, stiffness: 100 } },
};

const cardVariants = {
  hover: { scale: 1.03, transition: { type: "spring", stiffness: 300 } },
  selected: { scale: 1.02, transition: { type: "spring", stiffness: 300 } }
};

const buttonVariants = {
  hover: { scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 10 } },
  tap: { scale: 0.95 }
};

const StartScreen = ({ onShowFolderManagement }) => {
  const { initializeExam } = useExamStore();
  
  const loadSavedSettings = () => {
    try {
      const saved = localStorage.getItem('examSettings');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error loading settings:', error);
      return null;
    }
  };

  const defaultSettings = {
    examMode: 'sectioned',
    timerMode: 'none',
    selectedTimerDuration: 30,
    questionTypeFilter: 'all',
    selectedQuestionType: 'analogy',
    rcQuestionOrder: 'sequential'
  };

  const [currentStep, setCurrentStep] = useState(1);
  const [settings, setSettings] = useState(loadSavedSettings() || defaultSettings);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    localStorage.setItem('examSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const questionTypeOptions = [
    { id: 'analogy', title: 'التناظر اللفظي', icon: Brain, color: 'from-violet-500 to-purple-500', stats: '1200+ سؤال' },
    { id: 'completion', title: 'إكمال الجمل', icon: BookText, color: 'from-emerald-500 to-teal-500', stats: '900+ سؤال' },
    { id: 'error', title: 'الخطأ السياقي', icon: Target, color: 'from-rose-500 to-pink-500', stats: '800+ سؤال' },
    { id: 'rc', title: 'استيعاب المقروء', icon: Lightbulb, color: 'from-amber-500 to-orange-500', stats: '2800+ سؤال' },
    { id: 'odd', title: 'المفردة الشاذة', icon: Sparkles, color: 'from-cyan-500 to-blue-500', stats: '400+ سؤال' }
  ];

  const timerDurations = [
    { value: 30, label: '30 دقيقة' },
    { value: 45, label: '45 دقيقة' },
    { value: 60, label: 'ساعة' },
  ];

  const handleStepChange = (step) => {
    if (step >= 1 && step <= 3) {
      setCurrentStep(step);
    }
  };

  const handleStartExam = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    initializeExam({
      ...settings,
      timerDuration: settings.timerMode === 'none' ? 0 : settings.selectedTimerDuration,
      selectedQuestionType: settings.questionTypeFilter === 'specific' ? settings.selectedQuestionType : null,
      shuffleQuestions: true,
      shuffleChoices: true,
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return <Step1Content settings={settings} updateSetting={updateSetting} questionTypeOptions={questionTypeOptions} />;
      case 2: return <Step2Content settings={settings} updateSetting={updateSetting} timerDurations={timerDurations} />;
      case 3: return <Step3Content settings={settings} questionTypeOptions={questionTypeOptions} timerDurations={timerDurations} handleStartExam={handleStartExam} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-cairo overflow-x-hidden" dir="rtl">
      <div className="absolute inset-0 -z-10 h-full w-full bg-slate-950 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div>
      </div>

      <div className="relative z-10">
        <Header currentStep={currentStep} onStepChange={handleStepChange} onShowFolderManagement={onShowFolderManagement} onShowSearch={() => setShowSearch(true)} />
        
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <AnimatePresence mode='wait'>
            {renderStepContent()}
          </AnimatePresence>
        </main>

        <Footer currentStep={currentStep} onStepChange={handleStepChange} />
      </div>

      {/* ✅ تم إصلاح هذا الجزء. إذا أردت تفعيل البحث، تأكد من وجود المكون SearchComponent وإلغاء التعليق */}
      {/* 
      <AnimatePresence>
        {showSearch && <SearchComponent onClose={() => setShowSearch(false)} />}
      </AnimatePresence> 
      */}
    </div>
  );
};

const Header = ({ currentStep, onStepChange, onShowFolderManagement, onShowSearch }) => (
  <header className="sticky top-0 bg-slate-950/70 backdrop-blur-xl border-b border-white/10 z-40">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <motion.button onClick={onShowFolderManagement} whileHover="hover" variants={buttonVariants} className="p-2.5 bg-slate-800/80 border border-white/10 rounded-lg hover:bg-slate-700 transition-colors">
            <FolderOpen className="w-5 h-5 text-fuchsia-400" />
          </motion.button>
          <motion.button onClick={onShowSearch} whileHover="hover" variants={buttonVariants} className="p-2.5 bg-slate-800/80 border border-white/10 rounded-lg hover:bg-slate-700 transition-colors">
            <Search className="w-5 h-5 text-fuchsia-400" />
          </motion.button>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {[1, 2, 3].map((step) => (
            <motion.button
              key={step}
              onClick={() => onStepChange(step)}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 relative
                ${currentStep >= step ? 'bg-fuchsia-600 text-white' : 'bg-slate-800 text-slate-400'}`}
            >
              {currentStep > step ? <Check className="w-5 h-5" /> : step}
              {currentStep === step && (
                <motion.span className="absolute inset-0 rounded-full border-2 border-fuchsia-400" layoutId="outline" />
              )}
            </motion.button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <h1 className="font-bold text-white">محاكي اور جول</h1>
            <p className="text-xs text-slate-400">الخطوة {currentStep} من 3</p>
          </div>
          <div className="p-2 bg-slate-800 rounded-lg">
            <BarChart3 className="w-6 h-6 text-fuchsia-400" />
          </div>
        </div>
      </div>
    </div>
  </header>
);

const Footer = ({ currentStep, onStepChange }) => (
  <footer className="sticky bottom-0 bg-slate-950/70 backdrop-blur-xl border-t border-white/10 z-30">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
      <motion.button
        onClick={() => onStepChange(currentStep - 1)}
        disabled={currentStep === 1}
        whileHover={currentStep > 1 ? "hover" : ""} variants={buttonVariants}
        className="flex items-center gap-2 px-6 py-3 bg-slate-800 rounded-lg font-semibold transition-opacity disabled:opacity-50"
      >
        <ChevronRight className="w-5 h-5" />
        السابق
      </motion.button>
      
      <motion.button
        onClick={() => onStepChange(currentStep + 1)}
        disabled={currentStep === 3}
        whileHover={currentStep < 3 ? "hover" : ""} variants={buttonVariants}
        className="flex items-center gap-2 px-6 py-3 bg-fuchsia-600 rounded-lg font-semibold transition-opacity disabled:opacity-50"
      >
        التالي
        <ChevronLeft className="w-5 h-5" />
      </motion.button>
    </div>
  </footer>
);

const Step1Content = ({ settings, updateSetting, questionTypeOptions }) => (
  <motion.div key="step1" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
    <div className="text-center mb-10">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">اختر نمط التدريب</h2>
      <p className="text-slate-400 max-w-xl mx-auto">ابدأ بتحديد ما إذا كنت تريد تدريبًا شاملاً أم مركزًا على نوع معين من الأسئلة.</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <SelectionCard
        title="تدريب شامل"
        subtitle="اختبار متكامل يغطي جميع أنواع الأسئلة."
        icon={Layers}
        isSelected={settings.questionTypeFilter === 'all'}
        onClick={() => updateSetting('questionTypeFilter', 'all')}
      />
      <SelectionCard
        title="تدريب مُركز"
        subtitle="تركيز عالي على نوع محدد من الأسئلة."
        icon={Target}
        isSelected={settings.questionTypeFilter === 'specific'}
        onClick={() => updateSetting('questionTypeFilter', 'specific')}
      />
    </div>

    <AnimatePresence>
      {settings.questionTypeFilter === 'specific' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {questionTypeOptions.map(type => (
              <TypeCard 
                key={type.id}
                {...type}
                isSelected={settings.selectedQuestionType === type.id}
                onClick={() => updateSetting('selectedQuestionType', type.id)}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

const Step2Content = ({ settings, updateSetting, timerDurations }) => (
  <motion.div key="step2" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
    <div className="text-center mb-10">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">تخصيص الإعدادات</h2>
      <p className="text-slate-400 max-w-xl mx-auto">اختر نمط الاختبار والمؤقت الزمني الذي يناسب خطتك التدريبية.</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <h3 className="font-bold text-xl text-white flex items-center gap-2"><Shuffle className="text-fuchsia-400"/>نمط الاختبار</h3>
        <SelectionCard
          title="أقسام مع مراجعة"
          subtitle="الاختبار مقسم لأجزاء مع إمكانية مراجعة الإجابات."
          icon={Layers}
          isSelected={settings.examMode === 'sectioned'}
          onClick={() => updateSetting('examMode', 'sectioned')}
        />
        <SelectionCard
          title="متتالي ومجمع"
          subtitle="جميع الأسئلة في قسم واحد متواصل بدون توقف."
          icon={Zap}
          isSelected={settings.examMode === 'single'}
          onClick={() => updateSetting('examMode', 'single')}
        />
      </div>
      <div className="space-y-4">
        <h3 className="font-bold text-xl text-white flex items-center gap-2"><Timer className="text-fuchsia-400"/>المؤقت الزمني</h3>
        <SelectionCard
          title="بدون مؤقت"
          subtitle="وقت مفتوح للتركيز الكامل على حل الأسئلة."
          icon={Sparkles}
          isSelected={settings.timerMode === 'none'}
          onClick={() => updateSetting('timerMode', 'none')}
        />
        <SelectionCard
          title="مع مؤقت زمني"
          subtitle="تدريب واقعي يحاكي ظروف الاختبار الحقيقي."
          icon={Timer}
          isSelected={settings.timerMode === 'total'}
          onClick={() => updateSetting('timerMode', 'total')}
        >
          <AnimatePresence>
            {settings.timerMode === 'total' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex gap-2 mt-4"
              >
                {timerDurations.map(timer => (
                  <motion.button
                    key={timer.value}
                    onClick={(e) => { e.stopPropagation(); updateSetting('selectedTimerDuration', timer.value); }}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors w-full ${settings.selectedTimerDuration === timer.value ? 'bg-fuchsia-600 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
                  >
                    {timer.label}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </SelectionCard>
      </div>
    </div>
  </motion.div>
);

const Step3Content = ({ settings, questionTypeOptions, timerDurations, handleStartExam }) => {
  const { questionTypeFilter, selectedQuestionType, examMode, timerMode, selectedTimerDuration } = settings;
  const selectedType = questionTypeOptions.find(t => t.id === selectedQuestionType);
  const selectedTimer = timerDurations.find(t => t.value === selectedTimerDuration);

  const summary = [
    { icon: BarChart3, title: 'نمط التدريب', value: questionTypeFilter === 'all' ? 'شامل' : `مركز: ${selectedType?.title}` },
    { icon: Layers, title: 'نمط الاختبار', value: examMode === 'sectioned' ? 'أقسام ومراجعة' : 'متتالي' },
    { icon: Timer, title: 'المؤقت', value: timerMode === 'none' ? 'بدون مؤقت' : selectedTimer?.label },
  ];

  return (
    <motion.div key="step3" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
      <div className="text-center mb-10">
        <div className="inline-block p-4 bg-slate-800 rounded-2xl mb-4">
          <Rocket className="w-12 h-12 text-fuchsia-400" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">جاهز للانطلاق!</h2>
        <p className="text-slate-400 max-w-xl mx-auto">هذا هو ملخص إعداداتك. تأكد من كل شيء ثم ابدأ رحلتك.</p>
      </div>

      <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 mb-10">
        {summary.map(item => (
          <div key={item.title} className="flex items-center justify-between pb-4 border-b border-white/10 last:border-none last:pb-0">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-slate-800 rounded-lg"><item.icon className="w-5 h-5 text-fuchsia-400" /></div>
              <span className="font-semibold text-slate-300">{item.title}</span>
            </div>
            <span className="font-bold text-white text-lg">{item.value}</span>
          </div>
        ))}
      </div>

      <div className="text-center">
        <motion.button
          onClick={handleStartExam}
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 30px rgba(217, 70, 239, 0.4)" }}
          whileTap={{ scale: 0.98 }}
          className="px-12 py-4 bg-fuchsia-600 text-white text-xl font-bold rounded-xl shadow-lg shadow-fuchsia-600/20"
        >
          ابدأ الاختبار الآن
        </motion.button>
      </div>
    </motion.div>
  );
};

const SelectionCard = ({ title, subtitle, icon: Icon, isSelected, onClick, children }) => (
  <motion.div
    onClick={onClick}
    variants={cardVariants}
    whileHover="hover"
    animate={isSelected ? "selected" : ""}
    className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${isSelected ? 'border-fuchsia-500 bg-fuchsia-500/10' : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'}`}
  >
    <div className="flex items-start justify-between mb-3">
      <div className="p-3 bg-slate-800 rounded-lg">
        <Icon className={`w-6 h-6 transition-colors ${isSelected ? 'text-fuchsia-400' : 'text-slate-400'}`} />
      </div>
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-fuchsia-500 bg-fuchsia-500' : 'border-slate-600'}`}>
        {isSelected && <Check className="w-4 h-4 text-white" />}
      </div>
    </div>
    <h4 className="font-bold text-lg text-white">{title}</h4>
    <p className="text-slate-400 text-sm mb-2">{subtitle}</p>
    {children}
  </motion.div>
);

const TypeCard = ({ id, title, icon: Icon, color, isSelected, onClick }) => (
  <motion.button
    onClick={onClick}
    variants={itemVariants}
    className={`p-4 rounded-lg border-2 text-right w-full transition-all ${isSelected ? 'border-fuchsia-400 bg-fuchsia-500/10' : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'}`}
  >
    <div className="flex items-center justify-between">
      <div className={`p-2 rounded-md bg-gradient-to-br ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      {isSelected && <Check className="w-5 h-5 text-fuchsia-400" />}
    </div>
    <p className="font-bold text-white mt-3">{title}</p>
  </motion.button>
);

export default StartScreen;
