import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  Gauge,
  Wallet,
  Mail,
  CheckCircle,
  XCircle,
  Timer,
} from "lucide-react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const RideDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [ride, setRide] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [loadingReport, setLoadingReport] = useState(false);
  const [isCaptainBlocked, setIsCaptainBlocked] = useState(false);

  useEffect(() => {
    if (ride?.reportedbyPassenger === true) {
      setIsCaptainBlocked(true);
    }
  }, [ride]);

  useEffect(() => {
    fetchRide();
  }, []);

  useEffect(() => {
    if (ride?.status === "ONGOING" && location.pathname !== "/riding") {
      navigate("/riding", { state: { ride } });
    }
  }, [ride]);

  useEffect(() => {
    if (ride?.status === "ACCEPTED" && location.pathname !== "/home") {
      navigate("/home", { state: { ride } });
    }
  }, [ride]);

  const fetchRide = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}users/find-ride/${id}`,
        { withCredentials: true },
      );
      setRide(res.data.ride);
    } catch {
      toast.error("Unable to fetch ride detail ❌");
    }
  };

  if (!ride)
    return <p className="text-center py-10">Loading ride details...</p>;

  const getStatusStyle = () => {
    switch (ride.status) {
      case "COMPLETED":
        return {
          bg: "bg-green-100",
          text: "text-green-700",
          Icon: CheckCircle,
        };
      case "ONGOING":
        return { bg: "bg-yellow-100", text: "text-yellow-700", Icon: Timer };
      default:
        return { bg: "bg-red-100", text: "text-red-700", Icon: XCircle };
    }
  };

  const { bg, text, Icon } = getStatusStyle();
  const handleReportPassenger = async () => {
    if (!reportReason.trim()) {
      toast.error("Please enter a reason");
      return;
    }

    try {
      setLoadingReport(true);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}users/report-captain`,
        {
          rideId: ride._id,
          captainId: ride.captain._id,
          reason: reportReason,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        },
      );

      toast.success("Captain reported 🚩");
      setShowReportModal(false);
      navigate("/captain-reported", { state: { reason: reportReason } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to report");
    } finally {
      setLoadingReport(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-5 py-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-semibold text-[#E23744]"
        >
          Ride Summary 🚗
        </motion.h1>

        <span className="font-mono text-sm bg-gray-200 px-3 py-1 rounded-lg text-gray-700">
          #{ride._id.slice(0, 7).toUpperCase()}
        </span>
      </div>

      {/* STATUS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm ${bg} ${text}`}
      >
        <Icon size={16} /> {ride.status}
      </motion.div>

      {/* MAIN CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 }}
        className="bg-white shadow-sm rounded-2xl mt-6 overflow-hidden"
      >
        {/* CAPTAIN */}
        <div className="p-5 border-b flex items-center gap-4">
          {ride?.captain ? (
            <>
              <img
                src={ride.captain.avatar}
                className="h-14 w-14 border rounded-full object-cover"
                alt="captain"
              />
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-800">
                  {ride.captain.fullname.firstname}{" "}
                  {ride.captain.fullname.lastname}
                </h2>
                <p className="text-gray-500 text-sm">
                  {ride.captain.vehicle.vehicleModel} •{" "}
                  {ride.captain.vehicle.color}
                </p>
                <p className="text-gray-800 font-semibold text-sm mt-1">
                  {ride.captain.vehicle.numberPlate}
                </p>
              </div>
            </>
          ) : (
            <div className="w-full text-center py-4">
              <p className="text-gray-600 font-medium">
                🚫 No Captain Assigned
              </p>
              <p className="text-sm text-gray-500">
                This ride was cancelled or no captain accepted.
              </p>
            </div>
          )}
        </div>

        {/* ROUTE */}
        <div className="p-5 space-y-4 bg-gray-50 rounded-xl mx-4 mt-4">
          <div className="flex items-start gap-3">
            <MapPin className="text-[#E23744]" size={18} />
            <p className="text-gray-800 font-medium">{ride.origin}</p>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="text-green-600" size={18} />
            <p className="text-gray-800 font-medium">{ride.destination}</p>
          </div>
        </div>

        <hr className="mx-4 border-gray-200" />

        {/* STATS */}
        <div className="grid grid-cols-3 text-center p-5 gap-4">
          {/* FARE */}
          <div className="bg-gray-50 rounded-xl py-3">
            <Wallet className="mx-auto text-[#E23744]" size={22} />
            <p className="text-sm text-gray-500">Fare</p>
            <p className="font-bold text-lg text-gray-900 mt-1">
              ₹{ride.fare.toFixed(2)}
            </p>

            {ride.paymentStatus === "PAID" ? (
              <span className="mt-1 inline-flex items-center gap-1 text-green-600 text-xs font-semibold">
                <CheckCircle size={14} /> Paid
              </span>
            ) : ride.paymentStatus === "FAILED" ? (
              <span className="mt-1 inline-flex items-center gap-1 text-red-600 text-xs font-semibold">
                <XCircle size={14} /> Failed
              </span>
            ) : (
              <span className="mt-1 inline-flex items-center gap-1 text-yellow-600 text-xs font-semibold animate-pulse">
                <Timer size={14} /> Pending
              </span>
            )}
          </div>

          {/* DURATION */}
          <div>
            <Clock className="mx-auto text-indigo-500" size={22} />
            <p className="text-sm text-gray-500">Duration</p>
            <p className="font-semibold">
              {(ride.duration / 60).toFixed(1)} min
            </p>
          </div>

          {/* DISTANCE */}
          <div>
            <Gauge className="mx-auto text-yellow-600" size={22} />
            <p className="text-sm text-gray-500">Distance</p>
            <p className="font-semibold">{ride.distance.toFixed(1)} km</p>
          </div>
        </div>

        <hr className="mx-4 border-gray-200" />

        {/* CONTACT */}
        <div className="p-5 flex justify-between items-center">
          {/* REPORT PASSENGER */}
           {ride.status !== "REQUESTED" && (
          <div className="px-5 pb-4">
            <button
              onClick={() => setShowReportModal(true)}
              disabled={isCaptainBlocked}
              className={`text-sm font-semibold px-4 py-2 rounded-lg transition flex items-center gap-2 shadow-sm
              ${
                isCaptainBlocked
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-red-600 text-white hover:bg-red-700"
              }
            `}
            >
              🚩{" "}
              {isCaptainBlocked ? "Captain Already Reported" : "Report Captain"}
            </button>

            {showReportModal && (
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl"
                >
                  <h2 className="text-lg font-semibold mb-3">
                    Report Passenger
                  </h2>

                  <textarea
                    placeholder="Describe the issue..."
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    rows={4}
                  />

                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      onClick={() => setShowReportModal(false)}
                      className="px-4 py-2 text-sm rounded-lg border"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleReportPassenger}
                      disabled={loadingReport}
                      className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      {loadingReport ? "Reporting..." : "Submit Report"}
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
           )}

          <Mail size={22} className="text-[#E23744]" />
        </div>
      </motion.div>

      {/* PAYMENT CTA */}
      {ride.paymentStatus !== "PAID" && ride.status === "ONGOING" && (
        <button
          onClick={() => navigate("/riding", { state: { ride } })}
          className="w-full mt-5 py-4 bg-[#E23744] text-white rounded-xl text-lg font-semibold hover:bg-[#c02f38] transition"
        >
          💳 Complete Payment
        </button>
      )}

      {/* FOOTER */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mt-6 text-gray-400 text-sm"
      >
        Thanks for riding with{" "}
        <span className="text-[#E23744] font-semibold">GadiGo</span> ❤️
      </motion.p>
    </div>
  );
};

export default RideDetails;
