import React, { useState, useEffect } from 'react'; // useEffect aur useState import karo
import { useAuth } from '../AuthContext.jsx';
import { UserCircleIcon, HeartIcon,EditIcon, SaveIcon, } from '../components/icons/index.js';
import axios from 'axios'; // Axios zaroori hai
import toast from 'react-hot-toast'; // Error dikhane ke liye

// StatCard waisa hi rahega
const StatCard = ({ label, value, unit }) => (
  <div className="bg-white/70 backdrop-blur-lg p-4 rounded-lg shadow-md text-center">
    <p className="text-sm font-medium text-gray-600">{label}</p>
    <p className="text-3xl font-bold text-green-600">
      {value || 'N/A'}
      {unit && <span className="text-lg text-gray-700 ml-1">{unit}</span>}
    </p>
  </div>
);

// ===== NAYA HELPER: BMI Calculator Logic =====
const calculateBMI = (weight, height) => {
  if (!weight || !height || height === 0) {
    return { bmi: 'N/A', category: 'Missing Data' };
  }
  const heightInMeters = height / 100;
  const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
  let category = '';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi >= 18.5 && bmi <= 24.9) category = 'Normal Weight';
  else if (bmi >= 25 && bmi <= 29.9) category = 'Overweight';
  else category = 'Obese';
  return { bmi, category };
};

// NAYA HELPER: BMI Card
const BmiCard = ({ weight, height }) => {
  const { bmi, category } = calculateBMI(weight, height);
  let colorClass = 'text-gray-700';
  if (category === 'Normal Weight') colorClass = 'text-green-600';
  if (category === 'Underweight' || category === 'Overweight') colorClass = 'text-yellow-600';
  if (category === 'Obese') colorClass = 'text-red-600';

  return (
    <div className="bg-white/70 backdrop-blur-lg p-6 rounded-lg shadow-md text-center col-span-1 md:col-span-2">
      <p className="text-sm font-medium text-gray-600">Body Mass Index (BMI)</p>
      <p className={`text-4xl font-bold ${colorClass} mt-2`}>{bmi}</p>
      <p className={`text-lg font-semibold ${colorClass}`}>{category}</p>
    </div>
  );
};
// ============================================

