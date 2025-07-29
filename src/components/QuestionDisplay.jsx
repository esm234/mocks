
import React, { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  Bookmark, 
  Eye,
  Brain,
  Target,
  Lightbulb,
  Star,
  BookOpen,
  Zap,
  Sparkles,
  Shield,
  Compass,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Settings,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { useExamStore } from '../store/examStore';

const QuestionDisplay = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const {
    examQuestions,
    currentQuestionIndex,
    currentSection,
    userAnswers,
    deferredQuestions,
    examMode,
    timerActive,
    timeRemaining,
    selectAnswer,
    toggleDeferred,
    nextQuestion,
    previousQuestion,
    goToSectionReview
  } = useExamStore();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          handleNext();
          break;
        case 'ArrowRight':
          event.preventDefault();
          handlePrevious();
          break;
        case '1':
        case '2':
        case '3':
        case '4':
          event.preventDefault();
          const choiceIndex = parseInt(event.key) - 1;
          if (currentQuestion && currentQuestion.choices && choiceIndex < currentQuestion.choices.length) {
            handleAnswerSelect(choiceIndex);
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentQuestionIndex]);

  if (!examQuestions || examQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-spin"></div>
            <div className="absolute inset-2 bg-gray-900 rounded-full flex items-center justify-center">
              <Brain className="h-12 w-12 text-blue-400 animate-pulse" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">جاري تحميل الأسئلة...</h2>
          <p className="text-gray-400">تهيئة البيئة التفاعلية للاختبار</p>
        </div>
      </div>
    );
  }

  const currentQuestion = examQuestions[currentQuestionIndex];
  const selectedAnswer = userAnswers[currentQuestion.question_number];
  const isDeferred = deferredQuestions[currentQuestion.question_number];
  const isLastQuestion = currentQuestionIndex === examQuestions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  const getDisplayQuestionNumber = () => {
    if (examMode === 'sectioned') {
      return (currentQuestionIndex % 13) + 1;
    }
    return currentQuestionIndex + 1;
  };

  const getTotalQuestionsDisplay = () => {
    return examMode === 'sectioned' ? 13 : examQuestions.length;
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getQuestionTypeIcon = (type) => {
    const icons = {
      analogy: Brain,
      completion: Sparkles,
      error: Target,
      rc: Eye,
      reading: BookOpen,
      odd: Star
    };
    return icons[type] || Brain;
  };

  const getQuestionTypeStyle = (type) => {
    const styles = {
      analogy: 'from-violet-500 to-purple-600',
      completion: 'from-emerald-500 to-teal-600',
      error: 'from-rose-500 to-pink-600',
      rc: 'from-amber-500 to-orange-600',
      reading: 'from-amber-500 to-orange-600',
      odd: 'from-cyan-500 to-blue-600'
    };
    return styles[type] || 'from-gray-500 to-gray-600';
  };

  const getQuestionTypeLabel = (type) => {
    const labels = {
      analogy: 'التناظر اللفظي',
      completion: 'إكمال الجمل',
      error: 'الخطأ السياقي',
      rc: 'استيعاب المقروء',
      reading: 'استيعاب المقروء',
      odd: 'المفردة الشاذة'
    };
    return labels[type] || type;
  };

  const INSTRUCTIONS = {
    analogy: {
      title: 'التناظر اللفظي',
      subtitle: 'العلاقات والمقارنات',
      text: 'في بداية كل سؤال كلمتان ترتبطان بعلاقة معينة، تتبعهما أربعة أزواج من الكلمات. المطلوب: اختيار الزوج الذي يحمل نفس العلاقة.',
      example: 'مثال: قلم : كتابة\nأ- مطرقة : بناء  ب- سيارة : نقل\nج- كتاب : قراءة  د- ماء : عطش',
      tips: '💡 ابحث عن العلاقة الأساسية بين الكلمتين الأوليين\n💡 طبق نفس العلاقة على الخيارات'
    },
    completion: {
      title: 'إكمال الجمل',
      subtitle: 'ملء الفراغات بدقة',
      text: 'تحتوي كل جملة على فراغ أو أكثر، وعليك اختيار الكلمة أو العبارة المناسبة.',
      example: 'مثال: العلم _____ والجهل ظلام.\nأ- صعب  ب- نور  ج- مفيد  د- ضروري',
      tips: '💡 اقرأ الجملة كاملة مع كل خيار\n💡 اختر ما يجعل المعنى منطقياً ومتماسكاً'
    },
    error: {
      title: 'الخطأ السياقي',
      subtitle: 'تحديد الكلمة الشاذة',
      text: 'في كل جملة أربع كلمات مميزة، واحدة منها لا تتناسب مع السياق العام.',
      example: 'مثال: الطالب المجتهد يحقق النجاح في دراسته الصعبة.\n(الخطأ: الصعبة - يجب أن تكون الطويلة)',
      tips: '💡 ركز على المعنى العام للجملة\n💡 ابحث عن الكلمة التي تخل بالمعنى'
    },
    rc: {
      title: 'استيعاب المقروء',
      subtitle: 'فهم النصوص والمعاني',
      text: 'اقرأ النص بعناية ثم أجب عن الأسئلة بناءً على فهمك للمحتوى.',
      example: 'اقرأ النص أولاً، ثم انتقل للسؤال. ركز على الفكرة الأساسية والتفاصيل المهمة.',
      tips: '💡 اقرأ النص مرتين على الأقل\n💡 ابحث عن الإجابة داخل النص'
    },
    reading: {
      title: 'استيعاب المقروء',
      subtitle: 'فهم النصوص والمعاني',
      text: 'اقرأ النص بعناية ثم أجب عن الأسئلة بناءً على فهمك للمحتوى.',
      example: 'اقرأ النص أولاً، ثم انتقل للسؤال. ركز على الفكرة الأساسية والتفاصيل المهمة.',
      tips: '💡 اقرأ النص مرتين على الأقل\n💡 ابحث عن الإجابة داخل النص'
    },
    odd: {
      title: 'المفردة الشاذة',
      subtitle: 'تحديد الكلمة المختلفة',
      text: 'من بين أربع كلمات، ثلاث تنتمي لمجال واحد والرابعة مختلفة.',
      example: 'مثال: تفاح - برتقال - موز - طاولة\n(الإجابة: طاولة - لأنها ليست فاكهة)',
      tips: '💡 ابحث عن الخيط المشترك بين الكلمات\n💡 حدد الكلمة التي لا تنتمي للمجموعة'
    }
  };

  const currentInstructions = INSTRUCTIONS[currentQuestion.type] || INSTRUCTIONS.analogy;
  const TypeIcon = getQuestionTypeIcon(currentQuestion.type);
  const typeStyle = getQuestionTypeStyle(currentQuestion.type);

  const handleAnswerSelect = (choiceIndex) => {
    setIsAnimating(true);
    selectAnswer(currentQuestion.question_number, choiceIndex);
    setTimeout(() => setIsAnimating(false), 200);
  };

  const handleDeferToggle = () => {
    toggleDeferred(currentQuestion.question_number);
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setIsAnimating(true);
      setTimeout(() => {
        nextQuestion();
        setIsAnimating(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 200);
    }
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setIsAnimating(true);
      setTimeout(() => {
        previousQuestion();
        setIsAnimating(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 200);
    }
  };

  const highlightChoiceWords = (questionText, choices, questionType) => {
    if (questionType !== 'error' || !choices || !questionText) {
      return questionText;
    }

    let highlightedText = questionText;
    
    choices.forEach(choice => {
      if (choice && choice.trim()) {
        const words = choice.trim().split(/\s+/);
        words.forEach(word => {
          if (word.length > 2) {
            const regex = new RegExp(`\\b${word}\\b`, 'g');
            if (highlightedText.match(regex)) {
              highlightedText = highlightedText.replace(regex, `<span class="bg-red-200 text-red-800 font-bold px-1 rounded">${word}</span>`);
            }
          }
        });
      }
    });

    return highlightedText;
  };

  const renderHighlightedText = (text) => {
    return <div dangerouslySetInnerHTML={{ __html: text }} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 text-white overflow-hidden relative" dir="rtl">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-r from-emerald-600/8 to-cyan-600/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-amber-600/6 to-rose-600/6 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10">
        {/* Header with Dynamic Progress */}
        <div className="sticky top-0 bg-black/40 backdrop-blur-xl border-b border-gray-700/50 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className={`p-3 bg-gradient-to-r ${typeStyle} rounded-xl shadow-lg`}>
                  <TypeIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className={`text-xl font-bold bg-gradient-to-r ${typeStyle.replace('from-', 'from-').replace('to-', 'to-')} bg-clip-text text-transparent`}>
                    محاكي قياس التفاعلي
                  </h1>
                  <p className="text-sm text-gray-400">
                    {getQuestionTypeLabel(currentQuestion.type)} - السؤال {getDisplayQuestionNumber()} من {getTotalQuestionsDisplay()}
                  </p>
                </div>
              </div>
              
              {/* Timer and Tools */}
              <div className="flex items-center gap-4">
                {timerActive && (
                  <div className="flex items-center gap-2 bg-red-900/30 border border-red-500/30 rounded-full px-4 py-2">
                    <Clock className="h-5 w-5 text-red-400 animate-pulse" />
                    <span className="text-red-300 font-bold font-mono">
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                )}

                <Button
                  onClick={handleDeferToggle}
                  variant="ghost"
                  className={`flex items-center gap-2 transition-all duration-300 ${
                    isDeferred 
                      ? 'bg-yellow-600/30 border border-yellow-500/30 text-yellow-300' 
                      : 'bg-gray-700/30 border border-gray-600/30 text-gray-300 hover:bg-gray-600/30'
                  }`}
                >
                  <Bookmark className={`h-4 w-4 ${isDeferred ? 'fill-current' : ''}`} />
                  <span className="text-sm">
                    {isDeferred ? 'مؤجل' : 'تأجيل'}
                  </span>
                </Button>

                <Button
                  onClick={() => setShowHint(!showHint)}
                  variant="ghost"
                  className="bg-blue-700/30 border border-blue-600/30 text-blue-300 hover:bg-blue-600/30"
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4 w-full bg-gray-700/50 rounded-full h-2">
              <div 
                className={`h-2 bg-gradient-to-r ${typeStyle} rounded-full transition-all duration-500 ease-out shadow-lg`}
                style={{ width: `${(getDisplayQuestionNumber() / getTotalQuestionsDisplay()) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 min-h-[calc(100vh-120px)]">
          {/* Question Section */}
          <div className={`w-1/2 p-8 transition-all duration-500 ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-8 h-full backdrop-blur-lg">
              {/* Reading Passage */}
              {(currentQuestion.type === 'rc' || currentQuestion.type === 'reading') && currentQuestion.passage && (
                <div className="mb-8 p-6 bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-700/30 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <BookOpen className="h-5 w-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-blue-300">النص</h3>
                  </div>
                  <div className="text-gray-200 leading-relaxed">
                    {currentQuestion.passage}
                  </div>
                </div>
              )}
              
              {/* Question */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 bg-gradient-to-r ${typeStyle} rounded-lg`}>
                    <TypeIcon className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-200">
                    السؤال {getDisplayQuestionNumber()}
                  </h2>
                </div>
                <div className="text-xl text-white leading-relaxed bg-gradient-to-br from-gray-700/30 to-gray-800/30 border border-gray-600/30 rounded-xl p-6">
                  {currentQuestion.type === 'error' ? 
                    renderHighlightedText(highlightChoiceWords(currentQuestion.question, currentQuestion.choices, currentQuestion.type)) :
                    currentQuestion.question
                  }
                </div>
              </div>
              
              {/* Answer Choices */}
              <div className="space-y-4">
                <RadioGroup
                  value={selectedAnswer?.toString()}
                  onValueChange={(value) => handleAnswerSelect(parseInt(value))}
                  className="space-y-4"
                >
                  {currentQuestion.choices.map((choice, index) => {
                    const isSelected = selectedAnswer === index;
                    return (
                      <div
                        key={index}
                        className={`group relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                          isSelected
                            ? `border-emerald-400 bg-gradient-to-r from-emerald-900/30 to-teal-900/30 shadow-lg shadow-emerald-500/25`
                            : 'border-gray-600 bg-gradient-to-r from-gray-800/30 to-gray-900/30 hover:border-gray-500 hover:shadow-lg'
                        }`}
                        onClick={() => handleAnswerSelect(index)}
                      >
                        <div className="flex items-center gap-4">
                          <RadioGroupItem
                            value={index.toString()}
                            id={`choice-${index}`}
                            className={`w-5 h-5 ${isSelected ? 'text-emerald-400 border-emerald-400' : 'border-gray-400'}`}
                          />
                          <Label
                            htmlFor={`choice-${index}`}
                            className={`flex-1 cursor-pointer text-lg leading-relaxed ${
                              isSelected ? 'text-emerald-100' : 'text-gray-200'
                            }`}
                          >
                            {choice}
                          </Label>
                        </div>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Instructions Section */}
          <div className="w-1/2 p-8">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-8 h-full backdrop-blur-lg">
              <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${typeStyle} mb-4 shadow-lg`}>
                  <TypeIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className={`text-2xl font-bold bg-gradient-to-r ${typeStyle} bg-clip-text text-transparent mb-2`}>
                  {currentInstructions.title}
                </h3>
                <p className="text-gray-400">{currentInstructions.subtitle}</p>
              </div>

              <div className="space-y-6">
                {/* Instructions */}
                <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-700/30 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-blue-300 mb-3">التعليمات</h4>
                  <p className="text-gray-200 leading-relaxed">
                    {currentInstructions.text}
                  </p>
                </div>

                {/* Example */}
                {currentInstructions.example && (
                  <div className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border border-emerald-700/30 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-emerald-300 mb-3">مثال</h4>
                    <pre className="text-gray-200 leading-relaxed whitespace-pre-line">
                      {currentInstructions.example}
                    </pre>
                  </div>
                )}

                {/* Tips */}
                {currentInstructions.tips && (
                  <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 border border-amber-700/30 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-amber-300 mb-3">نصائح مفيدة</h4>
                    <pre className="text-gray-200 leading-relaxed whitespace-pre-line">
                      {currentInstructions.tips}
                    </pre>
                  </div>
                )}

                {/* Hint Section */}
                {showHint && (
                  <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-xl p-6 animate-in slide-in-from-bottom-4 duration-300">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="h-5 w-5 text-purple-400" />
                      <h4 className="text-lg font-semibold text-purple-300">تلميح ذكي</h4>
                    </div>
                    <p className="text-purple-100">
                      {currentQuestion.type === 'analogy' && "ركز على نوع العلاقة بين الكلمتين الأوليين"}
                      {currentQuestion.type === 'completion' && "اقرأ الجملة مع كل خيار لتجد المعنى المنطقي"}
                      {currentQuestion.type === 'error' && "ابحث عن الكلمة التي تبدو غريبة في السياق"}
                      {(currentQuestion.type === 'rc' || currentQuestion.type === 'reading') && "الإجابة موجودة في النص، لا تعتمد على معرفتك الخارجية"}
                      {currentQuestion.type === 'odd' && "فكر في التصنيف المشترك للكلمات الثلاث"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="sticky bottom-0 bg-black/40 backdrop-blur-xl border-t border-gray-700/50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <Button
                onClick={handlePrevious}
                disabled={isFirstQuestion}
                size="lg"
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isFirstQuestion 
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
                }`}
              >
                <ChevronRight className="h-5 w-5" />
                السؤال السابق
              </Button>

              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {getDisplayQuestionNumber()}/{getTotalQuestionsDisplay()}
                  </div>
                  <div className="text-xs text-gray-400">تقدم الاختبار</div>
                </div>
              </div>

              <Button
                onClick={handleNext}
                disabled={isLastQuestion}
                size="lg"
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isLastQuestion 
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                    : `bg-gradient-to-r ${typeStyle} text-white shadow-lg hover:shadow-xl hover:scale-105`
                }`}
              >
                السؤال التالي
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDisplay;

