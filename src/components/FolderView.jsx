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
  FileText,
  TrendingUp,
  Clock,
  Star
} from 'lucide-react';

const FolderView = ({ folderId, onBack, onStartTest }) => {
  const [folders] = useState([
    { 
      id: 1, 
      name: 'أسئلة التناظر اللفظي', 
      questionIds: [1, 2, 3] 
    }
  ]);
  
  const [allQuestions] = useState([
    {
      id: 1,
      type: 'analogy',
      question: 'العلاقة بين الكلمات التالية: كتاب : مكتبة',
      choices: ['طالب : مدرسة', 'سيارة : طريق', 'طعام : مطبخ', 'مريض : مستشفى'],
      answer: 0,
      passage: null
    },
    {
      id: 2,
      type: 'completion',
      question: 'أكمل الجملة التالية: العلم نور والجهل ...',
      choices: ['ظلام', 'نهار', 'ضوء', 'شمس'],
      answer: 0,
      passage: null
    },
    {
      id: 3,
      type: 'rc',
      question: 'ما الفكرة الرئيسية للنص؟',
      choices: ['التعليم مهم', 'القراءة مفيدة', 'العلم أساس التقدم', 'المعرفة قوة'],
      answer: 2,
      passage: 'العلم هو أساس التقدم والحضارة. بدون العلم لا يمكن للمجتمعات أن تتطور وتزدهر. إن الاستثمار في التعليم والبحث العلمي هو استثمار في مستقبل الأمم.'
    }
  ]);
  
  const folder = folders.find(f => f.id === parseInt(folderId)) || folders[0];
  const folderQuestions = allQuestions.filter(q => folder.questionIds.includes(q.id));

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

  const getQuestionTypeGradient = (type) => {
    switch (type) {
      case 'analogy': return 'from-purple-500 to-pink-500';
      case 'completion': return 'from-emerald-500 to-teal-500';
      case 'error': return 'from-rose-500 to-red-500';
      case 'rc': return 'from-amber-500 to-orange-500';
      case 'odd': return 'from-cyan-500 to-blue-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const handleRemoveQuestion = (questionId) => {
    if (window.confirm('هل أنت متأكد من إزالة هذا السؤال من المجلد؟')) {
      console.log('Remove question:', questionId);
    }
  };

  const handleStartTest = () => {
    if (folderQuestions.length === 0) {
      alert('لا توجد أسئلة في هذا المجلد لبدء الاختبار');
      return;
    }
    onStartTest && onStartTest(folderQuestions);
  };

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
    
    return question.choices[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-900 text-white" dir="rtl">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl animate-ping"></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 p-6 bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={onBack}
                className="border-white/20 text-gray-300 hover:bg-white/10 hover:border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="w-4 h-4 ml-2" />
                العودة
              </Button>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl backdrop-blur-sm">
                  <Folder className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {folder.name}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-400">{folderQuestions.length} سؤال</span>
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm">مجلد مميز</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {folderQuestions.length > 0 && (
              <Button
                onClick={handleStartTest}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-green-500/25 transition-all duration-300 hover:scale-105 text-white font-semibold px-6 py-3"
              >
                <Play className="w-5 h-5 ml-2" />
                بدء الاختبار
              </Button>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-xl p-4 border border-blue-500/20">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">إجمالي الأسئلة</p>
                  <p className="text-xl font-bold text-blue-400">{folderQuestions.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-purple-400" />
                <div>
                  <p className="text-sm text-gray-400">الوقت المتوقع</p>
                  <p className="text-xl font-bold text-purple-400">{folderQuestions.length * 2} دقيقة</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-sm rounded-xl p-4 border border-emerald-500/20">
              <div className="flex items-center gap-3">
                <Star className="w-6 h-6 text-emerald-400" />
                <div>
                  <p className="text-sm text-gray-400">مستوى الصعوبة</p>
                  <p className="text-xl font-bold text-emerald-400">متوسط</p>
                </div>
              </div>
            </div>
          </div>

          {/* Questions List */}
          {folderQuestions.length === 0 ? (
            <div className="text-center py-16 bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10">
              <div className="animate-bounce mb-6">
                <FileText className="w-20 h-20 mx-auto text-gray-500" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-300 mb-3">لا توجد أسئلة</h3>
              <p className="text-gray-500 text-lg">لم يتم إضافة أي أسئلة إلى هذا المجلد بعد</p>
            </div>
          ) : (
            <div className="space-y-6">
              {folderQuestions.map((question, index) => {
                const TypeIcon = getQuestionTypeIcon(question.type);
                const correctAnswerText = getCorrectAnswerText(question);
                const gradientClass = getQuestionTypeGradient(question.type);
                
                return (
                  <Card key={question.id} className="bg-black/30 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 group">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Badge className={`bg-gradient-to-r ${gradientClass} text-white shadow-lg px-3 py-1 text-sm font-medium`}>
                            <TypeIcon className="w-4 h-4 ml-1" />
                            {getQuestionTypeLabel(question.type)}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-full">
                              السؤال #{index + 1}
                            </span>
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveQuestion(question.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Question Text */}
                      <div className="p-4 bg-gradient-to-r from-white/5 to-white/10 rounded-xl border border-white/10">
                        <p className="text-white leading-relaxed text-lg font-medium">
                          {question.question}
                        </p>
                      </div>

                      {/* Passage (for RC questions) */}
                      {question.passage && (
                        <div className="p-4 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/20 backdrop-blur-sm">
                          <h4 className="text-amber-300 font-semibold mb-3 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            النص:
                          </h4>
                          <p className="text-gray-200 leading-relaxed">
                            {question.passage}
                          </p>
                        </div>
                      )}

                      {/* Choices */}
                      {question.choices && question.choices.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-gray-300 font-semibold mb-3 flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            الخيارات:
                          </h4>
                          <div className="grid gap-3">
                            {question.choices.map((choice, choiceIndex) => {
                              const isCorrect = (
                                (typeof question.answer === 'number' && choiceIndex === question.answer) ||
                                (typeof question.answer === 'string' && choice === question.answer)
                              );
                              
                              return (
                                <div
                                  key={choiceIndex}
                                  className={`p-4 rounded-xl border transition-all duration-300 ${
                                    isCorrect
                                      ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/50 text-green-100 shadow-lg shadow-green-500/10'
                                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                        isCorrect ? 'bg-green-500 text-white' : 'bg-white/10 text-gray-400'
                                      }`}>
                                        {String.fromCharCode(65 + choiceIndex)}
                                      </span>
                                      <span className="font-medium">{choice}</span>
                                    </div>
                                    {isCorrect && (
                                      <Badge className="bg-green-500 text-white text-xs px-2 py-1 animate-pulse">
                                        ✓ الإجابة الصحيحة
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Show correct answer if no choices available */}
                      {(!question.choices || question.choices.length === 0) && question.answer && (
                        <div className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-xl">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">✓</span>
                            </div>
                            <span className="text-green-200 font-medium">الإجابة الصحيحة: </span>
                            <span className="text-green-100 font-semibold">{question.answer}</span>
                          </div>
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
    </div>
  );
};

export default FolderView;
