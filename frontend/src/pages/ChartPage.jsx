// import React from 'react';
// import { useParams, Link } from 'react-router-dom';

// const ChartPage = () => {
//   const { type } = useParams(); // URL se 'carbon', 'water' etc. lega

//   return (
//     <div className="p-8">
//       <Link to="/dashboard" className="text-green-600 mb-4 inline-block">&larr; Back to Dashboard</Link>
//       <h1 className="text-4xl font-bold capitalize mb-8">{type} Footprint</h1>
      
//       <div className="bg-white p-6 rounded-lg shadow-lg">
//         <h2 className="text-2xl font-semibold mb-4">Your Previous Data</h2>
//         <p>Yahaan {type} ka chart (Recharts/D3.js) aayega.</p>
//         {/*  */}
//         <div className="h-64 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
//           (Chart Placeholder)
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChartPage;

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