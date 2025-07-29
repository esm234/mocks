import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronRight, 
  ChevronLeft, 
  Clock, 
  Flag, 
  BookOpen, 
  Target, 
  CheckCircle, 
  Home, 
  ZoomIn, 
  RotateCcw,
  Brain,
  Lightbulb,
  Star,
  Eye,
  ArrowRight,
  ArrowLeft,
  Timer,
  Award,
  Bookmark
} from 'lucide-react';
import { useExamStore } from '../store/examStore';

const QuestionDisplay = () => {
  const [isTextEnlarged, setIsTextEnlarged] = useState(false);
  const [isInstructionModalOpen, setIsInstructionModalOpen] = useState(false);

  const {
    examQuestions,
    currentQuestionIndex,
    currentSection,
    userAnswers,
    deferredQuestions,
    examMode,
    reviewMode,
    timerActive,
    timeRemaining,
    sectionReviewMode,
    hasSeenSectionReview,
    returnedFromSectionReview,
    reviewedSection,
    hideDeferButton,
    selectAnswer,
    toggleDeferred,
    nextQuestion,
    previousQuestion,
    getQuestionStats,
    getCurrentExamInfo,
    goToQuestion,
    setReviewMode,
    goToSectionReview
  } = useExamStore();

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }

      const currentQuestionNumber = currentQuestionIndex + 1;
      const isLastQuestionInSection = currentQuestionNumber % 13 === 0;
      
      let shouldShowDeferredButton = false;
      
      if (examMode === 'combined') {
        shouldShowDeferredButton = isLastQuestion && hasDeferredQuestionsInCurrentSection();
      } else {
        shouldShowDeferredButton = 
          (isLastQuestionInSection && !isLastQuestion && examMode === 'sectioned' && hasDeferredQuestionsInCurrentSection()) ||
          (isLastQuestion && hasDeferredQuestionsInCurrentSection());
      }

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          if (canProceed && !shouldShowDeferredButton) {
            handleNext();
          }
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (canGoPrevious()) {
            handlePrevious();
          }
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
  }, [currentQuestionIndex, examQuestions, deferredQuestions, examMode, currentSection]);

  const getDisplayQuestionNumber = () => {
    if (examMode === 'sectioned') {
      const questionInSection = (currentQuestionIndex % 13) + 1;
      return questionInSection;
    } else {
      return currentQuestionIndex + 1;
    }
  };

  const getTotalQuestionsDisplay = () => {
    if (examMode === 'sectioned') {
      return 13;
    } else {
      return examQuestions.length;
    }
  };

  const highlightChoiceWords = (questionText, choices, questionType) => {
    if (questionType !== 'error' || !choices || !questionText) {
      return questionText;
    }

    let highlightedText = questionText;
    
    const sortedChoices = [...choices].sort((a, b) => b.length - a.length);
    
    const removeDiacritics = (text) => {
      return text.replace(/[\u064B-\u0652\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]/g, "");
    };
    
    const normalizeHamza = (text) => {
      return text
        .replace(/[أإآ]/g, 'ا')
        .replace(/[ؤ]/g, 'و')
        .replace(/[ئ]/g, 'ي');
    };

    const getCoreWord = (word) => {
      let cleanedWord = word.replace(/[،,\.؛;:!؟?]/g, '');
      
      let core = normalizeHamza(removeDiacritics(cleanedWord));
      
      core = core.replace(/^و/, '');
      
      if (core.startsWith('بال')) {
        core = core.substring(3);
      }
      else if (core.startsWith('لال')) {
        core = core.substring(3);
      }
      else if (core.startsWith('ب')) {
        core = core.substring(1);
        if (core.startsWith('ال')) {
          core = core.substring(2);
        }
      }
      else if (core.startsWith('ل')) {
        core = core.substring(1);
        if (core.startsWith('ال')) {
          core = core.substring(2);
        }
      }
      else if (core.startsWith('ال')) {
        core = core.substring(2);
      }
      
      core = core.replace(/^(ف|ك|س)/, '');
      
      if (core.endsWith('وا')) {
        core = core.slice(0, -2) + 'و';
      }
      
      core = core.replace(/(ه|ها|هم|هن|ك|كم|كن|ي|نا|ون|ين|ات)$/, '');
      
      return core;
    };
    
    sortedChoices.forEach(choice => {
      if (choice && choice.trim()) {
        const trimmedChoice = choice.trim();
        
        const wordsInChoice = trimmedChoice.split(/[\s\(\)\[\]،,\.؛;:]+/).filter(word => word.length > 0);
        
        wordsInChoice.forEach(wordInChoice => {
          const coreWordInChoice = getCoreWord(wordInChoice);
          
          const wordsInQuestion = questionText.split(/\s+/);
          
          wordsInQuestion.forEach(wordInQuestion => {
            const coreWordInQuestion = getCoreWord(wordInQuestion);
            
            if (coreWordInQuestion === coreWordInChoice && coreWordInChoice.length > 0) {
              if (!highlightedText.includes(`<span style="color: red; font-weight: bold;">${wordInQuestion}</span>`)) {
                highlightedText = highlightedText.replace(wordInQuestion, `<span style="color: red; font-weight: bold;">${wordInQuestion}</span>`);
              }
            }
          });
        });
      }
    });

    return highlightedText;
  };

  const renderHighlightedText = (text) => {
    return <div dangerouslySetInnerHTML={{ __html: text }} />;
  };

  if (!examQuestions || examQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-[#eaf3fa] flex items-center justify-center" dir="rtl">
        <div className="text-center bg-white rounded-lg p-8 shadow-lg mx-4">
          <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Brain className="h-8 w-8 text-blue-600 animate-pulse" />
          </div>
          <div className="text-xl font-medium text-gray-900">جاري تحميل الأسئلة...</div>
          <div className="text-sm text-gray-600 mt-2">يرجى الانتظار</div>
        </div>
      </div>
    );
  }

  const currentQuestion = examQuestions[currentQuestionIndex];
  const selectedAnswer = userAnswers[currentQuestion.question_number];
  const isDeferred = deferredQuestions[currentQuestion.question_number];
  const isLastQuestion = currentQuestionIndex === examQuestions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const examInfo = getCurrentExamInfo();

  const canGoPrevious = () => {
    if (isFirstQuestion) return false;
    
    if (examMode !== 'sectioned') {
      return true;
    }

    const currentQuestionNumber = currentQuestionIndex + 1;
    const isFirstQuestionInSection = (currentQuestionNumber - 1) % 13 === 0;
    
    if (isFirstQuestionInSection && currentQuestionIndex > 0) {
      return false;
    }
    
    return true;
  };

  const canProceed = true;

  const hasDeferredQuestionsInCurrentSection = () => {
    const isLastQuestion = currentQuestionIndex === examQuestions.length - 1;

    if (isLastQuestion) {
        return examQuestions.some(q => deferredQuestions[q.question_number]);
    }
    return examQuestions
      .filter(q => q.section === currentSection)
      .some(q => deferredQuestions[q.question_number]);
  };
  
  const getFirstDeferredQuestionIndexInCurrentSection = () => {
    const isLastQuestion = currentQuestionIndex === examQuestions.length - 1;

    if (isLastQuestion) {
        for (let i = 0; i < examQuestions.length; i++) {
            const question = examQuestions[i];
            if (deferredQuestions[question.question_number]) {
                return i;
            }
        }
        return -1;
    }
    for (let i = 0; i < examQuestions.length; i++) {
      const question = examQuestions[i];
      if (question.section === currentSection && deferredQuestions[question.question_number]) {
        return i;
      }
    }
    return -1;
  };

  const handleAnswerSelect = (choiceIndex) => {
    selectAnswer(currentQuestion.question_number, choiceIndex);
  };

  const handleDeferToggle = () => {
    toggleDeferred(currentQuestion.question_number);
  };

  const handleNext = () => {
    const currentQuestionNumber = currentQuestionIndex + 1;
    const isLastQuestionInSection = currentQuestionNumber % 13 === 0;
    
    if (examMode === 'combined') {
      if (isLastQuestion && hasDeferredQuestionsInCurrentSection()) {
        const firstDeferredIndex = getFirstDeferredQuestionIndexInCurrentSection();
        if (firstDeferredIndex !== -1) {
          if (typeof goToQuestion === 'function') {
            goToQuestion(firstDeferredIndex);
          }
          return;
        }
      }
    } else {
      if (isLastQuestionInSection && !isLastQuestion && examMode === 'sectioned' && hasDeferredQuestionsInCurrentSection()) {
        const firstDeferredIndex = getFirstDeferredQuestionIndexInCurrentSection();
        if (firstDeferredIndex !== -1) {
          if (typeof goToQuestion === 'function') {
            goToQuestion(firstDeferredIndex);
          }
          return;
        }
      }
      
      if (isLastQuestion && hasDeferredQuestionsInCurrentSection()) {
        const firstDeferredIndex = getFirstDeferredQuestionIndexInCurrentSection();
        if (firstDeferredIndex !== -1) {
          if (typeof goToQuestion === 'function') {
            goToQuestion(firstDeferredIndex);
          }
          return;
        }
      }
    }
    
    nextQuestion();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevious = () => {
    if (examMode !== 'sectioned') {
      previousQuestion();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const currentQuestionNumber = currentQuestionIndex + 1;
    const isFirstQuestionInSection = (currentQuestionNumber - 1) % 13 === 0;
    
    if (isFirstQuestionInSection && currentQuestionIndex > 0) {
      return;
    }
    
    previousQuestion();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTextEnlarge = () => {
    setIsTextEnlarged(true);
  };

  const handleCloseEnlargedText = () => {
    setIsTextEnlarged(false);
  };

  const handleOpenInstructionModal = () => {
    setIsInstructionModalOpen(true);
  };

  const handleCloseInstructionModal = () => {
    setIsInstructionModalOpen(false);
  };

  const handleSectionReview = () => {
    goToSectionReview();
  };

  const shouldShowSectionReviewButton = () => {
    return examMode === 'sectioned' && (
      returnedFromSectionReview || 
      (hasDeferredQuestionsInCurrentSection() && hasSeenSectionReview)
    );
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getQuestionTypeLabel = (type) => {
    const labels = {
      'analogy': 'التناظر اللفظي',
      'completion': 'إكمال الجمل',
      'error': 'الخطأ السياقي',
      'rc': 'استيعاب المقروء',
      'reading': 'فهم المقروء',
      'odd': 'المفردة الشاذة'
    };
    return labels[type] || type;
  };

  const getQuestionTypeIcon = (type) => {
    const icons = {
      'analogy': <Target className="h-4 w-4" />,
      'completion': <Lightbulb className="h-4 w-4" />,
      'error': <Eye className="h-4 w-4" />,
      'rc': <BookOpen className="h-4 w-4" />,
      'reading': <BookOpen className="h-4 w-4" />,
      'odd': <Star className="h-4 w-4" />
    };
    return icons[type] || <Brain className="h-4 w-4" />;
  };

  // تعليمات حسب النوع
  const INSTRUCTIONS = {
    'analogy': {
      title: 'التناظر اللفظي',
      text: `في بداية كل سؤال مما يأتي، كلمتان ترتبطان بعلاقة معينة، تتبعهما أربعة أزواج من الكلمات، أحدها ترتبط فيه الكلمتان بعلاقة مشابهة للعلاقة بين الكلمتين في بداية السؤال. المطلوب هو: اختيار الإجابة الصحيحة
      
مثال: ساعة : وقت
أ- شمس : قمر ب - ميزان : ثقل
ج- ترمومتر : زكام د - صفر : محرم

الشرح: علاقة الساعة بالوقت مثل علاقة الميزان بالثقل. أي كما أن الساعة تقيس الوقت فإن الميزان يقيس الثقل، فالإجابة الصحيحة هي (ب). أما الاختيار (ج) فهو غير صحيح؛ لأن الترمومتر يقيس الحرارة الناتجة عن الزكام لا الزكام نفسه. أما الاختياران (أ) و (د) فليس فيهما علاقة مماثلة أو قريبة من علاقة الساعة بالوقت.`
    },
    'completion': {
      title: 'إكمال الجمل',
      text: 'تلي كل جملة من الجمل الآتية أربعة اختيارات، أحدها يكمل الفراغ أو الفراغات في الجملة إكمالاً صحيحاً. المطلوب هو: اختيار الإجابة الصحيحة'
    },
    'error': {
      title: 'الخطأ السياقي',
      text: 'في كل جملة مما يأتي أربع كلمات كل منها مكتوبة بخط غليظ. المطلوب هو: تحديد الكلمة التي لا يتفق معناها مع المعنى العام للجملة، (الخطأ ليس إملائياً ولا نحوياً)'
    },
    'rc': {
      title: 'استيعاب المقروء',
      text: 'السؤال التالي يتعلق بالنص المرفق، بعد السؤال هناك أربع اختيارات، واحد منها صحيح. المطلوب هو: قراءة النص بعناية، ثم اختيار الإجابة الصحيحة'
    },
    'reading': {
      title: 'استيعاب المقروء',
      text: 'السؤال التالي يتعلق بالنص المرفق، بعد السؤال هناك أربع اختيارات، واحد منها صحيح. المطلوب هو: قراءة النص بعناية، ثم اختيار الإجابة الصحيحة'
    },
    'odd': {
      title: 'المفردة الشاذة',
      text: 'في كل مجموعة من المجموعات الآتية أربع كلمات، ثلاث منها تنتمي إلى مجال واحد والرابعة مختلفة عنها. المطلوب هو: اختيار الكلمة المختلفة'
    }
  };

  const currentInstructions = INSTRUCTIONS[currentQuestion.type] || { title: '', text: '' };

  return (
    <div className="min-h-screen flex flex-col bg-[#2E74B5]" dir="rtl">
      {/* الشريط العلوي الأزرق */}
      <div className="bg-[#2E74B5] px-6 py-3 text-white">
        <div className="flex items-center justify-between">
          {/* معلومات الوقت والسؤال */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-lg font-bold">{formatTime(timeRemaining)}</span>
              <span className="text-sm">الوقت المتبقي</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">{getDisplayQuestionNumber()}</span>
              <span className="text-sm">من</span>
              <span className="text-lg font-bold">{getTotalQuestionsDisplay()}</span>
            </div>
            
            <div className="flex items-center border border-white/30 rounded px-3 py-1">
              <Bookmark className="w-4 h-4 ml-2" />
              <span className="text-sm bg-[#1A5B99] px-2 py-0.5 rounded text-center min-w-[2rem]">18</span>
              <span className="text-sm mr-2">تمييز السؤال للمراجعة</span>
            </div>
          </div>
          
          {/* عنوان الاختبار */}
          <div>
            <h1 className="text-xl font-bold">اختبار أكاديمية الحوت على الحاسب الآلي</h1>
          </div>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="flex flex-1">
        {/* العمود الأيمن - الأسئلة والخيارات */}
        <div className="w-1/2 bg-white p-8 flex flex-col justify-between min-h-[calc(100vh-64px)]">
          <div className="flex-1">
            {/* نص الاستيعاب للقراءة */}
            {(currentQuestion.type === 'rc' || currentQuestion.type === 'reading') && currentQuestion.passage && (
              <div className="text-right leading-relaxed text-lg mb-8 text-gray-800 font-medium">
                {currentQuestion.passage}
              </div>
            )}
            
            {/* السؤال */}
            <div className="text-right text-lg mb-8 text-gray-900 font-medium leading-relaxed">
              {currentQuestion.type === 'error' ? 
                renderHighlightedText(highlightChoiceWords(currentQuestion.question, currentQuestion.choices, currentQuestion.type)) :
                currentQuestion.question
              }
            </div>
            
            {/* الخيارات */}
            <div className="space-y-6">
              <RadioGroup
                value={selectedAnswer?.toString()}
                onValueChange={(value) => handleAnswerSelect(parseInt(value))}
                className="space-y-6"
              >
                {currentQuestion.choices.map((choice, index) => {
                  const choiceLabels = ['امرأة', 'طفل', 'تاجر', 'جبل'];
                  const choiceValues = ['نجلاء', 'يمين', 'بخيل', 'فواح', 'وعر'];
                  const displayText = currentQuestion.type === 'analogy' ? 
                    `${choiceLabels[index] || ''} : ${choiceValues[index] || choice}` : choice;
                    
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 cursor-pointer text-xl text-gray-900 font-medium"
                      onClick={() => handleAnswerSelect(index)}
                    >
                      <RadioGroupItem
                        value={index.toString()}
                        id={`choice-${index}`}
                        className="w-5 h-5 border-2 border-gray-400"
                      />
                      <Label
                        htmlFor={`choice-${index}`}
                        className="flex-1 cursor-pointer text-right leading-relaxed"
                      >
                        {displayText}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>
          </div>
        </div>

        {/* العمود الأيسر - التعليمات */}
        <div className="w-1/2 bg-[#F5F5F5] p-8 border-l-2 border-[#2E74B5]">
          <div className="text-right">
            <h2 className="text-3xl font-bold text-[#C41E3A] mb-8 leading-relaxed">
              {currentInstructions.title}
            </h2>
            <div className="text-gray-800 text-lg leading-relaxed whitespace-pre-line font-medium">
              {currentInstructions.text}
            </div>
          </div>
        </div>
      </div>

      {/* الشريط السفلي */}
      <div className="bg-[#2E74B5] text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className={`flex items-center gap-2 px-6 py-2 text-lg font-bold transition-opacity ${
                !canGoPrevious() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10 rounded-lg'
              }`}
              disabled={!canGoPrevious()}
              onClick={handlePrevious}
            >
              <ChevronRight className="w-5 h-5" />
              <span>التالي</span>
            </button>

            {canGoPrevious() && (
              <button
                className="flex items-center gap-2 px-6 py-2 text-lg font-bold hover:bg-white/10 rounded-lg transition-colors"
                onClick={handlePrevious}
              >
                <ChevronLeft className="w-5 h-5" />
                <span>السابق</span>
              </button>
            )}
          </div>

          {/* زر المعادلات في الوسط */}
          <div className="flex items-center gap-2 px-4 py-2 border border-white/30 rounded-lg">
            <span className="text-sm font-medium">المعادلات</span>
            <div className="w-5 h-5 border border-white rounded-full flex items-center justify-center">
              <span className="text-xs">؟</span>
            </div>
          </div>

          {/* زر التأجيل في الوسط يسار */}
          {!hideDeferButton && (
            <button
              onClick={handleDeferToggle}
              className={`px-6 py-2 rounded-lg font-bold border transition-all ${
                isDeferred
                  ? 'bg-yellow-500 text-black border-yellow-600 hover:bg-yellow-400'
                  : 'bg-white/20 text-white border-white/50 hover:bg-white/30'
              }`}
            >
              <Bookmark className="h-4 w-4 inline ml-2" />
              {isDeferred ? 'إلغاء التأجيل' : 'تأجيل'}
            </button>
          )}

          {/* زر مراجعة القسم */}
          {shouldShowSectionReviewButton() && (
            <button
              onClick={handleSectionReview}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg font-bold border border-purple-700 hover:bg-purple-700 transition-colors"
            >
              <Eye className="h-4 w-4 inline ml-2" />
              مراجعة القسم
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionDisplay;

