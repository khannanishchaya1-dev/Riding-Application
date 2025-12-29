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
  Phone,
  IndianRupee,
} from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

// 📊 Chart imports
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  ChartDataLabels
);

const TripItem = ({ trip }) => {
  const getDisplayStatus = () => {
    switch (trip.status) {
      case "CANCELLED_BY_CAPTAIN":
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
              className={`ml-3 text-xs font-medium px-2 py-0.5 rounded-full ${
                trip.status === "COMPLETED"
                  ? "bg-green-100 text-green-700"
                  : trip.status === "ONGOING"
                  ? "bg-[#FFF8D1] text-[#B08900]"
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
  const navigate = useNavigate();
  const [captainData, setCaptainData] = useState(() => {
    const saved = localStorage.getItem("captain");
    return saved ? JSON.parse(saved) : null;
  });
  const [trips, setTrips] = useState([]);
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalEarnings: "0.00",
    rating: "5.0",
  });

  // 📊 Modal
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
      } catch (err) {
        console.log(err);
      }
    }

    fetchTrips();
  }, [captainData]);

  useEffect(() => {
    const completed = trips.filter((t) => t.status === "COMPLETED");
    const total = completed.reduce((sum, t) => sum + t.fare, 0).toFixed(2);

    setStats({
      totalTrips: completed.length,
      totalEarnings: total,
      rating: "5.0",
    });
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

  const memberSince = captainData?.createdAt
    ? new Date(captainData.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : "N/A";

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#FFF5F6]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#E23744] to-[#B01E2E] p-8 text-white w-full shadow-md">
        <div className="flex justify-between items-center">
          <div className="w-20 h-20 rounded-full bg-white text-[#E23744] font-extrabold flex items-center justify-center text-3xl shadow-lg ring-4 ring-[#FFCDD2]">
            {captainData?.fullname?.firstname?.[0]?.toUpperCase() || "D"}
          </div>

          <button
            onClick={() => navigate("/captain-logout")}
            className="flex items-center font-semibold px-4 py-2 rounded-full border border-white/60 hover:bg-white hover:text-[#E23744] transition"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </button>
        </div>

        <h1 className="text-3xl font-extrabold mt-4">
          Welcome {captainData?.fullname?.firstname}
        </h1>
        <p className="text-sm opacity-90">🚗 Driving Partner Since {memberSince}</p>
      </div>

      {/* Stats */}
      <div className="p-6 w-full">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-[#E23744]" /> Performance
        </h2>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-[#FFEBEC] p-4 rounded-xl text-center border border-[#FFBDC4]">
            <Car className="w-6 h-6 mx-auto text-[#E23744]" />
            <p className="text-lg font-bold">{stats.totalTrips}</p>
            <p className="text-xs text-gray-600">Trips</p>
          </div>
          <div className="bg-[#FFEBEC] p-4 rounded-xl text-center border border-[#FFBDC4]">
            <IndianRupee className="w-6 h-6 mx-auto text-[#E23744]" />
            <p className="text-lg font-bold">₹{stats.totalEarnings}</p>
            <p className="text-xs text-gray-600">Earnings</p>
          </div>
          <div className="bg-[#FFEBEC] p-4 rounded-xl text-center border border-[#FFBDC4]">
            <ShieldCheck className="w-6 h-6 mx-auto text-[#E23744]" />
            <p className="text-lg font-bold">{stats.rating}</p>
            <p className="text-xs text-gray-600">Rating</p>
          </div>
        </div>
      </div>

      {/* Trip History */}
      <div className="p-6 w-full">
        <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-[#E23744]" /> Recent Trips
        </h2>

        <div className="space-y-3 max-h-72 overflow-y-auto">
          {trips.length ? (
            trips.map((t) => <TripItem key={t._id} trip={t} />)
          ) : (
            <p className="text-center text-gray-500 py-4">No trips yet</p>
          )}
        </div>

        <button
  onClick={fetchAnalytics}
  className="mt-5 w-full text-white py-3 rounded-xl bg-[#E23744] font-semibold hover:bg-[#c51f2f] transition"
>
  📊 View Captain Analytics
</button>

      </div>

      {/* ─────────── ANALYTICS MODAL ─────────── */}
      {showAnalytics && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[999]">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-[90%] max-w-lg rounded-2xl shadow-xl p-0 overflow-hidden max-h-[92vh] flex flex-col"
          >
            <div className="bg-gradient-to-r from-[#E23744] to-[#B01E2E] text-white px-6 py-4">

              <h2 className="text-xl font-bold text-center">🚖 Captain Analytics</h2>
            </div>

            <div className="overflow-y-auto px-6 py-4 space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <h3 className="font-semibold text-[#E23744] mb-2 text-sm">
📄 Summary</h3>
                <pre className="text-gray-700 whitespace-pre-wrap text-sm leading-6">
                  {analyticsSummary}
                </pre>
              </div>

              {chartData && (
                <>
                  {/* Monthly earnings */}
                  <div className="bg-white border border-gray-200 rounded-xl shadow p-3">
                    <h3 className="font-semibold text-gray-800 text-sm mb-2">
                      📆 Monthly Earnings (₹)
                    </h3>
                    <Bar
                      data={{
                        labels: Object.keys(chartData.monthlyEarn),
                        datasets: [
                          {
                            data: Object.values(chartData.monthlyEarn),
                            backgroundColor: "rgba(226,55,68,0.6)",

                          },
                        ],
                      }}
                      options={{ plugins: { legend: { display: false } } }}
                    />
                  </div>

                  
                  
                </>
              )}
            </div>

            <div className="p-4 border-t bg-white">
              <button
                onClick={() => setShowAnalytics(false)}
               className="w-full py-2 rounded-xl bg-[#E23744] text-white font-semibold hover:bg-[#c51f2f] transition"
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
