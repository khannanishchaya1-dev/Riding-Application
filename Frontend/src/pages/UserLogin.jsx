import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../UserContext/UserContext";
import GadiGoLogo from "../assets/GadiGo.svg";
import toast from "react-hot-toast";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserDataContext);
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}users/login`,
        { email, password }
      );

      

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
       if(res.data.user && res.data.user.blocked){
                toast.error("Your account has been blocked. Please contact support.");
                navigate("/blocked");
                return;
              }
toast.success("Welcome back! 🚗🔥");
      setUser(res.data.user);
      navigate("/home");
    } catch {
      toast.error("Invalid email or password ❌");
    }
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col justify-between bg-[#FFFFFF]">

      {/* Top Banner */}
      <div className="w-full py-10">
        <img src={GadiGoLogo} className="w-32 mx-auto opacity-95" />
      </div>

      <div className="w-full max-w-md mx-auto px-6 mt-4 animate-fadeIn">
        <h2 className="text-4xl font-bold text-[#111] text-center">Sign in</h2>
        <p className="text-gray-500 text-center text-sm mt-1">Book a ride instantly</p>

        <form onSubmit={submitHandler} className="mt-10 space-y-6">

          {/* Email */}
          <div className="space-y-1">
            <label className="text-[15px] text-gray-700 font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@gmail.com"
              className="w-full px-4 py-3 rounded-xl bg-[#FAFAFA] border border-gray-200 shadow-sm focus:border-black focus:ring-0 outline-none transition"
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
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
              type={showPass ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-[#FAFAFA] border border-gray-200 shadow-sm focus:border-black focus:ring-0 outline-none transition"
            />

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-[#111] text-xs hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#111] text-white font-semibold text-lg active:scale-95 transition duration-150 shadow-lg"
          >
            Continue
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6 text-sm">
          New here?{" "}
          <Link
            className="text-black font-semibold hover:underline"
            to="/signup"
          >
            Create Account →
          </Link>
        </p>
      </div>

      {/* Switch Button */}
      <div className="w-full px-6 pb-6 mt-8">
        <Link
          to="/captain-login"
          className="block text-center py-3 rounded-xl border border-gray-300 font-medium text-gray-700 active:scale-95 shadow-sm transition"
        >
          Sign in as Captain 🚖
        </Link>
      </div>
    </div>
  );
};

export default UserLogin;
