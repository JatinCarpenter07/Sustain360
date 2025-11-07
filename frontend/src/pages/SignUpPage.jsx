// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { LeafIcon } from '../components/icons/index.js';
// import axios from 'axios'
// import toast from 'react-hot-toast';

// const SignUpPage = () => {
//     // Har field ke liye state banayenge
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     password: '',
//     phone: '',
//     gender: '',
//     age: '',
//     height: '',
//     weight: '',
//     bloodGroup: '',
//   });

//  // const [error, setError] = useState(null); // Error dikhane ke liye
//   const navigate = useNavigate(); // Redirect karne ke liye

//   // Jab bhi user kisi field mein type karega, yeh function state update karega
//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // Form submit hone par yeh function chalega
//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Page ko refresh hone se roko
//     //setError(null); // Puraana error saaf karo

//     try {
//       // Yahaan API call jaayegi!
//       // NOTE: URL ko apne backend server ke hisaab se badal lena
//       const response = await axios.post('http://localhost:5000/api/user/signup', formData);

//       console.log('Success:', response.data); // Backend se mila response
//       toast.success('Account created! Please log in.');
//       // Signup success! Ab user ko login page par bhej do.
//       navigate('/login');

//     } catch (err) {
//       // Agar backend se error aaya (e.g., "User already exists")
//       console.error('Signup Error:', err.response.data);
//       toast.error(err.response.data.message || 'Signup failed. Please try again.');
//      // setError(err.response.data.message || 'Signup failed. Please try again.');
//     }
//   };
//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <Link to="/" className="flex justify-center">
//           <LeafIcon className="h-12 w-auto text-green-600" />
//         </Link>
//         <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//           Create your account
//         </h2>
//         <p className="mt-2 text-center text-sm text-gray-600">
//           Get started by filling in your details.
//         </p>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//           <form className="space-y-6" onSubmit={handleSubmit} >
//             {/* Full Name */}
//             <div>
//               <label
//                 htmlFor="fullName"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Full Name
//               </label>
//               <div className="mt-1">
//                 <input
//                   id="fullName"
//                   name="fullName"
//                   type="text"
//                   required
//                   value={formData.fullName} // State se value lo
//                   onChange={handleChange} // Change par state update karo
//                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
//                 />
//               </div>
//             </div>

//             {/* Email */}
//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Email address
//               </label>
//               <div className="mt-1">
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   required
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
//                 />
//               </div>
//             </div>

//             {/* Password */}
//             <div>
//               <label
//                 htmlFor="password"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Password
//               </label>
//               <div className="mt-1">
//                 <input
//                   id="password"
//                   name="password"
//                   type="password"
                 
//                   required
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
//                 />
//               </div>
//             </div>

//             {/* Phone */}
//             <div>
//               <label
//                 htmlFor="phone"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Phone Number
//               </label>
//               <div className="mt-1">
//                 <input
//                   id="phone"
//                   name="phone"
//                   type="tel"
//                   required
//                   value={formData.phone}
//                   onChange={handleChange}
//                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
//                 />
//               </div>
//             </div>

//             {/* Grid for smaller fields */}
//             <div className="grid grid-cols-2 gap-4">
//               {/* Age */}
//               <div>
//                 <label
//                   htmlFor="age"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Age
//                 </label>
//                 <div className="mt-1">
//                   <input
//                     id="age"
//                     name="age"
//                     type="number"
                  
//                   required
//                   value={formData.age}
//                   onChange={handleChange}
//                     className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
//                   />
//                 </div>
//               </div>

//               {/* Gender */}
//               <div>
//                 <label
//                   htmlFor="gender"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Gender
//                 </label>
//                 <div className="mt-1">
//                   <select
//                     id="gender"
//                     name="gender"
//                     required
//                   value={formData.gender}
//                   onChange={handleChange}
//                     className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
//                   >
//                     <option value="">Select</option>
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                     <option value="other">Other</option>
//                   </select>
//                 </div>
//               </div>
//             </div>

//             {/* Another Grid */}
//             <div className="grid grid-cols-2 gap-4">
//               {/* Height */}
//               <div>
//                 <label
//                   htmlFor="height"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Height (cm)
//                 </label>
//                 <div className="mt-1">
//                   <input
//                     id="height"
//                     name="height"
//                     type="number"
//                     placeholder="e.g. 170"
//                     required
//                   value={formData.height}
//                   onChange={handleChange}
                    
//                     className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
//                   />
//                 </div>
//               </div>

