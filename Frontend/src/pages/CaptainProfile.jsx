import React, { useEffect, useState, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../UserContext/CaptainContext"; // Assuming the context provides [captainData, setCaptainData]
import { LogOut, Car, TrendingUp, DollarSign, MapPin, Calendar, Clock, ArrowRight, ShieldCheck, Phone,IndianRupee,Eye,EyeOff } from 'lucide-react';

// --- Helper Components ---

// Component for a single completed Trip item in the history list
const TripItem = ({ trip }) => {
  // Use a Captain/Driver-centric term like 'TRIP' or 'RIDE'
  const statusColor = trip.status === 'COMPLETED' ? 'text-green-700' : 'text-red-600';

  return (
    <div className="bg-white p-4 sm:p-5 rounded-xl border border-yellow-200 hover:shadow-md transition duration-150 flex justify-between items-center cursor-pointer">
      
      {/* Trip Details (Left) */}
      <div className="flex flex-col space-y-2 w-4/5">
        <div className="flex items-center text-sm font-semibold text-gray-800">
          <Calendar className="w-4 h-4 mr-2 text-yellow-500" />
          {trip.createdAt
            ? new Date(trip.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "2-digit"
              })
            : "No Date"}
          <span className={`ml-3 text-xs font-medium px-2 py-0.5 rounded-full ${statusColor === 'text-green-700' ? 'bg-green-100' : 'bg-red-100'} ${statusColor}`}>
            {trip.status}
          </span>
        </div>

        <div className="flex items-center text-xs text-gray-600 truncate">
          <MapPin className="w-3.5 h-3.5 mr-1 text-blue-600" />
          <span className="truncate font-medium">{trip.origin}</span>
        </div>
        
        <div className="flex items-center text-xs text-gray-600 truncate">
          <MapPin className="w-3.5 h-3.5 mr-1 text-red-600" />
          <span className="truncate font-medium">{trip.destination}</span>
        </div>
      </div>
      
      {/* Earnings and Arrow (Right) */}
      <div className="flex flex-col items-end space-y-1">
        <span className="text-lg font-bold text-yellow-800">₹{trip.captain_earnings || (trip.fare).toFixed(2)}</span> {/* Ensures two decimal places for earnings */}
        <ArrowRight className="w-5 h-5 text-gray-400 hover:text-yellow-600 transition" />
      </div>
    </div>
  );
};


// --- Main Captain Component ---

