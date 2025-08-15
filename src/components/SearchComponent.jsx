import React, { useState, useEffect } from 'react';
import { Search, X, Filter, BookOpen, Brain, Target, Lightbulb, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';

// Import all JSON data files
import analogyData from '../data/analogy.json';
import completionData from '../data/completion.json';
import errorData from '../data/error.json';
import oddData from '../data/odd.json';
import rcbank4Data from '../data/rcbank4.json';
import rcbank5Data from '../data/rcbank5.json';

const SearchComponent = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(8); // عدد أقل من النتائج لتركيز أكبر

  // Combine all data sources into a memoized constant
  const allData = React.useMemo(() => [
    ...analogyData,
    ...completionData,
    ...errorData,
    ...oddData,
    ...rcbank4Data,
    ...rcbank5Data
  ], []);

  const categories = [
    { value: 'all', label: 'جميع الفئات', icon: BookOpen, color: 'from-gray-500 to-gray-600' },
    { value: 'التناظر اللفظي', label: 'التناظر اللفظي', icon: Brain, color: 'from-violet-500 to-purple-600' },
    { value: 'إكمال الجمل', label: 'إكمال الجمل', icon: Target, color: 'from-emerald-500 to-teal-600' },
    { value: 'الخطأ السياقي', label: 'الخطأ السياقي', icon: Lightbulb, color: 'from-rose-500 to-pink-600' },
    { value: 'المفردة الشاذة', label: 'المفردة الشاذة', icon: Sparkles, color: 'from-cyan-500 to-blue-600' },
    { value: 'استيعاب المقروء', label: 'استيعاب المقروء', icon: BookOpen, color: 'from-amber-500 to-orange-600' }
  ];

  useEffect(() => {
    const performSearch = () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setCurrentPage(1);
        return;
      }

      setIsLoading(true);
      
      // Debounce search to avoid excessive calls
      const handler = setTimeout(() => {
        const filteredData = allData.filter(item => {
          const query = searchQuery.toLowerCase();
          const matchesQuery = item.question.toLowerCase().includes(query) ||
                             (item.choices && item.choices.some(choice => choice.toLowerCase().includes(query))) ||
                             (item.answer && item.answer.toLowerCase().includes(query));
          
          const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
          
          return matchesQuery && matchesCategory;
        });

        setSearchResults(filteredData);
        setCurrentPage(1);
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(handler);
    };

    performSearch();
  }, [searchQuery, selectedCategory, allData]);

  const totalPages = Math.ceil(searchResults.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const currentResults = searchResults.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      document.getElementById('search-results-container')?.scrollTo(0, 0);
    }
  };

  const highlightText = (text, query) => {
    if (!query.trim() || !text) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.split(regex).map((part, index) => 
      regex.test(part) ? <mark key={index} className="bg-yellow-400/80 text-black px-1 rounded-sm">{part}</mark> : part
    );
  };

  const getCategoryInfo = (category) => {
    return categories.find(cat => cat.value === category) || categories[0];
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-lg z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 20, stiffness: 150 }}
        className="bg-slate-900/80 bg-gradient-to-b from-gray-900/50 to-slate-900/50 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-gray-700 flex flex-col"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Header */}
        <header className="p-5 border-b border-gray-700/80 bg-black/20 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: [0, 15, -10, 5, 0] }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg"
              >
                <Search className="h-7 w-7 text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-wide">بحث متقدم</h2>
                <p className="text-gray-400 text-sm">استكشف قاعدة بيانات الأسئلة بذكاء</p>
              </div>
            </div>
            <Button onClick={onClose} variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-full">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Search Controls */}
        <div className="p-5 border-b border-gray-700/80 bg-slate-800/40 flex-shrink-0">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5 pointer-events-none" />
              <Input
                type="text"
                placeholder="اكتب كلمة، عبارة، أو جزء من سؤال..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pr-12 pl-4 bg-gray-800/80 border-2 border-gray-700 text-white placeholder-gray-500 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
              />
            </div>
            <div className="md:w-60">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full h-12 bg-gray-800/80 border-2 border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500/50">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <SelectValue placeholder="اختر الفئة" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {categories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <SelectItem key={category.value} value={category.value} className="focus:bg-blue-600/50">
                        <div className="flex items-center gap-3 py-1">
                          <IconComponent className="h-5 w-5" />
                          <span>{category.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Area */}
        <main id="search-results-container" className="flex-1 overflow-y-auto p-6 bg-black/10">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400 mb-4"></div>
              <p className="text-lg font-semibold">جاري البحث...</p>
            </div>
          ) : searchQuery.trim() === '' ? (
            <div className="text-center h-full flex flex-col justify-center items-center text-gray-500">
              <Sparkles className="h-20 w-20 mb-6 opacity-30" />
              <h3 className="text-2xl font-bold text-gray-300 mb-2">أطلق العنان للبحث</h3>
              <p>اكتب في الشريط أعلاه للعثور على ما تبحث عنه.</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center h-full flex flex-col justify-center items-center text-gray-500">
              <Search className="h-20 w-20 mb-6 opacity-30" />
              <h3 className="text-2xl font-bold text-gray-300 mb-2">لم يتم العثور على نتائج</h3>
              <p>جرّب كلمات بحث مختلفة أو قم بتغيير الفئة المحددة.</p>
            </div>
          ) : (
            <div>
              <header className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-white">
                  النتائج <span className="text-blue-400">({searchResults.length})</span>
                </h3>
                <div className="text-sm text-gray-400">
                  صفحة {currentPage} / {totalPages}
                </div>
              </header>
              
              <motion.div
                className="grid grid-cols-1 lg:grid-cols-2 gap-5"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {currentResults.map((q, index) => {
                  const categoryInfo = getCategoryInfo(q.category);
                  const IconComponent = categoryInfo.icon;
                  return (
                    <motion.div
                      key={`${q.question_number}-${q.exam}-${index}`}
                      variants={itemVariants}
                      className={`relative bg-gray-800/70 rounded-xl p-5 border border-gray-700 transition-all duration-300 group hover:border-blue-500/80 hover:shadow-lg hover:shadow-blue-900/20`}
                    >
                      <div className={`absolute -top-3 -right-3 p-3 rounded-full bg-gray-900 border-2 border-gray-700 bg-gradient-to-br ${categoryInfo.color}`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="font-bold text-blue-400">{q.category}</span>
                          <p className="text-xs text-gray-400 mt-1">{q.exam} | سؤال #{q.question_number}</p>
                        </div>
                      </div>

                      <p className="text-lg font-medium text-white mb-4 min-h-[56px]">
                        {highlightText(q.question, searchQuery)}
                      </p>

                      {q.choices && q.choices.length > 0 && (
                        <div className="space-y-2">
                          {q.choices.map((choice, i) => (
                            <div
                              key={i}
                              className={`p-3 rounded-md text-sm transition-all duration-200 ${
                                choice === q.answer
                                  ? 'bg-green-500/10 border border-green-500/50 text-green-300'
                                  : 'bg-gray-700/50 border border-transparent text-gray-300'
                              }`}
                            >
                              {highlightText(choice, searchQuery)}
                              {choice === q.answer && <span className="font-bold text-xs mr-2">(الإجابة الصحيحة)</span>}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {q.answer && !q.choices && (
                         <div className="p-3 rounded-md bg-green-500/10 border border-green-500/50">
                            <span className="text-sm text-green-300 font-medium">الإجابة: </span>
                            <span className="text-green-300">{highlightText(q.answer, searchQuery)}</span>
                          </div>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>

              {totalPages > 1 && (
                <footer className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-gray-700/60">
                  <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} variant="outline" className="bg-gray-800 border-gray-700 hover:bg-gray-700 disabled:opacity-50">
                    <ChevronRight className="h-4 w-4 ml-1" /> السابق
                  </Button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button key={page} onClick={() => handlePageChange(page)} variant={currentPage === page ? "default" : "ghost"} size="icon" className={currentPage === page ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-gray-700'}>
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} variant="outline" className="bg-gray-800 border-gray-700 hover:bg-gray-700 disabled:opacity-50">
                    التالي <ChevronLeft className="h-4 w-4 mr-1" />
                  </Button>
                </footer>
              )}
            </div>
          )}
        </main>
      </motion.div>
    </motion.div>
  );
};

export default SearchComponent;
