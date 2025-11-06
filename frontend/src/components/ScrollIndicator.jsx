import React from 'react';

// Yeh component "Scroll to Grow" indicator dikhayega
const ScrollIndicator = () => {
  return (
    // 'absolute bottom-10' se yeh Hero Section ke neeche, center mein rahega
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
      <div className="w-8 h-12 border-2 border-gray-800 rounded-full p-1">
        
        <div className="w-full h-2 bg-gray-800 rounded-full animate-bounce-short"></div>
      </div>
      <p className="mt-2 text-sm font-semibold text-gray-800 tracking-wide">
        Scroll to Grow
      </p>
    </div>
  );
};

export default ScrollIndicator;