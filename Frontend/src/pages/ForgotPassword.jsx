import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}users/forgot-password`, { email });
      toast.success("Password reset email sent 🎉 Check your inbox!");
    } catch {
      toast.error("Email not found ❌");
    }
  };

  return (
    <div className="h-[100dvh] flex flex-col justify-center px-8">
      <h2 className="text-2xl font-semibold text-[#E23744] text-center mb-4">Forgot Password?</h2>
      <p className="text-sm text-gray-500 text-center mb-6">
        Enter your registered email and we'll send you a reset link.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#E23744] outline-none"
        />

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-[#E23744] text-white font-semibold active:scale-95 transition"
        >
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
