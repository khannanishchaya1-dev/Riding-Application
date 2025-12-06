import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import WheelzyLogo from "../assets/wheelzy-captain-dark.svg";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem("pendingEmail");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [resendEnabled, setResendEnabled] = useState(false);

  // Count down timer
  useEffect(() => {
    if (timer === 0) {
      setResendEnabled(true);
      return;
    }

    const interval = setInterval(() => setTimer(timer - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return; // only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      toast.error("Enter full 6-digit OTP");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}users/verify-otp`,
        { email, otp: finalOtp }
      );
console.log(response.data);
      if (response.status === 200) {
        toast.success("🎉 Email Verified Successfully!");

        // Store authenticated user
        
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        localStorage.removeItem("pendingEmail"); // cleanup

        navigate("/home");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    }
  };

  const resendOTP = async () => {
    if (!resendEnabled) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}users/resend-otp`,
        { email }
      );

      toast.success("📩 New OTP sent to your email!");

      setTimer(60);
      setResendEnabled(false);
    } catch {
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <div className="h-[100vh] bg-[#FAFAFA] flex flex-col justify-center items-center px-6">
      <img src={WheelzyLogo} className="w-28 mb-5 opacity-90" alt="" />

      <h2 className="text-2xl font-semibold text-[#E23744]">
        Verify Your Email
      </h2>

      <p className="text-gray-600 text-sm text-center mt-2">
        Enter the 6-digit OTP sent to:
        <br /> <span className="font-medium">{email}</span>
      </p>

      {/* OTP Inputs */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-6 w-full max-w-xs">
        <div className="flex justify-between">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              className="w-11 h-12 text-center border border-gray-300 rounded-xl text-lg font-bold 
              outline-none focus:ring-2 focus:ring-[#E23744]"
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          type="submit"
          className="w-full bg-[#E23744] py-3 rounded-xl text-white font-semibold"
        >
          Verify & Continue
        </button>
      </form>

      {/* Resend OTP */}
      <p className="text-sm text-gray-500 mt-4">
        Didn’t receive the code?{" "}
        <button
          onClick={resendOTP}
          disabled={!resendEnabled}
          className={`font-semibold ${
            resendEnabled ? "text-[#E23744]" : "text-gray-400"
          }`}
        >
          {resendEnabled ? "Resend OTP" : `Resend in ${timer}s`}
        </button>
      </p>
    </div>
  );
};

export default VerifyEmail;
