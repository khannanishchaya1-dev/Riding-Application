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
import WheelzyLogo from "../assets/wheelzy.svg";

const CaptainHome = () => {
  const [ridePopUppanel, setridePopUppanel] = useState(false);
  const ridePopUppanelRef = useRef(null);

  const [confirmridePopUppanel, setconfirmridePopUppanel] = useState(false);
  const confirmridePopUppanelRef = useRef(null);

  const [captainData, setCaptainData] = useContext(CaptainDataContext);
  const { socket, sendMessage, receiveMessage, offMessage } = useSocket();

  const incomingSound = useRef(new Audio("/src/assets/sounds/incoming_new.mp3"));
  const [ride, setride] = useState({});

  // Load captain from local storage
  useEffect(() => {
    const stored = localStorage.getItem("captain");
    if (stored) setCaptainData(JSON.parse(stored));
  }, []);

  // Join socket room
  useEffect(() => {
    if (!socket || !captainData?._id) return;
    sendMessage("join", { userId: captainData._id, userType: "captain" });
  }, [socket, captainData?._id]);
// Auto GPS tracking + emit to backend every 5 seconds
useEffect(() => {
  if (!socket || !captainData?._id) return;

  let watchId = null;

  const sendLocation = (lat, lng) => {
    sendMessage("updateCaptainLocation", {
      captainId: captainData._id,
      location: { ltd: lat, lng: lng },
    });
  };

  // Start GPS watcher
  watchId = navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      console.log(" 📡 captain location ")
      sendLocation(latitude, longitude);
    },
    (err) => {
      console.error("GPS Error:", err);
      toast.error("⚠ Unable to get live location");
    },
    { enableHighAccuracy: true, maximumAge: 0 }
  );

  // Cleanup when component unmounts or socket disconnects
  return () => {
    if (watchId) navigator.geolocation.clearWatch(watchId);
  };
}, [socket, captainData?._id]);

  // Listen for ride request
  useEffect(() => {
    if (!socket) return;

    const handler = (data) => {
      setride(data);
      toast.success("🚗 New Ride Request");

      incomingSound.current.currentTime = 0;
      incomingSound.current.play().catch(() => {});

      setridePopUppanel(true);
    };

    receiveMessage("new-ride", handler);
    return () => offMessage("new-ride", handler);
  }, [socket]);

  // Confirm ride function
  const confirmRide = async () => {
  try {
    await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}rides/confirm-ride`,
      { rideId: ride._id },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );

    sendMessage("ride-accepted", { rideId: ride._id }); // 👈 broadcast event

    toast.success("✔ Ride Accepted");
    setridePopUppanel(false);
    setconfirmridePopUppanel(true);
  } catch {
    toast.error("⚠ Error confirming ride");
  }
};



  useEffect(() => {
  if (!socket || !ride?._id) return;

  const handler = (data) => {
    console.log("📩 ride-confirmed event received", data);

    if (data._id === ride._id) {
      toast.error("❌ Ride taken by another captain");

      setridePopUppanel(false);

      incomingSound.current?.pause();
      if (incomingSound.current) incomingSound.current.currentTime = 0;

      setride({});
    }
  };

  socket.on("ride-confirmed", handler);

  return () => socket.off("ride-confirmed", handler);
}, [socket, ride?._id]);



  // Popup animations
  useGSAP(() => {
    gsap.to(ridePopUppanelRef.current, {
      transform: ridePopUppanel ? "translateY(0%)" : "translateY(120%)",
      duration: 0.45,
      ease: "power2.out",
    });
  }, [ridePopUppanel]);

  useGSAP(() => {
    gsap.to(confirmridePopUppanelRef.current, {
      transform: confirmridePopUppanel ? "translateY(0%)" : "translateY(200%)",
      duration: 0.45,
      ease: "power2.out",
    });
  }, [confirmridePopUppanel]);

  return (
    <div className="h-[100dvh] w-full overflow-hidden relative">

      {/* Top Avatar Button */}
      <div className="absolute top-0 left-0 w-full flex items-center justify-between px-6 py-8 z-10">
        <img 
          src={WheelzyLogo}
          alt="Logo"
          className="w-32 opacity-90"
        />
      
        <Link to="/captain-profile">
                <div className="h-12 w-12 rounded-full bg-white/90 backdrop-blur-xl shadow-md border border-gray-200 
                                flex items-center justify-center text-[#E23744] text-xl font-bold transition hover:scale-105">
                  {captainData?.fullname?.firstname?.charAt(0)?.toUpperCase() || "U"}
                </div>
              </Link>
      </div>

      {/* Full Map */}
      <div className="h-[100dvh]">
        <LiveTracking />
      </div>

      {/* Bottom Card Glass UI */}
      <div className="absolute bottom-0 w-full backdrop-blur-xl bg-white/70 rounded-t-3xl p-6 border-t border-gray-300 shadow-lg z-20">
        <CaptainDetails captain={captainData} />
      </div>

      {/* Incoming Popup */}
      <div
        ref={ridePopUppanelRef}
        className="fixed bottom-0 w-full z-40 translate-y-[120%] backdrop-blur-xl bg-white/85 
                border-t border-gray-200 shadow-xl rounded-t-3xl p-6">
        <RidePopUp
          ride={ride}
          setridePopUppanel={(v) => {
            if (!v) setconfirmridePopUppanel(false);
            setridePopUppanel(v);
          }}
          setconfirmridePopUppanel={(v) => {
            setridePopUppanel(false);
            setTimeout(() => setconfirmridePopUppanel(v), 250);
          }}
          confirmRide={confirmRide}
        />
      </div>

      {/* Confirm Ride Popup */}
      <div
        ref={confirmridePopUppanelRef}
        className="inset-x-0 fixed bottom-0 w-full z-40 translate-y-[200%] backdrop-blur-xl bg-white/90 
                border-t border-gray-200 shadow-xl rounded-t-3xl">
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
