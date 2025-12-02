import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import { CaptainDataContext } from "../UserContext/CaptainContext";
import { useSocket } from "../UserContext/SocketContext";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import axios from "axios";
import LiveTracking from "../components/LiveTracking";
import toast from "react-hot-toast";

const CaptainHome = () => {
  const [ridePopUppanel, setridePopUppanel] = useState(false);
  const ridePopUppanelRef = useRef(null);

  const [confirmridePopUppanel, setconfirmridePopUppanel] = useState(false);
  const confirmridePopUppanelRef = useRef(null);

  const [captainData, setCaptainData] = useContext(CaptainDataContext);
  const { socket, sendMessage, receiveMessage, offMessage } = useSocket();

  const incomingSound = useRef(new Audio("/src/assets/sounds/incoming_new.mp3"));
  const [ride, setride] = useState({});

  // Load stored captain
  useEffect(() => {
    const storedCaptain = localStorage.getItem("captain");
    if (storedCaptain) setCaptainData(JSON.parse(storedCaptain));
  }, []);

  // Join socket room
  useEffect(() => {
    if (!socket || !captainData?._id) return;

    sendMessage("join", { userId: captainData._id, userType: "captain" });
  }, [socket, captainData?._id]);

  // Listen for ride request
  useEffect(() => {
    if (!socket) return;

    const handler = (data) => {
      setride(data);
      toast.success("📍 New Ride Request!");

      incomingSound.current.currentTime = 0;
      incomingSound.current.play().catch(() => {});

      setridePopUppanel(true);
    };

    receiveMessage("new-ride", handler);

    return () => offMessage("new-ride", handler);
  }, [socket]);

  const confirmRide = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}rides/confirm-ride`,
        { rideId: ride._id },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      toast.success("🚗 Ride Accepted!");
    } catch {
      toast.error("⚠ Error confirming ride");
    }
  };

  // ---------- POPUP ANIMATIONS ----------

  // Incoming Ride Sheet
  useGSAP(() => {
    gsap.to(ridePopUppanelRef.current, {
      transform: ridePopUppanel ? "translateY(0%)" : "translateY(120%)",
      duration: 0.45,
      ease: "power2.out",
    });
  }, [ridePopUppanel]);

  // Confirm Ride Sheet (Fix Overlap: move farther when hidden)
  useGSAP(() => {
    gsap.to(confirmridePopUppanelRef.current, {
      transform: confirmridePopUppanel ? "translateY(0%)" : "translateY(200%)",
      duration: 0.45,
      ease: "power2.out",
    });
  }, [confirmridePopUppanel]);

  return (
    <div className="h-[100dvh] w-full bg-[#FCEDEE] relative">

      {/* Transparent Header */}
      <div className="fixed top-0 w-full z-40 flex items-center justify-end px-5 py-4 bg-transparent">
        <Link to="/captain-profile">
          <div className="h-11 w-11 rounded-full bg-[#E23744] text-white flex items-center justify-center 
                          font-semibold text-lg shadow-lg hover:scale-105 transition-all active:scale-95">
            {captainData?.fullname?.firstname?.charAt(0)?.toUpperCase() || "C"}
          </div>
        </Link>
      </div>

      {/* Map */}
      <div className="h-[58%] w-full">
        <LiveTracking />
      </div>

      {/* Driver Status Section */}
      <div className="h-[42%] w-full p-5 bg-white rounded-t-3xl shadow-[0_-6px_25px_rgba(0,0,0,0.10)] border-t-4 border-[#E23744]">
        <CaptainDetails captain={captainData} />
      </div>

      {/* Incoming Ride Popup */}
      <div
        ref={ridePopUppanelRef}
        className="fixed bottom-0 w-full bg-white rounded-t-3xl z-40 shadow-2xl p-5 translate-y-[120%]"
      >
        <RidePopUp
          ride={ride}
          setridePopUppanel={(v) => {
            if (!v) setconfirmridePopUppanel(false);
            setridePopUppanel(v);
          }}
          setconfirmridePopUppanel={(v) => {
            // smooth transition: close first sheet then open OTP panel
            setridePopUppanel(false);
            setTimeout(() => setconfirmridePopUppanel(v), 320);
          }}
          confirmRide={confirmRide}
        />
      </div>

      {/* Confirm OTP Popup */}
      <div
        ref={confirmridePopUppanelRef}
        className="fixed bottom-0 w-full bg-white rounded-t-3xl z-[999] shadow-2xl p-5 translate-y-[200%]"
      >
        <ConfirmRidePopUp
          ride={ride}
          setridePopUppanel={setridePopUppanel}
          setconfirmridePopUppanel={setconfirmridePopUppanel}
        />
      </div>
    </div>
  );
};

export default CaptainHome;
