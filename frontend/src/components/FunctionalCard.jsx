// import React, { Fragment } from 'react';
// import { Link } from 'react-router-dom';
// import { Menu, Transition } from '@headlessui/react'; // Dropdown ke liye
// import { ThreeDotsIcon } from './icons/index.js'; // 3-dot icon

// const FunctionalCard = ({ title, description, icon, bgColor, linkTo, onButtonClick }) => {
//   return (
//    <div className="bg-white/70 backdrop-blur-lg shadow-2xl rounded-xl overflow-hidden flex flex-col border border-white/50">
//       {/* ======================================= */}
//       <Link to={linkTo} className="block p-6 hover:bg-white/50 transition-colors">
//         <div className={`p-4 rounded-full ${bgColor} w-16 h-16 mb-4`}>
//           {icon}
//         </div>
//         <h3 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h3>
//         <p className="text-gray-700">{description}</p> {/* Text thoda dark */}
//       </Link>
      
//       {/* Card ke neeche button (border-t se line aayegi) */}
//       <div className="p-4 bg-white/50 border-t border-gray-200/50 mt-auto">
//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             onButtonClick();
//           }}
//           className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//         >
//           Log Today's Activity
//         </button>
//       </div>
//     </div>
//   );
// };

// export default FunctionalCard;

import React, { Fragment } from 'react'; // Fragment import karo
import { Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react'; // Dropdown ke liye
import { ThreeDotsIcon } from './icons/index.js'; // 3-dot icon
import toast from 'react-hot-toast';// NAYA IMPORT (Error dikhane ke liye)

const FunctionalCard = ({ title, description, icon, bgColor, linkTo, onButtonClick, isDisabled }) => {

    // ===== NAYA CLICK HANDLER =====
  const handleLogClick = (e) => {
    e.stopPropagation();
    if (isDisabled) {
      // Agar disable hai, toh error toast dikhao
      toast.error("You've already made today's log. Come back tomorrow!");
    } else {
      // Agar disable nahi hai, toh modal kholo
      onButtonClick();
    }
  };
  // ==============================
  return (
    // ===== YEH RAHA BADLAAV (Glass Effect + 'relative') =====
    <div className="relative bg-white/70 backdrop-blur-lg shadow-2xl rounded-xl overflow-hidden flex flex-col border border-white/50">
      
      {/* ===== NAYA 3-DOT MENU (Top Right) ===== */}
      <div className="absolute top-4 right-4 z-10">
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="flex items-center text-gray-500 rounded-full p-1.5 hover:bg-gray-200 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500">
              <span className="sr-only">Open options</span>
              <ThreeDotsIcon className="w-5 h-5" />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                {/* Option 1: Analytics */}
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to={linkTo} // e.g., /dashboard/carbon
                      className={`${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } block px-4 py-2 text-sm`}
                    >
                      Analytics
                    </Link>
                  )}
                </Menu.Item>
                {/* Option 2: History */}
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to={`${linkTo}/history`} // e.g., /dashboard/carbon/history
                      className={`${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } block px-4 py-2 text-sm`}
                    >
                      History
                    </Link>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
      
      {/* ===== YEH RAHA BADLAAV (Link wrapper HATA diya) ===== */}
      {/* Ab yeh bas ek 'div' hai, clickable nahi */}
      <div className="block p-6">
        <div className={`p-4 rounded-full ${bgColor} w-16 h-16 mb-4`}>
          {icon}
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-700">{description}</p>
      </div>
      {/* ====================================================== */}
      
      {/* Button waala hissa waisa hi rahega */}
      <div className="p-4 bg-white/50 border-t border-gray-200/50 mt-auto">
        <button
        //   onClick={(e) => {
        //     e.stopPropagation();
        //     onButtonClick();
        //   }}
          onClick={handleLogClick} // Naya function use karo
          disabled={isDisabled} // Button ko disable karo
          className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                     disabled:bg-gray-400 disabled:cursor-not-allowed" // Disable hone par style
        //   className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          {/* Log Today's Activity */}
          {isDisabled ? "Logged for Today" : "Log Today's Activity"}
        </button>
      </div>
    </div>
  );
};

export default FunctionalCard;