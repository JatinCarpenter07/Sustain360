import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LeafIcon } from '../components/icons/index.js';
import { useAuth } from '../AuthContext.jsx';
import axios from 'axios';
import toast from 'react-hot-toast';

const LoginPage = () => {

    const { login } = useAuth(); // Auth context se login function lo
  
  // Email aur password ke liye state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
 // const [error, setError] = useState(null); // Error dikhane ke liye

  // Form submit hone par yeh function chalega
  const handleSubmit = async (e) => {
    e.preventDefault(); // Page ko refresh hone se roko
   // setError(null);

    try {
      // Yahaan API call jaayegi!
      // NOTE: URL ko apne backend server ke hisaab se badal lena
      const response = await axios.post('http://localhost:5000/api/user/login', {
        email: email,
        password: password,
      });

      // Backend se humein token mila
      const { token, user } = response.data; 

      // Ab hum AuthContext ke 'asli' login function ko call karenge
      login(token, user);
      
      // AuthContext ab humein dashboard par redirect kar dega

    } catch (err) {
      // Agar backend se error aaya (e.g., "Wrong password")
      console.error('Login Error:', err.response.data);
      toast.error(err.response.data.message || 'Login failed. Check email or password.');
      //setError(err.response.data.message || 'Login failed. Check email or password.');
    }
  };
    
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center">
          <LeafIcon className="h-12 w-auto text-green-600" />
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Log in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
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
                  autoComplete="email"
                  required
                  value={email} // State se value lo
                  onChange={(e) => setEmail(e.target.value)} // State update karo
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
            </div>

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
                  autoComplete="current-password"
                  required
                  value={password} // State se value lo
                  onChange={(e) => setPassword(e.target.value)} // State update karo
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Error Message Dikhane Ki Jagah */}
            {/* {error && (
              <div>
                <p className="text-sm text-red-600 text-center">{error}</p>
              </div>
            )} */}

            <div className="text-sm text-right">
              <a
                href="#"
                className="font-medium text-green-600 hover:text-green-500"
              >
                Forgot your password?
              </a>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Log In
              </button>
            </div>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-medium text-green-600 hover:text-green-500"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;