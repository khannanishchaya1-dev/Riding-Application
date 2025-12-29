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
  Phone
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement);



const RideItem = ({ ride }) => {
  const getDisplayStatus = () => {
  switch (ride.status) {
    case "CANCELLED_BY_CAPTAIN":
      return "CANCELLED";
    case "CANCELLED_BY_USER":
      return "CANCELLED";
    default:
      return ride.status;
  }
};

  return (
    <Link to={`/passenger-ride-details/${ride._id}`}>
    <div className="backdrop-blur-xl bg-white/70 border border-gray-200 rounded-2xl p-4 flex justify-between items-center hover:scale-[0.99] transition-all cursor-pointer shadow-sm">
      
      {/* Left Content */}
      <div className="flex flex-col space-y-1 w-[70%]">
        
        {/* Date + Status */}
        <div className="flex items-center text-xs font-semibold text-gray-700">
          <Clock className="w-4 h-4 mr-2 text-gray-500" />
          {ride.createdAt
            ? new Date(ride.createdAt).toLocaleDateString()
            : "No Date"}
          <span
  className={`ml-3 text-xs font-medium px-2 py-0.5 rounded-full 
    ${
      ride.status === "COMPLETED"
        ? "bg-green-100 text-green-700"
        : ride.status === "ONGOING"
        ? "bg-[#FFF8D1] text-[#B08900]"  // 🔥 NEW STYLE FOR ONGOING
        : "bg-[#FFEBEC] text-[#E23744]"
    }`}
>
  {getDisplayStatus()}

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rideSummary, setRideSummary] = useState("");
const [showSummaryModal, setShowSummaryModal] = useState(false);

const [chartData, setChartData] = useState(null);

const fetchSummary = async () => {
  const summaryRes = await axios.post(`${import.meta.env.VITE_BACKEND_URL}analytics/summary`, {
    userId: user._id
  });

  const chartRes = await axios.post(`${import.meta.env.VITE_BACKEND_URL}analytics/data`, {
    userId: user._id
  });

  setRideSummary(summaryRes.data.summary);
  setChartData(chartRes.data.chartData);
  setShowSummaryModal(true);
};


const handleDelete = async () => {
  try {
    console.log("Deleting account...");
    await axios.delete(`${import.meta.env.VITE_BACKEND_URL}users/delete-account`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    localStorage.clear();
    navigate("/signup");
  } catch (err) {
    toast.error("❌ Could not delete account. Try again.");
  }
};

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
    <div className="min-h-screen bg-gradient-to-b from-white to-[#FFF4F4] flex flex-col items-center">

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
          <div className="flex justify-between bg-white/90 backdrop-blur-md border border-gray-200 px-4 py-3 rounded-xl shadow-sm">
            <span className="flex items-center gap-2 text-gray-700"><Phone className="w-5 text-[#E23744]" /> Phone</span>
            <strong className="truncate max-w-[50%] text-[#E23744]">{user.phone}</strong>
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

        {/* <button
  onClick={() => setShowDeleteModal(true)}
  className="mt-5 w-full text-red-600 border border-red-400 py-2 rounded-xl hover:bg-red-50 transition font-semibold"
>
  ❌ Delete Account Permanently
</button> */}
<button
  onClick={fetchSummary}
  className="mt-5 w-full text-[#E23744] border border-[#E23744] py-2 rounded-xl hover:bg-[#E23744] hover:text-white transition font-semibold"
>
  📊 View My Ride Summary
</button>


      </div>
     {/* Ride Summary Modal */}
{showSummaryModal && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center z-[999]">
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="bg-white/90 backdrop-blur-xl w-[92%] max-w-lg rounded-3xl shadow-2xl p-0 overflow-hidden max-h-[92vh] flex flex-col"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#E23744] to-[#A81C28] text-white px-6 py-4">
        <h2 className="text-xl font-bold text-center">
          🚕 Your Gadigo Ride Analytics
        </h2>
      </div>

      {/* Content Scroll */}
      <div className="overflow-y-auto px-6 py-5 space-y-6">

        {/* Summary Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-[#E23744] mb-2 text-sm">
            📄 Summary
          </h3>
          <pre className="whitespace-pre-wrap text-gray-700 text-sm leading-6">
            {rideSummary}
          </pre>
        </div>

        {/* Charts */}
        {chartData && (
          <div className="space-y-6">

            {/* Money Spent Chart */}
            
{/* 🆕 Monthly Spending Chart */}
<div className="bg-white border border-gray-200 rounded-xl shadow p-3">
  <h3 className="font-semibold mb-2 text-gray-800 text-sm flex items-center gap-1">
    📆 Monthly Spending (₹)
  </h3>
  <Bar
    data={{
      labels: Object.keys(chartData.monthlySpend),
      datasets: [
        {
          label: "₹ Spent",
          data: Object.values(chartData.monthlySpend),
          backgroundColor: "rgba(40, 167, 69, 0.6)" // green tone
        }
      ]
    }}
    options={{
      plugins: { legend: { display: false } },
    }}
  />
</div>

           

            {/* Timeline Chart */}
            
          </div>
        )}
      </div>

      {/* Close Button */}
      <div className="p-5 border-t border-gray-200 bg-white/70 backdrop-blur-md">
        <button
          onClick={() => setShowSummaryModal(false)}
          className="w-full py-3 rounded-xl bg-[#E23744] text-white font-semibold hover:bg-[#b51f30] transition shadow-md"
        >
          Close
        </button>
      </div>
    </motion.div>
  </div>
)}

    </div>
  );
};

export default ProfilePage;
