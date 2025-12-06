import React from "react";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, Clock, Bike, Wallet, BadgeCheck } from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Phone } from "lucide-react";
import { Gauge,Mail } from "lucide-react";
const RideDetails = () => {
  const { id } = useParams();
  const [ride, setRide] = useState(null);

  useEffect(() => {
    fetchRide();
  }, []);

  const fetchRide = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}users/find-ride/${id}`, {
        withCredentials: true
      });
      console.log(res.data.ride);
      setRide(res.data.ride);
      console.log(res.data.ride);
    } catch {
      toast.error("Unable to fetch ride detail ❌");
    }
  };

  if (!ride) return <p className="text-center py-10">Loading ride details...</p>;
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

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 }}
        className="bg-white shadow-sm rounded-2xl mt-6 overflow-hidden"
      >
        
        {/* Captain / Vehicle Section */}
        <div className="p-5 border-b flex items-center gap-4">
          <div className="size-14 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold">
            {ride.captain.fullname.firstname[0]}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {ride.captain.fullname.firstname} {ride.captain.fullname.lastname}
            </h2>
            <p className="text-gray-500 text-sm">{ride.captain.vehicle.vehicleModel} • {ride.captain.vehicle.color}</p>
            <p className="text-gray-800 font-semibold">{ride.captain.vehicle.numberPlate}</p>
          </div>
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
          
          <div>
            <Wallet className="mx-auto text-[#E23744]" size={22} />
            <p className="text-sm text-gray-500">Fare</p>
            <p className="font-semibold text-gray-800">₹{ride.fare.toFixed(2)}</p>
          </div>

          <div>
            <Clock className="mx-auto text-indigo-500" size={22} />
            <p className="text-sm text-gray-500">Duration</p>
            <p className="font-semibold">
              {(ride.duration / 60).toFixed(1)} min
            </p>
          </div>

          <div>
            <Gauge className="mx-auto text-yellow-600" size={22} />
            <p className="text-sm text-gray-500">Distance</p>
            <p className="font-semibold">
              {(ride.distance / 1000).toFixed(1)} km
            </p>
          </div>
        </div>

        <hr className="mx-4 border-gray-200" />

        {/* Contact */}
        <div className="p-5 flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-sm">Captain Email</p>
            <p className="font-semibold text-gray-800">{ride.captain.email}</p>
          </div>

         <Mail size={22} className="text-[#E23744]" />

        </div>
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="text-center mt-6 text-gray-400 text-sm"
      >
        Thanks for riding with <span className="text-[#E23744] font-semibold">Wheelzy</span> ❤️
      </motion.p>
    </div>
  );
};

export default RideDetails;
