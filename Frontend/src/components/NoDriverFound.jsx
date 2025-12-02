import React from "react";
import Cancelled from "../assets/Cancelled.svg";
import { Link, useNavigate } from "react-router-dom";

const NoDriverFound = ({ setnoDriverFound, setride }) => {
  const navigate = useNavigate();

  const reset = () => {
    setnoDriverFound(false);
    setride({});
    navigate("/home");
  };

  return (
    <div className="p-6 pb-10 text-center relative animate-fadeIn bg-white rounded-3xl border-t-4 border-[#E23744]">

      {/* Close Icon */}
      <button
        onClick={reset}
        className="absolute top-2 right-3 bg-[#FFE5E5] h-9 w-9 rounded-full flex items-center justify-center text-[#E23744] hover:bg-[#ffcccc] transition"
      >
        <i className="ri-close-line text-xl"></i>
      </button>

      {/* Title */}
      <h2 className="text-2xl font-bold text-[#E23744] mt-4">
        No Drivers Available
      </h2>

      {/* Illustration */}
      <img
        className="w-20 mx-auto mt-5 drop-shadow-md"
        src={Cancelled}
        alt="No Driver Illustration"
      />

      {/* Subtitle */}
      <p className="text-gray-600 text-sm mt-4 px-3">
        We couldn't find a driver nearby right now.  
        Demand might be high — try again in a moment!
      </p>

      {/* Retry Button */}
      <button
        onClick={reset}
        className="w-full mt-7 py-3 bg-[#E23744] text-white font-semibold rounded-xl flex justify-center items-center gap-2 shadow-md hover:bg-[#c72b36] active:scale-[0.98] transition-all"
      >
        <i className="ri-refresh-line text-lg animate-spin-slow"></i>
        Try Again
      </button>

      {/* Passive message */}
      <p className="mt-4 text-xs text-gray-400">
        🚗 Checking new drivers nearby...
      </p>
    </div>
  );
};

export default NoDriverFound;
