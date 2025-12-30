import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../UserContext/UserContext";
import GadiGoLogo from "../assets/GadiGo.svg";
import toast from "react-hot-toast";

const UserSignup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    const newUser = {
      email,
      password,
      phone,
      fullname: { firstname: firstName, lastname: lastName },
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}users/register`,
        newUser
      );

      if (response.status === 201) {
        toast.success("📩 OTP sent — Please verify your email!");
        localStorage.setItem("pendingEmail", email);
        navigate("/verify-email", { state: { email } });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "⚠️ Signup failed. Try again.");
    }
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col justify-between bg-white">

      {/* Logo */}
      <div className="w-full pt-10">
        <img src={GadiGoLogo} className="w-32 mx-auto" />
      </div>

      {/* Content */}
      <div className="w-full max-w-md mx-auto px-6 mt-4 animate-fadeIn">
        <h2 className="text-4xl font-bold text-[#111] text-center">Create Account</h2>
        <p className="text-gray-500 text-center text-sm mt-1">
          Join and start riding in minutes
        </p>

        {/* Form */}
        <form onSubmit={submitHandler} className="mt-10 space-y-6">

          {/* Full Name */}
          <div>
            <label className="text-[15px] text-gray-700 font-medium">Full Name</label>
            <div className="flex gap-3 mt-2 flex-col sm:flex-row">
              <input
                required
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#FAFAFA] border border-gray-200 shadow-sm focus:border-black focus:ring-0 outline-none transition"
              />

              <input
                required
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#FAFAFA] border border-gray-200 shadow-sm focus:border-black focus:ring-0 outline-none transition"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="text-[15px] text-gray-700 font-medium">Phone Number</label>
            <input
              type="tel"
              placeholder="9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-[#FAFAFA] border border-gray-200 shadow-sm focus:border-black focus:ring-0 outline-none transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-[15px] text-gray-700 font-medium">Email</label>
            <input
              required
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-[#FAFAFA] border border-gray-200 shadow-sm focus:border-black focus:ring-0 outline-none transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-[15px] text-gray-700 font-medium flex justify-between">
              Password
              <span
                className="text-black text-xs cursor-pointer hover:underline"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? "Hide" : "Show"}
              </span>
            </label>
            <input
              required
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-[#FAFAFA] border border-gray-200 shadow-sm focus:border-black focus:ring-0 outline-none transition"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#111] text-white font-semibold text-lg active:scale-95 duration-150 shadow-md"
          >
            Continue
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-black font-semibold hover:underline">
            Login →
          </Link>
        </p>
      </div>

      <div className="pb-6"></div>
    </div>
  );
};

export default UserSignup;
