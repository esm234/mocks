import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import analogyData from '../data/التناظراللفظي.json';
import completionData from '../data/اكمالالجمل.json';
import errorData from '../data/الخطأالسياقي.json';
import reading4 from '../data/استيعابالمقروءالبنكالرابع.json';
import reading5 from '../data/استيعابالمقروءالبنكالخامس.json';
import oddData from '../data/المفردةالشاذة.json';

// تعليمات حسب النوع
const INSTRUCTIONS: Record<string, { title: string; text: string }> = {
  'التناظر اللفظي': {
    title: 'التناظر اللفظي',
    text: 'في بداية كل سؤال مما يأتي ، كلمتان ترتبطان بعلاقة معينة ، تتبعهما أربعة أزواج من الكلمات ، واحد منها ترتبط فيه الكلمتان بعلاقة مشابهة للعلاقة بين الكلمتين في بداية السؤال .  المطلوب هو : اختيار الإجابة الصحيحة',
  },
  'إكمال الجمل': {
    title: 'إكمال الجمل',
    text: 'تلي كل جملة من الجمل الآتية أربعة اختيارات ، أحدها يكمل الفراغ أو الفراغات في الجملة إكمالا صحيحا . المطلوب هو : اختيار الإجابة الصحيحة',
  },
  'الخطأ السياقي': {
    title: 'الخطأ السياقي',
    text: 'في كل جملة مما يأتي أربع كلمات كل منها مكتوبة بخط غليظ . المطلوب هو : تحديد الكلمة التي لا يتفق معناها مع المعنى العام للجملة ،( الخطأ ليس إملائياً ولا نحويا )',
  },
  'استيعاب المقروء': {
    title: 'استيعاب المقروء',
    text: 'الأسئلة التالية تتعلق بالنص الذي يسبقها ، بعد كل سؤال أربعة اختيارات ، واحد منها صحيح . المطلوب هو : قراءة النص بعناية ، واختيار الإجابة الصحيحة عن كل سؤال.',
  },
  'المفردة الشاذة': {
    title: 'المفردة الشاذة',
    text: 'الأسئلة التالية توجد بها أربع مفردات بين ثلاثة منها قاسم مشترك والرابع يختلف معهم فيه .',
  },
};

// تحديد نوع السؤال من category أو type
function getType(q: any) {
  if (q.category) {
    if (q.category.includes('تناظر')) return 'التناظر اللفظي';
    if (q.category.includes('إكمال')) return 'إكمال الجمل';
    if (q.category.includes('خطأ')) return 'الخطأ السياقي';
    if (q.category.includes('استيعاب')) return 'استيعاب المقروء';
    if (q.category.includes('مفردة')) return 'المفردة الشاذة';
  }
  return q.type || 'اختيار';
}

// تجهيز أسئلة الاستيعاب المتتالية
function groupReadingQuestions(readingArr) {
  const grouped: Record<string, any[]> = {};
  readingArr.forEach(q => {
    if (!q.passage) return;
    if (!grouped[q.passage]) grouped[q.passage] = [];
    grouped[q.passage].push(q);
  });
  return Object.values(grouped);
}

function shuffle(arr) {
  return arr
    .map((a) => [Math.random(), a])
    .sort((a, b) => a[0] - b[0])
    .map((a) => a[1]);
}

const LOCAL_KEY = 'mockExamAnswers';
const LOCAL_QUESTIONS_KEY = 'mockExamQuestions';

// إضافة دوال مساعدة لتحويل القيم من الإعدادات إلى أنواع الأسئلة
const TYPE_MAP = {
  analogy: 'التناظر اللفظي',
  completion: 'إكمال الجمل',
  error: 'الخطأ السياقي',
  rc: 'استيعاب المقروء',
  odd: 'المفردة الشاذة',
};

const REVERSE_TYPE_MAP = {
  'التناظر اللفظي': 'analogy',
  'إكمال الجمل': 'completion',
  'الخطأ السياقي': 'error',
  'استيعاب المقروء': 'rc',
  'المفردة الشاذة': 'odd',
};