const ProfilePage = () => {
  // AuthContext se humein 'token' aur 'default user' (jisme sirf naam/email hai) milega
  const { user: authUser, token,login } = useAuth(); 
  
  // Nayi states API se data laane ke liye
  const [user, setUser] = useState(authUser); // Hum 'user' state ko updateable banayenge
 // const [profileData, setProfileData] = useState(null); // Poora profile yahaan store hoga
  const [loading, setLoading] = useState(true); // Loading state

  // NAYI STATES (Income Edit karne ke liye)
  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [newIncome, setNewIncome] = useState(user?.monthlyIncome || '');
  const [isSaving, setIsSaving] = useState(false);

  // useEffect: Yeh page load hote hi *ek baar* chalega
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Nayi GET API ko call karo
        const response = await axios.get(
          'http://localhost:5000/api/user/profile', // Aapka naya GET route
          {
            headers: { 'Authorization': `Bearer ${token}` } // Token bhejna zaroori hai
          }
        );
        
        // API se mila poora user data state mein save karo
        //setProfileData(response.data.user); 
        setUser(response.data.user); // State ko poore data se update karo
        setNewIncome(response.data.user.monthlyIncome || ''); // Income state set karo
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        toast.error('Could not load profile data.');
      } finally {
        setLoading(false); // Loading khatam
      }
    };

    fetchProfileData();
  }, [token]); // Yeh tabhi chalega jab token available hoga

  // ===== NAYA FUNCTION (Income Save karne ke liye) =====
  const handleIncomeSave = async () => {
    setIsSaving(true);
    toast.loading('Saving income...');
    try {
      // Aapke diye gaye API ko call karo
      // NOTE: Is route ko apne backend router mein set zaroor karna
      const response = await axios.put(
        'http://localhost:5000/api/finance/updateMonthlyIncome', // Yeh route aapko banana hai
        { monthlyIncome: Number(newIncome) }, // Data bhejo
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      // Backend se jo naya profile (user) object mila hai...
      const updatedProfile = response.data;
      
      // ...usse poore App ke Context (aur localStorage) mein update karo
      login(token, updatedProfile); // Hum 'login' function ko re-use kar rahe hain data update ke liye
      setUser(updatedProfile); // Is page ki local state ko bhi update karo
      
      toast.dismiss();
      toast.success('Monthly Income Updated!');
      setIsEditingIncome(false); // Edit mode band karo
      
    } catch (err) {
      toast.dismiss();
      toast.error(err.response?.data?.message || 'Failed to save income.');
      console.error(err);
    }
    setIsSaving(false);
  };
  // ====================================================

  // ===== LOADING STATE (Jab API data laa raha hai) =====
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-green-100 via-blue-50 to-pink-50 flex items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-700">Loading Your Profile...</h2>
      </div>
    );
  }

  // ===== DATA LOAD HONE KE BAAD =====
  // Ab hum 'profileData' (poora data) ya 'defaultUser' (aadha data) se details nikaalenge
 // const user = profileData || defaultUser; 

  return (
   // ===== WAHI "GLASSMORPHISM" BACKGROUND (Dashboard waala) =====
    <div className="min-h-screen w-full bg-gradient-to-br from-green-100 via-blue-50 to-pink-50 relative overflow-hidden p-8 pt-16">
      {/* Background Blobs */}
      <div className="absolute top-0 -left-1/4 w-96 h-96 bg-green-300 rounded-full opacity-30 filter blur-3xl animate-blob-breathe z-0"></div>
      <div className="absolute top-1/4 -right-1/4 w-96 h-96 bg-blue-300 rounded-full opacity-30 filter blur-3xl animate-blob-breathe animation-delay-4000 z-0"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pink-300 rounded-full opacity-30 filter blur-3xl animate-blob-breathe animation-delay-2000 z-0"></div>

      {/* Saara content oopar (z-10) */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-10 text-center">
          Your Profile Hub
        </h1>

        {/* ===== YEH RAHA NAYA, SIMPLIFIED CARD (Bina flip ke) ===== */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-white/50">
          <div className="flex flex-col md:flex-row items-center">
            
            {/* Profile Pic Placeholder */}
            <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
              <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <UserCircleIcon className="w-24 h-24 text-white" />
              </div>
            </div>

            {/* Details (Read-only) */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-4xl font-bold text-gray-900">{user.fullName || user.Name}</h2>
              <p className="text-lg text-gray-600 mt-1">{user.email}</p>
              
              {/* NOTE: Hum assume kar rahe hain ki aapke 'user' object (jo login se milta hai)
                  usmein 'phone' hai. Agar nahi hai, toh yeh 'N/A' dikhayega.
              */}
              <p className="text-md text-gray-500 mt-2">
                {user.phone || 'No phone number provided'}
              </p>
            </div>
            {/* Edit/Save button yahaan se hata diye gaye hain */}
          </div>
        </div>
        
        {/* ===== "HEALTH VITALS" SECTION (Yeh waisa hi rahega) ===== */}
        <div className="mt-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center">
            <HeartIcon className="w-8 h-8 text-pink-500 mr-3" />
            Your Health & Finance
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Hum data 'user' object se seedha read kar rahe hain */}
            <StatCard label="Age" value={user.age} unit="years" />
            <StatCard label="Height" value={user.height} unit="cm" />
            <StatCard label="Weight" value={user.weight} unit="kg" />
            <StatCard label="Gender" value={user.gender || 'N/A'} />
            <StatCard label="Blood Group" value={user.bloodGroup || 'N/A'} />

            {/* NAYA: BMI Calculator Card */}
            <BmiCard weight={user.weight} height={user.height} />
            
            {/* NAYA: Financial Snapshot Card (Editable) */}
            <div className="bg-white/70 backdrop-blur-lg p-6 rounded-lg shadow-md col-span-1 md:col-span-3 grid grid-cols-3 items-center">
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-600">Monthly Income (INR)</p>

                {/* YEH RAHA JAADU: Inline Edit */}
                {isEditingIncome ? (
                  <input
                    type="number"
                    value={newIncome}
                    onChange={(e) => setNewIncome(e.target.value)}
                    className="mt-1 text-3xl font-bold text-gray-900 bg-transparent border-b-2 border-green-500 focus:outline-none"
                  />
                ) : (
                  <p className="text-3xl font-bold text-gray-900">
                    ₹ {user.monthlyIncome || 'N/A'}
                  </p>
                )}
              </div>
              <div className="text-right">
                {isEditingIncome ? (
                  <button
                    onClick={handleIncomeSave}
                    disabled={isSaving}
                    className="p-3 bg-green-100 rounded-full shadow-md hover:bg-green-200 transition-all disabled:opacity-50"
                  >
                    <SaveIcon className="w-6 h-6 text-green-700" />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditingIncome(true)}
                    className="p-3 bg-white/70 rounded-full shadow-md hover:bg-gray-100 transition-all"
                  >
                    <EditIcon className="w-6 h-6 text-gray-700" />
                  </button>
                )}
              </div>
            </div>
          
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;