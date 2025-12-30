import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement } from "chart.js";
import { useCountUp } from "../../utils/useCountUp";  // ✅ FIXED PATH
import { AdminContext } from "../../AdminContext/AdminContext";

ChartJS.register(ArcElement);

// ✨ Donut Center Text Plugin
const CenterTextPlugin = {
  id: "centerText",
  afterDraw(chart) {
    if (!chart.config.options.plugins.centerText) return;
    const { ctx, chartArea } = chart;
    const { top, left, width, height } = chartArea;
    const total = chart.config.options.plugins.centerText.total;
    ctx.save();
    ctx.fillStyle = "#111";
    ctx.textAlign = "center";
    ctx.font = "bold 14px Inter";
    ctx.fillText("Total Rides", left + width / 2, top + height / 2 - 8);
    ctx.font = "600 20px Inter";
    ctx.fillText(total, left + width / 2, top + height / 2 + 15);
  }
};

ChartJS.register(CenterTextPlugin);

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, captains: 0, rides: 0 });
  const [rideStats, setRideStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Animated numbers
  const animUsers = useCountUp(stats.users);
  const animCaptains = useCountUp(stats.captains);
  const animRides = useCountUp(stats.rides);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}admin/stats`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
        );
        setStats(res.data.stats);
      } catch (err) { console.log(err); } 
      finally { setLoading(false); }
    };

    const loadRideStats = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}admin/ride-stats`,
          { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } }
        );
        setRideStats(res.data.stats);
      } catch (err) { console.log(err); }
    };

    loadStats();
    loadRideStats();
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-[#F5F7FA]">
      <div className="flex-1 w-full">
        <AdminNavbar />

        <main className="p-4 md:p-6 overflow-y-auto">
          <h1 className="text-xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-xs md:text-sm mt-1">
            View system overview and quick actions.
          </p>

          {/* KPI Cards */}
          <div className="mt-6 space-y-4">
            <Card title="Total Users" value={animUsers} />
            <Card title="Total Captains" value={animCaptains} />
            <Card title="Total Rides" value={animRides} />
          </div>

          {/* Manage Section */}
          <h2 className="text-lg font-semibold text-gray-800 mt-10 mb-3">
            Manage Platform
          </h2>

          <div className="space-y-4">
            <NavCard title="Users" desc="View, track & block users" link="/admin/users" />
            <NavCard title="Captains" desc="Approve & monitor drivers" link="/admin/captains" />
            <NavCard title="Rides" desc="View ride logs & status" link="/admin/rides" />
          </div>

          {/* Widgets */}
          <div className="mt-10 space-y-4">
            <div className="bg-white rounded-lg border p-4 shadow-sm flex flex-col items-center justify-center">
              {!rideStats ? (
                <p className="text-gray-400 text-sm py-10">Loading ride stats...</p>
              ) : (
                <>
                  {/* Donut Chart */}
                  <div className="w-[180px] md:w-[230px]">
                    <Doughnut
                      data={{
                        labels: [],
                        datasets: [
                          {
                            data: [
                              rideStats.completed,
                              rideStats.ongoing,
                              rideStats.requested,
                              rideStats.cancelledByUser,
                              rideStats.cancelledByCaptain,
                            ],
                            backgroundColor: [
                              "#16a34a",
                              "#3b82f6",
                              "#facc15",
                              "#ef4444",
                              "#f97316",
                            ],
                            borderWidth: 0,
                          },
                        ],
                      }}
                      options={{
                        cutout: "70%",
                        plugins: {
                          legend: { display: false },
                          tooltip: { enabled: false },
                          datalabels: { display: false },
                          centerText: { total: stats.rides },
                        },
                      }}
                    />
                  </div>

                  {/* Custom Legend */}
                  <LegendRow color="#16a34a" label="Completed" count={rideStats.completed} />
                  <LegendRow color="#3b82f6" label="Ongoing" count={rideStats.ongoing} />
                  <LegendRow color="#facc15" label="Requested" count={rideStats.requested} />
                  <LegendRow color="#ef4444" label="Cancelled by User" count={rideStats.cancelledByUser} />
                  <LegendRow color="#f97316" label="Cancelled by Captain" count={rideStats.cancelledByCaptain} />
                </>
              )}
            </div>

            <div className="bg-white rounded-lg border p-4 shadow-sm h-40 flex items-center justify-center text-gray-400 text-sm">
              🗺️ Real-Time Ride Map Coming Soon
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const Card = ({ title, value }) => (
  <div className="bg-white w-full rounded-lg border p-4 shadow-sm hover:shadow-md transition">
    <p className="text-gray-500 text-sm">{title}</p>
    <h2 className="text-3xl font-extrabold mt-1 text-[#111]">{value}</h2>
  </div>
);

const NavCard = ({ title, desc, link }) => (
  <Link to={link} className="block bg-white rounded-lg border p-4 shadow-sm hover:shadow-md transition">
    <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
    <p className="text-gray-500 text-sm">{desc}</p>
  </Link>
);

const LegendRow = ({ color, label, count }) => (
  <div className="mt-3 w-full text-xs md:text-sm flex justify-between">
    <span className="flex items-center gap-2">
      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></span>
      {label}
    </span>
    <span className="font-semibold">{count}</span>
  </div>
);

export default AdminDashboard;