const MockExamExam: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const settings = location.state || {};
  // فحص settings
  console.log('settings:', settings);
  // فحص بيانات الملفات
  console.log('analogyData:', Array.isArray(analogyData), analogyData.length);
  console.log('completionData:', Array.isArray(completionData), completionData.length);
  console.log('errorData:', Array.isArray(errorData), errorData.length);
  console.log('reading4:', Array.isArray(reading4), reading4.length);
  console.log('reading5:', Array.isArray(reading5), reading5.length);
  console.log('oddData:', Array.isArray(oddData), oddData.length);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | string>>({});
  const [timeLeft, setTimeLeft] = useState(() => {
    // الوقت بالدقائق من الإعدادات أو 60 دقيقة افتراضي
    return (settings.time || 60) * 60;
  });
  const [questions, setQuestions] = useState<any[]>([]);

  // State لإدارة الأسئلة المميزة
  const [flagged, setFlagged] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('mockExamFlagged') || '[]');
    } catch {
      return [];
    }
  });

  // State لإدارة وضع المراجعة الخاصة
  const [specialReview, setSpecialReview] = useState<null | { type: 'all' | 'incomplete' | 'flagged', list: number[], index: number }>(null);

  // تحديث قائمة المميزين في LocalStorage
  useEffect(() => {
    localStorage.setItem('mockExamFlagged', JSON.stringify(flagged));
  }, [flagged]);

  // تفعيل زر تمييز للمراجعة
  function toggleFlag(qNum: number) {
    setFlagged(f => f.includes(qNum) ? f.filter(x => x !== qNum) : [...f, qNum]);
  }

  // منطق التنقل في وضع المراجعة الخاصة
  function goToSpecialReview(type: 'all' | 'incomplete' | 'flagged') {
    let list: number[] = [];
    if (type === 'all') {
      list = sectionQuestions[currentSection].map(q => q.question_number);
    } else if (type === 'incomplete') {
      list = sectionQuestions[currentSection].filter(q => answers[q.question_number] == null).map(q => q.question_number);
    } else if (type === 'flagged') {
      list = sectionQuestions[currentSection].filter(q => flagged.includes(q.question_number)).map(q => q.question_number);
    }
    setSpecialReview({ type, list, index: 0 });
    if (list.length > 0) {
      setCurrent(questions.findIndex(q => q.question_number === list[0]));
      setReviewMode(false);
    }
  }

  // عند الضغط على رقم سؤال في صفحة المراجعة
  function goToQuestion(qNum: number) {
    setCurrent(questions.findIndex(q => q.question_number === qNum));
    setReviewMode(false);
    setSpecialReview(null);
  }

  // منطق التالي/السابق في وضع المراجعة الخاصة
  function handleSpecialNext() {
    if (!specialReview) return;
    if (specialReview.index < specialReview.list.length - 1) {
      const nextIdx = specialReview.index + 1;
      setSpecialReview({ ...specialReview, index: nextIdx });
      setCurrent(questions.findIndex(q => q.question_number === specialReview.list[nextIdx]));
    }
  }
  function handleSpecialPrev() {
    if (!specialReview) return;
    if (specialReview.index > 0) {
      const prevIdx = specialReview.index - 1;
      setSpecialReview({ ...specialReview, index: prevIdx });
      setCurrent(questions.findIndex(q => q.question_number === specialReview.list[prevIdx]));
    }
  }
  function exitSpecialReview() {
    setSpecialReview(null);
    setReviewMode(true);
  }

  // تجهيز الأسئلة حسب الإعدادات
  useEffect(() => {
    if (!settings || Object.keys(settings).length === 0) return;

    // 1. تجهيز جميع الأسئلة
    const allQs = [
      ...analogyData.map(q => ({ ...q, _type: 'التناظر اللفظي' })),
      ...completionData.map(q => ({ ...q, _type: 'إكمال الجمل' })),
      ...errorData.map(q => ({ ...q, _type: 'الخطأ السياقي' })),
      ...reading4.map(q => ({ ...q, _type: 'استيعاب المقروء' })),
      ...reading5.map(q => ({ ...q, _type: 'استيعاب المقروء' })),
      ...oddData.map(q => ({ ...q, _type: 'المفردة الشاذة' })),
    ];

    // 2. فلترة حسب النوع
    let filteredQs = allQs;
    if (settings.questionTypeFilter === 'specific' && settings.selectedQuestionType) {
      const typeLabel = TYPE_MAP[settings.selectedQuestionType];
      filteredQs = allQs.filter(q => q._type === typeLabel);
    } else if (settings.questionTypeFilter === 'all') {
      // توزيع المفردة الشاذة: 2 فقط، والباقي موزع
      const oddQs = shuffle(allQs.filter(q => q._type === 'المفردة الشاذة')).slice(0, 2);
      const restQs = shuffle(allQs.filter(q => q._type !== 'المفردة الشاذة')).slice(0, 63);
      filteredQs = shuffle([...oddQs, ...restQs]);
    }

    // 3. ترتيب استيعاب المقروء
    if (settings.selectedQuestionType === 'rc' || settings.questionTypeFilter === 'all') {
      if (settings.rcQuestionOrder === 'sequential') {
        // متتالي: اجمع نصوص الاستيعاب مع أسئلتها
        const readingQs = filteredQs.filter(q => q._type === 'استيعاب المقروء');
        const nonReadingQs = filteredQs.filter(q => q._type !== 'استيعاب المقروء');
        const grouped = groupReadingQuestions(readingQs);
        filteredQs = shuffle([...nonReadingQs, ...grouped.flat()]);
      } else if (settings.rcQuestionOrder === 'random') {
        // عشوائي: لا شيء خاص، الأسئلة عشوائية
      }
    }

    // 4. تجهيز الأقسام إذا examMode = sectioned
    let sectionedQs: any[][] = [];
    if (settings.examMode === 'sectioned') {
      // 5 أقسام × 13 سؤال
      for (let i = 0; i < 5; i++) {
        sectionedQs.push(filteredQs.slice(i * 13, (i + 1) * 13));
      }
      filteredQs = sectionedQs.flat(); // للعرض الافتراضي
    }

    // 5. قص العدد النهائي
    filteredQs = filteredQs.slice(0, 65);
    setQuestions(filteredQs);
    localStorage.setItem(LOCAL_QUESTIONS_KEY, JSON.stringify(filteredQs));
  }, [JSON.stringify(settings)]);

  // تحميل الإجابات من localStorage
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) setAnswers(JSON.parse(saved));
  }, []);

  // المؤقت حسب الإعدادات
  useEffect(() => {
    if (settings.timerMode === 'none') return; // بدون مؤقت
    setTimeLeft((settings.selectedTimerDuration || 60) * 60);
  }, [settings.timerMode, settings.selectedTimerDuration]);

  // حفظ الإجابات في localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(answers));
  }, [answers]);

  // تنسيق الوقت
  function formatTime(sec: number) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  // السؤال الحالي
  const q = questions[current] || {};
  const qType = q._type || getType(q);
  const instructions = INSTRUCTIONS[qType] || { title: '', text: '' };

  // عند اختيار إجابة
  function handleSelect(idx: number | string) {
    setAnswers(a => ({ ...a, [q.question_number]: idx }));
  }

  // عرض نص الاستيعاب إذا وجد
  const passage = qType === 'استيعاب المقروء' ? q.passage : null;

  // مراجعة الأقسام
  const [reviewMode, setReviewMode] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  let sectionQuestions: any[][] = [];
  if (settings.examMode === 'sectioned' && questions.length === 65) {
    for (let i = 0; i < 5; i++) {
      sectionQuestions.push(questions.slice(i * 13, (i + 1) * 13));
    }
  }

  // عند إنهاء قسم: الانتقال للمراجعة
  function handleEndSection() {
    setReviewMode(true);
  }
  // عند إنهاء المراجعة: الانتقال للقسم التالي أو إنهاء الامتحان
  function handleEndReview() {
    setReviewMode(false);
    setSpecialReview(null);
    if (currentSection === 4) {
      // الانتقال لصفحة النتائج
      navigate('/mock-exam/result');
    } else {
      setCurrentSection(s => s + 1);
      // الانتقال لأول سؤال في القسم التالي بناءً على عدد الأسئلة الفعلي
      setCurrent(sectionQuestions.slice(0, currentSection + 1).reduce((acc, arr) => acc + arr.length, 0));
    }
  }

  // لون نص القطعة
  const passageClass = 'text-right leading-loose text-base mb-6 w-full text-gray-900';

  // نقطة الراديو يمين النص
  const radioLabelClass = 'flex flex-row-reverse items-center gap-2 cursor-pointer text-lg text-gray-900 font-normal w-full text-right';

  // صفحة المراجعة
  if (reviewMode && settings.examMode === 'sectioned' && sectionQuestions.length) {
    const secQs = sectionQuestions[currentSection];
    // تجهيز 18 خانة (3 صفوف × 6 أعمدة)
    const paddedQs = [...secQs];
    while (paddedQs.length < 18) paddedQs.push(null);
    const rows = [
      paddedQs.slice(0, 6),
      paddedQs.slice(6, 12),
      paddedQs.slice(12, 18),
    ];
    return (
      <div className="min-h-screen flex flex-col bg-[#eaf3fa]" dir="rtl">
        {/* الشريط العلوي */}
        <div className="flex items-center justify-between bg-[#2176c1] px-6 py-2 border-b border-blue-700">
          <div className="text-white text-lg font-bold">{settings.examName || 'اسم الاختبار'}</div>
          <div className="flex-1 flex justify-center">
            <span className="text-white text-xl font-bold">قسم المراجعة</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white bg-[#eaf3fa] rounded px-3 py-1 font-bold text-lg border border-blue-200">
              الوقت المتبقي: {formatTime(timeLeft)}
            </span>
          </div>
        </div>
        {/* تعليمات */}
        <div className="max-w-3xl mx-auto w-full mt-8 mb-4">
          <div className="bg-white border border-blue-200 rounded-lg p-4 text-right text-gray-800 text-base leading-relaxed shadow">
            <div className="font-bold mb-2 text-blue-900">إرشادات</div>
            <ul className="list-disc pr-6 space-y-2">
              <li>فيما يلي ملخص لإجاباتك، يمكنك مراجعة أسئلتك بثلاث طرق مختلفة:</li>
              <li>1- قم بمراجعة كل أسئلتك وإجاباتك.</li>
              <li>2- قم بمراجعة الأسئلة غير المكتملة.</li>
              <li>3- قم بمراجعة الأسئلة المميزة بعلامة المراجعة (النجمة الحمراء).</li>
            </ul>
            <div className="mt-2 text-sm text-gray-600">يمكنك أيضًا النقر فوق رقم السؤال للذهاب إليه مباشرة ومراجعته بسرعة في الاختبار.</div>
          </div>
        </div>
        {/* جدول الأسئلة */}
        <div className="max-w-3xl mx-auto w-full bg-white rounded-lg shadow border border-gray-200 p-4 mb-8">
          <table className="w-full text-center">
            <tbody>
              {rows.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  {row.map((reviewQ, colIdx) => (
                    <td key={colIdx} className="align-top px-1 py-2">
                      {reviewQ ? (
                        <div
                          className="flex flex-col items-center justify-center border rounded-lg py-2 px-1 cursor-pointer hover:bg-blue-50 transition min-w-[70px] min-h-[60px]"
                          onClick={() => goToQuestion(reviewQ.question_number)}
                        >
                          <span className="text-xs text-gray-500 mb-1">سؤال {currentSection * 13 + rowIdx * 6 + colIdx + 1}</span>
                          <span className={answers[reviewQ.question_number] == null ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>
                            {answers[reviewQ.question_number] == null ? 'غير مكتمل' : 'مكتمل'}
                          </span>
                          {flagged.includes(reviewQ.question_number) && (
                            <span className="text-red-500 text-lg mt-1" title="مميز للمراجعة">★</span>
                          )}
                        </div>
                      ) : (
                        <div className="min-w-[70px] min-h-[60px]" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* الأزرار السفلية */}
        <div className="max-w-3xl mx-auto w-full flex gap-2 mb-8">
          <button className="flex-1 bg-[#2176c1] hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition" onClick={() => goToSpecialReview('all')}>مراجعة الكل</button>
          <button className="flex-1 bg-[#2a9df4] hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition" onClick={() => goToSpecialReview('incomplete')}>مراجعة غير المكتمل</button>
          <button className="flex-1 bg-[#f44336] hover:bg-red-600 text-white font-bold py-3 rounded-lg transition" onClick={() => goToSpecialReview('flagged')}>مراجعة المميز بعلامة</button>
        </div>
        <div className="max-w-3xl mx-auto w-full mb-8">
          <button
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg text-lg transition"
            onClick={handleEndReview}
          >
            {currentSection === 4 ? 'إنهاء المراجعة' : 'إنهاء المراجعة والانتقال للقسم التالي'}
          </button>
        </div>
      </div>
    );
  }

  // منطق عرض الأسئلة في وضع المراجعة الخاصة
  let displayQuestions = questions;
  if (settings.examMode === 'sectioned' && sectionQuestions.length) {
    displayQuestions = sectionQuestions[currentSection];
  }
  let currentQ = displayQuestions[current % 13] || {};
  let currentQType = currentQ._type || getType(currentQ);
  let currentInstructions = INSTRUCTIONS[currentQType] || { title: '', text: '' };

  // إذا في وضع مراجعة خاصة (غير الكل)
  if (specialReview) {
    const { type, list, index } = specialReview;
    const qNum = list[index];
    currentQ = questions.find(q => q.question_number === qNum) || {};
    currentQType = currentQ._type || getType(currentQ);
    currentInstructions = INSTRUCTIONS[currentQType] || { title: '', text: '' };
  }

  // في الـ render: إذا لم تُحمّل الأسئلة
  if (!questions.length) {
    return <div className="text-center text-xl mt-20">جاري تحميل الأسئلة أو لا توجد أسئلة متاحة. تحقق من الإعدادات وملفات البيانات.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white" dir="rtl">
      {/* الشريط العلوي */}
      <div className="flex items-center justify-between bg-blue-400 px-4 py-2 border-b border-blue-700">
        {/* اسم الاختبار */}
        <div className="font-bold text-white text-lg">أنت الآن في القسم {currentSection + 1}</div>
        {/* باقي العناصر */}
        <div className="flex items-center gap-3 flex-row-reverse">
          <select className="rounded px-2 py-1 text-black bg-white">
            <option>خط عادي</option>
            <option>خط كبير</option>
          </select>
          <button
            className={`bg-white/30 text-white px-3 py-1 rounded border border-white/50 ${flagged.includes(currentQ.question_number) ? 'ring-2 ring-yellow-400' : ''}`}
            onClick={() => toggleFlag(currentQ.question_number)}
            type="button"
          >
            {flagged.includes(currentQ.question_number) ? '★ مميز للمراجعة' : 'تمييز السؤال للمراجعة'}
          </button>
          <span className="text-white">{settings.examMode === 'sectioned' ? (current % 13) + 1 : current + 1} من {settings.examMode === 'sectioned' ? 13 : questions.length}</span>
          {settings.timerMode !== 'none' && (
            <span className="text-white flex items-center gap-1">
              <span>الوقت المتبقي:</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              <span>{formatTime(timeLeft)}</span>
            </span>
          )}
        </div>
      </div>

      {/* محتوى الصفحة */}
      <div className="flex-1 flex flex-row">
        {/* عمود السؤال والاختيارات */}
        <div className="w-1/2 flex flex-col justify-start items-start p-12">
          {/* نص الاستيعاب */}
          {currentQType === 'استيعاب المقروء' && currentQ.passage && (
            <div className={passageClass}>{currentQ.passage}</div>
          )}
          {/* السؤال */}
          <div className="text-2xl font-bold text-gray-900 text-center w-full mb-8">{currentQ.question}</div>
          {/* الخيارات */}
          <div className="flex flex-col gap-6 w-full">
            {(currentQ.choices || []).map((opt: string, i: number) => (
              <label
                key={i}
                className={radioLabelClass}
                dir="rtl"
              >
                <input
                  type="radio"
                  name={`answer_${currentQ.question_number}`}
                  checked={answers[currentQ.question_number] === i || answers[currentQ.question_number] === opt}
                  onChange={() => handleSelect(currentQ.choices.length === 2 ? opt : i)}
                  className="accent-[#03A9F4] w-5 h-5"
                />
                <span className="flex-1">{opt}</span>
              </label>
            ))}
          </div>
        </div>
        {/* عمود التعليمات */}
        <div className="w-1/2 bg-gray-50 border-r border-gray-200 flex flex-col justify-start p-12">
          <div className="text-2xl font-bold text-red-600 text-right w-full mb-8">{currentInstructions.title}</div>
          <div className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
            {currentInstructions.text}
          </div>
          {/* إذا في وضع مراجعة خاصة، أظهر عداد وأرقام الأسئلة */}
          {specialReview && (
            <div className="mt-8 bg-blue-100 border border-blue-300 rounded-lg p-4 text-center">
              <div className="font-bold text-blue-800 mb-2">عدد الأسئلة: {specialReview.list.length}</div>
              <div className="flex flex-wrap gap-2 justify-center">
                {specialReview.list.map((num, idx) => (
                  <span key={num} className={`px-3 py-1 rounded-full text-sm font-bold ${idx === specialReview.index ? 'bg-blue-600 text-white' : 'bg-white text-blue-700 border border-blue-400'}`}>سؤال {questions.findIndex(q => q.question_number === num) + 1}</span>
                ))}
              </div>
              <button className="mt-4 px-6 py-2 bg-blue-700 text-white rounded-lg font-bold" onClick={exitSpecialReview}>خروج من وضع المراجعة الخاصة</button>
            </div>
          )}
        </div>
      </div>

      {/* الشريط السفلي */}
      <div className="w-full bg-[#03A9F4] text-white flex items-center justify-between px-8 py-3">
        <button
          className="flex items-center gap-1 text-lg font-bold disabled:opacity-50"
          disabled={specialReview ? specialReview.index === 0 : current === 0}
          onClick={() => {
            if (specialReview) {
              handleSpecialPrev();
            } else {
              setCurrent((c) => Math.max(0, c - 1));
            }
          }}
        >
          ◀ السابق
        </button>
        {/* زر العودة لصفحة المراجعة في وضع المراجعة الخاصة */}
        {specialReview && (
          <button
            className="mx-4 px-6 py-2 bg-white text-blue-700 rounded-lg font-bold border border-blue-400 hover:bg-blue-100 transition"
            onClick={exitSpecialReview}
          >
            العودة لصفحة المراجعة
          </button>
        )}
        <button
          className="flex items-center gap-1 text-lg font-bold"
          onClick={() => {
            if (specialReview) {
              handleSpecialNext();
            } else if (settings.examMode === 'sectioned') {
              const nextQuestion = current + 1;
              if (currentSection === 4 && current % displayQuestions.length === displayQuestions.length - 1) {
                // آخر سؤال في آخر قسم: فعّل صفحة المراجعة النهائية
                setReviewMode(true);
              } else if (nextQuestion % displayQuestions.length === 0) {
                handleEndSection();
              } else {
                setCurrent(nextQuestion);
              }
            } else {
              setCurrent((c) => Math.min(questions.length - 1, c + 1));
            }
          }}
          disabled={specialReview ? specialReview.index === specialReview.list.length - 1 : (
            settings.examMode === 'sectioned'
              ? false // الزر مفعل دائمًا في وضع الأقسام
              : current === questions.length - 1
          )}
        >
          {settings.examMode === 'sectioned' && current % displayQuestions.length === displayQuestions.length - 1 && currentSection === 4
            ? 'مراجعة نهائية'
            : settings.examMode === 'sectioned' && current % displayQuestions.length === displayQuestions.length - 1
            ? 'إنهاء القسم'
            : 'التالي ▶'}
        </button>
      </div>
    </div>
  );
};

export default MockExamExam;
