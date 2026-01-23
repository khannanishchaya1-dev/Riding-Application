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
        if(response.data.captain.blocked){
          toast.error("Your account has been blocked. Please contact support.");
          navigate("/captain-blocked");
          return;
        }

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
    <div className="h-[100dvh] w-full flex flex-col justify-between bg-white">

      {/* Logo */}
      <div className="w-full pt-10">
        <img src={GadiGoLogo} alt="logo" className="w-32 mx-auto" />
      </div>

      {/* Card */}
      <div className="w-full max-w-md mx-auto px-6 mt-4 animate-fadeIn">
        <h2 className="text-4xl font-bold text-[#111] text-center">Captain Login</h2>
        <p className="text-gray-500 text-center text-sm mt-1">
          Drive. Earn. Repeat.
        </p>

        {/* Form */}
        <form onSubmit={submitHandler} className="mt-10 space-y-6">

          {/* Email */}
          <div>
            <label className="text-[15px] text-gray-700 font-medium">Email</label>
            <input
              required
              type="email"
              placeholder="example@gmail.com"
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
              type={showPass ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full mt-2 px-4 py-3 rounded-xl bg-[#FAFAFA] border border-gray-200 shadow-sm focus:border-black focus:ring-0 outline-none transition"
            />

            <div className="text-right mt-1">
              <Link
                to="/forgot-password-captain"
                className="text-black text-xs hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold text-lg active:scale-95 transition duration-150 shadow-md ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#111]"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6 text-sm">
          New captain?{" "}
          <Link to="/captain-signup" className="text-black font-semibold hover:underline">
            Register →
          </Link>
        </p>
      </div>

      {/* Switch Button */}
      <div className="w-full px-6 pb-6 mt-6">
        <Link
          to="/login"
          className="block text-center py-3 border border-gray-300 rounded-xl text-gray-700 font-medium active:scale-95 shadow-sm transition"
        >
          Sign in as User 👤
        </Link>
      </div>
    </div>
  );
};

export default CaptainLogin;
