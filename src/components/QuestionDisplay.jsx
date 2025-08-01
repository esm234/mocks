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
  const [windowWidth, setWindowWidth] = useState(typeof window !== '' ? window.innerWidth : 1024);
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
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center" dir="rtl">
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
      {/* Header */}
      <div className="bg-[#2196F3] text-white">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-lg font-medium">
            أنت الآن في القسم {currentSection + 1}
          </div>
          
          <div className="flex items-center gap-4">
            {/* Timer */}
            {timerActive && (
              <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-lg">
                <Clock className="w-4 h-4" />
                <span className="font-medium">{formatTime(timeRemaining)}</span>
              </div>
            )}
            
            {/* Question Counter */}
            <div className="bg-white/20 px-3 py-1.5 rounded-lg">
              <span className="font-medium">
                {getDisplayQuestionNumber()} / {getTotalQuestionsDisplay()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            {/* Flag Button */}
            <button
              onClick={handleDeferToggle}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isDeferred 
                  ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300' 
                  : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:bg-gray-200'
              }`}
            >
              <Flag className={`w-4 h-4 ${isDeferred ? 'fill-current' : ''}`} />
              <span>تمييز</span>
            </button>

            {/* Folder Button */}
            <button
              onClick={() => setIsFolderDialogOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 border-2 border-gray-200 hover:bg-gray-200 transition-all"
            >
              <FolderPlus className="w-4 h-4" />
              <span>إضافة لمجلد</span>
            </button>

            {/* Section Review Button */}
            {shouldShowSectionReviewButton() && (
              <button
                onClick={handleSectionReview}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-purple-100 text-purple-700 border-2 border-purple-200 hover:bg-purple-200 transition-all"
              >
                <Eye className="w-4 h-4" />
                <span>مراجعة القسم</span>
              </button>
            )}
          </div>

          {/* Question Type Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg">
            {getQuestionTypeIcon(currentQuestion.type)}
            <span className="font-medium text-sm">{getQuestionTypeLabel(currentQuestion.type)}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        <div className="w-full max-w-7xl mx-auto flex gap-6 p-6">
          {/* Question and Choices Column */}
          <div className="flex-1 bg-white rounded-lg shadow-sm p-8">
            {/* Reading Passage */}
            {(currentQuestion.type === 'rc' || currentQuestion.type === 'reading') && currentQuestion.passage && (
              <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-gray-800 leading-relaxed whitespace-pre-line">
                  {currentQuestion.passage}
                </div>
              </div>
            )}

            {/* Question */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 text-center">
                {currentQuestion.type === 'error' ? 
                  renderHighlightedText(highlightChoiceWords(currentQuestion.question, currentQuestion.choices, currentQuestion.type)) :
                  currentQuestion.question
                }
              </h2>
            </div>

            {/* Choices */}
            <RadioGroup
              value={selectedAnswer?.toString()}
              onValueChange={(value) => handleAnswerSelect(parseInt(value))}
              className="space-y-4"
            >
              {currentQuestion.choices.map((choice, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedAnswer === index 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
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
                    className="flex-1 cursor-pointer text-lg text-gray-800"
                  >
                    {choice}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Instructions Column - Desktop Only */}
          {!isMobile && (
            <div className="w-96 bg-white rounded-lg shadow-sm p-8">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-red-600 mb-4">
                  {currentInstructions.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {currentInstructions.text}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="bg-[#2196F3] text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={!canGoPrevious()}
            className="flex items-center gap-2 px-6 py-2 bg-white/20 rounded-lg font-medium hover:bg-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
            <span>السابق</span>
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-all"
          >
            <span>التالي</span>
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Question to Folder Dialog */}
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
