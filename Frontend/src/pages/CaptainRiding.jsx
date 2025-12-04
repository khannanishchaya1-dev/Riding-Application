import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import FinishRide from "../components/FinishRide";
import LiveTracking from "../components/LiveTracking";
import toast from "react-hot-toast";

const CaptainRiding = () => {
  const [FinishRidepanel, setFinishRidepanel] = useState(false);
  const FinishRideRef = useRef(null);
  const location = useLocation();
  const { ride } = location.state || {};

  useEffect(() => {
    toast.success("🚕 Ride started — drive safe!");
  }, []);

  useGSAP(
    () => {
      gsap.to(FinishRideRef.current, {
        transform: FinishRidepanel ? "translateY(0)" : "translateY(100%)",
        duration: 0.5,
        ease: "power2.out",
      });
    },
    { dependencies: [FinishRidepanel] }
  );

  const remainingKm =
    typeof ride?.distance === "number"
      ? (ride.distance / 1000).toFixed(1)
      : "4.0";

  return (
    <div className="h-[100dvh] w-full relative overflow-hidden">

      {/* Top Right Button (Exit / Home) */}
      <Link
        to="/home"
        className="absolute right-5 top-5 h-11 w-11 bg-white flex items-center justify-center 
                   rounded-full shadow-md z-20 hover:scale-105 transition"
      >
        <i className="ri-logout-box-r-line text-lg text-gray-800" />
      </Link>

      {/* Fullscreen Map */}
      <div className="absolute inset-0 h-[100dvh] w-full">
        <LiveTracking />
      </div>

      {/* Bottom Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl 
                      shadow-[0_-8px_28px_rgba(0,0,0,0.18)] border-t border-gray-200 
                      px-6 py-4 flex items-center justify-between">

        {/* Drag Handle (opens FinishRide panel) */}
        <button
          onClick={() => setFinishRidepanel(true)}
          className="absolute top-1 left-1/2 -translate-x-1/2"
        >
          <div className="w-12 h-[4px] bg-gray-300 rounded-full" />
        </button>

        {/* Remaining Distance */}
        <div className="flex flex-col">
          <p className="text-xs text-gray-500">Distance remaining</p>
          <p className="text-lg font-semibold text-gray-900">
            🚦 {remainingKm} km
          </p>
        </div>

        {/* Finish Ride Button */}
        <button
          onClick={() => setFinishRidepanel(true)}
          className="bg-[#E23744] text-white font-semibold rounded-xl px-6 py-3 
                     text-sm active:scale-[0.97] hover:bg-[#c52e37] transition"
        >
          Finish Ride
        </button>
      </div>

      {/* Slide-up Finish Ride Panel */}
      <div
        ref={FinishRideRef}
        className="fixed h-[100dvh] z-30 bottom-0 bg-white w-full translate-y-full rounded-t-3xl shadow-[0_-8px_28px_rgba(0,0,0,0.18)]"
      >
        <FinishRide setFinishRidepanel={setFinishRidepanel} ride={ride} />
      </div>
    </div>
  );
};

export default CaptainRiding;
