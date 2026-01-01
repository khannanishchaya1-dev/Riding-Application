import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import FinishRide from "../components/FinishRide";
import LiveTracking from "../components/LiveTrackingOngoing";
import toast from "react-hot-toast";
import { useSocket } from "../UserContext/SocketContext";
import { CaptainDataContext } from "../UserContext/CaptainContext";
import axios from "axios";
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI/180;
  const dLon = (lon2 - lon1) * Math.PI/180;
  const a =
    Math.sin(dLat/2)**2 +
    Math.cos(lat1*Math.PI/180) *
    Math.cos(lat2*Math.PI/180) *
    Math.sin(dLon/2)**2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
}

const CaptainRiding = () => {
  const [FinishRidepanel, setFinishRidepanel] = useState(false);
  const { socket, sendMessage, receiveMessage,offMessage } = useSocket();
  const [captainData] = useContext(CaptainDataContext);
  const FinishRideRef = useRef(null);
  const location = useLocation();

  const [ride, setride] = useState(() => {
    const storedRide = localStorage.getItem("activeRide");
    return storedRide ? JSON.parse(storedRide) : location.state?.ride || null;
  });
  const [remainingKm, setRemainingKm] = useState(
  ride?.distance ? Number(ride.distance).toFixed(1) : "0.0"
);

console.log("SOCKET:", socket);
console.log("receiveMessage type:", typeof receiveMessage);

  // GSAP animation for Bottom sheet
  useEffect(() => {
    gsap.to(FinishRideRef.current, {
      transform: FinishRidepanel ? "translateY(0)" : "translateY(100%)",
      duration: 0.45,
      ease: "power2.out",
    });
  }, [FinishRidepanel]);

  // persist ride
  useEffect(() => {
    if (ride) localStorage.setItem("activeRide", JSON.stringify(ride));
  }, [ride]);

  useEffect(() => {
    return () => localStorage.removeItem("activeRide");
  }, []);

  // 📡 Send GPS location continuously
  useEffect(() => {
  if (!socket || !captainData?._id || !ride?._id || !ride?.destinationCoordinates) return;

  sendMessage("join-ride", { rideId: ride._id });

  const dest = ride.destinationCoordinates;

  const watchId = navigator.geolocation.watchPosition(
    ({ coords }) => {
      const { latitude, longitude } = coords;

      console.log("📡 Sending GPS:", latitude, longitude);

      // 🔹 Calculate distance (Captain -> Destination)
      const km = getDistanceKm(latitude, longitude, dest.lat, dest.lon);
      console.log("Updated Distance" , km)
      setRemainingKm(km.toFixed(1));  // <-- update state instantly

      // 🔹 Send GPS to backend (no need to include distance)
      sendMessage("updateCaptainLocation", {
        captainId: captainData._id,
        rideId: ride._id,
        lat: latitude,
        lon: longitude,
      });
    },
    (err) => console.error("GPS Error:", err),
    { enableHighAccuracy: true, maximumAge: 0 }
  );

  return () => navigator.geolocation.clearWatch(watchId);
}, [socket, ride?._id, captainData?._id]);




  // Toast on ride start
  useEffect(() => {
    toast.success("🚕 Ride started — drive safe!");
  }, []);

  // Payment listener
  useEffect(() => {
    if (!receiveMessage) return;
    const handler = (data) => {
      toast.success("💳 Passenger completed payment!");
      setride((prev) => ({ ...prev, ...data }));
    };
    receiveMessage("payment-success", handler);
    return () => receiveMessage?.off?.("payment-success", handler);
  }, [receiveMessage]);


const handleCashPayment = async () => {
  try{
    const token = localStorage.getItem("token"); 
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}payment/cash-payment`, { rideId: ride._id },{
            headers: {
              Authorization: `Bearer ${token}`, // 👈 include token again
            },
          }); 
          console.log("💰 Cash payment handled successfully!");
          setride((prev) => ({ ...prev, paymentStatus: "PAID" }));
  }catch(err){
    toast.error("❌ Cash payment failed. Please try again.");
  }
}

  // Payment badge UI
  const getPaymentBadge = () => {
    const status = ride?.paymentStatus;
    if (status === "PAID")
      return (
        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold flex items-center gap-1">
          <i className="ri-check-double-fill" /> Paid
        </span>
      );
    if (status === "FAILED")
      return (
        <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold flex items-center gap-1">
          <i className="ri-close-circle-fill" /> Failed
        </span>
      );
    return (
      <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-600 text-xs font-semibold flex items-center gap-1">
        <i className="ri-time-fill" /> Pending
      </span>
    );
  };



  return (
    <div className="h-[100dvh] w-full relative overflow-hidden">
      <Link
  to="/captain-home"
  onClick={() => localStorage.removeItem("activeRide")}
  className="absolute right-5 top-5 h-11 w-11 bg-white flex items-center justify-center 
             rounded-full shadow-lg z-20 hover:scale-105 transition"
>
  <i className="ri-logout-box-r-line text-lg text-black" />
</Link>

      {/* 🗺️ Full Map */}
      <div className="absolute inset-0 h-full w-full">
        <LiveTracking
          origin={ride?.originCoordinates}
          destination={ride?.destinationCoordinates}
          rideId={ride?._id}
          receiveMessage={receiveMessage}
          socket={socket}
          offMessage={offMessage}
        />
      </div>

      {/* Bottom Sheet UI */}
      {/* Bottom Sheet UI */}
<div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl 
                shadow-[0_-10px_35px_rgba(0,0,0,0.22)] border-t border-gray-200 
                px-6 py-4 flex items-center justify-between backdrop-blur-xl">

  {/* Drag Handle */}
  <button
    onClick={() => setFinishRidepanel(true)}
    className="absolute top-1 left-1/2 -translate-x-1/2 cursor-pointer"
  >
    <div className="w-14 h-[4px] bg-gray-300 rounded-full transition" />
  </button>

  {/* Distance */}
  <div className="flex flex-col">
    <p className="text-xs text-gray-500">Distance remaining</p>
    <p className="text-lg font-semibold text-gray-900">🚦 {remainingKm} km</p>
  </div>

  {/* Right Actions */}
  <div className="flex flex-col items-end gap-2">

    {/* Payment Status + Cash */}
    <div className="flex items-center gap-2">
      {getPaymentBadge()}

      {ride?.paymentStatus !== "PAID" && (
        <button
          onClick={handleCashPayment}
          className="px-3 py-[6px] border border-gray-300 text-gray-700 
                     rounded-full text-xs font-medium hover:bg-gray-100 
                     active:scale-95 transition-all"
        >
          Cash Received
        </button>
      )}
    </div>

    {/* Finish Ride CTA */}
    <button
      disabled={ride?.paymentStatus !== "PAID"}
      onClick={() => setFinishRidepanel(true)}
      className={`px-6 py-3 text-sm font-semibold rounded-xl transition-all shadow-md
        ${ride?.paymentStatus !== "PAID"
          ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
          : "bg-black text-white hover:bg-gray-900 active:scale-95"
        }`}
    >
      Finish Ride
    </button>

  </div>
</div>

      {/* Finish Ride Panel */}
     <div
  ref={FinishRideRef}
  className="fixed h-[100dvh] z-30 bottom-0 bg-white w-full translate-y-full 
            rounded-t-3xl shadow-[0_-12px_35px_rgba(0,0,0,0.25)] border-t border-gray-200"
>
  <FinishRide setFinishRidepanel={setFinishRidepanel} ride={ride} />
</div>

    </div>
  );
};

export default CaptainRiding;
