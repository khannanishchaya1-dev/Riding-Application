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
  const [showPass, setShowPass] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}users/login`,
        { email, password }
      );

      toast.success("Welcome back! 🚗🔥");
      setUser(res.data.user);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/home");
    } catch {
      toast.error("Invalid email or password ❌");
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-[#FAFAFA] flex flex-col justify-center py-6">

      {/* Logo */}
      <div className="text-center">
        <img src={WheelzyLogo} className="w-28 mx-auto opacity-90" />
      </div>

      {/* Content */}
      <div className="w-full max-w-md mx-auto mt-8 px-5">
        <h2 className="text-3xl font-semibold text-[#E23744] text-center tracking-tight">
          Sign In
        </h2>
        <p className="text-gray-500 text-center mt-1 text-sm">
          Continue your journey with Wheelzy
        </p>

        <form onSubmit={submitHandler} className="mt-8 space-y-5">
          {/* Email */}
          <div>
            <label className="text-sm text-gray-600 font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-[#E23744] focus:ring-0 outline-none transition"
            />
          </div>

          {/* Password */}
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
      to="/forgot-password"
      className="text-[#E23744] text-sm hover:underline cursor-pointer"
    >
      Forgot password?
    </Link>
  </div>
</div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#E23744] text-white font-semibold text-lg active:scale-95 transition duration-150"
          >
            Continue
          </button>
        </form>

        {/* Link */}
        <p className="text-center text-gray-500 mt-6">
          New here?{" "}
          <Link className="text-[#E23744] font-medium hover:underline" to="/signup">
            Create Account →
          </Link>
        </p>
      </div>

      {/* Switch button */}
      <div className="mt-6 px-6">
        <Link
          to="/captain-login"
          className="block text-center py-3 border border-gray-300 rounded-xl text-gray-700 font-medium active:scale-95 transition"
        >
          Sign in as Captain 🚖
        </Link>
      </div>
    </div>
  );
};

export default UserLogin;
