import React, { useState, useEffect } from 'react';
import { LeafIcon, DropletIcon, HeartIcon, DollarIcon } from './icons/index.js';

// Alag-alag "quick log" ke questions
const logOptions = [
  {
    type: 'carbon',
    question: 'How did you commute today?',
    color: 'green',
  },
  {
    type: 'water',
    question: 'Logged your water usage?',
    color: 'blue',
  },
  {
    type: 'health',
    question: 'What did you have for lunch?',
    color: 'pink',
  },
  {
    type: 'finance',
    question: 'Any new expenses to log?',
    color: 'yellow',
  },
];

const QuickLog = ({ openModal }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Har 5 second mein question badalne ke liye
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % logOptions.length);
    }, 5000); // 5 seconds

    return () => clearTimeout(timer); // Cleanup
  }, [currentIndex]);

  const currentLog = logOptions[currentIndex];
  
  // Icon aur border color set karne ke liye
  const colors = {
    green: { text: 'text-green-700', border: 'border-green-300', hover: 'hover:bg-green-100' },
    blue: { text: 'text-blue-700', border: 'border-blue-300', hover: 'hover:bg-blue-100' },
    pink: { text: 'text-pink-700', border: 'border-pink-300', hover: 'hover:bg-pink-100' },
    yellow: { text: 'text-yellow-700', border: 'border-yellow-300', hover: 'hover:bg-yellow-100' },
  };
  const colorTheme = colors[currentLog.color];

  return (
    <div className="w-full max-w-2xl mx-auto mb-12">

        {/* ===== YEH RAHA BADLAAV (Glass Effect) ===== */}
      <div 
        key={currentLog.type}
        // 'bg-white/80' (80% transparent) aur 'backdrop-blur-lg' (peeche blur)
        className="bg-white/80 backdrop-blur-lg rounded-xl shadow-2xl p-6 border border-white/50 animate-fade-in"
      >
        {/* ======================================= */}
        <h3 className="text-lg font-semibold text-gray-600">Quick Log</h3> {/* Text thoda dark */}
      {/* <div 
        key={currentLog.type} // Yeh key 'fade' animation ko trigger karegi
        className="bg-white bg-opacity-70 backdrop-blur-md rounded-xl shadow-2xl p-6 border-t-4 animate-fade-in"
        style={{ '--tw-border-opacity': 0.5, borderColor: `var(--tw-color-${currentLog.color}-300)` }}
      >
        <h3 className="text-lg font-semibold text-gray-500">Quick Log</h3>
         */}

        {/* Animated Question */}
        <p className={`text-2xl font-bold ${colorTheme.text} mb-4`}>
          {currentLog.question}
        </p>

        
      <button
          onClick={() => openModal(currentLog.type)}
          // Button ko bhi thoda updated look denge
          className={`w-full py-3 px-4 rounded-lg border-2 ${colorTheme.border} ${colorTheme.hover} ${colorTheme.text} font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-2 bg-white/50`}
        >
          <span>Log {currentLog.type.charAt(0).toUpperCase() + currentLog.type.slice(1)}</span>
        </button>
      </div>
    </div>
  );
};


export default QuickLog;