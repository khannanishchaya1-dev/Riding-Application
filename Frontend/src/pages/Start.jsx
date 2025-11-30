import React from "react";
import { Link } from "react-router-dom";
import wheelzyLogo from "../assets/wheelzy.svg";

const Start = () => {
  return (
    <div className="h-[100dvh] w-full relative">
      {/* Background Image */}
      <div
        className="h-full w-full bg-cover bg-center flex flex-col justify-between"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1619059558110-c45be64b73ae?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dHJhZmZpYyUyMGxpZ2h0fGVufDB8fDB8fHww')",
        }}
      >
        {/* Logo */}
        <img
          src={wheelzyLogo}
          alt="Wheelzy Logo"
          className="mt-4 ml-4 w-36 sm:w-44"
        />

        {/* Bottom Panel */}
        <div className="bg-white text-black py-6 px-5 rounded-t-3xl shadow-lg">
          <h2 className="text-xl sm:text-2xl font-bold mb-5 text-center">
            Get Started with Wheelzy
          </h2>
          <Link
            to="/home"
            className="flex justify-center items-center w-full bg-black text-white py-3 rounded text-base sm:text-lg hover:bg-gray-900 transition"
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Start;
