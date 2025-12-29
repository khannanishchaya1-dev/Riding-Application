import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import FinishRide from "../components/FinishRide";
import LiveTracking from "../components/LiveTrackingOngoing";
import toast from "react-hot-toast";
import { useSocket } from "../UserContext/SocketContext";
import { CaptainDataContext } from "../UserContext/CaptainContext";
import axios from "axios";
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
    console.log("🚦 SOCKET:", socket);
    console.log("🧑 captainId:", captainData?._id);
    console.log("🚕 rideId:", ride?._id);

    if (!socket || !captainData?._id || !ride?._id) {
      console.warn("❌ Live tracking NOT initialized – missing values");
      return;
    }

    sendMessage("join-ride", { rideId: ride._id });

    const watchId = navigator.geolocation.watchPosition(
      ({ coords }) => {
        console.log("📡 Sending GPS:", coords.latitude, coords.longitude);
        sendMessage("updateCaptainLocation", {
          captainId: captainData._id,
          rideId: ride._id,
          lat: coords.latitude,
          lon: coords.longitude,
        });
      },
      (err) => console.error("GPS Error:", err),
      { enableHighAccuracy: true, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [socket, captainData?._id, ride?._id]);

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

  const remainingKm =
    typeof ride?.distance === "number"
      ? (ride.distance / 1000).toFixed(1)
      : "4.0";

  return (
    <div className="h-[100dvh] w-full relative overflow-hidden">
      <Link
        to="/captain-home"
        onClick={() => localStorage.removeItem("activeRide")}
        className="absolute right-5 top-5 h-11 w-11 bg-white flex items-center justify-center 
                   rounded-full shadow-md z-20 hover:scale-105 transition"
      >
        <i className="ri-logout-box-r-line text-lg text-gray-800" />
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
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-[0_-8px_28px_rgba(0,0,0,0.18)] border-t 
                border-gray-200 px-6 py-4 flex items-center justify-between">
  <button
    onClick={() => setFinishRidepanel(true)}
    className="absolute top-1 left-1/2 -translate-x-1/2"
  >
    <div className="w-12 h-[4px] bg-gray-300 rounded-full" />
  </button>

  <div className="flex flex-col">
    <p className="text-xs text-gray-500">Distance remaining</p>
    <p className="text-lg font-semibold text-gray-900">🚦 {remainingKm} km</p>
  </div>

  <div className="flex flex-col items-end gap-2">

  {/* Payment Status + Cash Option */}
  <div className="flex items-center gap-2">
    {getPaymentBadge()}

    {/* Cash Payment Chip */}
    {ride?.paymentStatus !== "PAID" && (
      <button
        onClick={() => {
          handleCashPayment();

        }}
        className="px-3 py-[6px] border border-gray-300 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-100 active:scale-95"
      >
        Cash Received
      </button>
    )}
  </div>

  {/* Finish Ride CTA */}
  <button
    disabled={ride?.paymentStatus !== "PAID"}
    onClick={() => setFinishRidepanel(true)}
    className={`px-6 py-3 text-sm font-semibold rounded-xl transition 
      ${ride?.paymentStatus !== "PAID"
        ? "bg-gray-200 text-gray-400"
        : "bg-[#E23744] text-white hover:bg-[#c52e37] active:scale-95"
      }`}
  >
    Finish Ride
  </button>

</div>

</div>


      {/* Finish Ride Panel */}
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
