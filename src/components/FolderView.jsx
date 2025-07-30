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
import { getAllQuestions } from '../utils/dataLoader';

const FolderView = ({ folderId, onBack, onStartTest }) => {
  const { folders, removeQuestionFromFolder } = useFolderStore();
  const [allQuestions, setAllQuestions] = useState([]);
  
  const folder = folders.find(f => f.id === folderId);

  useEffect(() => {
    // Use the getAllQuestions function from dataLoader
    const questions = getAllQuestions();
    setAllQuestions(questions);
    console.log('Loaded questions in FolderView:', questions.length);
  }, []);

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

  const folderQuestions = allQuestions.filter(q => {
    const isIncluded = folder.questionIds.includes(q.id);
    if (isIncluded) {
      console.log('Found question in folder:', q.id, q.question.substring(0, 50));
    }
    return isIncluded;
  });

  console.log('Folder questions found:', folderQuestions.length);
  console.log('Folder question IDs:', folder.questionIds);

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

  // Helper function to get correct answer text
  const getCorrectAnswerText = (question) => {
    if (!question.choices || question.choices.length === 0) {
      return question.answer;
    }
    
    if (typeof question.answer === 'number' && question.answer < question.choices.length) {
      return question.choices[question.answer];
    }
    
    if (typeof question.answer === 'string') {
      return question.answer;
    }
    
    return question.choices[0]; // fallback
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

        {/* Debug info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-3 bg-gray-800/50 rounded-lg text-xs">
            <p>Total questions loaded: {allQuestions.length}</p>
            <p>Folder question IDs count: {folder.questionIds.length}</p>
            <p>Matched questions: {folderQuestions.length}</p>
          </div>
        )}

        {/* Questions List */}
        {folderQuestions.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-500" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">لا توجد أسئلة</h3>
            <p className="text-gray-500">لم يتم إضافة أي أسئلة إلى هذا المجلد بعد</p>
            {folder.questionIds.length > 0 && (
              <p className="text-red-400 text-sm mt-2">
                تحذير: يحتوي المجلد على {folder.questionIds.length} معرف سؤال لكن لم يتم العثور على الأسئلة المطابقة
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {folderQuestions.map((question, index) => {
              const TypeIcon = getQuestionTypeIcon(question.type);
              const correctAnswerText = getCorrectAnswerText(question);
              
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
                        {process.env.NODE_ENV === 'development' && (
                          <span className="text-xs text-gray-500">
                            ID: {question.id}
                          </span>
                        )}
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
                        {question.choices.map((choice, choiceIndex) => {
                          const isCorrect = (
                            (typeof question.answer === 'number' && choiceIndex ===
