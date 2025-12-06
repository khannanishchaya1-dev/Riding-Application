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
      navigate("/login");
    } catch {
      toast.error("Link expired or invalid ❌");
    }
  };

  return (
    <div className="p-6 h-[100dvh] flex flex-col justify-center">
      <h2 className="text-2xl text-[#E23744] font-semibold text-center mb-4">
        Reset Password 🔐
      </h2>

      <form onSubmit={submitHandler} className="space-y-5">
        
        {/* New password */}
        <div>
          <label className="text-sm text-gray-600 font-medium">
            New Password
          </label>
          <input
            className="border mt-1 p-3 w-full rounded-xl"
            type={showPass ? "text" : "password"}
            placeholder="Enter new password"
            value={password}
            minLength={6}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Confirm password */}
        <div>
          <label className="text-sm text-gray-600 font-medium">
            Confirm Password
          </label>
          <input
            className="border mt-1 p-3 w-full rounded-xl"
            type={showPass ? "text" : "password"}
            placeholder="Confirm new password"
            value={confirmPassword}
            minLength={6}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {/* Show password toggle */}
        <p 
          className="text-sm text-[#E23744] cursor-pointer hover:underline text-right"
          onClick={() => setShowPass(!showPass)}
        >
          {showPass ? "Hide Password" : "Show Password"}
        </p>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-[#E23744] text-white font-medium text-lg active:scale-95 transition"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}
