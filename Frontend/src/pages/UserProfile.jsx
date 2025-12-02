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

const RideItem = ({ ride }) => {
  const statusColor =
    ride.status === "COMPLETED" ? "text-green-600" : "text-[#E23744]";

  return (
    <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#FFD2D6] hover:shadow-md transition duration-150 flex justify-between items-center cursor-pointer">

      <div className="flex flex-col space-y-2 w-4/5">
        <div className="flex items-center text-sm font-semibold text-gray-800">
          <Clock className="w-4 h-4 mr-2 text-gray-400" />
          {ride.createdAt
            ? new Date(ride.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
              })
            : "No Date"}
          <span
            className={`ml-3 text-xs font-medium px-2 py-0.5 rounded-full ${
              ride.status === "COMPLETED"
                ? "bg-green-100 text-green-700"
                : "bg-[#FFEAEA] text-[#E23744]"
            }`}
          >
            {ride.status}
          </span>
        </div>

        <div className="flex items-center text-xs text-gray-600 truncate">
          <MapPin className="w-3.5 h-3.5 mr-1 text-gray-600" />
          <span className="truncate">{ride.origin}</span>
        </div>

        <div className="flex items-center text-xs text-gray-600 truncate">
          <MapPin className="w-3.5 h-3.5 mr-1 text-[#E23744]" />
          <span className="truncate">{ride.destination}</span>
        </div>
      </div>

      <div className="flex flex-col items-end space-y-1">
        <span className="text-lg font-bold text-[#E23744]">₹{ride.fare}</span>
        <ArrowRight className="w-5 h-5 text-gray-400 hover:text-[#E23744]" />
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const { user, setUser } = useContext(UserDataContext);
  const [rides, setrides] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    if (!user?._id) return;

    async function fetch() {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}rides/find-rides`,
          { user_id: user._id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setrides(res.data.rides);
      } catch (err) {
        console.log(err);
      }
    }

    fetch();
  }, [user]);

  const userInitial = useMemo(
    () => user?.fullname?.firstname?.charAt(0)?.toUpperCase() || "U",
    [user]
  );

  const memberSince = useMemo(() => {
    return user?.createdAt
      ? new Date(user.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "N/A";
  }, [user]);

  if (!user)
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#FFF5F6] font-sans">

      {/* Header */}
      <div className="bg-gradient-to-br from-[#E23744] to-[#BA1F2D] p-6 sm:p-8 text-white w-full shadow-lg">
        <div className="flex justify-between items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center text-[#E23744] text-3xl font-extrabold shadow-lg ring-4 ring-offset-2 ring-[#FFC6C9]">
            {userInitial}
          </div>

          <button
            onClick={() => navigate("/logout")}
            className="border border-white/40 px-4 py-2 rounded-full text-sm hover:bg-white hover:text-[#E23744] transition font-semibold"
          >
            <LogOut className="w-4 h-4 inline-block mr-2" />
            Logout
          </button>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold mt-4">
          Hey, {user?.fullname?.firstname} 👋
        </h1>
        <p className="opacity-90 text-sm">Member since {memberSince}</p>
      </div>

      {/* Personal Info */}
      <div className="w-full max-w-2xl p-6 sm:p-8 space-y-6 bg-white">
        <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
          Personal Information
        </h2>

        <div className="space-y-3">

          <div className="flex justify-between p-3 bg-[#FFF1F1] rounded-xl">
            <div className="flex items-center">
              <User className="w-5 h-5 text-[#E23744] mr-3" />
              <span className="text-sm text-gray-700">Full Name</span>
            </div>
            <span className="font-semibold">
              {user?.fullname?.firstname} {user?.fullname?.lastname}
            </span>
          </div>

          <div className="flex justify-between p-3 bg-[#FFF1F1] rounded-xl">
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-[#E23744] mr-3" />
              <span className="text-sm text-gray-700">Email</span>
            </div>
            <span className="font-semibold text-[#E23744] truncate max-w-[50%]">
              {user?.email}
            </span>
          </div>

        </div>
      </div>

      {/* Ride History */}
      <div className="w-full max-w-2xl p-6 sm:p-8">
        <h2 className="text-xl font-bold text-gray-900 border-b pb-2 flex items-center">
          <Car className="w-5 h-5 mr-2 text-[#E23744]" />
          Previous Rides ({rides.length})
        </h2>

        <div className="mt-4 space-y-3 max-h-80 overflow-y-auto pr-2">
          {rides.map((ride) => (
            <RideItem key={ride._id} ride={ride} />
          ))}
        </div>

        <button className="w-full text-center mt-6 text-[#E23744] font-semibold hover:underline">
          View All Ride History →
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
