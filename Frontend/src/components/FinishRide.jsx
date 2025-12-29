import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const FinishRide = ({ ride, setFinishRidepanel }) => {
  const navigate = useNavigate();

  const endRide = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}rides/end-ride`,
        { rideId: ride._id },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.status === 200) {
        localStorage.removeItem("activeRide");
        toast.success("🎉 Ride completed successfully!");
        navigate("/captain-home");
      }
    } catch (error) {
      console.error("❌ Error ending ride:", error);
      toast.error("Something went wrong while ending the ride.");
    }
  };

  const remainingKm =
    typeof ride?.distance === "number"
      ? (ride.distance / 1000).toFixed(1)
      : "4.0";
  const passengerName =
    ride?.userId?.fullname?.firstname && ride?.userId?.fullname?.lastname
      ? `${ride.userId.fullname.firstname} ${ride.userId.fullname.lastname}`
      : "Passenger";

  return (
    <div className="h-[100dvh] bg-white rounded-t-3xl shadow-[0_-8px_28px_rgba(0,0,0,0.18)] animate-fadeIn px-6 pt-6 pb-8 relative">

      {/* Drag Handle */}
      <div className="w-12 h-[4px] rounded-full bg-gray-300 mx-auto mb-4 cursor-pointer"
           onClick={() => setFinishRidepanel(false)}
      />

      {/* Heading */}
      <h3 className="text-lg font-semibold text-center text-gray-900">
        Finish Ride
      </h3>
      <p className="text-xs text-gray-500 text-center mt-1 mb-5">
      Make sure you’ve collected the payment before completing the trip.

      </p>

      {/* Passenger Card */}
      <div className="flex items-center justify-between bg-[#F9F9F9] rounded-2xl p-4 border border-gray-200 mt-2">
        <div className="flex items-center gap-3">
          <img
            className="h-11 w-11 rounded-full object-cover border border-gray-200"
            src="https://live.staticflickr.com/7160/6410037157_8a32776d93_b.jpg"
            alt="Passenger"
          />
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              {passengerName}
            </h2>
            <p className="text-[11px] text-gray-500">Passenger</p>
          </div>
        </div>

        <span className="text-xs text-gray-600 font-medium">
          📍 {remainingKm} km
        </span>
      </div>

      {/* Trip Summary */}
      <div className="bg-[#F5F5F5] rounded-2xl p-4 border border-gray-200 mt-6 space-y-4">

        {/* Pickup */}
        <div className="flex items-start gap-3">
          <div className="bg-white rounded-lg p-2 border border-gray-200">
            <i className="ri-map-pin-user-fill text-[#E23744] text-xl" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 text-sm">Pickup</h4>
            <p className="text-xs text-gray-600">{ride?.origin}</p>
          </div>
        </div>

        {/* Destination */}
        <div className="flex items-start gap-3">
          <div className="bg-white rounded-lg p-2 border border-gray-200">
            <i className="ri-navigation-fill text-[#E23744] text-xl" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 text-sm">Drop</h4>
            <p className="text-xs text-gray-600">{ride?.destination}</p>
          </div>
        </div>

        {/* Fare */}
        <div className="flex items-start gap-3">
          <div className="bg-white rounded-lg p-2 border border-gray-200">
            <i className="ri-money-rupee-circle-fill text-[#E23744] text-xl" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900">
              ₹{ride?.fare}
            </h4>
            <p className="text-xs text-gray-600">
              Check payment status before ending
            </p>
          </div>
        </div>
      </div>

      {/* Finish Button */}
      <button
        onClick={endRide}
        className="mt-6 w-full bg-[#E23744] text-white font-semibold rounded-xl py-3.5 text-sm tracking-wide 
                 hover:bg-[#c82c35] active:scale-[0.97] transition"
      >
        🚦 Finish Ride
      </button>

      {/* Cancel Button */}
      <button
        onClick={() => setFinishRidepanel(false)}
        className="mt-3 w-full bg-gray-100 text-gray-700 font-medium rounded-xl py-3 text-sm 
                   hover:bg-gray-200 active:scale-[0.97] transition"
      >
        Cancel
      </button>
    </div>
  );
};

export default FinishRide;
