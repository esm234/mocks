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
  FolderPlus,
  Calculator
} from 'lucide-react';
import { useExamStore } from '../store/examStore';
import QuestionToFolderDialog from './QuestionToFolderDialog';

const QuestionDisplay = () => {
  const [isTextEnlarged, setIsTextEnlarged] = useState(false);
  const [isInstructionModalOpen, setIsInstructionModalOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
  const [tempSelectedAnswer, setTempSelectedAnswer] = useState(null);
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  const [hasAnsweredLastQuestionInSection, setHasAnsweredLastQuestionInSection] = useState(false);

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
    sectionTimeRemaining,
    sectionReviewMode,
    hasSeenSectionReview,
    returnedFromSectionReview,
    reviewedSection,
    hideDeferButton,
    questionTypeFilter,
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

  // Check if mobile and show warning - منع كامل للهواتف
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth <= 768;
      const isMobileUserAgent = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isTablet = /iPad/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // منع الهواتف فقط (وليس التابلت) بناءً على نوع الجهاز وحجم الشاشة
      if ((isMobile && isMobileUserAgent && !isTablet) || (isMobile && window.innerHeight > window.innerWidth && isMobileUserAgent)) {
        setShowMobileWarning(true);
      }
    }
  }, [windowWidth]);

  // تهيئة الإجابة المؤقتة عند تغيير السؤال
  useEffect(() => {
    if (examQuestions && examQuestions.length > 0 && currentQuestionIndex < examQuestions.length) {
      const currentQuestion = examQuestions[currentQuestionIndex];
      const currentAnswer = userAnswers[currentQuestion?.question_number];
      setTempSelectedAnswer(currentAnswer !== undefined ? currentAnswer : null);
    }
  }, [currentQuestionIndex, examQuestions, userAnswers]);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }

      const currentQuestionNumber = currentQuestionIndex + 1;
      const isLastQuestionInSection = currentQuestionNumber % questionsPerSection === 0;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          if (canProceed) { // Assuming canProceed is always true for next
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
  }, [currentQuestionIndex, examQuestions, deferredQuestions, examMode, currentSection]); // Added dependencies for handleNext/handlePrevious

  const getDisplayQuestionNumber = () => {
    if (examMode === 'sectioned') {
      const questionInSection = (currentQuestionIndex % questionsPerSection) + 1;
      return questionInSection;
    } else {
      return currentQuestionIndex + 1;
    }
  };

  const getTotalQuestionsDisplay = () => {
    if (examMode === 'sectioned') {
      return questionsPerSection; // Dynamic based on training type
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
                highlightedText = highlightedText.replace(new RegExp(`\\b${wordInQuestion}\\b`, 'g'), `<span style="color: red; font-weight: bold;">${wordInQuestion}</span>`);
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
  const selectedAnswer = tempSelectedAnswer; // استخدام الإجابة المؤقتة
  const isDeferred = deferredQuestions[currentQuestion.question_number];
  const isLastQuestion = currentQuestionIndex === examQuestions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const examInfo = getCurrentExamInfo();
  
  // حساب القسم الحالي بناءً على فهرس السؤال الحالي (ثابت)
  const questionsPerSection = questionTypeFilter === 'specific' ? 13 : 24; // 13 for focused training, 24 for comprehensive
  const actualCurrentSection = Math.floor(currentQuestionIndex / questionsPerSection) + 1;
  
  // Debug logging
  useEffect(() => {
    console.log('Current question:', currentQuestion);
    console.log('Question type:', currentQuestion?.type);
    console.log('Question image:', currentQuestion?.image);
  }, [currentQuestion]);

  // إعادة تعيين الحالة عند تغيير القسم فقط
  useEffect(() => {
    setHasAnsweredLastQuestionInSection(false);
  }, [actualCurrentSection]);

  const canGoPrevious = () => {
    if (isFirstQuestion) return false;

    if (examMode !== 'sectioned') {
      return true;
    }

    // في الوضع المقسم، السماح بالتنقل فقط داخل نفس القسم
    const currentQuestionNumber = currentQuestionIndex + 1;
    const questionInSection = (currentQuestionNumber - 1) % questionsPerSection + 1;
    
    // السماح بالتنقل للخلف فقط إذا لم نكن في السؤال الأول من القسم
    return questionInSection > 1;
  };

  const canProceed = true; // This is always true, as next/section review logic handles progression

  // التحقق من إكمال القسم الحالي (عدد متغير من الأسئلة)
  const isCurrentSectionCompleted = () => {
    if (examMode !== 'sectioned') return true;
    
    const sectionStartIndex = (currentSection - 1) * questionsPerSection;
    const sectionEndIndex = Math.min(sectionStartIndex + questionsPerSection, examQuestions.length);
    
    // التحقق من أن جميع الأسئلة في القسم تمت الإجابة عليها
    for (let i = sectionStartIndex; i < sectionEndIndex; i++) {
      if (examQuestions[i] && userAnswers[examQuestions[i].question_number] === undefined) {
        return false;
      }
    }
    return true;
  };

  // التحقق من الوصول لآخر سؤال في القسم الحالي
  const hasReachedQuestion24 = () => {
    if (examMode !== 'sectioned') return false;
    
    const currentQuestionNumber = currentQuestionIndex + 1;
    const questionInSection = (currentQuestionNumber - 1) % questionsPerSection + 1;
    
    return questionInSection >= questionsPerSection;
  };

  // التحقق من إجابة آخر سؤال في القسم الحالي
  const hasAnsweredQuestion24 = () => {
    if (examMode !== 'sectioned') return false;
    
    const sectionStartIndex = (actualCurrentSection - 1) * questionsPerSection;
    const question24Index = sectionStartIndex + questionsPerSection - 1; // آخر سؤال في القسم
    
    if (question24Index >= examQuestions.length) return false;
    
    const question24Number = examQuestions[question24Index]?.question_number;
    return question24Number && userAnswers[question24Number] !== undefined;
  };

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
    setTempSelectedAnswer(choiceIndex);
  };

  const handleDeferToggle = () => {
    toggleDeferred(currentQuestion.question_number);
  };

  // الدالة المُحدثة لمعالجة الانتقال للسؤال التالي
  const handleNext = () => {
    // حفظ الإجابة المؤقتة إذا كانت موجودة
    if (tempSelectedAnswer !== null) {
      selectAnswer(currentQuestion.question_number, tempSelectedAnswer);
    }
    
    const currentQuestionNumber = currentQuestionIndex + 1;
    const questionInSection = (currentQuestionNumber - 1) % questionsPerSection + 1;
    const isLastQuestionInSection = questionInSection === questionsPerSection;
    const isLastQuestion = currentQuestionIndex === examQuestions.length - 1;

    // إذا كنا في آخر سؤال في القسم، لا ننتقل للقسم التالي
    if (isLastQuestionInSection && !isLastQuestion) {
      console.log('آخر سؤال في القسم - لا يمكن الانتقال');
      return;
    }

    // إذا كنا في آخر سؤال في الامتحان، لا ننتقل
    if (isLastQuestion) {
      console.log('آخر سؤال في الاختبار - لا يمكن الانتقال');
      return;
    }

    // في الحالات العادية، متابعة للسؤال التالي في نفس القسم
    nextQuestion();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevious = () => {
    if (!canGoPrevious()) {
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
    if (examMode !== 'sectioned') return false;
    
    const currentQuestionNumber = currentQuestionIndex + 1;
    const isLastQuestionInSection = currentQuestionNumber % 24 === 0;
    const isLastQuestionOfExam = currentQuestionIndex === examQuestions.length - 1;

    // Show on the last question of a section or the entire exam
    if (isLastQuestionInSection || isLastQuestionOfExam) {
        return true;
    }
    
    // Show if returning from section review
    if (returnedFromSectionReview) {
        return true;
    }

    // Show if there are deferred questions and the user has already seen the review page once
    if (hasDeferredQuestionsInCurrentSection() && hasSeenSectionReview) {
        return true;
    }

    return false;
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
      'odd': 'المفردة الشاذة',
      'quantitative': 'الأسئلة الكمية'
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
      'odd': <Star className="h-4 w-4" />,
      'quantitative': <Calculator className="h-4 w-4" />
    };
    return icons[type] || <Brain className="h-4 w-4" />;
  };

  // تعليمات حسب النوع
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
    },
    'quantitative': {
      title: 'الأسئلة الكمية',
      text: 'السؤال التالي يتعلق بالرياضيات والحساب. بعد السؤال هناك أربع اختيارات (أ، ب، ج، د)، واحد منها صحيح. المطلوب هو: حل المسألة بعناية، ثم اختيار الإجابة الصحيحة'
    }
  };

  const currentInstructions = INSTRUCTIONS[currentQuestion.type] || { title: '', text: '' };

  // Check if we're on mobile
  const isMobile = windowWidth <= 768;
  
  // Check if we're on tablet
  const isTablet = windowWidth > 768 && windowWidth <= 1024;
  
  // Check if we're on tablet in landscape mode
  const isTabletLandscape = isTablet && window.innerHeight < window.innerWidth;

  // حماية إضافية - منع كامل للهواتف (وليس التابلت)
  const isMobileDevice = typeof window !== 'undefined' && (
    (window.innerWidth <= 768 && /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && !/iPad/i.test(navigator.userAgent)) ||
    (window.innerWidth <= 768 && window.innerHeight > window.innerWidth && /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
  );

  // Mobile warning modal - منع كامل للهواتف
  if (showMobileWarning || isMobileDevice) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center border-2 border-red-200">
          <div className="mb-6">
            <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Brain className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-red-800 mb-2">غير مسموح بالوصول من الهاتف</h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              <span className="font-bold text-red-600">لا يمكن إجراء الاختبار من الهاتف المحمول.</span>
              <br />
              يرجى استخدام اللابتوب أو التابلت للحصول على تجربة اختبار مناسبة.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-yellow-800 text-xs font-medium">
                💡 نصائح: تأكد من استخدام جهاز كمبيوتر أو تابلت مع شاشة كافية لقراءة الأسئلة بوضوح
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => window.close()}
              className="w-full bg-red-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              إغلاق الصفحة
            </button>
            <button
              onClick={() => {
                // عمل refresh للصفحة
                window.location.reload();
              }}
              className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              العودة للصفحة الرئيسية
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative" style={{backgroundColor: '#F7F5F8'}} dir="rtl" key={currentQuestion.question_number}>
      {/* Watermark - أرقام مائلة في جميع أنحاء الصفحة - مخفية على الجوال */}
      <div className="absolute inset-0 pointer-events-none z-0 hidden md:block">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="absolute text-gray-400 font-mono font-bold text-lg"
            style={{
              left: `${(i * 15) % 90 + 5}%`,
              top: `${(i * 12) % 90 + 5}%`,
              transform: `rotate(15deg)`,
              opacity: 0.3
            }}
          >
            1395565256
          </div>
        ))}
      </div>

      {/* الشريط العلوي */}
      <div className="px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between relative z-10" style={{backgroundColor: '#068479'}}>
        <div className="text-white font-bold text-sm sm:text-lg">اختبار</div>
        <div className="text-white font-bold text-sm sm:text-lg">OUR GOAL</div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className={`flex-1 flex flex-col lg:flex-row pb-4 sm:pb-8 relative z-10 ${isTablet ? 'tablet-layout overflow-x-hidden max-w-full' : ''}`}>
         {/* العمود الأيسر - محتوى السؤال */}
         <div className="flex-1 flex flex-col lg:mr-4">
           {/* شريط المعلومات */}
           <div className="px-2 sm:px-4 py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between border-2 border-gray-300" style={{backgroundColor: '#DDE7F7'}}>
             <div className="text-gray-700 text-xs sm:text-sm font-bold mb-1 sm:mb-0">
               {examQuestions.length} مجموع الأسئلة في الاختبار | الاسئلة المحلولة <span style={{color: '#068479', fontWeight: 'bold'}}>{Object.keys(userAnswers).length}</span>
             </div>
             <div className="flex items-center gap-2">
               <button
                 onClick={() => setIsFolderDialogOpen(true)}
                 className="flex items-center gap-1 px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-medium transition-all active:scale-95"
                 title="إضافة السؤال الحالي لمجلد"
               >
                 <FolderPlus className="h-3 w-3" />
                 <span className="hidden sm:inline">إضافة لمجلد</span>
               </button>
               {/* تم نقل أزرار تغيير الخط إلى عمود الأسئلة */}
             </div>
           </div>

            {/* محتوى السؤال - تخطيط مرن */}
            <div className="flex-1 flex flex-col pt-4 sm:pt-8">
              {/* النص المقروء (إذا كان موجود) - ارتفاع ثابت */}
              {(currentQuestion.type === 'rc' || currentQuestion.type === 'reading') && currentQuestion.passage && (
                <div className="bg-gray-50 border-2 border-gray-300 mb-4" style={{height: isTablet ? '150px' : '200px', minHeight: isTablet ? '150px' : '200px'}}>
                  <div className="text-lg sm:text-2xl font-bold text-gray-900 p-4 text-right">النص المقروء</div>
                  <div className={`text-gray-700 text-right leading-relaxed overflow-y-auto p-4 ${isTextEnlarged ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`} style={{height: 'calc(100% - 60px)'}}>
                    {currentQuestion.passage}
                  </div>
                </div>
              )}

              {/* السؤال والخيارات - ارتفاع مرن */}
              <div className={`border-2 border-gray-300 flex-1 flex flex-col ${isTablet ? 'tablet-height overflow-x-hidden' : ''}`}>
                <div className={`p-4 sm:p-8 flex-1 flex flex-col ${isTablet ? 'tablet-spacing overflow-x-hidden' : ''}`}>
                   {/* أزرار تغيير الخط والصورة للأسئلة الكمية */}
                   <div className={`flex items-start mb-4 sm:mb-6 ${currentQuestion.type === 'quantitative' && currentQuestion.image ? 'justify-between' : 'justify-end'}`}>
                      {/* عرض الصورة للأسئلة الكمية */}
                      {currentQuestion.type === 'quantitative' && currentQuestion.image && (
                        <div className="flex-1 flex justify-start">
                          <img 
                            src={currentQuestion.image} 
                            alt={`سؤال ${currentQuestion.question_number}`}
                            className="h-auto rounded-lg shadow-lg border-2 border-gray-300"
                            style={{ maxHeight: '350px', width: '800px', maxWidth: '100%' }}
                            onLoad={() => console.log('Image loaded successfully:', currentQuestion.image)}
                            onError={(e) => {
                              console.error(`فشل في تحميل الصورة: ${currentQuestion.image}`, e);
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    
                    {/* أزرار تغيير الخط */}
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button 
                        className={`px-3 sm:px-4 py-2 border-2 rounded text-xs sm:text-sm font-bold text-white active:scale-95 transition-transform min-h-[44px] sm:min-h-0 ${
                          isTextEnlarged ? 'bg-yellow-400 border-yellow-500' : 'border-gray-300'
                        }`}
                        style={{backgroundColor: isTextEnlarged ? '#fbbf24' : '#3f9dc3'}}
                        onClick={handleTextEnlarge}
                      >+A</button>
                      <button 
                        className="px-3 sm:px-4 py-2 border border-gray-300 rounded text-xs sm:text-sm text-white active:scale-95 transition-transform min-h-[44px] sm:min-h-0"
                        style={{backgroundColor: '#3f9dc3'}}
                        onClick={handleCloseEnlargedText}
                      >A</button>
                      <button 
                        className="px-3 sm:px-4 py-2 border border-gray-300 rounded text-xs sm:text-sm text-white active:scale-95 transition-transform min-h-[44px] sm:min-h-0"
                        style={{backgroundColor: '#3f9dc3'}}
                        onClick={handleCloseEnlargedText}
                      >-A</button>
                    </div>
                  </div>
                    
                  {/* السؤال مع محاذاة مع الخيارات */}
                  <div className="flex items-start gap-2 sm:gap-3 mb-4 sm:mb-6">
                    {/* مساحة فارغة بنفس عرض الدوائر */}
                    <div className={`${isTextEnlarged ? 'w-5 h-5 sm:w-6 sm:h-6' : 'w-4 h-4 sm:w-5 sm:h-5'} flex-shrink-0`}></div>
                    <div className={`text-gray-900 text-right flex-1 ${isTextEnlarged ? 'text-lg sm:text-2xl' : 'text-base sm:text-xl'} ${isTablet ? 'tablet-text' : ''}`}>
                      {currentQuestion.type === 'error' ?
                        renderHighlightedText(highlightChoiceWords(currentQuestion.question, currentQuestion.choices, currentQuestion.type)) :
                        currentQuestion.question
                      }
                    </div>
                  </div>


                  {/* الخيارات - منطقة قابلة للتمرير */}
                  <div className="flex-1 overflow-y-auto overflow-x-hidden">
                    <div className={`space-y-3 sm:space-y-4 pb-4 sm:pb-6 ${isTablet ? 'tablet-choices tablet-spacing max-w-full' : ''} ${isTabletLandscape ? 'tablet-landscape' : ''}`}>
                      {currentQuestion.choices.map((choice, index) => (
                        <div
                          key={index}
                          className={`flex items-start gap-2 sm:gap-3 cursor-pointer text-gray-900 text-right p-3 sm:p-2 rounded hover:bg-gray-50 active:bg-gray-100 transition-colors min-h-[44px] sm:min-h-0 ${isTextEnlarged ? 'text-base sm:text-xl' : 'text-sm sm:text-lg'} ${isTablet ? 'tablet-text break-words' : ''}`}
                          onClick={() => handleAnswerSelect(index)}
                          style={{ maxWidth: isTablet ? 'calc(100vw - 3rem)' : 'auto' }}
                        >
                          <input
                            type="radio"
                            name="answer"
                            value={index}
                            checked={selectedAnswer === index}
                            onChange={() => handleAnswerSelect(index)}
                            className={`mt-1 ${isTextEnlarged ? 'w-5 h-5 sm:w-6 sm:h-6' : 'w-4 h-4 sm:w-5 sm:h-5'}`}
                            style={{accentColor: '#068479'}}
                          />
                          <span className={`flex-1 leading-relaxed break-words ${isTablet ? 'tablet-choices' : ''}`} style={{ wordBreak: 'break-word' }}>{choice}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          {/* أزرار التنقل في أسفل عمود الأسئلة */}
          <div className="p-2 sm:p-4 border-2 border-gray-300 border-t-0">
            <div className="flex justify-start gap-1">
              {/* زر حفظ والتالي */}
              <button
                className={`px-4 sm:px-6 py-3 sm:py-4 rounded font-bold transition-all text-sm sm:text-base active:scale-95 min-h-[44px] sm:min-h-0 ${
                  selectedAnswer !== null 
                    ? 'hover:opacity-90' 
                    : 'opacity-50 cursor-not-allowed'
                }`}
                style={{
                  backgroundColor: selectedAnswer !== null ? '#068479' : '#9CA3AF', 
                  color: 'white'
                }}
                disabled={selectedAnswer === null}
                  onClick={() => {
                    // حفظ الإجابة المؤقتة إذا كانت موجودة
                    if (tempSelectedAnswer !== null) {
                      selectAnswer(currentQuestion.question_number, tempSelectedAnswer);
                    }
                    
                    const currentQuestionNumber = currentQuestionIndex + 1;
                    const questionInSection = (currentQuestionNumber - 1) % questionsPerSection + 1;
                    const isLastQuestionInSection = questionInSection === questionsPerSection;
                    const isLastQuestion = currentQuestionIndex === examQuestions.length - 1;

                    // إذا تم الإجابة على آخر سؤال في القسم، احفظ فقط ولا تنتقل
                    if (hasAnsweredLastQuestionInSection) {
                      console.log('تم الإجابة على آخر سؤال في القسم - تم حفظ الإجابة فقط');
                      return;
                    }

                    // إذا كنا في آخر سؤال في القسم، احفظ فقط ولا تنتقل
                    if (isLastQuestionInSection) {
                      console.log('آخر سؤال في القسم - تم حفظ الإجابة فقط');
                      setHasAnsweredLastQuestionInSection(true);
                      return;
                    }

                    // إذا كنا في آخر سؤال في الامتحان، احفظ فقط
                    if (isLastQuestion) {
                      console.log('آخر سؤال في الاختبار - تم حفظ الإجابة فقط');
                      return;
                    }

                    // في الحالات العادية، متابعة للسؤال التالي في نفس القسم
                    nextQuestion();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
              >
                {(() => {
                  const currentQuestionNumber = currentQuestionIndex + 1;
                  const questionInSection = (currentQuestionNumber - 1) % questionsPerSection + 1;
                  const isLastQuestionInSection = questionInSection === questionsPerSection;
                  
                  // إذا تم الإجابة على آخر سؤال في القسم، كل الأسئلة تصبح "حفظ" فقط
                  if (hasAnsweredLastQuestionInSection) {
                    return 'حفظ';
                  } else if (isLastQuestionInSection) {
                    return 'حفظ والتالي';
                  } else if (currentQuestionIndex === examQuestions.length - 1) {
                    return 'إنهاء الاختبار';
                  } else {
                    return 'حفظ والتالي';
                  }
                })()}
              </button>
              
               {/* زر السابق - يختفي إذا تم الإجابة على آخر سؤال في القسم */}
               {!hasAnsweredLastQuestionInSection && (
                <button
                  className={`px-4 sm:px-6 py-3 sm:py-4 rounded font-bold transition-all text-sm sm:text-base active:scale-95 min-h-[44px] sm:min-h-0 ${
                    canGoPrevious() 
                      ? 'hover:opacity-90' 
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                  style={{
                    backgroundColor: canGoPrevious() ? '#6B7280' : '#9CA3AF', 
                    color: 'white'
                  }}
                  disabled={!canGoPrevious()}
                  onClick={handlePrevious}
                >
                  السابق
                </button>
              )}
            </div>
          </div>
        </div>

        {/* الفراغ بين الأعمدة - مخفي على الجوال */}
        <div className="w-8 hidden lg:block"></div>

        {/* العمود الأيمن - لوحة التحكم */}
        <div className={`w-full lg:w-80 border-2 border-gray-300 p-3 sm:p-6 flex flex-col order-first lg:order-last ${isTablet ? 'tablet-sidebar' : ''}`} style={{backgroundColor: '#DDE7F7', marginTop: isMobile ? '0' : '48px'}}>
          {/* وقت القسم الحالي */}
          {examMode === 'sectioned' && (
            <div className="text-center mb-4 sm:mb-6">
              <div className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">وقت القسم الحالي</div>
              <div className="text-2xl sm:text-4xl font-bold text-blue-600">{formatTime(sectionTimeRemaining)}</div>
            </div>
          )}

           {/* معلومات المستخدم */}
           <div className="mb-4 sm:mb-6">
             <div className="text-gray-600 text-xs sm:text-sm mb-1">اسم</div>
             <div className="text-gray-900 font-medium text-xs sm:text-sm truncate">ts1000008@nthb.moe.gov.sa</div>
             <div className="text-gray-600 text-xs sm:text-sm mb-1 mt-2">رقم الإقامة</div>
             <div className="text-gray-900 font-medium text-xs sm:text-sm">1395565256</div>
           </div>

          {/* إحصائيات الأسئلة */}
          <div className="mb-4 sm:mb-6">
            <div className="text-gray-600 text-xs sm:text-sm mb-2 font-bold">عدد الأقسام: 5</div>
            <div className="text-gray-600 text-xs sm:text-sm mb-2 font-bold">أسئلة كل قسم: {questionsPerSection}</div>
            <div className="text-gray-600 text-xs sm:text-sm mb-4 font-bold">مجموع الأسئلة: {questionsPerSection * 5}</div>
            
            {/* مربعات الإحصائيات */}
            <div className="grid grid-cols-3 gap-1 sm:gap-2 mb-4">
              <div className="bg-green-100 border border-green-300 rounded p-1 sm:p-2 text-center">
                <div className="text-green-800 font-bold text-sm sm:text-lg">{Object.keys(userAnswers).length}</div>
                <div className="text-green-700 text-xs">تمت الإجابة</div>
              </div>
              <div className="bg-red-100 border border-red-300 rounded p-1 sm:p-2 text-center">
                <div className="text-red-800 font-bold text-sm sm:text-lg">{examQuestions.length - Object.keys(userAnswers).length}</div>
                <div className="text-red-700 text-xs">لم تتم الإجابة</div>
              </div>
               <div className="bg-blue-100 border border-blue-300 rounded p-1 sm:p-2 text-center">
                 <div className="text-blue-800 font-bold text-sm sm:text-lg">{Object.keys(deferredQuestions).filter(q => deferredQuestions[q]).length}</div>
                 <div className="text-blue-700 text-xs">إجابة جزئية</div>
               </div>
            </div>
          </div>

          {/* أزرار التنقل */}
          <div className="mb-4 sm:mb-6">
             <div className="flex justify-center gap-1 sm:gap-2 mb-3 sm:mb-4">
               {Array.from({ length: 5 }, (_, i) => {
                 const targetSection = i + 1;
                 const isCompletedSection = targetSection < actualCurrentSection;
                 const isCurrentSection = targetSection === actualCurrentSection;
                 const isFutureSection = targetSection > actualCurrentSection;
                 
                 let buttonClass = 'w-8 h-8 sm:w-10 sm:h-10 rounded-full text-white font-bold text-xs sm:text-sm active:scale-95 transition-transform min-h-[44px] sm:min-h-0 ';
                 
                 if (isCompletedSection) {
                   buttonClass += 'bg-orange-500 cursor-not-allowed';
                 } else if (isCurrentSection) {
                   buttonClass += 'bg-green-500';
                 } else {
                   buttonClass += 'bg-orange-500';
                 }
                 
                 return (
                   <button 
                     key={i}
                     className={buttonClass}
                     disabled={isCompletedSection || isCurrentSection}
                     onClick={isCompletedSection || isCurrentSection ? undefined : () => {
                       // منع الانتقال للقسم التالي إلا بعد إنهاء القسم الحالي
                       if (isFutureSection) {
                         alert('لا يمكن الانتقال للقسم التالي إلا بعد إنهاء القسم الحالي');
                         return;
                       }
                       
                       const targetQuestionIndex = (targetSection - 1) * questionsPerSection;
                       if (targetQuestionIndex < examQuestions.length) {
                         goToQuestion(targetQuestionIndex);
                       }
                     }}
                     title={
                       isCompletedSection 
                         ? `القسم ${targetSection} - مكتمل (لا يمكن العودة)`
                         : isCurrentSection 
                           ? `القسم ${targetSection} - الحالي (لا يمكن النقر)`
                           : `القسم ${targetSection} - مستقبلي`
                     }
                   >
                     {i + 1}
                   </button>
                 );
               })}
             </div>
            
            {/* شبكة أرقام الأسئلة */}
            <div className="grid grid-cols-6 gap-1 bg-white p-2 rounded">
              {Array.from({ length: questionsPerSection }, (_, i) => {
                // حساب رقم السؤال الحقيقي في القسم الحالي (ثابت)
                const actualQuestionIndex = (actualCurrentSection - 1) * questionsPerSection + i;
                // التأكد من أن السؤال موجود في الامتحان
                if (actualQuestionIndex >= examQuestions.length) {
                  return null;
                }
                
                const question = examQuestions[actualQuestionIndex];
                if (!question) {
                  return null;
                }
                
                const isAnswered = userAnswers[question.question_number] !== undefined;
                const isDeferred = deferredQuestions[question.question_number];
                const isCurrent = actualQuestionIndex === currentQuestionIndex;
                
                // تحديد نوع السؤال للتمييز البصري
                const questionType = examQuestions[actualQuestionIndex]?.type;
                const isQuantitative = questionType === 'quantitative';
                
                 let buttonClass = 'w-5 h-5 sm:w-6 sm:h-6 rounded text-white font-bold text-xs active:scale-95 transition-transform min-h-[44px] sm:min-h-0 ';
                 if (isCurrent) {
                   buttonClass += 'bg-green-500';
                 } else if (isAnswered) {
                   buttonClass += 'bg-green-400';
                 } else if (isDeferred) {
                   buttonClass += 'bg-yellow-500';
                 } else {
                   // السماح بالتنقل دائماً - نفس اللون للكمي واللفظي
                   buttonClass += 'bg-orange-500';
                 }
                
                return (
                  <button
                    key={i}
                    className={buttonClass}
                     onClick={() => {
                       // منع التنقل لأسئلة القسم التالي
                       const targetSection = Math.floor(actualQuestionIndex / questionsPerSection) + 1;
                       if (targetSection > actualCurrentSection) {
                         alert('لا يمكن الانتقال لأسئلة القسم التالي إلا بعد إنهاء القسم الحالي');
                         return;
                       }
                       
                       // منع العودة لأسئلة الأقسام المكتملة
                       if (targetSection < actualCurrentSection) {
                         alert('لا يمكن العودة لأسئلة الأقسام المكتملة');
                         return;
                       }
                       
                       // التأكد من أن السؤال موجود
                       if (actualQuestionIndex < examQuestions.length) {
                         goToQuestion(actualQuestionIndex);
                       }
                     }}
                    title={`السؤال ${i + 1} من القسم ${actualCurrentSection} (${isQuantitative ? 'كمي' : 'لفظي'})${isAnswered ? ' - تمت الإجابة' : isDeferred ? ' - مؤجل' : ''}`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* فاصل */}
          <div className="h-2 sm:h-4"></div>

           {/* زر إنهاء القسم/الاختبار */}
           <button 
             className={`w-full py-3 sm:py-4 rounded font-bold transition-all text-sm sm:text-base active:scale-95 min-h-[44px] sm:min-h-0 ${
               sectionTimeRemaining <= 60 
                 ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                 : 'bg-orange-500 text-white hover:bg-orange-600'
             }`}
             disabled={sectionTimeRemaining <= 60}
             onClick={() => {
               // منع إنهاء القسم في آخر دقيقة
               if (sectionTimeRemaining <= 60) {
                 alert('لا يمكن إنهاء القسم في آخر دقيقة، انتظر انتهاء الوقت');
                 return;
               }
               
               const isLastSection = currentQuestionIndex === examQuestions.length - 1;
               const message = isLastSection 
                 ? 'هل أنت متأكد من إنهاء الاختبار؟'
                 : 'سيتم نقلك للقسم التالي مباشرة. هل تريد المتابعة؟';
               
               if (window.confirm(message)) {
                 if (isLastSection) {
                   // إنهاء الاختبار وعرض النتائج
                   const { completeExam } = useExamStore.getState();
                   completeExam();
                 } else {
                   // الانتقال للقسم التالي مباشرة باستخدام endCurrentSection
                   const { endCurrentSection } = useExamStore.getState();
                   endCurrentSection();
                   window.scrollTo({ top: 0, behavior: 'smooth' });
                 }
               }
             }}
           >
             {sectionTimeRemaining <= 60 ? 'انتظر انتهاء الوقت...' : (currentQuestionIndex === examQuestions.length - 1 ? 'إنهاء الاختبار' : 'إنهاء القسم')}
           </button>
        </div>
      </div>

      {/* الشريط السفلي */}
      <div className="px-4 sm:px-8 py-2 sm:py-4 flex items-center justify-between relative z-10" style={{backgroundColor: '#068479'}}>
        <div className="text-white text-xs sm:text-sm">
          <span className="font-medium">نمر مشعل</span>
        </div>
        <div className="text-white font-bold text-sm sm:text-base">OUR GOAL</div>
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


