// import React from 'react';
// import { Dialog, Transition } from '@headlessui/react';
// import { Fragment } from 'react';

// // Alag-alag form
// const CarbonForm = ({ onSubmit }) => (
//   <form onSubmit={onSubmit} className="space-y-4">
//     <div>
//       <label htmlFor="transport" className="block text-sm font-medium text-gray-700">Mode of Transport</label>
//       <select id="transport" name="transport" className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
//         <option>Car</option>
//         <option>Bus</option>
//         <option>Bike</option>
//       </select>
//     </div>
//     <div>
//       <label htmlFor="distance" className="block text-sm font-medium text-gray-700">Distance (in km)</label>
//       <input type="number" id="distance" name="distance" className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
//     </div>
//     <button type="submit" className="w-full py-2 px-4 bg-green-600 text-white font-medium rounded-md hover:bg-green-700">Save Data</button>
//   </form>
// );

// const WaterForm = ({ onSubmit }) => (
//   <form onSubmit={onSubmit} className="space-y-4">
//     <div>
//       <label htmlFor="shower" className="block text-sm font-medium text-gray-700">Shower Time (in mins)</label>
//       <input type="number" id="shower" name="shower" className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
//     </div>
//     <button type="submit" className="w-full py-2 px-4 bg-green-600 text-white font-medium rounded-md hover:bg-green-700">Save Data</button>
//   </form>
// );

// // Yeh component chunaav karega ki kaunsa form dikhana hai
// const ActivityForm = ({ type, onClose }) => {
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const data = Object.fromEntries(formData.entries());
//     console.log("Data Backend pe jaayega:", { type, ...data }); // Asli POST request yahaan lagegi
//     onClose(); // Form submit karke modal band karo
//   };

//   switch (type) {
//     case 'carbon':
//       return <CarbonForm onSubmit={handleSubmit} />;
//     case 'water':
//       return <WaterForm onSubmit={handleSubmit} />;
//     case 'health':
//       return <p>Health Form Yahaan Aayega</p>; // Placeholder
//     case 'finance':
//       return <p>Finance Form Yahaan Aayega</p>; // Placeholder
//     default:
//       return null;
//   }
// };

// // Asli Modal Component (Headless UI)
// const LogActivityModal = ({ isOpen, onClose, activityType }) => {
//   return (
//     <Transition appear show={isOpen} as={Fragment}>
//       <Dialog as="div" className="relative z-50" onClose={onClose}>
//         <Transition.Child
//           as={Fragment}
//           enter="ease-out duration-300"
//           enterFrom="opacity-0"
//           enterTo="opacity-100"
//           leave="ease-in duration-200"
//           leaveFrom="opacity-100"
//           leaveTo="opacity-0"
//         >
//           <div className="fixed inset-0 bg-black bg-opacity-40" />
//         </Transition.Child>

//         <div className="fixed inset-0 overflow-y-auto">
//           <div className="flex min-h-full items-center justify-center p-4 text-center">
//             <Transition.Child
//               as={Fragment}
//               enter="ease-out duration-300"
//               enterFrom="opacity-0 scale-95"
//               enterTo="opacity-100 scale-100"
//               leave="ease-in duration-200"
//               leaveFrom="opacity-100 scale-100"
//               leaveTo="opacity-0 scale-95"
//             >
//               <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
//                 <Dialog.Title
//                   as="h3"
//                   className="text-2xl font-bold leading-6 text-gray-900 capitalize mb-4"
//                 >
//                   Log {activityType} Activity
//                 </Dialog.Title>
                
//                 {/* Yahaan aapka dynamic form render hoga */}
//                 <ActivityForm type={activityType} onClose={onClose} />

//               </Dialog.Panel>
//             </Transition.Child>
//           </div>
//         </div>
//       </Dialog>
//     </Transition>
//   );
// };

// export default LogActivityModal;



import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useAuth } from '../AuthContext.jsx'; // Token lene ke liye
import axios from 'axios';
import toast from 'react-hot-toast';
import { LeafIcon, DropletIcon, HeartIcon, DollarIcon } from './icons/index.js'; // Breakdown icons

