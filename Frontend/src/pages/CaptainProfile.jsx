import React, { useEffect, useState, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../UserContext/CaptainContext";
import {
  LogOut,
  Car,
  TrendingUp,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  Phone,
  IndianRupee,
  Eye,
  EyeOff,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const TripItem = ({ trip }) => {
  const statusColor =
    trip.status === "COMPLETED" ? "text-green-700" : "text-[#E23744]";

    const getDisplayStatus = () => {
  switch (trip.status) {
    case "CANCELLED_BY_CAPTAIN":
      return "CANCELLED";
    case "CANCELLED_BY_USER":
      return "CANCELLED";
    default:
      return trip.status;
  }
};

  return (
    <Link to={`/captain-ride-details/${trip._id}`}>
    <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#FFD2D6] hover:shadow-md transition flex justify-between items-center cursor-pointer">

      <div className="flex flex-col space-y-2 w-4/5">
        <div className="flex items-center text-sm font-semibold text-gray-800">
          <Calendar className="w-4 h-4 mr-2 text-[#E23744]" />
          {trip.createdAt
            ? new Date(trip.createdAt).toLocaleDateString()
            : "No Date"}

          <span
  className={`ml-3 text-xs font-medium px-2 py-0.5 rounded-full 
    ${
      trip.status === "COMPLETED"
        ? "bg-green-100 text-green-700"
        : trip.status === "ONGOING"
        ? "bg-[#FFF8D1] text-[#B08900]"  // 🔥 NEW STYLE FOR ONGOING
        : "bg-[#FFEBEC] text-[#E23744]"
    }`}
>
  {getDisplayStatus()}

</span>

        </div>

        <div className="flex items-center text-xs text-gray-600 truncate">
          <MapPin className="w-3.5 h-3.5 mr-1 text-[#E23744]" />
          <span className="truncate font-medium">{trip.origin}</span>
        </div>

        <div className="flex items-center text-xs text-gray-600 truncate">
          <MapPin className="w-3.5 h-3.5 mr-1 text-[#E23744]" />
          <span className="truncate font-medium">{trip.destination}</span>
        </div>
      </div>

      <div className="flex flex-col items-end space-y-1">
        <span className="text-lg font-bold text-[#E23744]">
          ₹{trip.fare.toFixed(2)}
        </span>
        <ArrowRight className="w-5 h-5 text-gray-400 hover:text-[#E23744] transition" />
      </div>
    </div>
    </Link>
  );
};

const CaptainProfile = () => {
  const [captainData, setCaptainData] = useState(()=>{
    const saved = localStorage.getItem("captain");
    return saved ? JSON.parse(saved) : null;
  });
  const [trips, setTrips] = useState([]);
  const [stats, setStats] = useState({ totalTrips: 0, totalEarnings: "0.00", rating: "5.0" });
  const [showId, setShowId] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
const handleDelete = async () => {
  try {
    console.log("Deleting account...");
    await axios.delete(`${import.meta.env.VITE_BACKEND_URL}captains/delete-account`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    localStorage.clear();
    navigate("/captain-signup");
  } catch (err) {
    toast.error("❌ Could not delete account. Try again.");
  }
};

  const navigate = useNavigate();


  useEffect(() => {
    if (!captainData?._id) return;

    async function fetchTrips() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}rides/find-captain-rides`,
          { captain_id: captainData._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setTrips(res.data.rides);
      } catch (error) {
        console.log(error);
      }
    }

    fetchTrips();
  }, [captainData]);

  useEffect(() => {
    const completed = trips.filter(t => t.status === "COMPLETED");
    const total = completed.reduce((sum, t) => sum + t.fare, 0).toFixed(2);

    setStats({
      totalTrips: completed.length,
      totalEarnings: total,
      rating: "5.0",
    });
  }, [trips]);

  const captainInitial =
    captainData?.fullname?.firstname?.charAt(0)?.toUpperCase() || "D";

  const memberSince = captainData?.createdAt
    ? new Date(captainData.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : "N/A";

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#FFF5F6] font-sans">

      {/* HEADER */}
      <div className="bg-gradient-to-br from-[#E23744] to-[#B01E2E] p-6 sm:p-8 text-white w-full shadow-md">
        <div className="flex justify-between items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white text-[#E23744] font-extrabold flex items-center justify-center text-3xl shadow-lg ring-4 ring-offset-2 ring-[#FFCDD2]">
            {captainInitial}
          </div>

          <button
            onClick={() => navigate("/captain-logout")}
            className="flex items-center text-sm font-semibold px-4 py-2 rounded-full border border-white/60 hover:bg-white hover:text-[#E23744] transition"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </button>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold mt-4">
          Welcome {captainData?.fullname?.firstname}
        </h1>

        {/* RESTORED LINE */}
        <p className="text-sm font-medium opacity-90 mt-1">
          🚗 Driving Partner Since {memberSince}
        </p>
      </div>

      {/* STATS */}
      <div className="p-6 sm:p-8 space-y-6 w-full">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-[#E23744]" /> Performance Overview
        </h2>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#FFEBEC] p-4 rounded-xl text-center border border-[#FFBDC4]">
            <Car className="w-6 h-6 text-[#E23744] mx-auto mb-1" />
            <p className="text-lg font-bold">{stats.totalTrips}</p>
            <p className="text-xs text-gray-600">Trips</p>
          </div>

          <div className="bg-[#FFEBEC] p-4 rounded-xl text-center border border-[#FFBDC4]">
            <IndianRupee className="w-6 h-6 text-[#E23744] mx-auto mb-1" />
            <p className="text-lg font-bold">₹{stats.totalEarnings}</p>
            <p className="text-xs text-gray-600">Earnings</p>
          </div>

          <div className="bg-[#FFEBEC] p-4 rounded-xl text-center border border-[#FFBDC4]">
            <ShieldCheck className="w-6 h-6 text-[#E23744] mx-auto mb-1" />
            <p className="text-lg font-bold">{stats.rating}</p>
            <p className="text-xs text-gray-600">Rating</p>
          </div>
        </div>
      </div>

      {/* TRIP HISTORY */}
      <div className="p-6 sm:p-8 w-full">
        <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-[#E23744]" /> Recent Trips ({trips.length})
        </h2>

        <div className="space-y-3 max-h-80 overflow-y-auto">
          {trips.length ? (
            trips.map((t) => <TripItem key={t._id} trip={t} />)
          ) : (
            <p className="text-center text-gray-500 py-4">No recent trips</p>
          )}
        </div>

        {/* 🔥 RESTORED BUTTON */}
        {/* <button
         onClick={() => setShowDeleteModal(true)}
         className="mt-5 w-full text-red-600 border border-red-400 py-2 rounded-xl hover:bg-red-50 transition font-semibold"
       >
         ❌ Delete Account Permanently
       </button> */}
        <button
         className="mt-5 w-full text-red-600 border border-red-400 py-2 rounded-xl hover:bg-red-50 transition font-semibold"
       >
         View All
       </button>
       
             </div>
             {showDeleteModal && (
         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[999]">
           <motion.div
             initial={{ scale: 0.7, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             exit={{ scale: 0.7, opacity: 0 }}
             className="bg-white w-[90%] max-w-md rounded-2xl shadow-xl p-6 text-center"
           >
             <h2 className="text-xl font-bold text-[#E23744]">Delete Account?</h2>
             <p className="text-gray-600 mt-2 text-sm">
               This action <strong>cannot be undone</strong>. Your ride history, account,
               and stored data will be deleted permanently.
             </p>
       
             <div className="flex gap-3 mt-6">
               <button
                 onClick={() => setShowDeleteModal(false)}
                 className="flex-1 py-2 border rounded-xl font-semibold hover:bg-gray-100 transition"
               >
                 Cancel
               </button>
       
               <button
                 onClick={handleDelete}
                 className="flex-1 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition"
               >
                 Yes, Delete
               </button>
             </div>
           </motion.div>
         </div>
       )}
       
    </div>
  );
};

export default CaptainProfile;
