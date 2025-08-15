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
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(10); // ط¹ط¯ط¯ ط§ظ„ظ†طھط§ط¦ط¬ ظپظٹ ظƒظ„ طµظپط­ط©

  // Combine all data sources
  const allData = [
    ...analogyData,
    ...completionData,
    ...errorData,
    ...oddData,
    ...rcbank4Data,
    ...rcbank5Data
  ];

  const categories = [
    { value: 'all', label: 'ط¬ظ…ظٹط¹ ط§ظ„ظپط¦ط§طھ', icon: BookOpen },
    { value: 'ط§ظ„طھظ†ط§ط¸ط± ط§ظ„ظ„ظپط¸ظٹ', label: 'ط§ظ„طھظ†ط§ط¸ط± ط§ظ„ظ„ظپط¸ظٹ', icon: Brain },
    { value: 'ط¥ظƒظ…ط§ظ„ ط§ظ„ط¬ظ…ظ„', label: 'ط¥ظƒظ…ط§ظ„ ط§ظ„ط¬ظ…ظ„', icon: Target },
    { value: 'ط§ظ„ط®ط·ط£ ط§ظ„ط³ظٹط§ظ‚ظٹ', label: 'ط§ظ„ط®ط·ط£ ط§ظ„ط³ظٹط§ظ‚ظٹ', icon: Lightbulb },
    { value: 'ط§ظ„ظ…ظپط±ط¯ط© ط§ظ„ط´ط§ط°ط©', label: 'ط§ظ„ظ…ظپط±ط¯ط© ط§ظ„ط´ط§ط°ط©', icon: Sparkles },
    { value: 'ط§ط³طھظٹط¹ط§ط¨ ط§ظ„ظ…ظ‚ط±ظˆط،', label: 'ط§ط³طھظٹط¹ط§ط¨ ط§ظ„ظ…ظ‚ط±ظˆط،', icon: BookOpen }
  ];

  const performSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setCurrentPage(1);
      return;
    }

    setIsLoading(true);
    
    // Simulate search delay for better UX
    setTimeout(() => {
      const filteredData = allData.filter(item => {
        const matchesQuery = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (item.choices && item.choices.some(choice => 
                             choice.toLowerCase().includes(searchQuery.toLowerCase())
                           )) ||
                           (item.answer && item.answer.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        
        return matchesQuery && matchesCategory;
      });

      setSearchResults(filteredData);
      setCurrentPage(1); // Reset to first page when new search
      setIsLoading(false);
    }, 300);
  };

  useEffect(() => {
    performSearch();
  }, [searchQuery, selectedCategory]);

  // Calculate pagination
  const totalPages = Math.ceil(searchResults.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const currentResults = searchResults.slice(startIndex, endIndex);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const highlightText = (text, query) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-300 text-black px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  const getCategoryIcon = (category) => {
    const categoryData = categories.find(cat => cat.value === category);
    return categoryData ? categoryData.icon : BookOpen;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'ط§ظ„طھظ†ط§ط¸ط± ط§ظ„ظ„ظپط¸ظٹ': 'from-violet-500 to-purple-600',
      'ط¥ظƒظ…ط§ظ„ ط§ظ„ط¬ظ…ظ„': 'from-emerald-500 to-teal-600',
      'ط§ظ„ط®ط·ط£ ط§ظ„ط³ظٹط§ظ‚ظٹ': 'from-rose-500 to-pink-600',
      'ط§ط³طھظٹط¹ط§ط¨ ط§ظ„ظ…ظ‚ط±ظˆط،': 'from-amber-500 to-orange-600',
      'ط§ظ„ظ…ظپط±ط¯ط© ط§ظ„ط´ط§ط°ط©': 'from-cyan-500 to-blue-600'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-slate-900 to-gray-900 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden border border-gray-700"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Search className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">ط§ظ„ط¨ط­ط« ظپظٹ ط§ظ„ط£ط³ط¦ظ„ط©</h2>
                <p className="text-gray-300">ط§ط¨ط­ط« ظپظٹ ظ‚ط§ط¹ط¯ط© ط¨ظٹط§ظ†ط§طھ ط§ظ„ط£ط³ط¦ظ„ط©</p>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white hover:bg-gray-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Search Controls */}
        <div className="p-6 border-b border-gray-700 bg-gray-800/50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="ط§ط¨ط­ط« ظپظٹ ط§ظ„ط£ط³ط¦ظ„ط© ظˆط§ظ„ط¥ط¬ط§ط¨ط§طھ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
              />
            </div>
            <div className="md:w-64">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="ط§ط®طھط± ط§ظ„ظپط¦ط©" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {categories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <SelectItem key={category.value} value={category.value} className="text-white hover:bg-gray-700">
                        <div className="flex items-center gap-2">
                          <IconComponent className="h-4 w-4" />
                          {category.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 300px)' }}>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="mr-3 text-gray-400">ط¬ط§ط±ظٹ ط§ظ„ط¨ط­ط«...</span>
            </div>
          ) : searchQuery.trim() === '' ? (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">ط§ط¨ط¯ط£ ط§ظ„ط¨ط­ط«</h3>
              <p className="text-gray-500">ط§ظƒطھط¨ ظƒظ„ظ…ط© ط£ظˆ ط¹ط¨ط§ط±ط© ظ„ظ„ط¨ط­ط« ظپظٹ ظ‚ط§ط¹ط¯ط© ط¨ظٹط§ظ†ط§طھ ط§ظ„ط£ط³ط¦ظ„ط©</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">ظ„ط§ طھظˆط¬ط¯ ظ†طھط§ط¦ط¬</h3>
              <p className="text-gray-500">ط¬ط±ط¨ ظƒظ„ظ…ط§طھ ظ…ط®طھظ„ظپط© ط£ظˆ ط؛ظٹط± ط§ظ„ظپط¦ط© ط§ظ„ظ…ط­ط¯ط¯ط©</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">
                  ط§ظ„ظ†طھط§ط¦ط¬ ({searchResults.length})
                </h3>
                <div className="text-sm text-gray-400">
                  ط§ظ„ط¨ط­ط« ط¹ظ†: "{searchQuery}" - ط§ظ„طµظپط­ط© {currentPage} ظ…ظ† {totalPages}
                </div>
              </div>
              
              {/* Current Page Results */}
              <AnimatePresence>
                {currentResults.map((question, index) => {
                  const IconComponent = getCategoryIcon(question.category);
                  return (
                    <motion.div
                      key={`${question.question_number}-${question.exam}-${index}-${currentPage}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-6 border border-gray-600 hover:border-gray-500 transition-all duration-300"
                    >
                      {/* Question Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${getCategoryColor(question.category)}`}>
                            <IconComponent className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-blue-400">
                              {question.category}
                            </span>
                            <div className="text-xs text-gray-400">
                              {question.exam} - ط³ط¤ط§ظ„ ط±ظ‚ظ… {question.question_number}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          #{startIndex + index + 1}
                        </div>
                      </div>

                      {/* Question Text */}
                      <div className="mb-4">
                        <h4 className="text-lg font-semibold text-white mb-2">
                          {highlightText(question.question, searchQuery)}
                        </h4>
                      </div>

                      {/* Choices */}
                      {question.choices && question.choices.length > 0 && (
                        <div className="mb-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {question.choices.map((choice, choiceIndex) => (
                              <div
                                key={choiceIndex}
                                className={`p-3 rounded-lg border transition-all duration-200 ${
                                  choice === question.answer
                                    ? 'bg-green-900/30 border-green-500 text-green-300'
                                    : 'bg-gray-700/50 border-gray-600 text-gray-300'
                                }`}
                              >
                                <span className="text-sm">
                                  {highlightText(choice, searchQuery)}
                                </span>
                                {choice === question.answer && (
                                  <span className="mr-2 text-xs text-green-400">âœ“ ط§ظ„ط¥ط¬ط§ط¨ط© ط§ظ„طµط­ظٹط­ط©</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Answer (for non-multiple choice questions) */}
                      {question.answer && (!question.choices || question.choices.length === 0) && (
                        <div className="mb-4">
                          <div className="p-3 bg-green-900/30 border border-green-500 rounded-lg">
                            <span className="text-sm text-green-300 font-medium">ط§ظ„ط¥ط¬ط§ط¨ط©: </span>
                            <span className="text-green-300">
                              {highlightText(question.answer, searchQuery)}
                            </span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-gray-700">
                  {/* Previous Button */}
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant="outline"
                    size="sm"
                    className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-4 w-4" />
                    ط§ظ„ط³ط§ط¨ظ‚
                  </Button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) => (
                      <React.Fragment key={index}>
                        {page === '...' ? (
                          <span className="px-3 py-2 text-gray-400">...</span>
                        ) : (
                          <Button
                            onClick={() => handlePageChange(page)}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            className={`min-w-[40px] ${
                              currentPage === page
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                            }`}
                          >
                            {page}
                          </Button>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Next Button */}
                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    size="sm"
                    className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ط§ظ„طھط§ظ„ظٹ
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Results Summary */}
              {searchResults.length > 0 && (
                <div className="text-center text-sm text-gray-400 mt-4">
                  ط¹ط±ط¶ {startIndex + 1} - {Math.min(endIndex, searchResults.length)} ظ…ظ† {searchResults.length} ظ†طھظٹط¬ط©
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SearchComponent;
