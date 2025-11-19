import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../UserContext/UserContext";
import WheelzyLogo from "../assets/wheelzy.svg";
import toast from "react-hot-toast";

const UserSignup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const newUser = {
      email,
      password,
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}users/register`, newUser);
      if (response.status === 201) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/home");
      }
    } catch (error) {
      
      toast.error("Oops! Something seems wrong with the details you entered.");
      console.error(error?.response?.data || error.message);
    }

    // Reset form
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 px-4 sm:px-6">
      {/* Logo and Form */}
      <div className="pt-8 ">
        <img src={WheelzyLogo} alt="Wheelzy Logo" className="w-40 sm:w-32 mb-6" />

        <form onSubmit={submitHandler} className="w-full max-w-md">
          {/* Name Inputs */}
          <h3 className="text-base sm:text-lg mb-2 font-medium">What's your Name</h3>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="bg-gray-200 px-3 py-2 rounded w-full text-base sm:w-1/2"
              type="text"
              placeholder="First Name"
            />
            <input
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="bg-gray-200 px-3 py-2 rounded w-full text-base sm:w-1/2"
              type="text"
              placeholder="Last Name"
            />
          </div>

          {/* Email */}
          <h3 className="text-base sm:text-lg mb-2 font-medium">What's your email</h3>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-200 px-3 py-2 rounded w-full text-base mb-6"
            type="email"
            placeholder="example@gmail.com"
          />

          {/* Password */}
          <h3 className="text-base sm:text-lg mb-2 font-medium">Enter Password</h3>
          <input
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-200 px-3 py-2 rounded w-full text-base mb-6"
            type="password"
            placeholder="Password"
          />

          <button className="bg-black text-white font-semibold px-3 py-2 rounded w-full text-base mb-4 hover:bg-gray-900 transition">
            Create Account
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm sm:text-base">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>

      {/* Terms & Privacy */}
      <p className="text-xs text-gray-500 text-center my-6 sm:my-8">
        By logging in, you agree to our{" "}
        <a href="/terms" className="text-blue-600 underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="/privacy" className="text-blue-600 underline">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
};

export default UserSignup;
