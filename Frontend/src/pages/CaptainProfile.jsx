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

const TripItem = ({ trip }) => {
  const statusColor =
    trip.status === "COMPLETED" ? "text-green-700" : "text-[#E23744]";

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
            className={`ml-3 text-xs font-medium px-2 py-0.5 rounded-full ${
              trip.status === "COMPLETED"
                ? "bg-green-100 text-green-700"
                : "bg-[#FFEBEC] text-[#E23744]"
            }`}
          >
            {trip.status}
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
        <button className="w-full mt-6 text-center text-[#E23744] font-semibold hover:underline">
          View All Ride History →
        </button>
      </div>
    </div>
  );
};

export default CaptainProfile;
