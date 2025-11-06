// import React from 'react';

// export const LeafIcon = ({ className = "w-6 h-6" }) => (
//   <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <path d="M12 22C12 22 20 18 20 12C20 6 12 2 12 2C12 2 4 6 4 12C4 18 12 22 12 22Z" fill="#16A34A" fillOpacity="0.1"/>
//     <path d="M12 22C12 22 20 18 20 12C20 6 12 2 12 2C12 2 4 6 4 12C4 18 12 22 12 22Z" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//     <path d="M12 22L12 2" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//     <path d="M12 22C12 22 16.0967 19.3333 17 12C17.9033 4.66667 12 2 12 2" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//   </svg>
// );
import React from 'react';

// Naya, clean, solid-fill footprint icon
export const LeafIcon = ({ className = "w-6 h-6" }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor" // 'fill' use karega, 'stroke' nahi
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Yeh 'talwa' (sole) hai */}
    <path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M10.5 12C9.09 12.37 7.74 13.23 6.8 14.5C4.71 17.21 5.53 21 8.24 23.09C10.95 25.18 14.79 24.36 16.88 21.65C17.92 20.24 18.25 18.5 17.76 17C17.76 17 14 16.5 10.5 12Z" 
    />
    
    {/* Yeh 'ungliyaan' (toes) hain */}
    <path d="M8.5 3C7.67157 3 7 3.67157 7 4.5C7 5.32843 7.67157 6 8.5 6C9.32843 6 10 5.32843 10 4.5C10 3.67157 9.32843 3 8.5 3Z" />
    <path d="M11.5 2C10.6716 2 10 2.67157 10 3.5C10 4.32843 10.6716 5 11.5 5C12.3284 5 13 4.32843 13 3.5C13 2.67157 12.3284 2 11.5 2Z" />
    <path d="M15 4C14.1716 4 13.5 4.67157 13.5 5.5C13.5 6.32843 14.1716 7 15 7C15.8284 7 16.5 6.32843 16.5 5.5C16.5 4.67157 15.8284 4 15 4Z" />
    <path d="M17.5 7C16.6716 7 16 7.67157 16 8.5C16 9.32843 16.6716 10 17.5 10C18.3284 10 19 9.32843 19 8.5C19 7.67157 18.3284 7 17.5 7Z" />
  </svg>
);