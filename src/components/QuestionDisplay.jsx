<div
                  key={index}
                  className="flex flex-row-reverse items-center gap-2 cursor-pointer text-lg text-gray-900 font-normal w-full text-right"
                  onClick={() => handleAnswerSelect(index)}
                >
                  <RadioGroupItem
                    value={index.toString()}
                    id={`choice-${index}`}
                    className="accent-[#03A9F4] w-5 h-5"
                  />
                  <Label
                    htmlFor={`choice-${index}`}
                    className="flex-1 cursor-pointer"
                  >
                    {choice}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        {/* عمود التعليمات */}
        <div className="w-1/2 bg-gray-50 border-r border-gray-200 flex flex-col justify-start p-12">
          <div className="text-2xl font-bold text-red-600 text-right w-full mb-8">
            {currentInstructions.title}
          </div>
          <div className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
            {currentInstructions.text}
          </div>
        </div>
      </div>

      {/* الشريط السفلي */}
      <div className="w-full bg-[#03A9F4] text-white flex items-center justify-between px-8 py-3">
        <button
          className="flex items-center gap-1 text-lg font-bold disabled:opacity-50"
          disabled={!canGoPrevious()}
          onClick={handlePrevious}
        >
          ◀ السابق
        </button>

        {/* زر التأجيل في الوسط */}
        {!hideDeferButton && (
          <button
            onClick={handleDeferToggle}
            className={`mx-4 px-6 py-2 rounded-lg font-bold border transition ${
              isDeferred
                ? 'bg-yellow-500 text-black border-yellow-600'
                : 'bg-white/20 text-white border-white/50'
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
            className="mx-4 px-6 py-2 bg-purple-500 text-white rounded-lg font-bold border border-purple-600 hover:bg-purple-600 transition"
          >
            <Eye className="h-4 w-4 inline ml-2" />
            مراجعة القسم
          </button>
        )}

        <button
          className="flex items-center gap-1 text-lg font-bold"
          onClick={handleNext}
          disabled={!canProceed}
        >
          التالي ▶
        </button>
      </div>
    </div>
  );
};

export default QuestionDisplay;
