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
    <div className="p-7 pb-10 text-center relative bg-white rounded-3xl border-t border-gray-200 shadow-[0_-10px_30px_rgba(0,0,0,0.12)] animate-fadeIn">

      {/* Close Icon */}
      <button
        onClick={reset}
        className="absolute top-3 right-4 h-9 w-9 rounded-full flex items-center justify-center 
                   bg-gray-100 text-gray-600 hover:bg-gray-200 transition active:scale-95"
      >
        <i className="ri-close-line text-xl"></i>
      </button>

      {/* Title */}
      <h2 className="text-xl font-semibold text-[#111] mt-2">
        No Drivers Available
      </h2>

      {/* Illustration */}
      <img
        className="w-20 mx-auto mt-5 opacity-90"
        src={Cancelled}
        alt="No Driver Illustration"
      />

      {/* Subtitle */}
      <p className="text-gray-500 text-sm mt-4 leading-relaxed">
        We couldn't match a driver right now.  
        Please try again after a moment.
      </p>

      {/* Retry Button */}
      <button
        onClick={reset}
        className="w-full mt-7 py-3 text-[15px] font-medium bg-black text-white rounded-xl shadow-md 
                   hover:bg-[#222] active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        <i className="ri-refresh-line text-lg"></i>
        Try Again
      </button>

      {/* Passive message */}
      <p className="mt-4 text-[11px] text-gray-400">
        🚘 Still scanning — new drivers may become available soon
      </p>
    </div>
  );
};

export default NoDriverFound;
