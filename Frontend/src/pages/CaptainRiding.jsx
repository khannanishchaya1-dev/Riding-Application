import React from 'react'
import { Link,useLocation } from 'react-router-dom'
import {useGSAP} from "@gsap/react";
import {gsap} from "gsap";
import { useState,useRef, useEffect } from 'react';
import FinishRide from '../components/FinishRide'
import LiveTracking from '../components/LiveTracking';
import wheelzyCaptainLogo from "../assets/wheelzy-captain-dark.svg";
import toast from "react-hot-toast";

const CaptainRiding = () => {
  const [FinishRidepanel, setFinishRidepanel] = useState(false);
  const FinishRideRef = useRef(null);
  const location=useLocation();
  const {ride} = location.state || {};

  useEffect(() => {
    toast.success("🚕 Ride started — drive safe!");
  }, []);

  useGSAP(() => {
    gsap.to(FinishRideRef.current, {
      transform: FinishRidepanel ? "translateY(0)" : "translateY(100%)",
      duration: 0.5,
      ease: "power2.out",
    });
  }, { dependencies: [FinishRidepanel] });

  return (
    <div className="h-[100dvh] w-full">
      
      {/* Header */}
      <div className="fixed p-6 top-0 flex items-center justify-between w-screen">
        <img className="w-60" src={wheelzyCaptainLogo} alt="Wheelzy Captain Logo" />
        <Link to="/home" className="h-10 w-10 bg-white flex items-center justify-center rounded-full">
          <i className=" text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>

      {/* Map */}
      <div className="h-4/5">
        <LiveTracking />
      </div>

      {/* 🔥 Updated Zomato-style bottom section */}
      <div className="h-1/5 bg-[#FCEDEE] flex items-center justify-between px-5 border-t border-gray-300 relative">
        
        {/* Drag Icon */}
        <h5 className="absolute w-full top-1 flex justify-center">
          <i 
            onClick={() => setFinishRidepanel(true)}
            className="ri-arrow-up-s-line text-3xl text-gray-500 cursor-pointer"
          ></i>
        </h5>

        {/* Ride Distance */}
        <h4 className="text-lg font-semibold text-[#E23744]">
          🚦 {(ride?.distance)/1000 || "4 KM"} remaining
        </h4>

        {/* 🔴 New Zomato-style Button */}
        <button
          onClick={() => setFinishRidepanel(true)}
          className="bg-[#E23744] text-white font-semibold rounded-xl px-6 py-3 active:scale-[0.96] transition"
        >
          Finish Ride
        </button>
      </div>

      {/* Slide Panel */}
      <div ref={FinishRideRef} className="fixed h-[100dvh] z-10 bottom-0 bg-white p-3 w-full py-10 translate-y-full">
        <FinishRide setFinishRidepanel={setFinishRidepanel} ride={ride} />
      </div>
      
    </div>
  )
}

export default CaptainRiding;
