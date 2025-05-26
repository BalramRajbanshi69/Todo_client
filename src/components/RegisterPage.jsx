import React from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import toast from "react-hot-toast"
import { FaEye, FaEyeSlash } from "react-icons/fa";

const RegisterPage = () => {

    const apiUrl = import.meta.env.VITE_REACT_API_URL;
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const requirements = [];

    if (password.length < minLength)
      requirements.push(`at least ${minLength} characters`);
    if (!hasUpperCase) requirements.push("an uppercase letter");
    if (!hasLowerCase) requirements.push("a lowercase letter");
    if (!hasNumbers) requirements.push("a number");
    if (!hasSpecialChars) requirements.push("a special character");

    return {
      isValid: requirements.length === 0,
      requirements,
    };
  };

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

    if (!credentials.name.trim()) {
      newErrors.name = "Name is required";
    } else if (credentials.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!credentials.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!credentials.password) {
      newErrors.password = "Password is required";
    } else {
      const { isValid, requirements } = validatePassword(credentials.password);
      if (!isValid) {
        newErrors.password = `Password must contain ${requirements.join(", ")}`;
      }
    }

    if (!credentials.cpassword) {
      newErrors.cpassword = "Please confirm your password";
    } else if (credentials.password !== credentials.cpassword) {
      newErrors.cpassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (validateForm()) {
  //     setLoading(true);
  //     try {
  //       const response = await fetch(`${apiUrl}/api/auth/signup`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           name: credentials.name,
  //           email: credentials.email,
  //           password: credentials.password,
  //         }),
  //       });

  //       const data = await response.json();
  //       if (data?.authToken) {
  //         localStorage.setItem("token", data.authToken);
  //         toast.success("Registration successful!");
  //         navigate("/login");
  //       } else if (data?.error) {
  //         toast.error(data.error);
  //       } else {
  //         toast.error("Registration failed. Please try again.");
  //       }
  //     } catch (error) {
  //       console.error("Error:", error);
  //       toast.error("An unexpected error occurred");
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  // };


  const handleSubmit = async (e) => {
  e.preventDefault();
  if (validateForm()) {
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/api/auth/signup`,
        {
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );

      if (response.data?.authToken) {
        localStorage.setItem("token", response.data.authToken);
        toast.success("Registration successful!");
        navigate("/login");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      const errorMessage = error.response?.data?.error || "Registration failed. Please try again.";
      toast.error(errorMessage);
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
                <p className='text-2xl font-["YesevaOne"] font-bold text-center '>Registration</p>
                <hr className='mt-2'/>

                <div className='mt-10'>
                    <form action="" onSubmit={handleSubmit}>
                        <div className='flex flex-col gap-3'>
                            <div>
                        <label htmlFor="name">
                            <input type="text" name="name" value={credentials.name} onChange={handleChange} id="name" placeholder='Enter your name'  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F2B6C] transition-all ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}/>
                  {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
                        </label>
                        </div>
                        <div>
                        <label htmlFor="email">
                            <input type="email" name="email" id="email" value={credentials.email} onChange={handleChange} placeholder='Enter your email'  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F2B6C] transition-all ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}/>
                  {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
                        </label>
                        </div>
                        <div>
                        <label htmlFor="password" className='relative'>
                            <input type={showPassword ? "text" : "password"}
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    onFocus={() => setIsPasswordFocused(true)}
      onBlur={() => setIsPasswordFocused(false)}
       className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F2B6C] transition-all ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`} placeholder="Create a password"/>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  </label>
                 {errors.password ? (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                ) : isPasswordFocused ?(
                  <p className="text-gray-500 text-xs mt-1">
                    Password must be at least 8 characters long and contain
                    uppercase, lowercase, number and special character
                  </p>
                ) : null}
                </div>

                <div>
                        <label htmlFor="cpassword">
                              <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="cpassword"
                    value={credentials.cpassword}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F2B6C] transition-all ${
                      errors.cpassword ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>

                  </label>
                  {errors.cpassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.cpassword}</p>
                )}
            </div>
                        </div>
                        <div className='mt-6 text-center '>
                            <button type='submit' disabled={loading} className='bg-green-900 p-2 rounded-md cursor-pointer w-full text-xl text-white'>{loading ? "Creating Account..." : "Register"}</button>
                        </div>
                        <p className='text-center mt-2'>Already registered? <Link to="/login" className='underline'>Login</Link></p>
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

export default RegisterPage