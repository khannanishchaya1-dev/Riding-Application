import React from "react";
import { Link } from "react-router-dom";
import wheelzyLogo from "../assets/wheelzy.svg";

const Start = () => {
  return (
    <div className="h-[100dvh] w-full relative overflow-hidden bg-black">

      {/* Background (premium dark traffic blur) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1673986928683-4e9f232d6f9f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      />

      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />

      {/* Logo */}
      <img
        src={wheelzyLogo}
        alt="Wheelzy Logo"
        className="absolute top-8 left-1/2 -translate-x-1/2 w-40 sm:w-48 opacity-95 animate-fadeIn"
      />

      {/* Bottom Glass Panel */}
      <div className="absolute bottom-0 w-full px-6 pb-10 animate-slideUp">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-7 rounded-3xl text-center">

          <h2 className="text-3xl font-bold tracking-wide text-white">
            Ready to ride?
          </h2>

          <p className="text-gray-300 text-sm sm:text-base mt-1 mb-6">
            Your journey starts with a tap.
          </p>

          <Link
            to="/home"
            className="w-full block text-center py-3 text-white text-lg font-semibold bg-[#E23744] hover:bg-[#FF4F5A] active:scale-[0.97] transition rounded-xl"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Start;
