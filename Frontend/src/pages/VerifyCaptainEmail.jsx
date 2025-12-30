import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import WheelzyLogo from "../assets/wheelzy-captain-dark.svg";

const VerifyCaptainEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || localStorage.getItem("pendingEmail");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [resendEnabled, setResendEnabled] = useState(false);

  useEffect(() => {
    if (timer === 0) {
      setResendEnabled(true);
      return;
    }
    const interval = setInterval(() => setTimer(timer - 1), 1000);
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

    if (finalOtp.length !== 6) return toast.error("Enter full OTP");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}captains/verify-otp`,
        { email, otp: finalOtp }
      );

      toast.success("🎉 Captain Verified Successfully!");

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("captain", JSON.stringify(res.data.captain));
      localStorage.removeItem("pendingCaptainEmail");

      navigate("/captain-home");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    }
  };

  const resendOTP = async () => {
    if (!resendEnabled) return;
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}captains/resend-otp`,
        { email }
      );

      toast.success("📩 New OTP Sent!");
      setTimer(60);
      setResendEnabled(false);
    } catch {
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-[100dvh] bg-white flex justify-center items-center px-6">
      {/* Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm w-full max-w-sm px-6 py-8 text-center">
        <img src={WheelzyLogo} className="w-24 mx-auto mb-4" />

        <h2 className="text-2xl font-bold text-gray-800">Verify Email</h2>
        <p className="text-gray-500 text-sm mt-1">
          Enter the 6-digit OTP sent to <strong className="text-gray-700">{email}</strong>
        </p>

        {/* OTP INPUTS */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="flex justify-between gap-2">
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, i)}
                className="w-10 h-12 text-center text-xl font-semibold border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-black transition"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 active:scale-95 transition shadow-md"
          >
            Verify & Continue
          </button>
        </form>

        {/* RESEND */}
        <button
          onClick={resendOTP}
          disabled={!resendEnabled}
          className={`mt-4 text-sm font-semibold transition ${
            resendEnabled
              ? "text-black hover:opacity-70 active:scale-95"
              : "text-gray-400"
          }`}
        >
          {resendEnabled ? "Resend OTP" : `Resend in ${timer}s`}
        </button>
      </div>
    </div>
  );
};

export default VerifyCaptainEmail;
