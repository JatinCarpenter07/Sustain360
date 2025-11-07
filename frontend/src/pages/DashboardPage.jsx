// import React, { useState } from 'react';
// import { useAuth } from '../AuthContext.jsx';
// import FunctionalCard from '../components/FunctionalCard.jsx';
// import LogActivityModal from '../components/LogActivityModal.jsx';
// import QuickLog from '../components/QuickLog.jsx';
// import { LeafIcon, DropletIcon, HeartIcon, DollarIcon } from '../components/icons/index.js';

// // Time ke hisaab se Greeting badlega
// const getGreeting = () => {
//   const hour = new Date().getHours();
//   if (hour < 12) return "Good Morning";
//   if (hour < 18) return "Good Afternoon";
//   return "Good Evening";
// };

// const DashboardPage = () => {
//     const { user } = useAuth();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [modalType, setModalType] = useState(null); // 'carbon', 'water', etc.

//   // Yeh function card se call hoga
//   const openModal = (type) => {
//     setModalType(type);
//     setIsModalOpen(true);
//   };

//   // Yeh modal se call hoga
//   const closeModal = () => {
//     setIsModalOpen(false);
//     setModalType(null);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-white">
      
//       {/* ===== 1. NAYA "WOW" HEADER ===== */}
//       <div className="relative w-full pt-16 pb-24 text-center z-10">
//         <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">
//           {getGreeting()}, {user?.Name || 'User'}!
//         </h1>
//         <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
//           "Your small actions today are shaping a better tomorrow. Let's log your impact."
//         </p>

//         {/* "Quick Log" Carousel (Naya Component) */}
//         <QuickLog openModal={openModal} />
//       </div>
      
//       {/* ===== STYLISH WAVE DIVIDER ===== */}
//       <div className="relative" style={{ zIndex: 5 }}>
//         <div className="absolute bottom-0 w-full h-20 bg-gray-50 -skew-y-2"></div>
//       </div>
      
//       {/* ===== 2. AAPKE 4 CARDS (Ab yeh tools jaise lagenge) ===== */}
//       <div className="relative bg-gray-50 pt-16 pb-24 px-8 z-0">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
//             Your Complete Dashboard
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//             <FunctionalCard
//               title="Carbon Footprint"
//               description="Log your travel and food."
//               icon={<LeafIcon className="w-8 h-8 text-green-700" />}
//               bgColor="bg-green-100"
//               linkTo="/dashboard/carbon"
//               onButtonClick={() => openModal('carbon')}
//             />
//             <FunctionalCard
//               title="Water Footprint"
//               description="Log your consumption."
//               icon={<DropletIcon className="w-8 h-8 text-blue-700" />}
//               bgColor="bg-blue-100"
//               linkTo="/dashboard/water"
//               onButtonClick={() => openModal('water')}
//             />
//             <FunctionalCard
//               title="Health & Wellness"
//               description="Log your activities."
//               icon={<HeartIcon className="w-8 h-8 text-pink-700" />}
//               bgColor="bg-pink-100"
//               linkTo="/dashboard/health"
//               onButtonClick={() => openModal('health')}
//             />
//             <FunctionalCard
//               title="Financial Health"
//               description="Log your expenses."
//               icon={<DollarIcon className="w-8 h-8 text-yellow-700" />}
//               bgColor="bg-yellow-100"
//               linkTo="/dashboard/finance"
//               onButtonClick={() => openModal('finance')}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Modal (Popup) - Yeh waise ka waisa hi rahega */}
//       <LogActivityModal
//         isOpen={isModalOpen}
//         onClose={closeModal}
//         activityType={modalType}
//       />
//     </div>
//   );
// };

// export default DashboardPage;


