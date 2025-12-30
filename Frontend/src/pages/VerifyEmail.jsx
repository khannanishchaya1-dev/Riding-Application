import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../assets/wheelzy-captain-dark.svg";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || localStorage.getItem("pendingEmail");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [resendEnabled, setResendEnabled] = useState(false);

  // Countdown Timer
  useEffect(() => {
    if (timer === 0) {
      setResendEnabled(true);
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) return toast.error("Enter full 6–digit OTP");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}users/verify-otp`,
        { email, otp: finalOtp }
      );

      toast.success("Email Verified 🎉");

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.removeItem("pendingEmail");

      navigate("/home");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    }
  };

  const resendOTP = async () => {
    if (!resendEnabled) return;

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}users/resend-otp`, { email });
      toast.success("📩 New OTP sent");

      setTimer(60);
      setResendEnabled(false);
    } catch {
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <div className="h-[100dvh] flex flex-col justify-center items-center bg-white px-6">

      <img src={Logo} alt="Logo" className="w-24 mb-6 opacity-90" />

      <h2 className="text-2xl font-semibold text-black">Verify Your Email</h2>

      <p className="text-gray-600 text-sm text-center mt-2 leading-relaxed">
        Enter the 6–digit code sent to<br />
        <span className="font-medium text-black">{email}</span>
      </p>

      {/* OTP Inputs */}
      <form onSubmit={handleSubmit} className="mt-7 space-y-6 w-full max-w-xs">
        <div className="flex justify-between">
          {otp.map((digit, index) => (
            <input
              id={`otp-${index}`}
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              className="w-12 h-14 rounded-xl border border-gray-300 bg-gray-50
                         text-center text-xl font-semibold outline-none
                         focus:ring-2 focus:ring-black transition"
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-black text-white font-semibold
                     hover:bg-neutral-900 active:scale-95 transition"
        >
          Verify & Continue
        </button>
      </form>

      {/* Resend OTP */}
      <p className="text-sm text-gray-500 mt-5">
        Didn’t get the code?{" "}
        <button
          onClick={resendOTP}
          disabled={!resendEnabled}
          className={`font-medium underline ${
            resendEnabled ? "text-black" : "text-gray-400"
          }`}
        >
          {resendEnabled ? "Resend OTP" : `Resend in ${timer}s`}
        </button>
      </p>
    </div>
  );
};

export default VerifyEmail;
