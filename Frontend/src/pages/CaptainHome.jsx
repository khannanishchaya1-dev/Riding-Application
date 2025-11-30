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
import wheelzyCaptainLogo from "../assets/wheelzy-captain.svg";
import toast from "react-hot-toast";


const CaptainHome = () => {
  const [ridePopUppanel, setridePopUppanel] = useState(false);
  const ridePopUppanelRef = useRef(null);
  const [confirmridePopUppanel, setconfirmridePopUppanel] = useState(false);
  const confirmridePopUppanelRef = useRef(null);
  const [captainData, setCaptainData] = useContext(CaptainDataContext);
  const { socket, sendMessage, receiveMessage, offMessage } = useSocket();
  const incomingSound = useRef(new Audio("/src/assets/sounds/incoming_new.mp3"));
const acceptedSound = useRef(new Audio("/src/assets/sounds/accepted.mp3"));
const expiredSound = useRef(new Audio("/src/assets/sounds/ignored.mp3"));
  const timerRef = useRef(null);
 // adjust if different
  const [ride, setride] = useState({});
useEffect(() => {
  if (!socket || !captainData?._id) return;

  sendMessage("join", {
    userId: captainData._id,
    userType: "captain",
  });

  console.log("📡 Join request sent for captain:", captainData._id);

}, [socket, captainData?._id]);

  // Load captain from localStorage
  useEffect(() => {
    const storedCaptain = localStorage.getItem("captain");
    if (storedCaptain) {
      setCaptainData(JSON.parse(storedCaptain));
    }
  }, [setCaptainData]);

  // Join room + location updates
  useEffect(() => {
  if (!captainData?._id || !socket) return;

  let intervalId = null;

  const sendLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        sendMessage("updateCaptainLocation", {
          captainId: captainData._id,
          location: {
            ltd: position.coords.latitude,
            lng: position.coords.longitude,
          },
        });
      },
      (err) => console.error("❌ Location error:", err)
    );
  };

  // Run immediately once
  sendLocation();

  // Start continuous updates ONLY if popup is not open
  if (!ridePopUppanel) {
    intervalId = setInterval(sendLocation, 5000);
  }

  return () => {
    if (intervalId) clearInterval(intervalId);
  };

}, [captainData?._id, socket, ridePopUppanel]);

  // Listen for new rides (socket)
  useEffect(() => {
  if (!socket) return;
  console.log("🔥 Socket connected:", socket.id);
}, [socket]);
  
useEffect(() => {
  if (!socket) return; // <-- important safeguard

  const handler = (data) => {
    console.log("📦 New ride received:", data);
    setride(data);
    toast.success("🚖 New ride request received!");
    incomingSound.current.currentTime = 0;
  incomingSound.current.play().catch(()=>{});
    setridePopUppanel(true);
  };

  console.log("📡 Subscribed to event: new-ride");
  receiveMessage("new-ride", handler);

  return () => {
    console.log("🧹 Unsubscribed from: new-ride");
    offMessage("new-ride", handler);
  };
}, [socket]); // <-- ONLY depend on socket


  // Log ride updates (just for debug)
  useEffect(() => {
    console.log("Updated ride:", ride);
  }, [ride]);

  // Auto close ride popup + toast countdown instead of console "waiting"
  useEffect(() => {

  // 🚫 If popup closed → stop immediately & do nothing
  if (!ridePopUppanel || confirmridePopUppanel) {
    toast.dismiss("ride-timer");
    console.log("🛑 Ride popup closed, timer prevented.");
    return;
  }

  // ✅ If popup opened → start timer
  let seconds = 29;

  toast.loading(`⏳ Waiting for your response... ${seconds}s`, { id: "ride-timer" });

  const intervalId = setInterval(() => {
    seconds--;
    if (seconds > 0) {
      toast.loading(`⏳ Waiting for your response... ${seconds}s`, { id: "ride-timer" });
    }
  }, 1000);

  const timeoutId = setTimeout(() => {
    setridePopUppanel(false);
    toast.dismiss("ride-timer");
    console.log("⌛ Ride auto-dismissed after timeout");
  }, 29000);

  return () => {
    clearInterval(intervalId);
    clearTimeout(timeoutId);
  };

}, [ridePopUppanel,confirmridePopUppanel, ride]);

  // GSAP animations
  useGSAP(
    () => {
      gsap.to(ridePopUppanelRef.current, {
        transform: ridePopUppanel ? "translateY(0%)" : "translateY(100%)",
        duration: 0.5,
        ease: "power2.out",
      });
    },
    { dependencies: [ridePopUppanel] }
  );

  useGSAP(
    () => {
      gsap.to(confirmridePopUppanelRef.current, {
        transform: confirmridePopUppanel ? "translateY(0%)" : "translateY(100%)",
        duration: 0.5,
        ease: "power2.out",
      });
    },
    { dependencies: [confirmridePopUppanel] }
  );

  async function confirmRide() {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}rides/confirm-ride`,
        {
          rideId: ride._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("✅ Ride confirmed:", response.data);
    } catch (error) {
      console.error(
        "❌ Error confirming ride:",
        error.response?.data || error.message
      );
    }
  }

  return (
    <div className="h-[100dvh] w-full">
      <div className="fixed p-6 top-0 flex items-center justify-between w-full z-10">
        <img
          src={wheelzyCaptainLogo}
          alt="Logo"
          className="w-40 sm:w-28 md:w-32"
        />

        <Link to="/captain-profile">
          <div className="relative w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-black font-bold text-lg sm:text-xl shadow-md hover:scale-105 transition-transform duration-200 overflow-hidden">
            <div className="absolute inset-0 bg-white/20 rounded-full pointer-events-none" />
            <span className="relative z-10">
              {captainData?.fullname?.firstname?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
        </Link>
      </div>

      <div className="h-3/5">
        <LiveTracking />
      </div>

      <div className="h-2/5 p-4 bg-gradient-to-br from-yellow-200 to-yellow-400">
        <CaptainDetails captain={captainData} />
      </div>

      {/* Ride popup */}
      <div
        ref={ridePopUppanelRef}
        className="fixed z-10 bottom-0 bg-white p-3 w-full py-10 translate-y-full"
      >
        <RidePopUp
          setridePopUppanel={setridePopUppanel}
          setconfirmridePopUppanel={setconfirmridePopUppanel}
          ride={ride}
          confirmRide={confirmRide}
        />
      </div>

      {/* Confirm ride popup */}
      <div
        ref={confirmridePopUppanelRef}
        className="fixed h-[100dvh] z-30 bottom-0 bg-white p-3 w-full py-10 translate-y-full"
      >
        <ConfirmRidePopUp
          setconfirmridePopUppanel={setconfirmridePopUppanel}
          setridePopUppanel={setridePopUppanel}
          ride={ride}
        />
      </div>
    </div>
  );
};

export default CaptainHome;
