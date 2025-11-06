import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

const Layout = () => {
  return (
    // font-inter: Yeh ek accha, clean font hai.
    <div className="font-sans antialiased">
      <Navbar />
      <main>
        {/* <Outlet /> ki jagah aapka page (jaise HomePage) render hoga */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;