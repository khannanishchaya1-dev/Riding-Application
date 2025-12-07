import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../UserContext/CaptainContext";
import GadiGoLogo from "../assets/GadiGo.svg";
import toast from "react-hot-toast";

const CaptainLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captainData, setCaptainData] = useContext(CaptainDataContext);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}captains/login`,
        { email, password }
      );

      if (response.data?.token) {
        setCaptainData(response.data.captain);

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("captain", JSON.stringify(response.data.captain));

        toast.success("Welcome Captain 🚖🔥");
        navigate("/captain-home");
      } else {
        toast.error("Unexpected server response");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid Credentials ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-[#FAFAFA] flex flex-col justify-center py-6">

      {/* Logo */}
      <div className="text-center">
        <img src={GadiGoLogo} alt="logo" className="w-28 mx-auto opacity-90" />
      </div>

      {/* Card */}
      <div className="w-full max-w-md mx-auto mt-6 px-5">

        <h2 className="text-3xl font-semibold text-[#E23744] text-center tracking-tight">
          Captain Login
        </h2>

        <p className="text-gray-500 text-center text-sm mt-1">
          Drive. Earn. Repeat.
        </p>

        {/* Form */}
        <form onSubmit={submitHandler} className="mt-8 space-y-5">

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600 font-medium">Email</label>
            <input
              required
              type="email"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-[#E23744] focus:ring-0 outline-none transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-600 font-medium flex justify-between">
              Password
              <span
                className="text-[#E23744] text-xs cursor-pointer hover:underline"
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
              className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-[#E23744] focus:ring-0 outline-none transition"
            />
          
            {/* Forgot Password Link */}
            <div className="text-right mt-2">
              <Link
                to="/forgot-password-captain"
                className="text-[#E23744] text-sm hover:underline cursor-pointer"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold text-lg active:scale-95 transition duration-150 ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#E23744]"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Redirect */}
        <p className="text-center text-gray-500 mt-6 text-sm">
          New captain?{" "}
          <Link to="/captain-signup" className="text-[#E23744] font-medium hover:underline">
            Register →
          </Link>
        </p>
      </div>

      {/* Switch Button */}
      <div className="mt-6 px-6">
        <Link
          to="/login"
          className="block text-center py-3 border border-gray-300 rounded-xl text-gray-700 font-medium active:scale-95 transition"
        >
          Sign in as User 👤
        </Link>
      </div>
    </div>
  );
};

export default CaptainLogin;