// ===================================================================
// STEP 1: NAYA "CARBON FOOTPRINT" FORM
// ===================================================================
const CarbonForm = ({ setResultData }) => {
  const { token } = useAuth(); // Token nikaalo
  const [isLoading, setIsLoading] = useState(false);
  
  // Aapke schema ke hisaab se poori state
  const [formData, setFormData] = useState({
    carKm: 0,
    bikeKm: 0,
    busKm: 0,
    trainKm: 0,
    flightKm: 0,
    electricityKwh: 0,
    gasKg: 0,
    meatServings: 0,
    dairyServings: 0,
    vegServings: 0,
  });

  // Har input change par state update karega
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value) || 0, // Value ko Number mein convert karo
    });
  };

  // Form submit karne par
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    toast.loading('Calculating & Saving...');

    try {
      // Aapke backend route ko call karo (yeh 'authMiddleware' se protected hai)
      // NOTE: URL ko apne backend route ke hisaab se check kar lena
      const response = await axios.post(
        'http://localhost:5000/api/carbon/feedData', // (e.g., /api/carbon/feed)
        formData, // Poora data object
        {
          headers: { 'Authorization': `Bearer ${token}` } // Token bhejna zaroori hai
        }
      );
      
      // Success! Backend se naya record (result) mila
      toast.dismiss();
      toast.success('Log Saved!');
      setResultData(response.data); // Result ko parent component mein set karo
      
    } catch (err) {
      toast.dismiss();
      toast.error(err.response?.data?.message || 'Failed to save log.');
      console.error(err);
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* --- TRAVEL SECTION --- */}
      <fieldset className="border border-gray-300 p-4 rounded-lg">
        <legend className="text-lg font-semibold text-green-700 px-2">Travel</legend>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="carKm" className="block text-sm font-medium text-gray-700">Car (km)</label>
            <input type="number" min="0" name="carKm" id="carKm" value={formData.carKm} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border... rounded-md"/>
          </div>
          <div>
            <label htmlFor="bikeKm" className="block text-sm font-medium text-gray-700">Bike (km)</label>
            <input type="number" min="0" name="bikeKm" id="bikeKm" value={formData.bikeKm} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border... rounded-md"/>
          </div>
          <div>
            <label htmlFor="busKm" className="block text-sm font-medium text-gray-700">Bus (km)</label>
            <input type="number" min="0" name="busKm" id="busKm" value={formData.busKm} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border... rounded-md"/>
          </div>
          <div>
            <label htmlFor="trainKm" className="block text-sm font-medium text-gray-700">Train (km)</label>
            <input type="number" min="0" name="trainKm" id="trainKm" value={formData.trainKm} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border... rounded-md"/>
          </div>
          <div>
            <label htmlFor="flightKm" className="block text-sm font-medium text-gray-700">Flight (km)</label>
            <input type="number" min="0" name="flightKm" id="flightKm" value={formData.flightKm} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border... rounded-md"/>
          </div>
        </div>
      </fieldset>
      
      {/* --- ENERGY SECTION --- */}
      <fieldset className="border border-gray-300 p-4 rounded-lg">
        <legend className="text-lg font-semibold text-yellow-700 px-2">Energy</legend>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="electricityKwh" className="block text-sm font-medium text-gray-700">Electricity (kWh)</label>
            <input type="number" min="0" name="electricityKwh" id="electricityKwh" value={formData.electricityKwh} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border... rounded-md"/>
          </div>
          <div>
            <label htmlFor="gasKg" className="block text-sm font-medium text-gray-700">Gas (kg)</label>
            <input type="number" min="0" name="gasKg" id="gasKg" value={formData.gasKg} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border... rounded-md"/>
          </div>
        </div>
      </fieldset>
      
      {/* --- FOOD SECTION --- */}
      <fieldset className="border border-gray-300 p-4 rounded-lg">
        <legend className="text-lg font-semibold text-pink-700 px-2">Food</legend>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="meatServings" className="block text-sm font-medium text-gray-700">Meat (serv.)</label>
            <input type="number" min="0" name="meatServings" id="meatServings" value={formData.meatServings} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border... rounded-md"/>
          </div>
          <div>
            <label htmlFor="dairyServings" className="block text-sm font-medium text-gray-700">Dairy (serv.)</label>
            <input type="number" min="0" name="dairyServings" id="dairyServings" value={formData.dairyServings} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border... rounded-md"/>
          </div>
          <div>
            <label htmlFor="vegServings" className="block text-sm font-medium text-gray-700">Veg (serv.)</label>
            <input type="number" min="0" name="vegServings" id="vegServings" value={formData.vegServings} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border... rounded-md"/>
          </div>
        </div>
      </fieldset>

      {/* --- SUBMIT BUTTON --- */}
      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full py-3 px-4 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 disabled:bg-gray-400"
      >
        {isLoading ? 'Calculating...' : 'Calculate & Save Today\'s Log'}
      </button>
    </form>
  );
};
const WaterForm = ({ setResultData }) => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Aapke naye schema ke hisaab se state
  const [formData, setFormData] = useState({
    drinkingL: 0,
    showerMin: 0,
    laundryLoads: 0,
    dishUses: 0,
    meatServings: 0,
    vegServings: 0,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value) || 0,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    toast.loading('Calculating & Saving Water...');

    try {
      // Aapke naye backend route ko call karo
      // NOTE: URL ko apne backend route ke hisaab se check kar lena
      const response = await axios.post(
        'http://localhost:5000/api/water/feedData', // Naya Water route
        formData,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      toast.dismiss();
      toast.success('Log Saved!');
      setResultData({ type: 'water', data: response.data }); // Type ke saath save karo
      
    } catch (err) {
      toast.dismiss();
      toast.error(err.response?.data?.message || 'Failed to save log.');
      console.error(err);
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* --- PERSONAL USAGE SECTION --- */}
      <fieldset className="border border-gray-300 p-4 rounded-lg">
        <legend className="text-lg font-semibold text-blue-700 px-2">Personal Usage</legend>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="drinkingL" className="block text-sm font-medium text-gray-700">Drinking (L)</label>
            <input type="number" min="0" name="drinkingL" id="drinkingL" value={formData.drinkingL} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border... rounded-md"/>
          </div>
          <div>
            <label htmlFor="showerMin" className="block text-sm font-medium text-gray-700">Shower (mins)</label>
            <input type="number" min="0" name="showerMin" id="showerMin" value={formData.showerMin} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border... rounded-md"/>
          </div>
          <div>
            <label htmlFor="laundryLoads" className="block text-sm font-medium text-gray-700">Laundry (loads)</label>
            <input type="number" min="0" name="laundryLoads" id="laundryLoads" value={formData.laundryLoads} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border... rounded-md"/>
          </div>
          <div>
            <label htmlFor="dishUses" className="block text-sm font-medium text-gray-700">Dishwasher (uses)</label>
            <input type="number" min="0" name="dishUses" id="dishUses" value={formData.dishUses} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border... rounded-md"/>
          </div>
        </div>
      </fieldset>
      
      {/* --- DIET SECTION (Aapke schema ke hisaab se) --- */}
      <fieldset className="border border-gray-300 p-4 rounded-lg">
        <legend className="text-lg font-semibold text-pink-700 px-2">Diet</legend>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="meatServings" className="block text-sm font-medium text-gray-700">Meat (serv.)</label>
            <input type="number" min="0" name="meatServings" id="meatServings" value={formData.meatServings} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border... rounded-md"/>
          </div>
          <div>
            <label htmlFor="vegServings" className="block text-sm font-medium text-gray-700">Veg (serv.)</label>
            <input type="number" min="0" name="vegServings" id="vegServings" value={formData.vegServings} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border... rounded-md"/>
          </div>
        </div>
      </fieldset>

      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isLoading ? 'Calculating...' : 'Calculate & Save Today\'s Log'}
      </button>
    </form>
  );
};

