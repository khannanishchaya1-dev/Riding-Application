import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../UserContext/UserContext";
import WheelzyLogo from "../assets/wheelzy.svg";
import toast from "react-hot-toast";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const userData = { email, password };
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}users/login`, userData);
      if (response.status === 200) {
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
    setEmail("");
    setPassword("");
  };

  return (
    <div className="h-[100dvh] flex flex-col justify-between bg-gray-50 px-4 sm:px-6">
      {/* Logo and Form */}
      <div className="pt-8">
        <img src={WheelzyLogo} alt="Wheelzy Logo" className="w-40 sm:w-32 mb-6" />

        <form onSubmit={submitHandler} className="w-full max-w-md">
          {/* Email */}
          <h3 className="text-base sm:text-lg mb-2 font-medium">What's your email</h3>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-200 px-3 py-2 rounded w-full text-base sm:text-lg mb-6"
            type="email"
            placeholder="example@gmail.com"
          />

          {/* Password */}
          <h3 className="text-base sm:text-lg mb-2 font-medium">Enter Password</h3>
          <input
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-200 px-3 py-2 rounded w-full text-base sm:text-lg mb-6"
            type="password"
            placeholder="Password"
          />

          <button className="bg-black text-white font-semibold px-3 py-2 rounded w-full text-base sm:text-lg mb-4 hover:bg-gray-900 transition">
            Login
          </button>
        </form>

        {/* Signup Link */}
        <p className="text-center text-sm sm:text-base">
          New here?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Create new Account
          </Link>
        </p>
      </div>

      {/* Captain Login */}
      <div className="pt-6 pb-8 w-full max-w-md mx-auto">
        <Link
          to="/captain-login"
          className="bg-green-600 flex justify-center text-white font-semibold px-3 py-2 rounded w-full text-base sm:text-lg hover:bg-green-700 transition"
        >
          Sign in as Captain
        </Link>
      </div>
    </div>
  );
};

export default UserLogin;
