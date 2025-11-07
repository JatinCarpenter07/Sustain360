import React from 'react';

// Yeh aapka naya "three dot" menu icon hai
export const ThreeDotsIcon = ({ className = "w-6 h-6" }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor" // 'fill' use karega, 'stroke' nahi
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Dot 1 (Top) */}
    <path d="M12 5.5C13.1046 5.5 14 4.60457 14 3.5C14 2.39543 13.1046 1.5 12 1.5C10.8954 1.5 10 2.39543 10 3.5C10 4.60457 10.8954 5.5 12 5.5Z" />
    {/* Dot 2 (Middle) */}
    <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" />
    {/* Dot 3 (Bottom) */}
    <path d="M12 22.5C13.1046 22.5 14 21.6046 14 20.5C14 19.3954 13.1046 18.5 12 18.5C10.8954 18.5 10 19.3954 10 20.5C10 21.6046 10.8954 22.5 12 22.5Z" />
  </svg>
);