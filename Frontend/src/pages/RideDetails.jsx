import React from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Gauge, Wallet, Mail, CheckCircle, XCircle, Timer } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const RideDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const vehicleImages = {
    Car: "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy9iYWRmYjFkNi02YzJiLTQ1NTMtYjkyOS05ZmYzMmYwMmE1NWUucG5n",
    Moto: "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8yYzdmYTE5NC1jOTU0LTQ5YjItOWM2ZC1hM2I4NjAxMzcwZjUucG5n",
    Auto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRor72fdhJNar5p8b5iAmiwHtcY-c5XCd8nbvYwWgvVfy4Fmyt_9kB8-5kr8rWXdpO_DL0&usqp=CAU",
  };
  const vehicleImg = vehicleImages[ride?.vehicleType];

  useEffect(() => {
    fetchRide();
  }, []);
useEffect(() => {
  if (ride?.status === "ONGOING"  && location.pathname !== "/home") {
    navigate("/riding", { state: { ride } });
  }
}, [ride]);
useEffect(() => {
  if (ride?.status === "ACCEPTED"  && location.pathname !== "/home") {
    console.log("Navigating to /home from RideDetails",ride);
    navigate("/home", { state: { ride } });
  }
}, [ride]);

  const fetchRide = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}users/find-ride/${id}`, {
        withCredentials: true
      });
      setRide(res.data.ride);
    } catch {
      toast.error("Unable to fetch ride detail ❌");
    }
  };

  if (!ride) return <p className="text-center py-10">Loading ride details...</p>;

  // 🔥 Status color + icon logic
  const getStatusStyle = () => {
    switch (ride.status) {
      case "COMPLETED":
        return { bg: "bg-green-100", text: "text-green-700", Icon: CheckCircle };
      case "ONGOING":
        return { bg: "bg-yellow-100", text: "text-yellow-700", Icon: Timer };
      default:
        return { bg: "bg-red-100", text: "text-red-700", Icon: XCircle };
    }
  };

  const { bg, text, Icon } = getStatusStyle();

  return (
    <div className="h-[100dvh] bg-gray-50 px-5 py-8">

      {/* Page Title */}
      <motion.h1 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-semibold text-[#E23744]"
      >
        Ride Summary 🚗
      </motion.h1>

      {/* Ride Status */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`mt-3 inline-flex items-center gap-2 px-4 py-1 rounded-full text-sm font-semibold ${bg} ${text}`}
      >
        <Icon size={16} /> {ride.status}
      </motion.div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 }}
        className="bg-white shadow-sm rounded-2xl mt-6 overflow-hidden"
      >
        
        {/* Captain Info */}
        {/* Captain Info */}
<div className="p-5 border-b flex items-center gap-4">
  {ride?.captain ? (
    <>
      <img
        src={vehicleImg}
        className="h-12 w-12 rounded-lg border"
        alt="vehicle"
      />

      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          {ride.captain.fullname.firstname} {ride.captain.fullname.lastname}
        </h2>
        <p className="text-gray-500 text-sm">
          {ride.captain.vehicle.vehicleModel} • {ride.captain.vehicle.color}
        </p>
        <p className="text-gray-800 font-semibold">{ride.captain.vehicle.numberPlate}</p>
      </div>
    </>
  ) : (
    <div className="w-full text-center py-4">
      <p className="text-gray-600 font-medium">🚫 No Captain Assigned</p>
      <p className="text-sm text-gray-500">
        This ride was cancelled or no captain accepted.
      </p>
    </div>
  )}
</div>

        {/* Route */}
        <div className="p-5 space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="text-[#E23744]" size={18} />
            <p className="text-gray-800 font-medium">{ride.origin}</p>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="text-green-600" size={18} />
            <p className="text-gray-800 font-medium">{ride.destination}</p>
          </div>
        </div>

        <hr className="mx-4 border-gray-200" />

        {/* Ride Stats */}
        <div className="grid grid-cols-3 text-center p-5 gap-4">
          
          {/* 💰 Fare - Now Clean UI */}
          <div className="text-center">
  <Wallet className="mx-auto text-[#E23744]" size={22} />
  <p className="text-sm text-gray-500">Fare</p>

  {/* Fare + Payment Status in vertical layout */}
  <p className="font-semibold text-gray-900 mt-1">₹{ride.fare.toFixed(2)}</p>

  {/* Payment Status Badge */}
  {ride.paymentStatus === "PAID" ? (
    <span className="mt-1 inline-flex items-center gap-1 text-green-600 text-xs font-semibold">
      <CheckCircle size={14} /> Paid
    </span>
  ) : ride.paymentStatus === "FAILED" ? (
    <span className="mt-1 inline-flex items-center gap-1 text-red-600 text-xs font-semibold">
      <XCircle size={14} /> Failed
    </span>
  ) : (
    <span className="mt-1 inline-flex items-center gap-1 text-yellow-600 text-xs font-semibold animate-pulse">
      <Timer size={14} /> Pending
    </span>
  )}
</div>

          {/* ⏱ Duration */}
          <div>
            <Clock className="mx-auto text-indigo-500" size={22} />
            <p className="text-sm text-gray-500">Duration</p>
            <p className="font-semibold">{(ride.duration / 60).toFixed(1)} min</p>
          </div>

          {/* 📍 Distance */}
          <div>
            <Gauge className="mx-auto text-yellow-600" size={22} />
            <p className="text-sm text-gray-500">Distance</p>
            <p className="font-semibold">{(ride.distance / 1000).toFixed(1)} km</p>
          </div>
        </div>

        <hr className="mx-4 border-gray-200" />

        {/* Contact */}
        <div className="p-5 flex justify-between items-center">
  {ride?.captain ? (
    <>
      <div>
        <p className="text-gray-400 text-sm">Captain Email</p>
        <p className="font-semibold text-gray-800">
          {ride.captain.email}
        </p>
      </div>

      <Mail size={22} className="text-[#E23744]" />
    </>
  ) : (
    <div className="w-full text-center py-2">
      <p className="text-gray-500 text-sm">📍 No Captain Assigned</p>
      <p className="text-xs text-gray-400">
        Ride may have been cancelled.
      </p>
    </div>
  )}
</div>

      </motion.div>

      {/* 🚀 Payment CTA */}
      {(ride.paymentStatus !== "PAID" && ride.status === "ONGOING") && (
        <button
          onClick={() => navigate("/riding", { state: { ride } })}
          className="w-full mt-5 py-4 bg-[#E23744] text-white rounded-xl text-lg font-semibold hover:bg-[#c02f38] transition"
        >
          💳 Complete Payment
        </button>
      )}

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mt-6 text-gray-400 text-sm"
      >
        Thanks for riding with <span className="text-[#E23744] font-semibold">GadiGo</span> ❤️
      </motion.p>
    </div>
  );
};

export default RideDetails;
