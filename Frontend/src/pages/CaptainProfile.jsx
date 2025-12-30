import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  LogOut,
  Car,
  TrendingUp,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  IndianRupee,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement);

const TripItem = ({ trip }) => {
  const getStatus = () => {
    switch (trip.status) {
      case "CANCELLED_BY_USER":
      case "CANCELLED_BY_CAPTAIN":
        return "CANCELLED";
      default:
        return trip.status;
    }
  };

  return (
    <Link to={`/captain-ride-details/${trip._id}`}>
      <div className="bg-white border border-gray-200 rounded-2xl p-4 flex justify-between items-center hover:scale-[0.99] cursor-pointer shadow-sm transition-all">
        <div className="flex flex-col space-y-1 w-[70%]">
          <div className="flex items-center text-xs font-semibold text-gray-700">
            <Clock className="w-4 h-4 mr-2 text-gray-500" />
            {new Date(trip.createdAt).toLocaleDateString()}
            <span
              className={`ml-3 text-xs px-2 py-0.5 rounded-full font-medium ${
                trip.status === "COMPLETED"
                  ? "bg-green-100 text-green-700"
                  : trip.status === "ONGOING"
                  ? "bg-gray-200 text-gray-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {getStatus()}
            </span>
          </div>

          <p className="flex items-center text-xs text-gray-600 truncate">
            <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" /> {trip.origin}
          </p>
          <p className="flex items-center text-xs text-gray-600 truncate">
            <MapPin className="w-3.5 h-3.5 mr-1 text-black" /> {trip.destination}
          </p>
        </div>

        <div className="text-right flex flex-col items-end">
          <p className="text-lg font-bold text-black">₹{trip.fare.toFixed(2)}</p>
          <ArrowRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </Link>
  );
};

const CaptainProfile = () => {
  const navigate = useNavigate();
  const [captainData, setCaptainData] = useState(
    JSON.parse(localStorage.getItem("captain")) || null
  );

  const [trips, setTrips] = useState([]);
  const [stats, setStats] = useState({ totalTrips: 0, totalEarnings: "0.00", rating: "5.0" });

  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analyticsSummary, setAnalyticsSummary] = useState("");
  const [chartData, setChartData] = useState(null);

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
      } catch {}
    }
    fetchTrips();
  }, [captainData]);

  useEffect(() => {
    const completed = trips.filter((t) => t.status === "COMPLETED");
    const totalEarned = completed.reduce((sum, t) => sum + t.fare, 0).toFixed(2);
    setStats({ totalTrips: completed.length, totalEarnings: totalEarned, rating: "5.0" });
  }, [trips]);

  const fetchAnalytics = async () => {
    const summary = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}captain-analytics/summary`,
      { captainId: captainData._id }
    );
    const charts = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}captain-analytics/data`,
      { captainId: captainData._id }
    );
    setAnalyticsSummary(summary.data.summary);
    setChartData(charts.data.chartData);
    setShowAnalytics(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">

      {/* HEADER */}
      <div className="bg-black text-white w-full p-8 relative rounded-b-3xl shadow-lg">
        <div className="flex justify-between items-center">
          <div className="bg-white text-black font-extrabold w-20 h-20 flex items-center justify-center rounded-full shadow-xl ring-4 ring-gray-900 text-3xl">
            {captainData?.fullname?.firstname?.[0]?.toUpperCase() ?? "C"}
          </div>

          <button
            onClick={() => navigate("/captain-logout")}
            className="flex items-center gap-2 px-4 py-2 border border-white rounded-full hover:bg-white hover:text-black transition font-medium"
          >
            <LogOut className="w-4" /> Logout
          </button>
        </div>

        <h1 className="text-3xl font-bold mt-4">
          Welcome {captainData?.fullname?.firstname}
        </h1>
        <p className="opacity-80 text-sm">
          🚕 Partner since {new Date(captainData?.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* PERFORMANCE */}
      <div className="p-6 w-full">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-black" /> Performance
        </h2>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-center">
            <Car className="w-6 h-6 mx-auto text-black" />
            <p className="text-lg font-bold">{stats.totalTrips}</p>
            <p className="text-xs text-gray-500">Trips</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-center">
            <IndianRupee className="w-6 h-6 mx-auto text-black" />
            <p className="text-lg font-bold">₹{stats.totalEarnings}</p>
            <p className="text-xs text-gray-500">Earned</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-center">
            <ShieldCheck className="w-6 h-6 mx-auto text-black" />
            <p className="text-lg font-bold">{stats.rating}</p>
            <p className="text-xs text-gray-500">Rating</p>
          </div>
        </div>
      </div>

      {/* TRIPS */}
      <div className="p-6 w-full">
        <h2 className="text-xl font-bold text-gray-900 flex items-center mb-2">
          <Clock className="w-5 h-5 mr-2 text-black" /> Recent Trips
        </h2>

        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {trips.length ? trips.map((t) => <TripItem key={t._id} trip={t} />) : (
            <p className="text-center text-gray-500 text-sm py-4">No trips yet</p>
          )}
        </div>

        <button
          onClick={fetchAnalytics}
          className="mt-5 w-full text-black border border-black py-2 rounded-xl hover:bg-black hover:text-white transition font-semibold"
        >
          📊 View Captain Analytics
        </button>
      </div>

      {/* ANALYTICS MODAL */}
      {showAnalytics && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[999]">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-[92%] max-w-lg rounded-3xl shadow-xl overflow-hidden max-h-[92vh] flex flex-col"
          >
            <div className="bg-black text-white px-6 py-4">
              <h2 className="text-xl font-bold text-center">🚖 Captain Analytics</h2>
            </div>

            <div className="overflow-y-auto px-6 py-5 space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <h3 className="font-semibold text-black mb-2 text-sm">📄 Summary</h3>
                <pre className="text-gray-700 whitespace-pre-wrap text-sm leading-6">
                  {analyticsSummary}
                </pre>
              </div>

              {chartData && (
                <div className="bg-white border border-gray-200 rounded-xl shadow p-3">
                  <h3 className="font-semibold mb-2 text-gray-800 text-sm">
                    📆 Monthly Earnings (₹)
                  </h3>
                  <Bar
                    data={{
                      labels: Object.keys(chartData.monthlyEarn),
                      datasets: [
                        {
                          data: Object.values(chartData.monthlyEarn),
                          backgroundColor: "rgba(0,0,0,0.8)",
                        },
                      ],
                    }}
                    options={{ plugins: { legend: { display: false } } }}
                  />
                </div>
              )}
            </div>

            <div className="p-5 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowAnalytics(false)}
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

export default CaptainProfile;
