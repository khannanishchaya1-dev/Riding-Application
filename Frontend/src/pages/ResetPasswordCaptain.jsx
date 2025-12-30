import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match ❌");
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}captains/reset-password/${token}`,
        { password }
      );

      toast.success("Password successfully updated 🎉");
      navigate("/captain-login");
    } catch {
      toast.error("Link expired or invalid ❌");
    }
  };

  return (
    <div className="h-[100dvh] flex flex-col justify-center px-6 bg-white">

      {/* Title */}
      <h2 className="text-3xl font-semibold text-black text-center mb-2">
        Reset Password
      </h2>
      <p className="text-gray-500 text-center text-sm mb-8">
        Enter a strong new password to secure your account
      </p>

      {/* Form */}
      <form onSubmit={submitHandler} className="space-y-6 max-w-md mx-auto w-full">
        
        {/* New Password */}
        <div className="space-y-1">
          <label className="text-sm text-gray-600 font-medium">New Password</label>
          <input
            type={showPass ? "text" : "password"}
            placeholder="Enter new password"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 bg-gray-50 rounded-xl p-3 text-[15px] outline-none 
                       focus:ring-2 focus:ring-black transition"
          />
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <label className="text-sm text-gray-600 font-medium">Confirm Password</label>
          <input
            type={showPass ? "text" : "password"}
            placeholder="Confirm new password"
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full border border-gray-300 bg-gray-50 rounded-xl p-3 text-[15px] outline-none 
                       focus:ring-2 focus:ring-black transition"
          />
        </div>

        {/* Toggle View Password */}
        <button
          type="button"
          onClick={() => setShowPass(!showPass)}
          className="text-sm text-black font-medium hover:underline text-right w-full transition"
        >
          {showPass ? "Hide Password" : "Show Password"}
        </button>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-black text-white text-[16px] font-semibold
                     hover:bg-neutral-900 active:scale-95 transition"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}
