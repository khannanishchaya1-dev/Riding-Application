import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useSocket } from "../UserContext/SocketContext";
import {
  LogOut, Mail, User, Car, MapPin, Clock, ArrowRight, Phone
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement);

const RideItem = ({ ride }) => {
  const getDisplayStatus = () => {
    switch (ride.status) {
      case "CANCELLED_BY_CAPTAIN":
      case "CANCELLED_BY_USER":
        return "CANCELLED";
      default:
        return ride.status;
    }
  };

  return (
    <Link to={`/passenger-ride-details/${ride._id}`}>
      <div className="bg-white border border-gray-200 rounded-2xl p-4 flex justify-between items-center hover:scale-[0.99] cursor-pointer shadow-sm transition-all">

        {/* Left */}
        <div className="flex flex-col space-y-1 w-[70%]">
          {/* Date + Status */}
          <div className="flex items-center text-xs font-semibold text-gray-700">
            <Clock className="w-4 h-4 mr-2 text-gray-500" />
            {ride.createdAt ? new Date(ride.createdAt).toLocaleDateString() : "No Date"}
            <span
              className={`ml-3 text-xs px-2 py-0.5 rounded-full font-medium ${
                ride.status === "COMPLETED"
                  ? "bg-green-100 text-green-700"
                  : ride.status === "ONGOING"
                  ? "bg-gray-200 text-gray-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {getDisplayStatus()}
            </span>
          </div>

          {/* Origin */}
          <p className="flex items-center text-xs text-gray-600 truncate">
            <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" /> {ride.origin}
          </p>

          {/* Destination */}
          <p className="flex items-center text-xs text-gray-600 truncate">
            <MapPin className="w-3.5 h-3.5 mr-1 text-black" /> {ride.destination}
          </p>
        </div>

        {/* Right */}
        <div className="text-right flex flex-col items-end">
          <p className="text-lg font-bold text-black">₹{ride.fare}</p>
          <ArrowRight className="w-5 h-5 text-gray-400 transition" />
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
  const [chartData, setChartData] = useState(null);
  const [rideSummary, setRideSummary] = useState("");
  const [showSummaryModal, setShowSummaryModal] = useState(false);
   const { socket, sendMessage, receiveMessage, offMessage } = useSocket();
  const [isBlocked, setIsBlocked] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    return stored?.blocked || false;
  });

  const navigate = useNavigate();

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

  const userInitial = useMemo(
    () => user?.fullname?.firstname?.[0]?.toUpperCase() || "U",
    [user]
  );

  const memberSince = useMemo(
    () =>
      user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" })
        : "Unknown",
    [user]
  );

  useEffect(() => {
    if (!user?._id) return;
    axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}rides/find-rides`,
        { user_id: user._id },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      )
      .then((res) => setrides(res.data.rides));
  }, [user]);

  if (!user) return <div className="h-screen flex justify-center items-center">Loading...</div>;
  useEffect(() => {
  if (!socket) return;

  const handleBlockStatus = (data) => {
    if (data.blocked) {
      // 🔔 Show toast
      toast.error(`${data.message} — you are restricted from booking rides`);

      // 🔒 Update user status in localStorage
      const user = JSON.parse(localStorage.getItem("user")) || {};
      const updatedUser = {
        ...user,
        blocked: true,
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // 🚫 Redirect to blocked page
      navigate("/blocked", { replace: true });
    }else{
       const user = JSON.parse(localStorage.getItem("user")) || {};
      const updatedUser = {
        ...user,
        blocked: false,
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      navigate("/home", { replace: true });

    }
  };

  socket.on("user-block-status", handleBlockStatus);

  // 🧹 Cleanup
  return () => {
    socket.off("user-block-status", handleBlockStatus);
  };
}, [socket, navigate]);
useEffect(() => {
  if (isBlocked) {
    navigate("/blocked", { replace: true });
  }
}, [isBlocked, navigate]);
useEffect(() => {
  const storedCaptain = JSON.parse(localStorage.getItem("captain"));
  if (storedCaptain?.blocked) {
    navigate("/captain-blocked");
  }
}, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">

      {/* Header */}
      <div className="bg-black text-white w-full p-8 relative rounded-b-3xl shadow-lg">
        {/* Avatar + Logout */}
        <div className="flex justify-between items-center">
          <div className="bg-white text-black font-extrabold w-20 h-20 flex items-center justify-center rounded-full shadow-xl ring-4 ring-gray-900 text-3xl">
            {userInitial}
          </div>

          <button
            onClick={() => navigate("/logout")}
            className="flex items-center gap-2 px-4 py-2 border border-white rounded-full hover:bg-white hover:text-black transition font-medium"
          >
            <LogOut className="w-4" /> Logout
          </button>
        </div>

        <h1 className="text-3xl font-bold mt-4">Hey {user?.fullname?.firstname} 👋</h1>
        <p className="opacity-80 text-sm">Member since {memberSince}</p>
      </div>

      {/* Personal Info */}
      <div className="w-full max-w-2xl px-6 py-8 space-y-4">
        <h2 className="font-semibold text-lg">Personal Information</h2>

        <div className="space-y-3">
          <div className="flex justify-between bg-white border border-gray-200 px-4 py-3 rounded-xl shadow-sm">
            <span className="flex items-center gap-2 text-gray-700"><User className="w-5" /> Full Name</span>
            <strong>{user.fullname.firstname} {user.fullname.lastname}</strong>
          </div>

          <div className="flex justify-between bg-white border border-gray-200 px-4 py-3 rounded-xl shadow-sm">
            <span className="flex items-center gap-2 text-gray-700"><Mail className="w-5" /> Email</span>
            <strong className="truncate max-w-[50%]">{user.email}</strong>
          </div>

          <div className="flex justify-between bg-white border border-gray-200 px-4 py-3 rounded-xl shadow-sm">
            <span className="flex items-center gap-2 text-gray-700"><Phone className="w-5" /> Phone</span>
            <strong className="truncate max-w-[50%]">{user.phone}</strong>
          </div>
        </div>
      </div>

      {/* Ride History */}
      <div className="w-full max-w-2xl px-6 py-6">
        <h2 className="font-bold text-lg flex items-center mb-3">
          <Car className="w-5 mr-2 text-black" /> Ride History ({rides.length})
        </h2>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {rides.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">No rides yet 🚗</p>
          ) : (
            rides.map((ride) => <RideItem ride={ride} key={ride._id} />)
          )}
        </div>

        <button
          onClick={fetchSummary}
          className="mt-5 w-full text-black border border-black py-2 rounded-xl hover:bg-black hover:text-white transition font-semibold"
        >
          📊 View My Ride Summary
        </button>
      </div>

      {/* Ride Summary Modal */}
      {showSummaryModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[999]">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-white w-[92%] max-w-lg rounded-3xl shadow-xl overflow-hidden max-h-[92vh] flex flex-col"
          >
            {/* Header */}
            <div className="bg-black text-white px-6 py-4">
              <h2 className="text-xl font-bold text-center">
                🚕 Ride Analytics
              </h2>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto px-6 py-5 space-y-6">

              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <h3 className="font-semibold text-black mb-2 text-sm">📄 Summary</h3>
                <pre className="whitespace-pre-wrap text-gray-700 text-sm leading-6">
                  {rideSummary}
                </pre>
              </div>

              {chartData && (
                <div className="space-y-6">
                  {/* Monthly Spending */}
                  <div className="bg-white border border-gray-200 rounded-xl shadow p-3">
                    <h3 className="font-semibold mb-2 text-gray-800 text-sm">
                      📆 Monthly Spending (₹)
                    </h3>
                    <Bar
                      data={{
                        labels: Object.keys(chartData.monthlySpend),
                        datasets: [
                          {
                            label: "₹ Spent",
                            data: Object.values(chartData.monthlySpend),
                            backgroundColor: "rgba(0,0,0,0.7)"
                          }
                        ]
                      }}
                      options={{ plugins: { legend: { display: false } } }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowSummaryModal(false)}
                className="w-full py-3 rounded-xl bg-black text-white font-semibold hover:bg-neutral-900 transition shadow-md"
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
