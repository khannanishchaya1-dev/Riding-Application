import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import WheelzyLogo from "../assets/wheelzy-captain-dark.svg";

const VerifyCaptainEmail = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem("pendingCaptainEmail");

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
    <div className="h-[100vh] flex flex-col justify-center items-center bg-[#ffffff] px-6 text-center">
      <img src={WheelzyLogo} className="w-28 mb-4" />

      <h2 className="text-2xl font-semibold text-[#E23744]">Verify Email</h2>
      <p className="text-gray-500 text-sm mt-2">
        OTP sent to <strong>{email}</strong>
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6 w-full max-w-xs">
        <div className="flex justify-between">
          {otp.map((digit, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              className="w-10 h-12 text-center text-xl font-semibold border rounded-xl outline-none focus:ring-2 focus:ring-[#E23744]"
            />
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-[#E23744] text-white py-3 rounded-xl font-semibold"
        >
          Verify & Continue
        </button>
      </form>

      <button
        onClick={resendOTP}
        disabled={!resendEnabled}
        className="mt-4 text-sm font-semibold"
      >
        {resendEnabled ? "Resend OTP" : `Resend in ${timer}s`}
      </button>
    </div>
  );
};

export default VerifyCaptainEmail;
