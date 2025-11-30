import React, { useEffect, useState, useMemo,useContext} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../UserContext/UserContext";
// Assuming useNavigate is available from the runtime environment (like react-router-dom)
// Since this is a standalone file, we assume the host environment provides these helpers.
import { LogOut, Mail, User, Car, MapPin, Clock, ArrowRight } from 'lucide-react';


const getMockUser = () => {
  const stored = localStorage.getItem("user");
  if (!stored) {
    return;
  }else{
    return JSON.parse(stored);
  }
  
  
};





// Mock data for previous rides
const mockRides = [
  { id: 1, date: "Nov 15", status: "Completed", pickup: "123 Main St", dropoff: "456 Oak Ave", cost: 24.50 },
  { id: 2, date: "Nov 12", status: "Completed", pickup: "Airport Terminal A", dropoff: "Downtown Hilton", cost: 58.00 },
  { id: 3, date: "Oct 28", status: "Completed", pickup: "789 Pine Ln", dropoff: "Local Coffee Shop", cost: 12.75 },
  { id: 4, date: "Oct 20", status: "Canceled", pickup: "Home Address", dropoff: "City Library", cost: 0.00 },
];

// --- Helper Components ---

// Component for a single ride item in the history list
const RideItem = ({ ride }) => {
  const statusColor = ride.status === 'COMPLETED' ? 'text-green-600' : 'text-red-500';
  
  return (
    <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-100 hover:shadow-sm transition duration-150 flex justify-between items-center cursor-pointer">
      
      {/* Ride Details (Left) */}
      <div className="flex flex-col space-y-2 w-4/5">
        <div className="flex items-center text-sm font-semibold text-gray-800">
          <Clock className="w-4 h-4 mr-2 text-gray-400" />
          {ride.createdAt
    ? new Date(ride.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      })
    : "No Date"}
          <span className={`ml-3 text-xs font-medium px-2 py-0.5 rounded-full ${statusColor === 'text-green-600' ? 'bg-green-50' : 'bg-red-50'} ${statusColor}`}>
            {ride.status}
          </span>
        </div>

        <div className="flex items-center text-xs text-gray-600 truncate">
          <MapPin className="w-3.5 h-3.5 mr-1 text-blue-500" />
          <span className="truncate">{ride.origin}</span>
        </div>
        
        <div className="flex items-center text-xs text-gray-600 truncate">
          <MapPin className="w-3.5 h-3.5 mr-1 text-red-500" />
          <span className="truncate">{ride.destination}</span>
        </div>
      </div>
      
      {/* Cost and Arrow (Right) */}
      <div className="flex flex-col items-end space-y-1">
        <span className="text-lg font-bold text-gray-900">₹{ride.fare}</span>
        <ArrowRight className="w-5 h-5 text-gray-400 hover:text-blue-500 transition" />
      </div>
    </div>
  );
};


// --- Main Component ---

const ProfilePage = () => {
  const { user, setUser } = useContext(UserDataContext); // Get user data from context
  const [rides, setrides] = useState([]);
  const navigate = useNavigate();

   useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }, []);
  
  useEffect(() => {
  
  if (!user?._id) return; // Wait until user is availab
  const fetchRides = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage!");
        return;
      }

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}rides/find-rides`,
        { user_id: user._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setrides(res.data.rides);
    } catch (error) {
      // More detailed logging
      console.error("Error fetching rides:", error.response?.data || error.message);
    }
  };

  fetchRides();
}, [user]);



  // Derived state for display
  const userInitial = useMemo(() => {
    return user?.fullname?.firstname?.charAt(0).toUpperCase() || "U";
  }, [user]);

  
  const memberSince = useMemo(() => {
    return user?.createdAt 
      ? new Date(user.createdAt).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long',
          day: 'numeric'
        }) 
      : 'N/A';
  }, [user]);

  const handleLogout = () => {
    
    navigate("/logout");
  };

  if (!user) {
    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-50">
            <p className="text-gray-600">Loading profile...</p>
        </div>
    );
  }

  return (
    <div className="h-[100dvh] flex flex-col items-center bg-gray-50 font-sans ">

      {/* 🚀 Main Content Wrapper */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* --- 1. HEADER & GREETING --- */}
        <div className="bg-gradient-to-br from-gray-700 to-gray-500 p-6 sm:p-8 text-white">
          <div className="flex justify-between items-center">
            {/* User Initial Avatar (Large and prominent) */}
            <div 
              className="
                w-16 h-16 sm:w-20 sm:h-20
                rounded-full 
                bg-white 
                flex items-center justify-center 
                text-indigo-600 
                font-extrabold text-3xl 
                shadow-2xl 
                ring-4 ring-offset-2 ring-blue-300
              "
              aria-label="User Initial Avatar"
            >
              {userInitial}
            </div>
            
            <button 
                onClick={handleLogout} 
                className="flex items-center text-sm font-semibold px-4 py-2 rounded-full border border-white/50 hover:bg-white hover:text-indigo-700 transition"
            >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
            </button>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold mt-4">
            Hello, {user?.fullname?.firstname}!
          </h1>
          <p className="text-sm font-medium opacity-80 mt-1">
            Member Since {memberSince}
          </p>
        </div>

        {/* --- 2. PERSONAL INFORMATION --- */}
        <div className="p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Personal Information</h2>
          
          <div className="space-y-3">
            {/* Full Name */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <User className="w-5 h-5 text-gray-500 mr-3" />
                <span className="text-sm text-gray-600">Full Name</span>
              </div>
              <span className="font-semibold text-gray-800 text-sm sm:text-base">
                {user?.fullname?.firstname} {user?.fullname?.lastname}
              </span>
            </div>
            
            {/* Email */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-500 mr-3" />
                <span className="text-sm text-gray-600">Email</span>
              </div>
              <span className="font-semibold text-blue-600 text-sm sm:text-base truncate max-w-[50%] sm:max-w-none">
                {user?.email}
              </span>
            </div>
          </div>
        </div>

        {/* --- 3. PREVIOUS RIDES --- */}
        <div className="p-6 sm:p-8 pt-0">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-2 flex items-center">
            <Car className="w-5 h-5 mr-2 text-gray-700" />
            Previous Rides ({rides.length})
          </h2>

          {/* Ride List Container (Scrollable on overflow) */}
          <div className="mt-4 space-y-3 max-h-80 overflow-y-auto pr-2">
            {rides.map((ride) => (
              <RideItem key={ride.id} ride={ride} />
            ))}
          </div>
          
          <button className="w-full mt-6 text-center text-blue-600 font-semibold hover:text-blue-700 transition">
            View All Ride History →
          </button>
        </div>
        
      </div>

    </div>
  );
};

export default ProfilePage;