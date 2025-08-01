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
  Bookmark,
  FolderPlus
} from 'lucide-react';
import { useExamStore } from '../store/examStore';
import QuestionToFolderDialog from './QuestionToFolderDialog';

const QuestionDisplay = () => {
  const [isTextEnlarged, setIsTextEnlarged] = useState(false);
  const [isInstructionModalOpen, setIsInstructionModalOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);

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

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }

      const currentQuestionNumber = currentQuestionIndex + 1;
      const isLastQuestionInSection = currentQuestionNumber % 13 === 0;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          if (canProceed) {
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

  const handleAnswerSelect = (choiceIndex) => {
    selectAnswer(currentQuestion.question_number, choiceIndex);
  };

  const handleDeferToggle = () => {
    toggleDeferred(currentQuestion.question_number);
  };

  const handleNext = () => {
    const currentQuestionNumber = currentQuestionIndex + 1;
    const isLastQuestionInSection = currentQuestionNumber % 13 === 0;
    
    if (isLastQuestionInSection && !isLastQuestion && examMode === 'sectioned') {
      goToSectionReview();
      return;
    }
    
    if (isLastQuestion) {
      goToSectionReview();
      return;
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

  const INSTRUCTIONS = {
    'analogy': {
      title: 'التناظر اللفظي',
      text: 'في بداية كل سؤال مما يأتي، كلمتان ترتبطان بعلاقة معينة، تتبعهما أربعة أزواج من الكلمات، أحدها ترتبط فيه الكلمتان بعلاقة مشابهة للعلاقة بين الكلمتين في بداية السؤال. المطلوب هو: اختيار الإجابة الصحيحة'
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

  // Check if we're on mobile
  const isMobile = windowWidth <= 768;

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]" dir="rtl" key={currentQuestion.question_number}>
      {/* Header - Two parts */}
      <div className="flex flex-col">
        {/* Top header part */}
        <div className="flex items-center justify-between bg-[#1976d2] px-4 py-3">
          <div className="font-bold text-white text-lg">
            أنت الآن في القسم {currentSection + 1}
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-white text-base">
              السؤال {getDisplayQuestionNumber()} من {getTotalQuestionsDisplay()}
            </span>
            
            {timerActive && (
              <div className="text-white flex items-center gap-2 text-base">
                <Clock className="w-5 h-5" />
                <span>{formatTime(timeRemaining)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom header part */}
        <div className="bg-[#e3f2fd] px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                isDeferred 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
              onClick={handleDeferToggle}
              type="button"
            >
              <Flag className="w-4 h-4 inline ml-1" />
              تمييز السؤال
            </button>
            
            <button
              onClick={() => setIsFolderDialogOpen(true)}
              className="px-4 py-1.5 bg-white text-gray-700 rounded-full text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-all"
            >
              <FolderPlus className="w-4 h-4 inline ml-1" />
              إضافة لمجلد
            </button>
          </div>

          {!isMobile && (
            <select className="rounded px-3 py-1.5 text-gray-700 bg-white text-sm border border-gray-300">
              <option>خط عادي</option>
              <option>خط كبير</option>
            </select>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-row p-4 gap-4">
        {/* Questions column */}
        <div className={`${isMobile ? 'w-full' : 'w-1/2'} bg-white rounded-lg border border-gray-300 p-6`}>
          <div className="flex flex-col h-full">
            {/* Reading passage if exists */}
            {(currentQuestion.type === 'rc' || currentQuestion.type === 'reading') && currentQuestion.passage && (
              <div className="text-right leading-relaxed text-base mb-6 text-gray-800 border-b border-gray-200 pb-4">
                {currentQuestion.passage}
              </div>
            )}

            {/* Question */}
            <div className="text-xl font-bold text-gray-900 text-right mb-6">
              {currentQuestion.type === 'error' ? 
                renderHighlightedText(highlightChoiceWords(currentQuestion.question, currentQuestion.choices, currentQuestion.type)) :
                currentQuestion.question
              }
            </div>
            
            {/* Choices */}
            <div className="flex-1">
              <RadioGroup
                value={selectedAnswer?.toString()}
                onValueChange={(value) => handleAnswerSelect(parseInt(value))}
                className="space-y-3"
              >
                {currentQuestion.choices.map((choice, index) => (
                  <div
                    key={index}
                    className={`flex flex-row-reverse items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                      selectedAnswer === index 
                        ? 'bg-blue-50 border border-blue-300' 
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                    onClick={() => handleAnswerSelect(index)}
                  >
                    <RadioGroupItem
                      value={index.toString()}
                      id={`choice-${index}`}
                      className="text-blue-600"
                    />
                    <Label
                      htmlFor={`choice-${index}`}
                      className="flex-1 cursor-pointer text-gray-800 text-base"
                    >
                      {choice}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        </div>

        {/* Instructions column - desktop only */}
        {!isMobile && (
          <div className="w-1/2 bg-white rounded-lg border border-gray-300 p-6">
            <div className="flex flex-col h-full">
              <h2 className="text-2xl font-bold text-[#d32f2f] mb-4">
                ملاحظات
              </h2>
              
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {currentInstructions.title}
                </h3>
                <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
                  {currentInstructions.text}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer navigation */}
      <div className="bg-[#1976d2] text-white flex items-center justify-between px-6 py-3">
        <button
          className="flex items-center gap-2 text-base font-medium disabled:opacity-50 hover:bg-blue-700 px-4 py-2 rounded transition-all"
          disabled={!canGoPrevious()}
          onClick={handlePrevious}
        >
          <ChevronRight className="w-5 h-5" />
          السابق
        </button>

        {shouldShowSectionReviewButton() && (
          <button
            onClick={handleSectionReview}
            className="px-6 py-2 bg-purple-600 text-white rounded font-medium hover:bg-purple-700 transition-all"
          >
            <Eye className="w-4 h-4 inline ml-2" />
            مراجعة القسم
          </button>
        )}

        <button
          className="flex items-center gap-2 text-base font-medium hover:bg-blue-700 px-4 py-2 rounded transition-all"
          onClick={handleNext}
          disabled={!canProceed}
        >
          التالي
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Dialog for adding question to folder */}
      <QuestionToFolderDialog
        isOpen={isFolderDialogOpen}
        onClose={() => setIsFolderDialogOpen(false)}
        questionId={currentQuestion?.id}
        questionText={currentQuestion?.question}
      />
    </div>
  );
};

export default QuestionDisplay;
