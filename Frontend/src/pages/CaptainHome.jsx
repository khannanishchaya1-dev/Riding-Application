import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
import GadiGoLogo from "../assets/GadiGo.svg";

const CaptainHome = () => {
  const location = useLocation();
  const [ridePopUppanel, setridePopUppanel] = useState(false);
  const ridePopUppanelRef = useRef(null);

  const [confirmridePopUppanel, setconfirmridePopUppanel] = useState(false);
  const confirmridePopUppanelRef = useRef(null);

  const [captainData, setCaptainData] = useContext(CaptainDataContext);
  const { socket, sendMessage, receiveMessage, offMessage } = useSocket();

  const incomingSound = useRef(new Audio("/src/assets/sounds/incoming_new.mp3"));

  const [ride, setride] = useState(() => {
    const storedRide = localStorage.getItem("activeRide");
    return storedRide ? JSON.parse(storedRide) : location.state?.ride || null;
  });

  useEffect(() => {
    return () => {
      localStorage.removeItem("activeRide");
    };
  }, []);

  useEffect(() => {
    if (!ride) {
      localStorage.removeItem("activeRide");
      return;
    }
    if (ride.status === "REQUESTED" || ride.status === "ACCEPTED") {
      localStorage.setItem("activeRide", JSON.stringify(ride));
    } else {
      localStorage.removeItem("activeRide");
    }
  }, [ride]);

  useEffect(() => {
    if (!ride) return;
    if (ride.status === "ACCEPTED") {
      setconfirmridePopUppanel(true);
      setridePopUppanel(false);
    } else if (ride.status === "REQUESTED") {
      setridePopUppanel(true);
      setconfirmridePopUppanel(false);
    }
  }, [ride]);

  useEffect(() => {
    const stored = localStorage.getItem("captain");
    if (stored) setCaptainData(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (!socket || !captainData?._id) return;
    sendMessage("join", { userId: captainData._id, userType: "captain" });
  }, [socket, captainData?._id]);

  useEffect(() => {
    if (!socket || !captainData?._id) return;

    const updateAvailabilityLocation = () => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          sendMessage("updateCaptainLocation", {
            captainId: captainData._id,
            lat: coords.latitude,
            lon: coords.longitude,
            isAvailable: true
          });
        },
        (err) => console.error("GPS error", err),
        { enableHighAccuracy: true }
      );
    };
    updateAvailabilityLocation();
    const interval = setInterval(updateAvailabilityLocation, 45000);
    return () => clearInterval(interval);
  }, [socket, captainData?._id]);


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
  }, [socket]);

  const confirmRide = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}rides/confirm-ride`,
        { rideId: ride._id },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      sendMessage("ride-accepted", { rideId: ride._id });
      toast.success("✔ Ride Accepted");
      setride(response.data.ride);
      setridePopUppanel(false);
      setconfirmridePopUppanel(true);
    } catch {
      toast.error("⚠ Error confirming ride");
    }
  };

  useEffect(() => {
    if (!receiveMessage) return;

    const cancelHandler = () => {
      toast.error("❌ Ride cancelled by Passenger");
      setconfirmridePopUppanel(false);
      setridePopUppanel(false);
      setride(null);
    };

    receiveMessage("ride-cancelled", cancelHandler);
  }, [receiveMessage]);

  const CancelRide = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}rides/cancel-ride`,
        { rideId: ride._id },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      toast.success(res.data?.message || "✔ Ride Cancelled");
      localStorage.removeItem("activeRide");
      setconfirmridePopUppanel(false);
      setridePopUppanel(false);
      setride(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "⚠ Error cancelling ride");
    }
  };

  useEffect(() => {
    if (!socket || !ride?._id) return;
    const handler = (data) => {
      if (data._id === ride._id) {
        toast.error("❌ Ride taken by another captain");
        incomingSound.current?.pause();
        setridePopUppanel(false);
        setride({});
      }
    };
    socket.on("ride-confirmed", handler);
    return () => socket.off("ride-confirmed", handler);
  }, [socket, ride?._id]);

  useGSAP(() => {
    gsap.to(ridePopUppanelRef.current, {
      transform: ridePopUppanel ? "translateY(0%)" : "translateY(120%)",
      duration: 0.35,
      ease: "power2.out",
    });
  }, [ridePopUppanel]);

  useGSAP(() => {
    gsap.to(confirmridePopUppanelRef.current, {
      transform: confirmridePopUppanel ? "translateY(0%)" : "translateY(200%)",
      duration: 0.35,
      ease: "power2.out",
    });
  }, [confirmridePopUppanel]);


  return (
    <div className="h-[100dvh] w-full overflow-hidden relative">

      {/* Header */}
      <div className="absolute top-0 left-0 w-full flex items-center justify-between px-6 py-8 z-10">
        <img src={GadiGoLogo} alt="Logo" className="w-32 opacity-90" />

        <Link to="/captain-profile">
          <div className="h-12 w-12 rounded-full bg-white border border-gray-200 
                          shadow-sm flex items-center justify-center text-black 
                          font-semibold hover:scale-105 transition">
            {captainData?.fullname?.firstname?.charAt(0)?.toUpperCase() || "U"}
          </div>
        </Link>
      </div>

      {/* Map */}
      <div className="h-[100dvh]">
        <LiveTracking />
      </div>

      {/* Bottom Captain Details */}
      <div className="absolute bottom-0 w-full bg-white rounded-t-3xl p-6 
                      border-t border-gray-200 shadow-[0_-4px_18px_rgba(0,0,0,0.08)] z-20">
        <CaptainDetails captain={captainData} />
      </div>

      {/* New Ride Popup */}
      <div
        ref={ridePopUppanelRef}
        className="fixed bottom-0 w-full z-40 translate-y-[120%] bg-white 
                  border-t border-gray-200 shadow-lg rounded-t-3xl p-6">
        <RidePopUp
          ride={ride}
          setridePopUppanel={setridePopUppanel}
          setconfirmridePopUppanel={setconfirmridePopUppanel}
          confirmRide={confirmRide}
        />
      </div>

      {/* Confirm Ride Popup */}
      <div
        ref={confirmridePopUppanelRef}
        className="fixed bottom-0 w-full z-40 translate-y-[200%] bg-white 
                  border-t border-gray-200 shadow-xl rounded-t-3xl">
        <ConfirmRidePopUp
          ride={ride}
          setridePopUppanel={setridePopUppanel}
          setconfirmridePopUppanel={setconfirmridePopUppanel}
          CancelRide={CancelRide}
          setride={setride}
        />
      </div>
    </div>
  );
};

export default CaptainHome;
