import React, { useState, useEffect } from 'react';
import { useExamStore } from './store/examStore';
import StartScreen from './components/StartScreen';
import QuestionDisplay from './components/QuestionDisplay';
import SectionReview from './components/SectionReview';
import ReviewScreen from './components/ReviewScreen';
import ResultsScreen from './components/ResultsScreen';
import FolderManagement from './components/FolderManagement';
import './App.css';
import { Analytics } from "@vercel/analytics/react"

function App() {
  const { 
    examStarted, 
    examCompleted, 
    reviewMode, 
    sectionReviewMode,
    examResults 
  } = useExamStore();
  
  const [showFolderManagement, setShowFolderManagement] = useState(false);
  const [error, setError] = useState(null);

  // Error boundary effect
  useEffect(() => {
    const handleError = (event) => {
      console.error('Global error caught:', event.error);
      setError('حدث خطأ في التطبيق. يرجى إعادة تحميل الصفحة.');
    };

    const handleUnhandledRejection = (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      setError('حدث خطأ في التطبيق. يرجى إعادة تحميل الصفحة.');
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // Clear error when component mounts
  useEffect(() => {
    setError(null);
  }, []);

  // If folder management is active, show it
  if (showFolderManagement && !examStarted) {
    return (
      <>
        <FolderManagement onBack={() => setShowFolderManagement(false)} />
        <Analytics />
      </>
    );
  }

  // Show error screen if there's an error
  if (error) {
    return (
      <div className="App">
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#dc2626', marginBottom: '20px' }}>خطأ في التطبيق</h2>
          <p style={{ marginBottom: '20px' }}>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              padding: '10px 20px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            إعادة تحميل الصفحة
          </button>
        </div>
        <Analytics />
      </div>
    );
  }

  return (
    <><div className="App">
      {/* Show results screen if exam is completed */}
      {examCompleted && examResults && <ResultsScreen />}

      {/* Show section review if in section review mode */}
      {examStarted && sectionReviewMode && !examCompleted && <SectionReview />}

      {/* Show review screen if in review mode */}
      {examStarted && reviewMode && !sectionReviewMode && !examCompleted && <ReviewScreen />}

      {/* Show question display if exam is started */}
      {examStarted && !reviewMode && !sectionReviewMode && !examCompleted && <QuestionDisplay />}

      {/* Show start screen by default */}
      {!examStarted && !examCompleted && (
        <StartScreen onShowFolderManagement={() => setShowFolderManagement(true)} />
      )}
    </div><Analytics /></>
  );
}

export default App;

