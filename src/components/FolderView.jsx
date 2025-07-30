import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Folder, 
  Trash2, 
  Edit2, 
  Play, 
  BookOpen,
  Target,
  Brain,
  Lightbulb,
  Sparkles,
  FileText
} from 'lucide-react';
import { useFolderStore } from '../store/folderStore';
import { useExamStore } from '../store/examStore';

// Import all question data to display questions
import analogyData from '../data/analogy.json';
import completionData from '../data/completion.json';
import errorData from '../data/error.json';
import rcBank4Data from '../data/rcbank4.json';
import rcBank5Data from '../data/rcbank5.json';
import oddData from '../data/odd.json';

const FolderView = ({ folderId, onBack, onStartTest }) => {
  const { folders, removeQuestionFromFolder } = useFolderStore();
  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const folder = folders.find(f => f.id === folderId);

  useEffect(() => {
    try {
      // Combine all question data with improved ID generation
      const normalizeQuestion = (question, type, sourceIndex) => {
        // Create a more robust unique ID that avoids collisions
        // Using sourceIndex (array position) + type + a small hash of question text
        const questionTextHash = question.question 
          ? btoa(unescape(encodeURIComponent(question.question))).substring(0, 8)
          : Math.random().toString(36).substring(2, 10); // fallback random string
        
        const uniqueId = `${type}-${sourceIndex}-${questionTextHash}`;

        return {
          id: uniqueId,
          question_number: question.question_number || sourceIndex + 1,
          question: question.question || '',
          type: type,
          choices: question.choices || [],
          answer: question.answer,
          passage: question.passage || null,
          category: question.category || type,
          exam: question.exam || ''
        };
      };

      const questions = [];
      
      // Process analogy questions
      if (analogyData && Array.isArray(analogyData)) {
        analogyData.forEach((q, index) => {
          if (q && (q.question || q.choices)) {
            questions.push(normalizeQuestion(q, 'analogy', index));
          }
        });
      }
      
      // Process completion questions
      if (completionData && Array.isArray(completionData)) {
        completionData.forEach((q, index) => {
          if (q && (q.question || q.choices)) {
            questions.push(normalizeQuestion(q, 'completion', index));
          }
        });
      }
      
      // Process error questions
      if (errorData && Array.isArray(errorData)) {
        errorData.forEach((q, index) => {
          if (q && (q.question || q.choices)) {
            questions.push(normalizeQuestion(q, 'error', index));
          }
        });
      }
      
      // Process RC Bank 4 questions
      if (rcBank4Data && Array.isArray(rcBank4Data)) {
        rcBank4Data.forEach((q, index) => {
          if (q && (q.question || q.choices)) {
            questions.push(normalizeQuestion(q, 'rc', index));
          }
        });
      }
      
      // Process RC Bank 5 questions
      if (rcBank5Data && Array.isArray(rcBank5Data)) {
        rcBank5Data.forEach((q, index) => {
          if (q && (q.question || q.choices)) {
            // Add rcBank4Data length to avoid index collision
            questions.push(normalizeQuestion(q, 'rc', index + (rcBank4Data?.length || 0)));
          }
        });
      }
      
      // Process odd questions
      if (oddData && Array.isArray(oddData)) {
        oddData.forEach((q, index) => {
          if (q && (q.question || q.choices)) {
            questions.push(normalizeQuestion(q, 'odd', index));
          }
        });
      }

      console.log('Total questions loaded:', questions.length);
      console.log('Sample question IDs:', questions.slice(0, 5).map(q => q.id));
      
      setAllQuestions(questions);
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="p-6 bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900 text-white min-h-screen" dir="rtl">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-300">جاري تحميل الأسئلة...</h2>
        </div>
      </div>
    );
  }

  // Show error if folder not found
  if (!folder) {
    return (
      <div className="p-6 bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900 text-white min-h-screen" dir="rtl">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">المجلد غير موجود</h2>
          <Button onClick={onBack} className="bg-gray-700 hover:bg-gray-600">
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة
          </Button>
        </div>
      </div>
    );
  }

  // Filter questions that belong to this folder
  const folderQuestions = allQuestions.filter(q => {
    const isIncluded = folder.questionIds.includes(q.id);
    if (isIncluded) {
      console.log('Question found in folder:', q.id, q.question.substring(0, 50));
    }
    return isIncluded;
  });

  console.log('Folder question IDs:', folder.questionIds);
  console.log('Matching questions found:', folderQuestions.length);

  const getQuestionTypeIcon = (type) => {
    switch (type) {
      case 'analogy': return Brain;
      case 'completion': return BookOpen;
      case 'error': return Target;
      case 'rc': return Lightbulb;
      case 'odd': return Sparkles;
      default: return FileText;
    }
  };

  const getQuestionTypeLabel = (type) => {
    switch (type) {
      case 'analogy': return 'التناظر اللفظي';
      case 'completion': return 'إكمال الجمل';
      case 'error': return 'الخطأ السياقي';
      case 'rc': return 'استيعاب المقروء';
      case 'odd': return 'المفردة الشاذة';
      default: return type;
    }
  };

  const getQuestionTypeColor = (type) => {
    switch (type) {
      case 'analogy': return 'bg-purple-600';
      case 'completion': return 'bg-emerald-600';
      case 'error': return 'bg-rose-600';
      case 'rc': return 'bg-amber-600';
      case 'odd': return 'bg-cyan-600';
      default: return 'bg-gray-600';
    }
  };

  const handleRemoveQuestion = (questionId) => {
    if (window.confirm('هل أنت متأكد من إزالة هذا السؤال من المجلد؟')) {
      removeQuestionFromFolder(folderId, questionId);
    }
  };

  const handleStartTest = () => {
    if (folderQuestions.length === 0) {
      alert('لا توجد أسئلة في هذا المجلد لبدء الاختبار');
      return;
    }
    onStartTest(folderQuestions);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900 text-white min-h-screen" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 ml-2" />
              العودة
            </Button>
            <div className="flex items-center gap-3">
              <Folder className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {folder.name}
                </h1>
                <p className="text-gray-400">{folderQuestions.length} سؤال</p>
              </div>
            </div>
          </div>

          {folderQuestions.length > 0 && (
            <Button
              onClick={handleStartTest}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <Play className="w-4 h-4 ml-2" />
              بدء الاختبار
            </Button>
          )}
        </div>

        {/* Debug Info (remove in production) */}
        <div className="mb-4 p-4 bg-gray-800 rounded-lg text-sm">
          <p>إجمالي الأسئلة المحملة: {allQuestions.length}</p>
          <p>أسئلة المجلد: {folderQuestions.length}</p>
          <p>معرفات الأسئلة في المجلد: {folder.questionIds.join(', ')}</p>
        </div>

        {/* Questions List */}
        {folderQuestions.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-500" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">لا توجد أسئلة</h3>
            <p className="text-gray-500">لم يتم إضافة أي أسئلة إلى هذا المجلد بعد</p>
            <p className="text-gray-500 text-sm mt-2">
              قد تحتاج إلى مسح البيانات المحفوظة وإعادة إضافة الأسئلة
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {folderQuestions.map((question, index) => {
              const TypeIcon = getQuestionTypeIcon(question.type);
              return (
                <Card key={question.id} className="bg-gray-800/50 border-gray-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge className={`${getQuestionTypeColor(question.type)} text-white`}>
                          <TypeIcon className="w-3 h-3 ml-1" />
                          {getQuestionTypeLabel(question.type)}
                        </Badge>
                        <span className="text-sm text-gray-400">
                          السؤال #{index + 1}
                        </span>
                        <span className="text-xs text-gray-500">
                          ID: {question.id}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveQuestion(question.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Question Text */}
                    <div className="mb-4">
                      <p className="text-white leading-relaxed">
                        {question.question}
                      </p>
                    </div>

                    {/* Passage (for RC questions) */}
                    {question.passage && (
                      <div className="mb-4 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">النص:</h4>
                        <p className="text-gray-200 text-sm leading-relaxed">
                          {question.passage}
                        </p>
                      </div>
                    )}

                    {/* Choices */}
                    {question.choices && question.choices.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">الخيارات:</h4>
                        {question.choices.map((choice, choiceIndex) => (
                          <div
                            key={choiceIndex}
                            className={`p-3 rounded-lg border ${
                              choiceIndex === question.answer
                                ? 'bg-green-900/30 border-green-600 text-green-200'
                                : 'bg-gray-700/30 border-gray-600 text-gray-300'
                            }`}
                          >
                            <span className="font-medium ml-2">
                              {String.fromCharCode(65 + choiceIndex)}.
                            </span>
                            {choice}
                            {choiceIndex === question.answer && (
                              <Badge className="bg-green-600 text-white mr-2 text-xs">
                                الإجابة الصحيحة
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FolderView;
