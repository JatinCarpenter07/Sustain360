import React from 'react';
import { useParams, Link } from 'react-router-dom';
import AnalyticsDashboard from '../components/AnalyticsDashboard.jsx';

const ChartPage = () => {
  const { type } = useParams();
  return (
    <div className="p-6 md:p-8">
      <Link to="/dashboard" className="text-green-600 mb-4 inline-block">&larr; Back to Dashboard</Link>
      <h1 className="text-3xl md:text-4xl font-bold capitalize mb-6">{type} Analytics</h1>
      <AnalyticsDashboard type={type} />
    </div>
  );
};

export default ChartPage;