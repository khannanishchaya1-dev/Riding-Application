import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const FinishRide = (props) => {
  const navigate = useNavigate();

  const endRide = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}rides/end-ride`,
        { rideId: props.ride._id },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      toast.success("🎉 Ride completed successfully!");

      if (response.status === 200) {
        navigate("/captain-home");
      }
    } catch (error) {
      console.error("❌ Error ending ride:", error);
    }
  };

  return (
    <div className="h-[100dvh] bg-white rounded-3xl  shadow-xl border-t-4 border-[#E23744] animate-fadeIn">

      {/* Close Button */}
      <div className="text-center">
        <i
          onClick={() => props.setFinishRidepanel(false)}
          className="ri-arrow-down-s-line text-3xl text-gray-400 hover:text-black cursor-pointer transition"
        ></i>
      </div>

      {/* Heading */}
      <h3 className="text-2xl font-bold text-center text-[#E23744] mt-2 tracking-tight">
        Complete Ride
      </h3>

      {/* Rider Card */}
      <div className="flex items-center justify-between bg-[#FFF5F5] rounded-2xl p-4 shadow-sm mt-5">
        <div className="flex items-center gap-3">
          <img
            className="h-12 w-12 rounded-full object-cover border-2 border-[#E23744]"
            src="https://live.staticflickr.com/7160/6410037157_8a32776d93_b.jpg"
          />

          <h2 className="text-lg font-semibold text-gray-800">
            {props.ride?.userId.fullname.firstname +
              " " +
              props.ride?.userId.fullname.lastname}
          </h2>
        </div>

        <span className="text-gray-600 font-medium text-md">📍 2.2 km</span>
      </div>

      {/* Trip Summary */}
      <div className="bg-[#F8F8F8] rounded-3xl p-4 border border-gray-200 mt-6 space-y-4">

        {/* Pickup */}
        <div className="flex items-start gap-4">
          <div className="bg-[#FFE7E7] rounded-xl p-2 shadow-sm">
            <i className="ri-map-pin-user-fill text-[#E23744] text-2xl"></i>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg">Pickup</h4>
            <p className="text-sm text-gray-500">{props?.ride?.origin}</p>
          </div>
        </div>

        {/* Destination */}
        <div className="flex items-start gap-4">
          <div className="bg-[#FFE7E7] rounded-xl p-2 shadow-sm">
            <i className="ri-navigation-fill text-[#E23744] text-2xl"></i>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg">Drop</h4>
            <p className="text-sm text-gray-500">{props?.ride?.destination}</p>
          </div>
        </div>

        {/* Fare */}
        <div className="flex items-center gap-4">
          <div className="bg-[#FFE7E7] rounded-xl p-2 shadow-sm">
            <i className="ri-money-rupee-circle-fill text-[#E23744] text-2xl"></i>
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-900">₹{props?.ride?.fare}</h4>
            <p className="text-sm text-gray-600">Take cash before finishing</p>
          </div>
        </div>
      </div>

      {/* Finish Button */}
      <button
        onClick={endRide}
        className="mt-6 w-full bg-[#E23744] text-white font-semibold rounded-2xl py-4 text-lg tracking-wide hover:bg-[#c82c35] transition active:scale-[0.98]"
      >
        🚦 Finish Ride
      </button>
    </div>
  );
};

export default FinishRide;
