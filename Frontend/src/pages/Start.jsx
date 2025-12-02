import React from "react";
import { Link } from "react-router-dom";
import wheelzyLogo from "../assets/wheelzy.svg";

const Start = () => {
  return (
    <div className="h-[100dvh] w-full relative overflow-hidden">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-500"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop')", // Slight urban red tone like Zomato
        }}
      />

      {/* Zomato Red Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#E23744]/80 via-[#E23744]/30 to-black/80"></div>

      {/* Logo */}
      <img
        src={wheelzyLogo}
        alt="Wheelzy Logo"
        className="absolute top-6 left-6 w-36 sm:w-48 animate-fadeIn drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]"
      />

      {/* Bottom Panel */}
      <div className="absolute bottom-0 w-full p-6 animate-slideUp">
        <div className="bg-white rounded-3xl shadow-xl p-7 border border-[#f6d4d4]">
          <h2 className="text-3xl font-extrabold text-center text-[#E23744] tracking-wide">
            Welcome
          </h2>

          <p className="text-gray-500 text-center text-sm sm:text-base mt-1 mb-6">
            Hungry for a smooth ride? Let's go.
          </p>

          <Link
            to="/home"
            className="w-full block text-center py-3 bg-[#E23744] text-white font-semibold rounded-xl text-lg hover:bg-[#c62f39] active:scale-[0.96] transition-all duration-200"
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Start;
