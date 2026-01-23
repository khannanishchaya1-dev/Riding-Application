import React, { useState,useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import GadiGoLogo from "../../assets/GadiGo.svg";
import { AdminContext } from "../../AdminContext/AdminContext";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const { setAdmin } = useContext(AdminContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}admin/login`,
        { email, password }
      );

      toast.success("Welcome Admin 🚀");
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("admin", JSON.stringify(res.data.admin));
      console.log("this res.data", res.data);
      setAdmin(res.data.admin);
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error("Invalid email or password ❌");
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-[#FAFAFA] flex flex-col justify-center py-6">
      {/* Logo */}
      <div className="text-center">
        <img src={GadiGoLogo} className="w-28 mx-auto opacity-90" />
      </div>

      {/* Content */}
      <div className="w-full max-w-md mx-auto mt-8 px-5">
        <h2 className="text-3xl font-semibold text-[#E23744] text-center tracking-tight">
          Admin Login
        </h2>
        <p className="text-gray-500 text-center mt-1 text-sm">
          Manage rides, users & captains efficiently
        </p>

        <form onSubmit={submitHandler} className="mt-8 space-y-5">
          {/* Email */}
          <div>
            <label className="text-sm text-gray-600 font-medium">Admin Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gadigo.app"
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

            {/* Forgot Password */}
            <div className="text-right mt-2">
              <button
                type="button"
                onClick={() => navigate("/admin/reset-password")}
                className="text-[#E23744] text-sm hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#E23744] text-white font-semibold text-lg active:scale-95 transition duration-150"
          >
            Login as Admin
          </button>
        </form>

        {/* Switch Login */}
        <p className="text-center text-gray-500 mt-6">
          Go back{" "}
          <button
            onClick={() => navigate("/")}
            className="text-[#E23744] font-medium hover:underline"
          >
            Return to Home →
          </button>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