import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import FunctionalCard from '../components/FunctionalCard.jsx';
import LogActivityModal from '../components/LogActivityModal.jsx';
import QuickLog from '../components/QuickLog.jsx';
import { LeafIcon, DropletIcon, HeartIcon, DollarIcon } from '../components/icons/index.js';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  const [disabledCards, setDisabledCards] = useState({});

  // Function jo localStorage check karega
  const checkDisabledStatus = () => {
    const today = new Date().toLocaleDateString(); // e.g., "11/6/2025"
    const disabled = {};
    const types = ['carbon', 'water', 'health', 'finance'];
    
    types.forEach(type => {
      const lastLogDate = localStorage.getItem(`lastLog_${type}`);
      if (lastLogDate === today) {
        disabled[type] = true; // Disable karo
      }
    });
    setDisabledCards(disabled);
  };

  // Page load hote hi check karo
  useEffect(() => {
    checkDisabledStatus();
  }, []);

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    checkDisabledStatus();
  };

  return (
    // ===== YEH RAHA BADLAAV =====
    // Naya gradient background aur 'overflow-hidden' blobs ko kaabu mein rakhega
    <div className="min-h-screen w-full bg-gradient-to-br from-green-100 via-blue-50 to-pink-50 relative overflow-hidden">
      
      {/* ===== NAYE "BLOBS" (Background mein) ===== */}
      <div className="absolute top-0 -left-1/4 w-96 h-96 bg-green-300 rounded-full opacity-30 filter blur-3xl animate-blob-breathe z-0"></div>
      <div className="absolute top-1/4 -right-1/4 w-96 h-96 bg-blue-300 rounded-full opacity-30 filter blur-3xl animate-blob-breathe animation-delay-4000 z-0"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-300 rounded-full opacity-30 filter blur-3xl animate-blob-breathe animation-delay-2000 z-0"></div>
      
      {/* ===== Saara content "z-10" (Blobs ke oopar) rahega ===== */}
      <div className="relative z-10">
        
        {/* 1. "WOW" HEADER */}
        <div className="relative w-full pt-16 pb-24 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">
            {getGreeting()}, {user?.Name || 'User'}!
          </h1>
          <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
            "Your small actions today are shaping a better tomorrow. Let's log your impact."
          </p>
          <QuickLog openModal={openModal} />
            {/* Personal Fitness navigation button */}
          <div className="mb-10 flex justify-center">
            <div
              onClick={() => navigate('/fitness-details')}
              className="cursor-pointer bg-gradient-to-r from-green-400 to-blue-400 text-white shadow-md rounded-2xl p-6 w-[280px] sm:w-[300px] md:w-[340px] hover:scale-105 transform transition-all duration-300 flex flex-col items-center justify-center"
            >
              <div className="bg-white p-3 rounded-full mb-3 shadow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-10 h-10 text-green-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6l4 2m4-8A9 9 0 11 3 12a9 9 0 0117 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold tracking-wide">Personal Fitness</h3>
              <p className="text-sm text-white/90 text-center mt-2">
                Track your wellness, health, and finance insights
              </p>
            </div>
          </div>
        </div>

        {/* 2. AAPKE 4 CARDS (Wave divider ki ab zaroorat nahi) */}
        <div className="relative pt-4 pb-24 px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
              Your Complete Dashboard
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Cards ab "glass" effect waale component se aayenge */}
              <FunctionalCard
                title="Carbon Footprint"
                description="Log your travel and food."
                icon={<LeafIcon className="w-8 h-8 text-green-700" />}
                bgColor="bg-green-100"
                linkTo="/dashboard/carbon"
                onButtonClick={() => openModal('carbon')}
                isDisabled={disabledCards['carbon']}
              />
              <FunctionalCard
                title="Water Footprint"
                description="Log your consumption."
                icon={<DropletIcon className="w-8 h-8 text-blue-700" />}
                bgColor="bg-blue-100"
                linkTo="/dashboard/water"
                onButtonClick={() => openModal('water')}
                isDisabled={disabledCards['water']} // NAYA PROP
              />
              <FunctionalCard
                title="Health & Wellness"
                description="Log your activities."
                icon={<HeartIcon className="w-8 h-8 text-pink-700" />}
                bgColor="bg-pink-100"
                linkTo="/dashboard/health"
                onButtonClick={() => openModal('health')}
                isDisabled={disabledCards['health']} // NAYA PROP
              />
              <FunctionalCard
                title="Financial Health"
                description="Log your expenses."
                icon={<DollarIcon className="w-8 h-8 text-yellow-700" />}
                bgColor="bg-yellow-100"
                linkTo="/dashboard/finance"
                onButtonClick={() => openModal('finance')}
                isDisabled={disabledCards['finance']} // NAYA PROP
              />
            </div>
          </div>
        </div>

        <LogActivityModal
          isOpen={isModalOpen}
          onClose={closeModal}
          activityType={modalType}
        />
      </div>
    </div>
  );
};

export default DashboardPage;