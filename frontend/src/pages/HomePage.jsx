import React, { useState, useEffect } from 'react';
import Plant from '../components/Plant.jsx';
import ScrollIndicator from '../components/ScrollIndicator.jsx';
import {
  LeafIcon,
  DropletIcon,
  HeartIcon,
  DollarIcon,
  DataIcon,
  CycleIcon,
  UsersIcon,
} from '../components/icons/index.js';

// Floating Particles Component
// const Particles = () => (
//   <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
//     {[...Array(10)].map((_, i) => (
//       <div key={i} className="particle"></div>
//     ))}
//   </div>
// );

const Particles = () => (
  <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
    {[...Array(10)].map((_, i) => (
      <div key={i} className="particle"></div>
    ))}
  </div>
);

// "Scrolly-telling" Text Component
const StoryText = ({ progress }) => {
  const calculateOpacity = (start, end, peak) => {
    if (progress < start) return 0;
    if (progress > end) return 0;
    if (progress < peak) return (progress - start) / (peak - start);
    return 1 - (progress - peak) / (end - peak);
  };

  return (
    // Yeh text abhi bhi center mein fade hoga, jo acha hai
    <div className="absolute inset-0 flex items-center justify-center lg:justify-start lg:pl-16 z-10">
      <div className="text-center lg:text-left text-gray-800">
        <p
          className="text-3xl md:text-4xl font-bold transition-opacity duration-1000"
          style={{ opacity: calculateOpacity(5, 25, 15) }}
        >
          It all starts with a single choice.
        </p>
        <p
          className="text-3xl md:text-4xl font-bold transition-opacity duration-1000 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:relative lg:top-0 lg:left-0 lg:-translate-x-0 lg:-translate-y-0"
          style={{ opacity: calculateOpacity(25, 45, 35) }}
        >
          Small habits begin to take root.
        </p>
        <p
          className="text-3xl md:text-4xl font-bold transition-opacity duration-1000 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 lg:relative lg:top-0 lg:left-0 lg:-translate-x-0 lg:-translate-y-0"
          style={{ opacity: calculateOpacity(45, 60, 50) }}
        >
          Your impact starts to branch out.
        </p>
       
      </div>
    </div>
  );
};


const HomePage = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) {
        setScrollProgress(0);
        return;
      }
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const card1Trigger = 50;
  const card2Trigger = 60;
  const card3Trigger = 70;
  const card4Trigger = 80;

  return (
    <div className="bg-white text-gray-900 relative">
   
    {/* ======================================================== */}
      <Particles />

     {/* 1. Hero Section (Light) */}
      <section className="h-screen flex flex-col lg:flex-row items-center p-8 relative">
        {/* Left Side: Text (Light) */}
        <div className="lg:w-1/2 h-full z-10">
          <div 
            className="flex flex-col justify-start pt-24 lg:pt-32 h-full text-center lg:text-left"
            style={{ opacity: 1 - Math.min(scrollProgress / 20, 1) }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6">
              Grow Your <br />
              <span className="text-green-600">Positive Impact.</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-lg mx-auto lg:mx-0">
              Sustain360 tracks your daily choices for a better tomorrow.
            </p>
          </div>
          <StoryText progress={scrollProgress} />
        </div>

        {/* Right Side: THE PLANT (Sticky) */}
        <div className="lg:w-1/2 h-full flex items-center justify-center z-10">
          <div className="sticky top-[15vh] lg:top-[20vh]">
            <Plant progress={scrollProgress} />
          </div>
        </div>

        <ScrollIndicator /> {/* Yeh bhi light background waala hai */}
      </section>

      {/* 2. Feature Section (Light Glassmorphism) */}
      <section className="pt-24 pb-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold">Your Complete Eco-System</h2>
            <p className="mt-4 text-lg text-gray-600">
              Understand your impact across four key dimensions.
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Feature 1: Carbon (Light Glass) */}
            <div
              // ===== YEH RAHA BADLAAV (Light Glass Card) =====
              className="bg-white/70 backdrop-blur-lg p-8 rounded-xl shadow-lg border border-gray-200/50 transition-all duration-500"
              style={{
                opacity: scrollProgress > card1Trigger ? 1 : 0,
                transform:
                  scrollProgress > card1Trigger ? 'translateY(0)' : 'translateY(50px)',
              }}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <LeafIcon className="w-6 h-6 text-green-700" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">Carbon Footprint</h3>
              </div>
              <p className="text-gray-700">
                Track CO2 emissions from your travel, food choices, and energy
                consumption.
              </p>
            </div>

            {/* Feature 2: Water (Light Glass) */}
            <div
              className="bg-white/70 backdrop-blur-lg p-8 rounded-xl shadow-lg border border-gray-200/50 transition-all duration-500"
              style={{
                opacity: scrollProgress > card2Trigger ? 1 : 0,
                transform:
                  scrollProgress > card2Trigger ? 'translateY(0)' : 'translateY(50px)',
              }}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <DropletIcon className="w-6 h-6 text-blue-700" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">Water Footprint</h3>
              </div>
              <p className="text-gray-700">
                Understand the hidden water usage in your food, products, and
                daily habits.
              </p>
            </div>

            {/* Feature 3: Health (Light Glass) */}
            <div
              className="bg-white/70 backdrop-blur-lg p-8 rounded-xl shadow-lg border border-gray-200/50 transition-all duration-500"
              style={{
                opacity: scrollProgress > card3Trigger ? 1 : 0,
                transform:
                  scrollProgress > card3Trigger ? 'translateY(0)' : 'translateY(50px)',
              }}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-pink-100 rounded-full">
                  <HeartIcon className="w-6 h-6 text-pink-700" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">Health & Wellness</h3>
              </div>
              <p className="text-gray-700">
                Monitor your steps, sleep, and nutrition to build healthier,
                more mindful routines.
              </p>
            </div>

            {/* Feature 4: Finance (Light Glass) */}
            <div
              className="bg-white/70 backdrop-blur-lg p-8 rounded-xl shadow-lg border border-gray-200/50 transition-all duration-500"
              style={{
                opacity: scrollProgress > card4Trigger ? 1 : 0,
                transform:
                  scrollProgress > card4Trigger ? 'translateY(0)' : 'translateY(50px)',
              }}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <DollarIcon className="w-6 h-6 text-yellow-700" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">Financial Health</h3>
              </div>
              <p className="text-gray-700">
                Categorize your spending to see how your financial habits align
                with your personal values.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. "Our Mission" Section (Light) */}
      <section className="pt-16 pb-24 bg-gray-50 relative z-10"> {/* Waapis bg-gray-50 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900">Our Core Mission</h2>
            <p className="mt-4 text-lg text-gray-600">
              We believe in a simple, data-driven approach to sustainability.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Mission 1 (Light) */}
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 bg-green-100 text-green-700 rounded-full mx-auto mb-4">
                <DataIcon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Data-Driven Insights</h3>
              <p className="text-gray-600">
                We turn your daily activities into clear, understandable data.
                No guesswork, just facts.
              </p>
            </div>
            
            {/* Mission 2 (Light) */}
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 bg-green-100 text-green-700 rounded-full mx-auto mb-4">
                <CycleIcon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">A Holistic View</h3>
              <p className="text-gray-600">
                Your environment, health, and finances are all connected. We
                help you see the full picture.
              </p>
            </div>
            
            {/* Mission 3 (Light) */}
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 bg-green-100 text-green-700 rounded-full mx-auto mb-4">
                <UsersIcon className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Community Focused</h3>
              <p className="text-gray-600">
                Small individual actions lead to a massive collective impact.
                Join a movement of changemakers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;