//               {/* Weight */}
//               <div>
//                 <label
//                   htmlFor="weight"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Weight (kg)
//                 </label>
//                 <div className="mt-1">
//                   <input
//                     id="weight"
//                     name="weight"
//                     type="number"
//                     placeholder="e.g. 65"
//                     required
//                     value={formData.weight}
//                   onChange={handleChange}
//                     className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Blood Group */}
//             <div>
//               <label
//                 htmlFor="bloodGroup"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Blood Group
//               </label>
//               <div className="mt-1">
//                 <select
//                   id="bloodGroup"
//                   name="bloodGroup"
//                   required
//                   value={formData.bloodGroup}
//                   onChange={handleChange}
//                   className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
//                 >
//                   <option value="">Select Blood Group</option>
//                   <option value="A+">A+</option>
//                   <option value="A-">A-</option>
//                   <option value="B+">B+</option>
//                   <option value="B-">B-</option>
//                   <option value="AB+">AB+</option>
//                   <option value="AB-">AB-</option>
//                   <option value="O+">O+</option>
//                   <option value="O-">O-</option>
//                 </select>
//               </div>
//             </div>

//             {/* Error Message Dikhane Ki Jagah */}
//             {/* {error && (
//               <div>
//                 <p className="text-sm text-red-600 text-center">{error}</p>
//               </div>
//             )} */}

//             {/* Submit Button */}
//             <div>
//               <button
//                 type="submit"
//                 className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//               >
//                 Create Account
//               </button>
//             </div>
//           </form>

//           {/* Link to Login */}
//           <p className="mt-6 text-center text-sm text-gray-600">
//             Already have an account?{' '}
//             <Link
//               to="/login"
//               className="font-medium text-green-600 hover:text-green-500"
//             >
//               Log in
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUpPage;


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LeafIcon } from '../components/icons/index.js';
import axios from 'axios'
import toast from 'react-hot-toast';

const SignUpPage = () => {
  // Har field ke liye state banayenge
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    gender: '',
    age: '',
    height: '',
    weight: '',
    bloodGroup: '',
    monthlyIncome: '', // <-- NAYA ADD KIYA
  });

  // const [error, setError] = useState(null); // Error dikhane ke liye
  const navigate = useNavigate(); // Redirect karne ke liye

  // Jab bhi user kisi field mein type karega, yeh function state update karega
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Form submit hone par yeh function chalega
  const handleSubmit = async (e) => {
    e.preventDefault(); // Page ko refresh hone se roko
    //setError(null); // Puraana error saaf karo

    try {
      // Yahaan API call jaayegi!
      // NOTE: URL ko apne backend server ke hisaab se badal lena
      const response = await axios.post('http://localhost:5000/api/user/signup', formData);

      console.log('Success:', response.data); // Backend se mila response
      toast.success('Account created! Please log in.');
      // Signup success! Ab user ko login page par bhej do.
      navigate('/login');

    } catch (err) {
      // Agar backend se error aaya (e.g., "User already exists")
      console.error('Signup Error:', err.response?.data);
      toast.error(err.response?.data?.message || 'Signup failed. Please try again.');
      // setError(err.response.data.message || 'Signup failed. Please try again.');
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center">
          <LeafIcon className="h-12 w-auto text-green-600" />
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Get started by filling in your details.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit} >
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName} // State se value lo
                  onChange={handleChange} // Change par state update karo
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
            </div>

            {/* ===== NAYA FIELD (MONTHLY INCOME) ===== */}
            <div>
              <label
                htmlFor="monthlyIncome"
                className="block text-sm font-medium text-gray-700"
              >
                Monthly Income (INR)
              </label>
              <div className="mt-1">
                <input
                  id="monthlyIncome"
                  name="monthlyIncome"
                  type="number"
                  placeholder="e.g. 60000"
                  required
                  value={formData.monthlyIncome}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
            </div>
            {/* ========================================= */}


            {/* Grid for smaller fields */}
            <div className="grid grid-cols-2 gap-4">
              {/* Age */}
              <div>
                <label
                  htmlFor="age"
                  className="block text-sm font-medium text-gray-700"
                >
                  Age
                </label>
                <div className="mt-1">
                  <input
                    id="age"
                    name="age"
                    type="number"
                  
                    required
                    value={formData.age}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700"
                >
                  Gender
                </label>
                <div className="mt-1">
                  <select
                    id="gender"
                    name="gender"
                    required
                    value={formData.gender}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Another Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Height */}
              <div>
                <label
                  htmlFor="height"
                  className="block text-sm font-medium text-gray-700"
                >
                  Height (cm)
                </label>
                <div className="mt-1">
                  <input
                    id="height"
                    name="height"
                    type="number"
                    placeholder="e.g. 170"
                    required
                    value={formData.height}
                    onChange={handleChange}
                    
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Weight */}
              <div>
                <label
                  htmlFor="weight"
                  className="block text-sm font-medium text-gray-700"
                >
                  Weight (kg)
                </label>
                <div className="mt-1">
                  <input
                    id="weight"
                    name="weight"
                    type="number"
                    placeholder="e.g. 65"
                    required
                    value={formData.weight}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Blood Group */}
            <div>
              <label
                htmlFor="bloodGroup"
                className="block text-sm font-medium text-gray-700"
              >
                Blood Group
              </label>
              <div className="mt-1">
                <select
                  id="bloodGroup"
                  name="bloodGroup"
                  required
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Create Account
              </button>
            </div>
          </form>

          {/* Link to Login */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-green-600 hover:text-green-500"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;