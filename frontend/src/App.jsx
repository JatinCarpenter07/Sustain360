import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ChartPage from './pages/ChartPage.jsx';
import Layout from './components/Layout.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

import { useAuth } from './AuthContext.jsx';

// Yeh component check karega ki user logged in hai ya nahi
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth(); // Auth context se hook lo
  
  // YEH RAHA BADLAAV: isLoggedIn() ko as a function call karo
  if (!isLoggedIn()) { 
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  
  return (
    <Routes>
       {/* Woh routes jinpar Navbar aur Footer chahiye */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        {/* Kal ko dashboard page banega toh woh bhi yahin aayega */}
        {/* <Route path="dashboard" element={<DashboardPage />} /> */}
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* Protected (Login Required) Routes */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="dashboard/:type" element={<ChartPage />} />
        <Route path="profile" element={<ProfilePage />} /> {/* NAYA ROUTE */}
      </Route>

    </Routes>
  )
}

export default App
