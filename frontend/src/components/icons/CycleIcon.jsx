import React from 'react';

export const CycleIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.1c5 0 9 4 9 9s-4 9-9 9-9-4-9-9 4-9 9-9z" />
    <path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
    <path d="M12 12a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
    <path d="M12 12a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
  </svg>
);