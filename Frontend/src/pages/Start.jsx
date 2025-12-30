import React from "react";
import { Link } from "react-router-dom";
import GadiGoLogo from "../assets/GadiGo.svg";

const Start = () => {
  return (
    <div className="h-[100dvh] w-full relative overflow-hidden bg-black">

      {/* Premium Black Gradient Background */}
      <div
  className="absolute inset-0 bg-cover bg-center scale-105"
  style={{
    backgroundImage:
      "url('https://plus.unsplash.com/premium_photo-1736079754845-3990ce86be89?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE0fHx8ZW58MHx8fHx8')",
    filter: "brightness(0.62)",   // increase visibility
  }}
/>

{/* remove blur, make overlay minimal */}
<div className="absolute inset-0 bg-black/10" />



      {/* Foreground Blur for Depth */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />

      {/* Brand Logo */}
      <img
        src={GadiGoLogo}
        alt="GadiGo Logo"
        className="absolute top-10 left-1/2 -translate-x-1/2 w-36 sm:w-48 opacity-95 animate-fadeIn"
      />

      {/* Bottom CTA Glass Card */}
      <div className="absolute bottom-0 w-full px-6 pb-12 animate-slideUp">
        <div className="backdrop-blur-2xl bg-white/10 border border-white/15 p-7 rounded-3xl text-center shadow-2xl">

          <h2 className="text-3xl font-extrabold tracking-wide text-white">
            Ready to Ride?
          </h2>

          <p className="text-gray-300 text-sm sm:text-base mt-2 mb-6">
            Your journey starts with a tap.
          </p>

          <Link
            to="/login"
            className="block w-full py-3 rounded-xl bg-[#111] text-white font-semibold text-lg active:scale-95 transition shadow-md"
          >
            Get Started →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Start;
