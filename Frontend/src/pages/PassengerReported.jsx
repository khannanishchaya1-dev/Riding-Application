import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const PassengerReported = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const reason = location.state?.reason || "No reason provided";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center text-center px-6">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-sm w-full"
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-red-50 p-4 rounded-full">
            <CheckCircle className="text-red-600 w-9 h-9" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-900">
          Passenger Reported
        </h1>

        {/* Message */}
        <p className="text-gray-500 mt-3 text-sm leading-relaxed">
          Our safety team will review this report and take necessary action.
        </p>

        {/* Reason Box */}
        <div className="mt-5 bg-white border border-gray-200 rounded-xl p-4 text-left">
          <p className="text-xs text-gray-400 mb-1">Reported Reason</p>
          <p className="text-sm text-gray-700 font-medium break-words">
            {reason}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-8 space-y-3">
          <button
            onClick={() => navigate("/captain-home")}
            className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-neutral-900 transition"
          >
            Back to Home
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full text-gray-600 py-2 font-medium hover:text-black transition"
          >
            Go Back
          </button>
        </div>
      </motion.div>

      <p className="text-xs text-gray-400 mt-10">
        GadiGo Safety • Ride Secure
      </p>
    </div>
  );
};

export default PassengerReported;
