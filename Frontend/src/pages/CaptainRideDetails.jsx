import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { MapPin, Clock, Gauge, Wallet, Mail, CheckCircle, XCircle, Timer } from "lucide-react";

const CaptainRideDetails = () => {
  const { id } = useParams();
  const [ride, setRide] = useState(null);
  const navigate = useNavigate();
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
    // 👇 if ride is still ongoing, send captain back to tracking screen
    if (ride?.status === "ONGOING") {
      navigate("/captain-riding", { state: { ride } });
    }
  }, [ride]);

  const fetchRide = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}captains/find-ride/${id}`,
        { withCredentials: true }
      );
      setRide(res.data.ride);
    } catch {
      toast.error("Unable to fetch ride details ❌");
    }
  };

  if (!ride) return <p className="text-center py-10">Loading ride details...</p>;

  const user = ride.userId;

  // ---- STATUS BADGE ----
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

  // ---- PAYMENT BADGE ----
  const getPaymentBadge = () => {
    switch (ride.paymentStatus) {
      case "PAID":
        return (
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold flex items-center gap-1">
            <CheckCircle size={14} /> Payment Completed
          </span>
        );
      case "FAILED":
        return (
          <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold flex items-center gap-1">
            <XCircle size={14} /> Payment Failed
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-600 text-xs font-semibold flex items-center gap-1">
            <Timer size={14} /> Pending Payment
          </span>
        );
    }
  };

  const { bg, text, Icon } = getStatusStyle();

  return (
    <div className="h-[100dvh] bg-gray-50 px-5 py-8">

      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-semibold text-[#E23744]"
      >
        Ride Summary 🚕
      </motion.h1>

      {/* Ride Status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className={`mt-3 inline-flex items-center gap-2 px-4 py-1 rounded-full text-sm font-semibold ${bg} ${text}`}
      >
        <Icon size={16} /> {ride.status}
      </motion.div>

      {/* MAIN CARD */}
      {/* MAIN CARD */}
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ delay: 0.15 }}
  className="bg-white shadow-sm rounded-2xl mt-6 overflow-hidden"
>

  {/* Vehicle Preview */}
  {vehicleImg && (
    <div className="w-full bg-gray-100 flex justify-center p-5 border-b">
      <img
        src={vehicleImg}
        alt={ride.vehicleType}
        className="h-28 object-contain drop-shadow-md"
      />
    </div>
  )}

  {/* Passenger Info */}
  <div className="p-5 border-b flex items-center gap-4">
    <div className="size-14 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold">
      {user.fullname.firstname[0]}
    </div>
    <div>
      <h2 className="text-lg font-semibold text-gray-800">
        {user.fullname.firstname} {user.fullname.lastname}
      </h2>
      <p className="text-gray-500 text-sm">Passenger</p>
      <p className="text-gray-800 font-semibold">{user.email}</p>
    </div>
  </div>

  {/* Route Display */}
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


        {/* Stats */}
        <div className="grid grid-cols-3 text-center p-5 gap-4">
          
          <div>
            <Wallet className="mx-auto text-[#E23744]" size={22} />
            <p className="text-sm text-gray-500">Fare</p>
            <p className="font-semibold text-gray-800">₹{ride.fare.toFixed(2)}</p>

            {/* Payment status under fare */}
            <div className="mt-2 flex justify-center">{getPaymentBadge()}</div>
          </div>

          <div>
            <Clock className="mx-auto text-indigo-500" size={22} />
            <p className="text-sm text-gray-500">Duration</p>
            <p className="font-semibold">{(ride.duration / 60).toFixed(1)} min</p>
          </div>

          <div>
            <Gauge className="mx-auto text-yellow-600" size={22} />
            <p className="text-sm text-gray-500">Distance</p>
            <p className="font-semibold">{(ride.distance / 1000).toFixed(1)} km</p>
          </div>
        </div>

        <hr className="mx-4 border-gray-200" />

        {/* Contact */}
        <div className="p-5 flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-sm">Passenger Email</p>
            <p className="font-semibold text-gray-800">{user.email}</p>
          </div>
          <Mail size={22} className="text-[#E23744]" />
        </div>

      </motion.div>

      {/* Continue Ride Button */}
      {ride.status === "ONGOING" && (
        <button
          onClick={() => navigate("/captain-riding", { state: { ride } })}
          className="w-full mt-5 py-4 bg-[#E23744] text-white rounded-xl text-lg font-semibold hover:bg-[#c02f38] transition"
        >
          🚕 Continue Ride
        </button>
      )}

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="text-center mt-6 text-gray-400 text-sm"
      >
        Thank you for driving with <span className="text-[#E23744] font-semibold">GadiGo</span> 🚗💨
      </motion.p>

    </div>
  );
};

export default CaptainRideDetails;
