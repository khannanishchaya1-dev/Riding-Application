import React from "react";
import Cancelled from "../assets/Cancelled.svg";

const NoDriverFound = ({ onRetry, onClose }) => {
  return (
    <div className="p-6 text-center animate-fadeIn relative">

      {/* Close Icon */}
      <button
        onClick={onClose}
        className="absolute top-2 right-3 text-gray-400 text-2xl hover:text-black transition"
      >
        <i className="ri-close-line"></i>
      </button>

      {/* Heading */}
      <h2 className="text-2xl font-semibold mb-4">No Driver Found</h2>

      {/* Illustration */}
      <img
        className="w-10 mx-auto mb-4 drop-shadow-lg rounded-lg"
        src={Cancelled}
        alt="No Driver Found"
      />

      {/* Subtitle */}
      <p className="text-gray-600 text-sm mb-6 px-4">
        Sorry, no nearby driver accepted your request.  
        You can try again — someone might be available now!
      </p>

      {/* Retry Button Icon Style */}
      <button
        onClick={onRetry}
        className="w-full flex items-center justify-center gap-2 border border-green-600 text-green-700 font-semibold rounded-lg py-2 hover:bg-green-600 hover:text-white transition-all active:scale-95"
      >
        <i className="ri-refresh-line text-xl animate-spin-slow"></i>
        Find Again
      </button>
    </div>
  );
};

export default NoDriverFound;
