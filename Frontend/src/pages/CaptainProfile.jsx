import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { X } from "lucide-react";
import { useSocket } from "../UserContext/SocketContext";
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
      <div className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md hover:-translate-y-[1px] cursor-pointer transition-all space-y-3">
        {/* TOP CONTENT */}
        <div className="flex justify-between items-center">
          {/* LEFT */}
          <div className="flex flex-col space-y-2 w-[72%]">
            <div className="flex items-center flex-wrap gap-2 text-xs">
              <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                #{trip._id.slice(0, 7).toUpperCase()}
              </span>

              <span className="flex items-center text-gray-600 font-medium">
                <Clock className="w-3.5 h-3.5 mr-1" />
                {new Date(trip.createdAt).toLocaleDateString()}
              </span>

              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  trip.status === "COMPLETED"
                    ? "bg-green-100 text-green-700"
                    : trip.status === "ONGOING"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-red-100 text-red-600"
                }`}
              >
                {getStatus()}
              </span>
            </div>

            <div className="space-y-1">
              <p className="flex items-center text-sm text-gray-700 truncate">
                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                {trip.origin}
              </p>

              <p className="flex items-center text-sm text-gray-700 truncate">
                <MapPin className="w-4 h-4 mr-2 text-black" />
                {trip.destination}
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="text-right flex flex-col items-end">
            <p className="text-xl font-bold text-black">
              ₹{trip.fare.toFixed(2)}
            </p>
            <ArrowRight className="w-5 h-5 text-gray-400 transition" />
          </div>
        </div>
      </div>
    </Link>
  );
};

const CaptainProfile = () => {
  const navigate = useNavigate();
  const { socket, sendMessage, receiveMessage, offMessage } = useSocket();
  const [isBlocked, setIsBlocked] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("captain"));
    return stored?.blocked || false;
  });

  const [captainData, setCaptainData] = useState(
    JSON.parse(localStorage.getItem("captain")) || null,
  );

  const [trips, setTrips] = useState([]);
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalEarnings: "0.00",
    rating: "5.0",
  });

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
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setTrips(res.data.rides);
      } catch {}
    }
    fetchTrips();
  }, [captainData]);

  useEffect(() => {
    const completed = trips.filter((t) => t.status === "COMPLETED");
    const totalEarned = completed
      .reduce((sum, t) => sum + t.fare, 0)
      .toFixed(2);
    setStats({
      totalTrips: completed.length,
      totalEarnings: totalEarned,
      rating: "5.0",
    });
  }, [trips]);

  const fetchAnalytics = async () => {
    const summary = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}captain-analytics/summary`,
      { captainId: captainData._id },
    );
    const charts = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}captain-analytics/data`,
      { captainId: captainData._id },
    );
    setAnalyticsSummary(summary.data.summary);
    setChartData(charts.data.chartData);
    setShowAnalytics(true);
  };
  useEffect(() => {
    if (!socket) return;

    const handleBlockStatus = (data) => {
      const storedCaptain = JSON.parse(localStorage.getItem("captain")) || {};

      if (data.blocked) {
        toast.error(data.message || "Your account has been blocked");

        const updatedCaptain = {
          ...storedCaptain,
          blocked: true,
        };

        // ✅ UPDATE BOTH
        localStorage.setItem("captain", JSON.stringify(updatedCaptain));
        setCaptainData(updatedCaptain);
        setIsBlocked(true); // 🔥 THIS WAS MISSING
      } else {
        const updatedCaptain = {
          ...storedCaptain,
          blocked: false,
        };

        localStorage.setItem("captain", JSON.stringify(updatedCaptain));
        setCaptainData(updatedCaptain);
        setIsBlocked(false);
      }
    };

    socket.on("captain-block-status", handleBlockStatus);

    return () => {
      socket.off("captain-block-status", handleBlockStatus);
    };
  }, [socket]);

  useEffect(() => {
    if (isBlocked) {
      navigate("/captain-blocked", { replace: true });
    }
  }, [isBlocked, navigate]);

  return (

  <div className="w-full min-h-[100dvh] bg-[#FFFDF7] overflow-x-hidden flex flex-col">

    {/* HEADER */}
    <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 text-black w-full px-5 pt-7 pb-6 rounded-b-[32px] shadow-lg border-b border-yellow-200">

      <div className="flex justify-between items-center">

        <div className="bg-black text-yellow-400 font-extrabold w-20 h-20 flex items-center justify-center rounded-full shadow-xl ring-4 ring-yellow-200 text-3xl">
          {captainData?.fullname?.firstname?.[0]?.toUpperCase() ?? "C"}
        </div>

        <button
          onClick={() => navigate("/captain-logout")}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 backdrop-blur-sm border border-black/10 hover:bg-black hover:text-yellow-300 transition-all duration-300 font-semibold"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>

      </div>

      <h1 className="text-3xl font-bold mt-5 tracking-tight leading-tight">
        Welcome {captainData?.fullname?.firstname}
      </h1>

      <p className="text-black/70 text-sm mt-1 font-medium">
        Partner since{" "}
        {new Date(captainData?.createdAt).toLocaleDateString()}
      </p>

    </div>

    {/* BODY */}
    <div className="flex-1 flex flex-col px-4 py-5">

      {/* PERFORMANCE */}
      <div>

        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-yellow-500" />
          Performance
        </h2>

        <div className="grid grid-cols-3 gap-3 mt-4">

          <div className="bg-white border border-yellow-100 p-4 rounded-2xl text-center shadow-sm">
            <Car className="w-6 h-6 mx-auto text-yellow-500" />

            <p className="text-lg font-bold mt-1">
              {stats.totalTrips}
            </p>

            <p className="text-xs text-gray-500">
              Trips
            </p>
          </div>

          <div className="bg-white border border-yellow-100 p-4 rounded-2xl text-center shadow-sm">
            <IndianRupee className="w-6 h-6 mx-auto text-yellow-500" />

            <p className="text-lg font-bold mt-1">
              ₹{stats.totalEarnings}
            </p>

            <p className="text-xs text-gray-500">
              Earned
            </p>
          </div>

          <div className="bg-white border border-yellow-100 p-4 rounded-2xl text-center shadow-sm">
            <ShieldCheck className="w-6 h-6 mx-auto text-yellow-500" />

            <p className="text-lg font-bold mt-1">
              {stats.rating}
            </p>

            <p className="text-xs text-gray-500">
              Rating
            </p>
          </div>

        </div>

      </div>

      {/* TRIPS */}
      <div className="flex-1 mt-6 flex flex-col">

        <h2 className="text-xl font-bold text-gray-900 flex items-center mb-3">
          <Clock className="w-5 h-5 mr-2 text-yellow-500" />
          Recent Trips
        </h2>

       <div className="flex-1 max-h-95 overflow-y-auto space-y-3 pb-24 scrollbar-hide">

          {trips.length ? (
            trips.map((t) => (
              <TripItem key={t._id} trip={t} />
            ))
          ) : (
            <p className="text-center text-gray-500 text-sm py-10">
              No trips yet
            </p>
          )}

        </div>

        <button
          onClick={fetchAnalytics}
          className="fixed bottom-4 mt-5 w-[93%]  bg-yellow-400 hover:bg-yellow-500 text-black py-3 rounded-2xl transition-all duration-300 font-bold shadow-md"
        >
          View Captain Analytics
        </button>

      </div>

    </div>

      {/* ANALYTICS MODAL */}
      {showAnalytics && (
        <div className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-md flex justify-center items-center px-3 py-4">
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-xl h-[92vh] bg-[#FFFDF7] rounded-[30px] overflow-hidden shadow-2xl border border-yellow-200 flex flex-col"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {/* HEADER */}
            <div className="sticky top-0 z-50 bg-gradient-to-r from-yellow-400 to-yellow-300 px-5 py-4 border-b border-yellow-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <h2 className="text-2xl font-bold text-black tracking-tight">
                      Captain Analytics
                    </h2>

                    <p className="text-black/70 text-sm mt-0.5">
                      Your driving performance overview
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowAnalytics(false)}
                  className="h-10 w-10 rounded-full bg-black/10 hover:bg-black/20 transition flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-black" />
                </button>
              </div>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#FFFDF7]">
              {/* STATS */}
              {chartData && (
                <div className="grid grid-cols-2 gap-3">
                  {/* TOTAL EARNINGS */}
                  <div className="bg-white rounded-3xl p-4 border border-yellow-100 shadow-sm">
                    <p className="text-sm text-gray-500 font-medium">
                      Total Earnings
                    </p>

                    <h3 className="text-black text-3xl font-bold mt-2">
                      ₹
                      {Object.values(chartData.monthlyEarn)
                        .reduce((a, b) => a + b, 0)
                        .toFixed(2)}
                    </h3>
                  </div>

                  {/* ACTIVE DAYS */}
                  <div className="bg-white rounded-3xl p-4 border border-yellow-100 shadow-sm">
                    <p className="text-sm text-gray-500 font-medium">
                      Active Days
                    </p>

                    <h3 className="text-black text-3xl font-bold mt-2">
                      {
                        new Set(
                          trips
                            .filter((trip) => trip.status === "COMPLETED")
                            .map((trip) =>
                              new Date(trip.createdAt).toDateString(),
                            ),
                        ).size
                      }
                    </h3>
                  </div>
                </div>
              )}

              {/* SUMMARY */}
              <div className="bg-white rounded-3xl border border-yellow-100 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-11 w-11 rounded-2xl bg-yellow-400 text-black flex items-center justify-center font-bold shadow-sm">
                    AI
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-black">
                      Performance Summary
                    </h3>

                    <p className="text-sm text-gray-500">
                      AI generated insights
                    </p>
                  </div>
                </div>

                <pre className="whitespace-pre-wrap text-[15px] leading-5 text-gray-700 font-medium font-sans">
                  {analyticsSummary?.replace(/•/g, "\n•")}
                </pre>
              </div>

              {/* CHART */}
              {chartData && (
                <div className="bg-white rounded-3xl border border-yellow-100 p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-black">
                        Monthly Earnings
                      </h3>

                      <p className="text-sm text-gray-500 mt-0.5">
                        Earnings overview
                      </p>
                    </div>

                    <span className="bg-yellow-400 text-black text-xs px-3 py-1 rounded-full font-bold">
                      2026
                    </span>
                  </div>

                  <Bar
                    data={{
                      labels: Object.keys(chartData.monthlyEarn),

                      datasets: [
                        {
                          label: "Earnings",
                          data: Object.values(chartData.monthlyEarn),
                          backgroundColor: "#EAB308",
                          borderRadius: 10,
                          barThickness: 32,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,

                      plugins: {
                        legend: {
                          display: false,
                        },
                      },

                      scales: {
                        y: {
                          grid: {
                            color: "#F3F4F6",
                          },

                          ticks: {
                            color: "#666",
                          },
                        },

                        x: {
                          grid: {
                            display: false,
                          },

                          ticks: {
                            color: "#666",
                          },
                        },
                      },
                    }}
                  />
                </div>
              )}
            </div>

            {/* FOOTER */}
            <div className="p-4 border-t border-yellow-100 bg-white">
              <button
                onClick={() => setShowAnalytics(false)}
                className="w-full py-3 rounded-2xl bg-yellow-400 hover:bg-yellow-500 text-black font-bold transition-all duration-300 shadow-sm"
              >
                Close Analytics
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CaptainProfile;