// ===================================================================
// 3. NAYA "HEALTH & WELLNESS" FORM
// ===================================================================
const HealthForm = ({ setResultData }) => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Aapke naye schema ke hisaab se state
  const [formData, setFormData] = useState({
    steps: 0,
    calories: 0,
    sleepHours: 0,
    waterIntake: 0,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: Number(e.target.value) || 0,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    toast.loading('Calculating & Saving Health...');

    try {
      // Aapke naye backend route ko call karo
      // NOTE: URL ko apne backend route ke hisaab se check kar lena
      const response = await axios.post(
        'http://localhost:5000/api/health/feedData', // Naya Health route
        formData,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      toast.dismiss();
      toast.success('Log Saved!');
      setResultData({ type: 'health', data: response.data }); // Type ke saath save karo
      
    } catch (err) {
      toast.dismiss();
      toast.error(err.response?.data?.message || 'Failed to save log.');
      console.error(err);
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* --- WELLNESS INPUTS SECTION --- */}
      <fieldset className="border border-gray-300 p-4 rounded-lg">
        <legend className="text-lg font-semibold text-pink-700 px-2">Daily Vitals</legend>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="steps" className="block text-sm font-medium text-gray-700">Steps Taken</label>
            <input type="number" min="0" name="steps" id="steps" value={formData.steps} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border... rounded-md"/>
          </div>
          <div>
            <label htmlFor="calories" className="block text-sm font-medium text-gray-700">Calories Eaten</label>
            <input type="number" min="0" name="calories" id="calories" value={formData.calories} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border... rounded-md"/>
          </div>
          <div>
            <label htmlFor="sleepHours" className="block text-sm font-medium text-gray-700">Sleep (hours)</label>
            <input type="number" min="0" step="0.5" name="sleepHours" id="sleepHours" value={formData.sleepHours} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border... rounded-md"/>
          </div>
          <div>
            <label htmlFor="waterIntake" className="block text-sm font-medium text-gray-700">Water (Liters)</label>
            <input type="number" min="0" step="0.1" name="waterIntake" id="waterIntake" value={formData.waterIntake} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border... rounded-md"/>
          </div>
        </div>
      </fieldset>

      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full py-3 px-4 bg-pink-600 text-white font-bold rounded-md hover:bg-pink-700 disabled:bg-gray-400"
      >
        {isLoading ? 'Calculating...' : 'Calculate & Save Today\'s Vitals'}
      </button>
    </form>
  );
};

// ===================================================================
// 4. NAYA "FINANCIAL HEALTH" FORM
// ===================================================================
const FinanceForm = ({ setResultData }) => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Aapke naye schema ke hisaab se state
  const [expenses, setExpenses] = useState({
    food: 0,
    travel: 0,
    entertainment: 0,
    shopping: 0,
    bills: 0,
    misc: 0
  });
  const [savingsAdded, setSavingsAdded] = useState(0);

  // Expenses object ke liye special handler
  const handleExpenseChange = (e) => {
    setExpenses({
      ...expenses,
      [e.target.name]: Number(e.target.value) || 0,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    toast.loading('Calculating & Saving Finance...');

    // Data ko backend ke format mein bhejo
    const postData = {
      expenses,
      savingsAdded
    };

    try {
      // Aapke naye backend route ko call karo
      const response = await axios.post(
        'http://localhost:5000/api/finance/feedData', // Naya Finance route
        postData,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      toast.dismiss();
      toast.success('Log Saved!');
      setResultData({ type: 'finance', data: response.data }); // Type ke saath save karo
      
    } catch (err) {
      toast.dismiss();
      // YEH RAHA SPECIAL ERROR HANDLING
      if (err.response && err.response.status === 400) {
        toast.error('Please set your Monthly Income in your Profile first!');
      } else {
        toast.error(err.response?.data?.message || 'Failed to save log.');
      }
      console.error(err);
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* --- EXPENSES SECTION --- */}
      <fieldset className="border border-gray-300 p-4 rounded-lg">
        <legend className="text-lg font-semibold text-yellow-700 px-2">Daily Expenses (INR)</legend>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="food" className="block text-sm font-medium text-gray-700">Food</label>
            <input type="number" min="0" name="food" id="food" value={expenses.food} onChange={handleExpenseChange} className="mt-1 block w-full py-2 px-3 border... rounded-md"/>
          </div>
          <div>
            <label htmlFor="travel" className="block text-sm font-medium text-gray-700">Travel</label>
            <input type="number" min="0" name="travel" id="travel" value={expenses.travel} onChange={handleExpenseChange} className="mt-1 block w-full py-2 px-3 border... rounded-md"/>
          </div>
          <div>
            <label htmlFor="entertainment" className="block text-sm font-medium text-gray-700">Entertainment</label>
            <input type="number" min="0" name="entertainment" id="entertainment" value={expenses.entertainment} onChange={handleExpenseChange} className="mt-1 block w-full py-2 px-3 border... rounded-md"/>
          </div>
          <div>
            <label htmlFor="shopping" className="block text-sm font-medium text-gray-700">Shopping</label>
            <input type="number" min="0" name="shopping" id="shopping" value={expenses.shopping} onChange={handleExpenseChange} className="mt-1 block w-full py-2 px-3 border... rounded-md"/>
          </div>
          <div>
            <label htmlFor="bills" className="block text-sm font-medium text-gray-700">Bills</label>
            <input type="number" min="0" name="bills" id="bills" value={expenses.bills} onChange={handleExpenseChange} className="mt-1 block w-full py-2 px-3 border... rounded-md"/>
          </div>
          <div>
            <label htmlFor="misc" className="block text-sm font-medium text-gray-700">Misc.</label>
            <input type="number" min="0" name="misc" id="misc" value={expenses.misc} onChange={handleExpenseChange} className="mt-1 block w-full py-2 px-3 border... rounded-md"/>
          </div>
        </div>
      </fieldset>
      
      {/* --- SAVINGS SECTION --- */}
      <fieldset className="border border-gray-300 p-4 rounded-lg">
        <legend className="text-lg font-semibold text-green-700 px-2">Daily Savings</legend>
        <div>
          <label htmlFor="savingsAdded" className="block text-sm font-medium text-gray-700">Savings Added Today (INR)</label>
          <input type="number" min="0" name="savingsAdded" id="savingsAdded" value={savingsAdded} onChange={(e) => setSavingsAdded(Number(e.target.value) || 0)} className="mt-1 block w-full py-2 px-3 border... rounded-md"/>
        </div>
      </fieldset>

      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full py-3 px-4 bg-yellow-600 text-white font-bold rounded-md hover:bg-yellow-700 disabled:bg-gray-400"
      >
        {isLoading ? 'Calculating...' : 'Calculate & Save Today\'s Finances'}
      </button>
    </form>
  );
};

// ===================================================================
// 5. UPDATED "RESULT" SCREEN (Jo ab Health bhi dikha sakta hai)
// ===================================================================
const ResultScreen = ({ result, onClose }) => {
  const data = result.data;

  // Helper function taaki breakdown dikha sakein
  const renderBreakdown = () => {
    switch (result.type) {
      case 'carbon':
        return (
          <div className="space-y-2">
            <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
              <span className="flex items-center font-medium"><LeafIcon className="w-5 h-5 text-green-600 mr-2"/>Travel</span>
              <span className="font-bold">{data.breakdown.travel.toFixed(2)} kg</span>
            </div>
            <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
              <span className="flex items-center font-medium"><DollarIcon className="w-5 h-5 text-yellow-600 mr-2"/>Energy</span>
              <span className="font-bold">{data.breakdown.energy.toFixed(2)} kg</span>
            </div>
            <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
              <span className="flex items-center font-medium"><HeartIcon className="w-5 h-5 text-pink-600 mr-2"/>Food</span>
              <span className="font-bold">{data.breakdown.food.toFixed(2)} kg</span>
            </div>
          </div>
        );
      case 'water':
        return (
          <div className="space-y-2">
            <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
              <span className="flex items-center font-medium"><DropletIcon className="w-5 h-5 text-blue-600 mr-2"/>Personal Usage</span>
              <span className="font-bold">{data.breakdown.personal.toFixed(2)} L</span>
            </div>
            <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
              <span className="flex items-center font-medium"><HeartIcon className="w-5 h-5 text-pink-600 mr-2"/>Diet</span>
              <span className="font-bold">{data.breakdown.diet.toFixed(2)} L</span>
            </div>
          </div>
        );
      case 'health':
        return (
          <div className="space-y-2">
            <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
              <span className="flex items-center font-medium">Steps Goal</span>
              <span className="font-bold">{data.breakdown.steps.toFixed(0)} / 100</span>
            </div>
            <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
              <span className="flex items-center font-medium">Sleep Goal</span>
              <span className="font-bold">{data.breakdown.sleep.toFixed(0)} / 100</span>
            </div>
            <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
              <span className="flex items-center font-medium">Calories Goal</span>
              <span className="font-bold">{data.breakdown.calories.toFixed(0)} / 100</span>
            </div>
            <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
              <span className="flex items-center font-medium">Water Goal</span>
              <span className="font-bold">{data.breakdown.water.toFixed(0)} / 100</span>
            </div>
          </div>
        );
        case 'finance':
        return (
          <div className="space-y-2">
            <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
              <span className="flex items-center font-medium">Total Expenses</span>
              <span className="font-bold">₹{data.totalExpenses.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
              <span className="flex items-center font-medium">Savings Rate</span>
              <span className="font-bold">{data.savingsRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
              <span className="flex items-center font-medium">Expense Score</span>
              <span className="font-bold">{data.breakdown.expenseScore.toFixed(0)} / 100</span>
            </div>
            <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg">
              <span className="flex items-center font-medium">Savings Score</span>
              <span className="font-bold">{data.breakdown.savingsScore.toFixed(0)} / 100</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Helper function taaki total score dikha sakein
  const renderTotal = () => {
    switch (result.type) {
      case 'carbon':
        return (
          <p className="text-6xl font-extrabold text-green-600 my-4">
            {data.totalKgCO2.toFixed(2)}
            <span className="text-2xl text-gray-700 ml-2">kg CO2</span>
          </p>
        );
      case 'water':
        return (
          <p className="text-6xl font-extrabold text-blue-600 my-4">
            {data.totalLiters.toFixed(2)}
            <span className="text-2xl text-gray-700 ml-2">Liters</span>
          </p>
        );
      case 'health':
        return (
          <p className="text-6xl font-extrabold text-pink-600 my-4">
            {data.wellnessScore}
            <span className="text-2xl text-gray-700 ml-2">/ 100</span>
          </p>
        );
        case 'finance':
        return (
          <p className="text-6xl font-extrabold text-yellow-600 my-4">
            {data.score}
            <span className="text-2xl text-gray-700 ml-2">/ 100</span>
          </p>
        );
      default:
        return null;
    }
  };

  return (
    <div className="text-center">
      <h3 className="text-lg font-medium text-gray-600">Log Saved!</h3>
      
      {renderTotal()}
      
      <p className="text-lg font-semibold text-gray-800 mb-3">Your Breakdown:</p>
      
      {renderBreakdown()}
      
      <button 
        onClick={onClose}
        className="w-full py-3 px-4 bg-gray-700 text-white font-bold rounded-md hover:bg-gray-800 mt-6"
      >
        Done
      </button>
    </div>
  );
};



// ===================================================================
// 6. UPDATED "ACTIVITY FORM" (Jo ab HealthForm ko bhi jaanta hai)
// ===================================================================
const ActivityForm = ({ type, setResultData, onClose }) => {
  const FinanceForm = () => <p>Finance form yahaan aayega.</p>;

  switch (type) {
    case 'carbon':
      return <CarbonForm setResultData={setResultData} />;
    case 'water':
      return <WaterForm setResultData={setResultData} />;
    case 'health':
      return <HealthForm setResultData={setResultData} />; // YEH RAHA BADLAAV
      case 'finance':
      return <FinanceForm setResultData={setResultData} />; // YEH RAHA BADLAAV
   
    default:
      return null;
  }
};

// ===================================================================
// 7. MAIN MODAL COMPONENT (Yeh waisa hi rahega)
// ===================================================================
const LogActivityModal = ({ isOpen, onClose, activityType }) => {
  // NAYI STATE: Result dikhane ke liye
  const [resultData, setResultData] = useState(null);

  // Naya 'close' function
  const handleClose = () => {
    setResultData(null); // Result ko reset karo
    onClose(); // Parent (DashboardPage) waala close function call karo
  };

  // Modal ka title badlega
  const getTitle = () => {
    if (resultData) return "Today's Result"; // Result screen par
    return `Log ${activityType} Activity`; // Form par
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        {/* ... (Transition.Child for overlay waisa hi) ... */}
        <Transition.Child as={Fragment} /* ... */>
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-bold leading-6 text-gray-900 capitalize mb-4"
                >
                  {getTitle()} {/* Naya dynamic title */}
                </Dialog.Title>
                
                {/* YEH RAHA JAADU: Form ya Result dikhao */}
                {resultData ? (
                  <ResultScreen result={resultData} onClose={handleClose} />
                ) : (
                  <ActivityForm 
                    type={activityType} 
                    setResultData={setResultData} 
                    onClose={handleClose} 
                  />
                )}

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default LogActivityModal;