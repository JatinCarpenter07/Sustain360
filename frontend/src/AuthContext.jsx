// import React, { createContext, useContext, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   // App shuru hote hi check karo ki localStorage mein token pehle se hai ya nahi
//   const [token, setToken] = useState(localStorage.getItem('token'));
//   const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
//   const navigate = useNavigate();

//   // isLoggedIn ab ek function hai jo token check karta hai
//   const isLoggedIn = () => {
//     return !!token; // Agar token hai toh true, nahi toh false
//   };

//   // Naya login function, yeh TOKEN lega
//  const login = (newToken, userData) => {
//     setToken(newToken);
//     setUser(userData);
//     localStorage.setItem('token', newToken);
//     localStorage.setItem('user', JSON.stringify(userData)); // User data ko save karo
//     navigate('/dashboard');
//   };

//   // Naya logout function
//   const logout = () => {
//     setToken(null);
//     setUser(null);
//     localStorage.removeItem('token');
//     localStorage.removeItem('user'); // User data ko bhi hatao
//     navigate('/');
//   };
//   return (
//     <AuthContext.Provider value={{ isLoggedIn, login, logout, token, user }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Yeh custom hook humein kahin bhi login state check karne dega
// export const useAuth = () => {
//   return useContext(AuthContext);
// };


import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; // NAYA IMPORT

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const navigate = useNavigate();

  const isLoggedIn = () => !!token;

  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    navigate('/dashboard');
    
    // NAYA: Login success toast
    toast.success(`Welcome back, ${userData.Name}!`); 
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // AAPKA FIX 1: Yeh pehle se hi homepage ('/') par jaa raha hai.
    navigate('/'); 
    
    // NAYA: Logout success toast
    toast.success('Logged out successfully.'); 
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, token, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};