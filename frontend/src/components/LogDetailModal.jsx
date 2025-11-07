import React, { Fragment } from 'react';
import { Dialog, Transition, Tab } from '@headlessui/react'; // Tab naya import hai

// Helper function (yeh 'className' join karega)
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

// NAYA: Label ko sundar banane ke liye (e.g., carKm -> "Car Km")
function formatLogLabel(key) {
  if (!key) return '';
  const result = key.replace(/([A-Z])/g, ' $1'); // carKm -> car Km
  return result.charAt(0).toUpperCase() + result.slice(1); // car Km -> Car Km
}

// ===================================================================
// 1. BREAKDOWN TAB (Sirf Breakdown dikhayega)
// ===================================================================
const BreakdownTab = ({ record, type }) => {
  const data = record.breakdown;
  switch (type) {
    case 'carbon':
      return (
        <div className="space-y-3 mt-4">
          <div className="flex justify-between p-3 bg-gray-100 rounded-lg"><span>Travel</span><span className="font-bold">{data.travel.toFixed(2)} kg</span></div>
          <div className="flex justify-between p-3 bg-gray-100 rounded-lg"><span>Energy</span><span className="font-bold">{data.energy.toFixed(2)} kg</span></div>
          <div className="flex justify-between p-3 bg-gray-100 rounded-lg"><span>Food</span><span className="font-bold">{data.food.toFixed(2)} kg</span></div>
        </div>
      );
    case 'water':
      return (
        <div className="space-y-3 mt-4">
          <div className="flex justify-between p-3 bg-gray-100 rounded-lg"><span>Personal Usage</span><span className="font-bold">{data.personal.toFixed(2)} L</span></div>
          <div className="flex justify-between p-3 bg-gray-100 rounded-lg"><span>Diet</span><span className="font-bold">{data.diet.toFixed(2)} L</span></div>
        </div>
      );
    case 'health':
      return (
        <div className="space-y-3 mt-4">
          <div className="flex justify-between p-3 bg-gray-100 rounded-lg"><span>Steps Goal</span><span className="font-bold">{data.steps.toFixed(0)} / 100</span></div>
          <div className="flex justify-between p-3 bg-gray-100 rounded-lg"><span>Sleep Goal</span><span className="font-bold">{data.sleep.toFixed(0)} / 100</span></div>
          <div className="flex justify-between p-3 bg-gray-100 rounded-lg"><span>Calories Goal</span><span className="font-bold">{data.calories.toFixed(0)} / 100</span></div>
          <div className="flex justify-between p-3 bg-gray-100 rounded-lg"><span>Water Goal</span><span className="font-bold">{data.water.toFixed(0)} / 100</span></div>
        </div>
      );
    case 'finance':
      return (
        <div className="space-y-3 mt-4">
          <div className="flex justify-between p-3 bg-gray-100 rounded-lg"><span>Total Expenses</span><span className="font-bold">₹{record.totalExpenses.toFixed(2)}</span></div>
          <div className="flex justify-between p-3 bg-gray-100 rounded-lg"><span>Expense Score</span><span className="font-bold">{data.expenseScore.toFixed(0)} / 100</span></div>
          <div className="flex justify-between p-3 bg-gray-100 rounded-lg"><span>Savings Score</span><span className="font-bold">{data.savingsScore.toFixed(0)} / 100</span></div>
        </div>
      );
    default: return null;
  }
};

// ===================================================================
// 2. FULL LOG TAB (Saare inputs dikhayega)
// ===================================================================
const FullLogTab = ({ record, type }) => {
  // Helper component
  const LogItem = ({ label, value }) => (
    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
      {/* NAYA: 'capitalize' class hata di, formatLogLabel() use kiya */}
      <span className="text-sm text-gray-600">{label}</span>
      <span className="font-medium">{value || '0'}</span>
    </div>
  );
  
  // Saare fields jo null ya 0 nahi hain
  const inputs = { ...record };
  // Faltu keys hata do
  delete inputs.breakdown;
  delete inputs._id;
  delete inputs.userId;
  delete inputs.date;
  delete inputs.totalKgCO2;
  delete inputs.totalLiters;
  delete inputs.wellnessScore;
  delete inputs.score;
  delete inputs.totalExpenses;
  delete inputs.savingsRate;
  delete inputs.__v;
  delete inputs.createdAt;
  delete inputs.updatedAt;

  return (
    <div className="mt-4 max-h-64 overflow-y-auto space-y-2 pr-2">
      {Object.entries(inputs).map(([key, value]) => {
        // 'expenses' object ko alag se handle karo
        if (key === 'expenses' && typeof value === 'object') {
          return Object.entries(value).map(([expKey, expValue]) => (
            <LogItem key={expKey} label={formatLogLabel(`Expense: ${expKey}`)} value={`₹${expValue}`} />
          ));
        }
        // Baaki sab
        return <LogItem key={key} label={formatLogLabel(key)} value={value} />;
      })}
    </div>
  );
};

// ===================================================================
// 3. MAIN MODAL COMPONENT (Tabs ke saath)
// ===================================================================
const LogDetailModal = ({ isOpen, onClose, record, type }) => {
  if (!record) return null; // Agar record nahi hai toh kuch mat dikhao

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Overlay */}
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
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
                
                <Dialog.Title as="h3" className="text-2xl font-bold leading-6 text-gray-900 capitalize">
                  Log Details
                </Dialog.Title>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(record.date).toLocaleString()}
                </p>

                {/* YEH RAHA JAADU: TABS */}
                <div className="w-full mt-4">
                  <Tab.Group>
                    {/* Tab Headers */}
                    <Tab.List className="flex space-x-1 rounded-xl bg-green-900/10 p-1">
                      <Tab
                        className={({ selected }) =>
                          classNames(
                            'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                            'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-green-400 ring-white ring-opacity-60',
                            selected
                              ? 'bg-white text-green-700 shadow'
                              // ===== YEH RAHA FIX (Error waali line hata di) =====
                              : 'text-gray-700 hover:bg-white/[0.5]'
                          )
                        }
                      >
                        Breakdown
                      </Tab>
                      <Tab
                        className={({ selected }) =>
                          classNames(
                            'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                            'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-green-400 ring-white ring-opacity-60',
                            selected
                              ? 'bg-white text-green-700 shadow'
                              // ===== YAHAN BHI FIX (Error waali line hata di) =====
                              : 'text-gray-700 hover:bg-white/[0.5]'
                          )
                        }
                      >
                        Full Log
                      </Tab>
                    </Tab.List>
                    
                    {/* Tab Content */}
                    <Tab.Panels className="mt-2">
                      <Tab.Panel>
                        <BreakdownTab record={record} type={type} />
                      </Tab.Panel>
                      <Tab.Panel>
                        <FullLogTab record={record} type={type} />
                      </Tab.Panel>
                    </Tab.Panels>
                  </Tab.Group>
                </div>

                <div className="mt-6 text-right">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 focus:outline-none"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default LogDetailModal;