const CaptainProfile = () => {
  const [captainData, setCaptainData] = useContext(CaptainDataContext); 
  const [trips, setTrips] = useState([]);
  const [stats, setStats] = useState({ totalTrips: 0, totalEarnings: '0.00', rating: '5.0' });
  const [showId, setShowId] = useState(false);
  const navigate = useNavigate();
  console.log(captainData)

  useEffect(() => {
      const storedCaptain = localStorage.getItem('captain');
      if (storedCaptain) {
        setCaptainData(JSON.parse(storedCaptain));
      }
    }, []);

  // 1. Fetch Trips (Rides)
  useEffect(() => {
    if (!captainData?._id) return; // Wait until captainData is available

    const fetchTrips = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in localStorage!");
          return;
        }

        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}rides/find-captain-rides`,
          { captain_id: captainData._id }, // Using captainData._id
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const fetchedRides = res.data.rides || [];
        setTrips(fetchedRides);
      } catch (error) {
        console.error("Error fetching trips:", error.response?.data || error.message);
      }
    };

    fetchTrips();
  }, [captainData]); // Dependency on captainData

  // 2. Derived State for Display - Changed 'user' to 'captainData'
  const captainInitial = useMemo(() => {
    return captainData?.fullname?.firstname?.charAt(0).toUpperCase() || "D";
  }, [captainData]);

  const memberSince = useMemo(() => {
    return captainData?.createdAt 
      ? new Date(captainData.createdAt).toLocaleDateString('en-US', { // Fixed variable name to captainData
          year: 'numeric', 
          month: 'long',
          day: 'numeric'
        }) 
      : 'N/A';
  }, [captainData]);

  useEffect(()=>{
    const completedTrips = trips.filter((trip)=>trip.status==='COMPLETED');
    const totalEarnings = completedTrips.reduce((sum, trip) => {
    // Determine the earnings amount for the current trip (t)
    const tripEarning = trip.fare;//As 0.2 is taken by company
    
    // Add it to the running sum
    return sum + tripEarning;
    
}, 0).toFixed(2);
setStats(
  {
    totalTrips: completedTrips.length,
    totalEarnings: totalEarnings,
    rating: '5.0'


  }
)

  },[trips])

  // 3. Handlers
  const handleLogout = () => {
    // Clear local storage data (token/user/captainData) if necessary before navigating
    // localStorage.removeItem('token');
    // setCaptainData(null); 
    navigate("/logout");
  };

  // 4. Loading State - Changed 'user' to 'captainData'
  if (!captainData) {
    return (
        <div className="h-screen flex justify-center items-center bg-gray-50">
            <p className="text-gray-600">Loading captain profile...</p>
        </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center bg-gray-50 font-sans">

      {/* 🚀 Main Content Wrapper */}
      <div className="w-full max-w-2xl bg-white shadow-xl overflow-hidden">
        
        {/* --- 1. HEADER & GREETING (Yellow Theme) --- */}
        <div className="bg-gradient-to-br from-yellow-300 to-yellow-500 p-6 sm:p-8 text-white">
          <div className="flex justify-between items-center">
            {/* Captain Initial Avatar (Yellow and prominent) */}
            <div 
              className="
                w-16 h-16 sm:w-20 sm:h-20
                rounded-full 
                bg-white 
                flex items-center justify-center 
                text-yellow-600 
                font-extrabold text-3xl 
                shadow-2xl 
                ring-4 ring-offset-2 ring-yellow-300
              "
              aria-label="Captain Initial Avatar"
            >
              {captainInitial}
            </div>
            
            <button 
                onClick={handleLogout} 
                className="flex items-center text-sm font-semibold px-4 py-2 rounded-full border border-white/50 hover:bg-white hover:text-yellow-700 transition"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>

          {/* Changed 'user' to 'captainData' */}
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-4">
            Welcome {captainData?.fullname?.firstname}
          </h1>
          <p className="text-sm font-medium opacity-90 mt-1">
            Driving Partner Since {memberSince}
          </p>
        </div>

        {/* --- 2. CAPTAIN STATS (Dashboard Feel) --- */}
        <div className="p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-2 flex items-center">
             <TrendingUp className="w-5 h-5 mr-2 text-yellow-600" /> Performance Overview
          </h2>
          
          <div className="grid grid-cols-3 gap-4">
            {/* Total Trips */}
            <div className="flex flex-col items-center p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <Car className="w-6 h-6 text-yellow-600 mb-1" />
                <span className="text-xl font-bold text-gray-900">{stats.totalTrips}</span>
                <span className="text-xs text-gray-500 mt-0.5">Total Trips</span>
            </div>
            {/* Total Earnings */}
            <div className="flex flex-col items-center p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <IndianRupee className="w-6 h-6 text-green-600 mb-1" />
                <span className="text-xl font-bold text-gray-900">{stats.totalEarnings}</span>
                <span className="text-xs text-gray-500 mt-0.5">Total Earnings</span>
            </div>
            {/* Average Rating */}
            <div className="flex flex-col items-center p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <ShieldCheck className="w-6 h-6 text-blue-600 mb-1" />
                <span className="text-xl font-bold text-gray-900">{stats.rating}</span>
                <span className="text-xs text-gray-500 mt-0.5">Avg. Rating</span>
            </div>
          </div>
        </div>
        
        {/* --- 3. PERSONAL & VEHICLE INFORMATION --- */}
        <div className="p-6 sm:p-8 pt-0 space-y-6">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Captain Details</h2>
            
            <div className="space-y-3">
              {/* Captain ID */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <ShieldCheck className="w-5 h-5 text-gray-500 mr-3" />
                  <span className="text-sm text-gray-600">Captain ID</span>
                </div>
                <span className="font-semibold text-gray-800 text-sm sm:text-base">
                  {showId ? captainData._id : "••••••••••••••••••••••••"} {/* Changed 'user' to 'captainData' */}
                </span>
                 <button
        onClick={() => setShowId(!showId)}
        className="text-gray-700 hover:text-black"
      >
        {showId ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
              </div>
              
              {/* Phone Number */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-500 mr-3" />
                  <span className="text-sm text-gray-600">Phone</span>
                </div>
                <span className="font-semibold text-green-600 text-sm sm:text-base">
                  {captainData?.phone || "N/A"} {/* Changed 'user' to 'captainData' */}
                </span>
              </div>

              {/* Vehicle Info */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Car className="w-5 h-5 text-gray-500 mr-3" />
                  <span className="text-sm text-gray-600">Vehicle</span>
                </div>
                <span className="font-semibold text-gray-800 text-sm sm:text-base">
                  {`${(captainData?.vehicle?.vehicleType || "Hatchback").toUpperCase()} (${captainData?.vehicle?.numberPlate || "KA-01-AB-1234"})`} {/* Changed 'user' to 'captainData' */}
                </span>
              </div>
            </div>
        </div>

        {/* --- 4. TRIP HISTORY --- */}
        <div className="p-6 sm:p-8 pt-0">
          <h2 className="text-xl font-bold text-gray-800 border-b pb-2 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-gray-700" />
            Recent Trips ({trips.length})
          </h2>

          {/* Trip List Container (Scrollable on overflow) */}
          <div className="mt-4 space-y-3 max-h-80 overflow-y-auto pr-2">
            {trips.length > 0 ? (
                trips.map((trip) => (
                    <TripItem key={trip._id || trip.id} trip={trip} /> 
                ))
            ) : (
                <p className="text-center text-gray-500 py-4">No recent trips found.</p>
            )}
          </div>
          
          <button className="w-full mt-6 text-center text-yellow-600 font-semibold hover:text-yellow-700 transition">
            View All Trip History →
          </button>
        </div>
        
      </div>

    </div>
  );
};

export default CaptainProfile;