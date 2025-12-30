import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}users/forgot-password`, { email });
      toast.success("📩 Reset link sent — check your email!");
    } catch {
      toast.error("Email not found ❌");
    }
  };

  return (
    <div className="h-[100dvh] flex flex-col justify-center px-8 bg-white">
      
      {/* Title */}
      <h2 className="text-3xl font-semibold text-black text-center mb-2">
        Forgot Password?
      </h2>
      <p className="text-sm text-gray-500 text-center mb-8 leading-5">
        Enter your registered email. We’ll send you a link to reset your password.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto w-full">
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-gray-300 bg-gray-50 rounded-xl p-3 text-[15px]
                     outline-none focus:ring-2 focus:ring-black transition"
        />

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-black text-white font-medium text-lg 
                     hover:bg-neutral-900 active:scale-95 transition shadow-sm"
        >
          Send Reset Link
        </button>
      </form>

      {/* Footer */}
      <p className="mt-6 text-center text-gray-400 text-xs">
        💡 Make sure to check spam folder if you don't see the email.
      </p>
    </div>
  );
};

export default ForgotPassword;
