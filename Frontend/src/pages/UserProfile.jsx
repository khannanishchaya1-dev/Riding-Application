import React, { useEffect, useState, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../UserContext/UserContext";
import {
  LogOut,
  Mail,
  User,
  Car,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const RideItem = ({ ride }) => {
  return (
    <Link to={`/passenger-ride-details/${ride._id}`}>
    <div className="backdrop-blur-xl bg-white/70 border border-gray-200 rounded-2xl p-4 flex justify-between items-center hover:scale-[0.99] transition-all cursor-pointer shadow-sm">
      
      {/* Left Content */}
      <div className="flex flex-col space-y-1 w-[70%]">
        
        {/* Date + Status */}
        <div className="flex items-center text-xs font-semibold text-gray-700">
          <Clock className="w-4 h-4 mr-2 text-gray-500" />
          {ride.createdAt
            ? new Date(ride.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
              })
            : "Unknown"}
          <span
            className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${
              ride.status === "COMPLETED"
                ? "bg-green-100 text-green-600"
                : "bg-[#FFE8E9] text-[#E23744]"
            }`}
          >
            {ride.status}
          </span>
        </div>

        {/* Origin */}
        <p className="flex items-center text-xs text-gray-600 truncate">
          <MapPin className="w-3.5 h-3.5 mr-1 text-gray-500" />
          {ride.origin}
        </p>

        {/* Destination */}
        <p className="flex items-center text-xs text-gray-600 truncate">
          <MapPin className="w-3.5 h-3.5 mr-1 text-[#E23744]" />
          {ride.destination}
        </p>
      </div>

      {/* Price + Arrow */}
      <div className="text-right flex flex-col items-end">
        <p className="text-lg font-bold text-[#E23744]">₹{ride.fare}</p>
        <ArrowRight className="w-5 h-5 text-gray-400 hover:text-[#E23744] transition" />
      </div>
    </div>
    </Link>
  );
};

const ProfilePage = () => {
  const [user, setUser] = useState(() => {
  const saved = localStorage.getItem("user");
  return saved ? JSON.parse(saved) : null;
});

  const [rides, setrides] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    if (!user?._id) return;

    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}rides/find-rides`,
        { user_id: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => setrides(res.data.rides));
  }, [user]);

  const userInitial = useMemo(
    () => user?.fullname?.firstname?.[0]?.toUpperCase() || "U",
    [user]
  );

  const memberSince = useMemo(
    () =>
      user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
          })
        : "Unknown",
    [user]
  );

  if (!user)
    return <div className="min-h-screen flex justify-center items-center text-gray-600">Loading...</div>;

  return (
    <div className="h-screen bg-gradient-to-b from-white to-[#FFF4F4] flex flex-col items-center">

      {/* Header */}
      <div className="bg-gradient-to-br from-[#E23744] to-[#A81C28] w-full p-8 text-white relative rounded-b-3xl shadow-lg">
        
        {/* Avatar + Logout */}
        <div className="flex justify-between items-center">
          <div className="bg-white text-[#E23744] font-extrabold w-20 h-20 flex items-center justify-center rounded-full shadow-xl ring-4 ring-[#FFD4D6] text-3xl">
            {userInitial}
          </div>

          <button
            onClick={() => navigate("/logout")}
            className="flex items-center gap-2 px-4 py-2 border border-white/40 rounded-full hover:bg-white hover:text-[#E23744] transition font-semibold"
          >
            <LogOut className="w-4" /> Logout
          </button>
        </div>

        <h1 className="text-3xl font-bold mt-4">Hey {user?.fullname?.firstname} 👋</h1>
        <p className="opacity-90 text-sm">Member since {memberSince}</p>
      </div>

      {/* Personal Info Card */}
      <div className="w-full max-w-2xl px-6 py-8 space-y-4">
        <h2 className="font-semibold text-lg">Personal Information</h2>

        <div className="space-y-3">

          <div className="flex justify-between bg-white/90 backdrop-blur-md border border-gray-200 px-4 py-3 rounded-xl shadow-sm">
            <span className="flex items-center gap-2 text-gray-700"><User className="w-5 text-[#E23744]" /> Full Name</span>
            <strong>{user.fullname.firstname} {user.fullname.lastname}</strong>
          </div>

          <div className="flex justify-between bg-white/90 backdrop-blur-md border border-gray-200 px-4 py-3 rounded-xl shadow-sm">
            <span className="flex items-center gap-2 text-gray-700"><Mail className="w-5 text-[#E23744]" /> Email</span>
            <strong className="truncate max-w-[50%] text-[#E23744]">{user.email}</strong>
          </div>
        </div>
      </div>

      {/* Ride History */}
      <div className="w-full max-w-2xl px-6 py-6 rounded-t-3xl">
        <h2 className="font-bold text-lg flex items-center mb-3">
          <Car className="w-5 text-[#E23744] mr-2" /> Ride History ({rides.length})
        </h2>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {rides.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">No rides yet 🚗</p>
          ) : (
            rides.map((ride) => <RideItem ride={ride} key={ride._id} />)
          )}
        </div>

        <button className="mt-5 w-full text-[#E23744] font-semibold hover:underline">View All →</button>
      </div>
    </div>
  );
};

export default ProfilePage;
