import React from 'react';
import { Link } from 'react-router-dom';

const FunctionalCard = ({ title, description, icon, bgColor, linkTo, onButtonClick }) => {
  return (
   <div className="bg-white/70 backdrop-blur-lg shadow-2xl rounded-xl overflow-hidden flex flex-col border border-white/50">
      {/* ======================================= */}
      <Link to={linkTo} className="block p-6 hover:bg-white/50 transition-colors">
        <div className={`p-4 rounded-full ${bgColor} w-16 h-16 mb-4`}>
          {icon}
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-700">{description}</p> {/* Text thoda dark */}
      </Link>
      
      {/* Card ke neeche button (border-t se line aayegi) */}
      <div className="p-4 bg-white/50 border-t border-gray-200/50 mt-auto">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onButtonClick();
          }}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Log Today's Activity
        </button>
      </div>
    </div>
  );
};

export default FunctionalCard;