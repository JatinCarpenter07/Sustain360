import React from 'react';

// Helper function jo total nikaalega
const getTotalValue = (record, type) => {
  switch (type) {
    case 'carbon':
      return `${record.totalKgCO2.toFixed(2)} kg CO2`;
    case 'water':
      return `${record.totalLiters.toFixed(2)} Liters`;
    case 'health':
      return `${record.wellnessScore} / 100`;
    case 'finance':
      return `${record.score} / 100`;
    default:
      return 'N/A';
  }
};

const HistoryRow = ({ record, type, onClick }) => {
  return (
    // Poora row clickable hai
    <div 
      onClick={onClick}
      className="bg-white/70 backdrop-blur-lg rounded-xl shadow-lg p-4 border border-white/50 cursor-pointer transition-all hover:shadow-xl hover:scale-105"
    >
      <div className="flex justify-between items-center">
        {/* Left: Date */}
        <div>
          <p className="text-sm font-medium text-gray-700">
            {new Date(record.date).toLocaleDateString()}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(record.date).toLocaleTimeString()}
          </p>
        </div>
        {/* Right: Total Value */}
        <div className="text-right">
          <p className="text-2xl font-bold text-green-600">
            {getTotalValue(record, type)}
          </p>
          <p className="text-xs text-gray-500">Click to view details</p>
        </div>
      </div>
    </div>
  );
};

export default HistoryRow;