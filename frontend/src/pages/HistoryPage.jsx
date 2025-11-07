import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import axios from 'axios';
import toast from 'react-hot-toast';

import HistoryRow from '../components/HistoryRow.jsx'; // Naya component
import LogDetailModal from '../components/LogDetailModal.jsx'; // Naya modal

const HistoryPage = () => {
  const { type } = useParams(); // 'carbon', 'water', etc.
  const { token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState({ data: [], page: 1, totalPages: 1 });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState(null); // Kaunsa record modal mein dikhana hai

  // NAYI STATES (Date filter ke liye)
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({
    start: '',
    end: '',
  });

  // useEffect: Yeh API call karega
  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        // API params ab state se aayenge
        const params = {
          page: currentPage,
          limit: 10, // Ek baar mein 10 record
        };

        // Agar user ne date select ki hai, toh hi bhejo
        if (appliedFilters.start) {
          params.start = appliedFilters.start;
        }
        if (appliedFilters.end) {
          params.end = appliedFilters.end;
        }
        // ======================================

        const response = await axios.get(
          `http://localhost:5000/api/${type}/getHistory`, // (e.g., /api/carbon/getHistory)
          {
            headers: { 'Authorization': `Bearer ${token}` },
            params: params // Naye params yahaan pass karo
          }
        );
        setPageData(response.data);
      } catch (err) {
        console.error("Failed to fetch history:", err);
        toast.error('Could not load history.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [type, token, currentPage, appliedFilters]); // appliedFilters par depend karega
  
  // "Filter" button dabane par
  const handleFilterApply = () => {
    setCurrentPage(1); // Page ko 1 par reset karo
    setAppliedFilters({ start: startDate, end: endDate }); // Naye filters set karo (isse API call trigger hogi)
  };

  // "Clear" button dabane par
  const handleFilterClear = () => {
    setCurrentPage(1); // Page ko 1 par reset karo
    setStartDate('');
    setEndDate('');
    setAppliedFilters({ start: '', end: '' }); // Filters clear karo (isse API call trigger hogi)
  };

  return (
    // Dashboard waala "Glassmorphism" background
    <div className="min-h-screen w-full bg-gradient-to-br from-green-100 via-blue-50 to-pink-50 relative overflow-hidden p-8 pt-16">
      {/* Background Blobs */}
      <div className="absolute top-0 -left-1/4 w-96 h-96 bg-green-300 rounded-full opacity-30 filter blur-3xl animate-blob-breathe z-0"></div>
      <div className="absolute top-1/4 -right-1/4 w-96 h-96 bg-blue-300 rounded-full opacity-30 filter blur-3xl animate-blob-breathe animation-delay-4000 z-0"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <Link to="/dashboard" className="text-green-600 mb-4 inline-block font-semibold">&larr; Back to Dashboard</Link>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-10 text-center capitalize">
          {type} History Log
        </h1>
        
        {/* NAYA FILTER BAR */}
        <div className="bg-white/70 backdrop-blur-lg rounded-xl shadow-lg p-4 border border-white/50 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* Start Date */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 block w-full appearance-none px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
            {/* End Date */}
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 block w-full appearance-none px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>
            {/* Filter Button */}
            <button
              onClick={handleFilterApply}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700 disabled:bg-gray-400"
            >
              Filter
            </button>
            {/* Clear Button */}
            <button
              onClick={handleFilterClear}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
              Clear
            </button>
          </div>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="text-center text-gray-700 font-semibold">Loading history...</div>
        )}

        {/* Data List */}
        {!loading && (
          <div className="space-y-4">
            {pageData.data.length > 0 ? (
              pageData.data.map(record => (
                <HistoryRow 
                  key={record._id} 
                  record={record} 
                  type={type}
                  onClick={() => setSelectedRecord(record)} // Click karke record set karo
                />
              ))
            ) : (
              <div className="bg-white/70 backdrop-blur-lg rounded-xl shadow-lg p-8 border border-white/50 text-center text-gray-500">
                No history found for these dates.
              </div>
            )}
          </div>
        )}

        {/* Pagination Buttons */}
        {!loading && pageData.totalPages > 1 && (
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={() => setCurrentPage(p => p - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700 disabled:bg-gray-400"
            >
              Previous
            </button>
            <span className="text-sm font-medium text-gray-700">
              Page {pageData.page} of {pageData.totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage === pageData.totalPages}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700 disabled:bg-gray-400"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Yeh raha "paagal" level ka Modal */}
      {/* Yeh tabhi render hoga jab 'selectedRecord' set hoga */}
      <LogDetailModal 
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        record={selectedRecord}
        type={type}
      />
    </div>
  );
};

export default HistoryPage;