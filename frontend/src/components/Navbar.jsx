import React,{ Fragment } from 'react';
import { Link } from 'react-router-dom';
import { LeafIcon, ThreeDotsIcon } from './icons/index.js'; // Naya UserCircleIcon import
import { useAuth } from '../AuthContext.jsx';
import { Menu, Transition } from '@headlessui/react'; // Dropdown ke liye

const Navbar = () => {
    const { isLoggedIn, logout, user } = useAuth();

  return (
    // sticky top-0: Navbar ko hamesha screen ke top par rakhega
    // z-50: Baki cheezon ke uppar dikhega
    <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo (Aapke project ka naam) */}
          <Link
            to={isLoggedIn() ? "/dashboard" : "/"}
            className="flex-shrink-0 flex items-center space-x-2 text-xl font-bold"
          >
            {/* Simple sa plant icon */}
            <span className="text-green-600 text-2xl">🌱</span>
            <span className="text-gray-900">Sustain360</span>
          </Link>

          {/* Login/Signup Buttons (Top-Right) */}
          <div className="flex items-center space-x-3">
           {isLoggedIn() && user ? (
              // AGAR USER LOGGED IN HAI:
              <>
                {/* 1. NON-CLICKABLE TEXT */}
                <span className="hidden md:inline text-sm font-medium text-gray-700">
                  Hello, {user.Name}
                </span>
                
                {/* 2. CLICKABLE ICON (DROPDOWN) */}
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    {/* Menu.Button AB SIRF ICON KO WRAP KAR RAHA HAI */}
                    <Menu.Button className="flex items-center text-gray-700 rounded-full p-1 hover:bg-gray-200 hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                      <span className="sr-only">Open user menu</span>
                      <ThreeDotsIcon className="w-6 h-6" />
                    </Menu.Button>
                  </div>

                  {/* Dropdown Menu (Yeh waisa hi rahega) */}
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="px-1 py-1">

                        {/* <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/dashboard"
                              className={`${
                                active ? 'bg-green-600 text-white' : 'text-gray-900'
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            >
                              Dashboard
                            </Link>                          )}
                        </Menu.Item> */}

                        {/* Button 1: Profile */}
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/profile"
                              className={`${
                                active ? 'bg-green-600 text-white' : 'text-gray-900'
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            >
                              Profile Details
                            </Link>
                          )}
                        </Menu.Item>
                        
                        {/* Button 2: Logout */}
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={logout}
                              className={`${
                                active ? 'bg-green-600 text-white' : 'text-gray-900'
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            >
                              Log Out
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </>) : (
              // AGAR USER LOGGED OUT HAI:
              <>
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Sign Up
            </Link>
            </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

// import React from 'react';
// import { Link } from 'react-router-dom';
// import { LeafIcon } from './icons/index.js'; // LeafIcon import karein

// const Navbar = () => {
//   return (
//     <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           {/* Logo (Aapke project ka naam) */}
//           <Link
//             to="/"
//             className="flex-shrink-0 flex items-center space-x-2 text-xl font-bold"
//           >
//             {/* NAYA: LeafIcon ko yahaan use kiya hai, classes ko adjust kiya */}
//             <LeafIcon className="h-8 w-auto text-green-600" /> {/* h-8 w-auto for better sizing */}
//             <span className="text-gray-900">Sustain360</span>
//           </Link>

//           {/* Login/Signup Buttons (Top-Right) */}
//           <div className="flex items-center space-x-3">
//             <Link
//               to="/login"
//               className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//             >
//               Log In
//             </Link>
//             <Link
//               to="/signup"
//               className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//             >
//               Sign Up
//             </Link>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;