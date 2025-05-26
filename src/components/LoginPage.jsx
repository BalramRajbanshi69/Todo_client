import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import { useState } from 'react';

const LoginPage = () => {
  const apiUrl = import.meta.env.VITE_REACT_API_URL;
   const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });

    // Clear errors when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!credentials.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!credentials.password.trim()) {
      newErrors.password = "Password is required";
    } else if (credentials.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {

        const response = await fetch(`${apiUrl}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        });

        const data = await response.json();
        if (data?.authToken) {
          localStorage.setItem("token", data.authToken);
          toast.success("Login successful!");
          navigate("/");
        } else if (data?.error) {
          toast.error(data.error);
        } else {
          toast.error("Login failed. Please check your credentials.");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
        <div className='flex flex-col min-h-screen bg-[#780000] font-sans'>
      <div className="max-w-[1200px] mx-auto w-full px-4 sm:px-6 lg:px-8">
        <nav className='text-gray-800 flex justify-between items-center py-8'>
          <div className='intro text-xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent'>
            <Link to="/">TODO_APP</Link>
          </div>
          {/* Navigation links */}
        </nav>
        {/* Separator line */}
        <div className='w-full h-[1px] bg-gray-300'></div>

    <div className='py-20 flex justify-center items-center'>
        <div className='bg-white w-100  rounded-md'>
            <div className='p-5'>
                <p className='text-2xl font-["YesevaOne"] font-bold text-center '>Login</p>
                <hr className='mt-2'/>

                <div className='mt-10'>
                    <form action="" onSubmit={handleSubmit}>
                        <div className='flex flex-col gap-3'>
                        <div>
                        <label htmlFor="email">
                            <input
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F2B6C] transition-all ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
                        </label>
                        </div>
                        <div>
                        <label htmlFor="password" className='relative'>
                             <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F2B6C] transition-all ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                        </label>
                        </div>
                       
                        </div>
                        <div className='mt-6 text-center '>
                            <button type='submit' className='bg-green-900 p-2 rounded-md cursor-pointer w-full text-xl text-white'>Login</button>
                        </div>
                        <p className='text-center mt-2'>Not registered yet? <Link to="/register" className='underline'>Register</Link></p>
                    </form>
                </div>
            </div>
        </div>
    </div>
    </div>
    </div>
    </div>
  )
}

export default LoginPage