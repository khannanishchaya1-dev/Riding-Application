import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../UserContext/CaptainContext";
import wheelzyCaptainLogo from "../assets/wheelzy-captain-dark.svg";
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
    <div className="h-[100dvh] w-full bg-[#F5F5F5] flex flex-col">

      {/* Main Centered Form Card */}
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md bg-white mx-4 p-8 rounded-xl shadow-md">

          <img src={wheelzyCaptainLogo} className="w-48 mb-6 mx-auto" alt="logo" />

          <h2 className="text-3xl font-bold text-[#E23744] text-center mb-2">
            Captain Login 🚖
          </h2>

          <p className="text-gray-600 text-center mb-6">
            Drive, Earn, Repeat.
          </p>

          {/* Form */}
          <form onSubmit={submitHandler} className="space-y-6">

            {/* Email */}
            <div>
              <label className="text-sm font-semibold">Email</label>
              <input
                required
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#E23744] focus:border-[#E23744] outline-none transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-semibold flex justify-between">
                Password
                <span
                  className="text-[#E23744] text-xs cursor-pointer hover:underline"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? "Hide" : "Show"}
                </span>
              </label>

              <input
                required
                type={showPass ? "text" : "password"}
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#E23744] focus:border-[#E23744] outline-none transition"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white text-lg font-semibold transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#E23744] hover:bg-[#FF4F5A]"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-5">
            New captain?{" "}
            <Link
              to="/captain-signup"
              className="text-[#E23744] font-medium hover:underline"
            >
              Register →
            </Link>
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-4">
        <Link
          to="/login"
          className="block text-center w-full py-3 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg text-lg font-medium transition"
        >
          Sign in as User 👤
        </Link>
      </div>
    </div>
  );
};

export default CaptainLogin;
