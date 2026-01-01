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
      ? (ride.distance).toFixed(1)
      : "4.0";

  const passengerName =
    ride?.userId?.fullname?.firstname && ride?.userId?.fullname?.lastname
      ? `${ride.userId.fullname.firstname} ${ride.userId.fullname.lastname}`
      : "Passenger";

  return (
    <div className="h-[100dvh] bg-white rounded-t-3xl shadow-[0_-8px_28px_rgba(0,0,0,0.15)] animate-fadeIn px-6 pt-6 pb-10 relative text-black">

      {/* Pull Handle */}
      <div
        className="w-12 h-[4px] rounded-full bg-gray-300 mx-auto mb-5 cursor-pointer hover:bg-gray-400 transition"
        onClick={() => setFinishRidepanel(false)}
      />

      {/* Title */}
      <h3 className="text-2xl font-bold text-center tracking-tight text-gray-800">
        Finish Ride
      </h3>
      <p className="text-xs text-gray-500 text-center mt-1 mb-6">
        Make sure you’ve collected payment before completing the trip.
      </p>

      {/* Passenger Card */}
      <div className="bg-[#F8F8F8] border border-gray-200 rounded-2xl p-4 flex justify-between items-center shadow-sm mb-6">
        <div className="flex items-center gap-3">
          <img
            src="https://live.staticflickr.com/7160/6410037157_8a32776d93_b.jpg"
            className="h-12 w-12 rounded-full object-cover border border-gray-200 shadow-sm"
            alt=""
          />
          <div>
            <h4 className="font-semibold text-gray-800 text-sm">{passengerName}</h4>
            <p className="text-[11px] text-gray-500">Passenger</p>
          </div>
        </div>
        <span className="text-xs font-medium bg-gray-100 px-3 py-1 rounded-full text-gray-700">
          📍 {remainingKm} km
        </span>
      </div>

      {/* Trip Summary */}
      <div className="rounded-2xl bg-[#FAFAFA] border border-gray-200 p-5 space-y-5 shadow-inner">

        {/* Pickup */}
        <div className="flex items-start gap-4">
          <div className="bg-white border border-gray-200 rounded-lg h-10 w-10 flex items-center justify-center shadow-sm">
            <i className="ri-map-pin-user-fill text-black text-xl"></i>
          </div>
          <div>
            <p className="text-xs text-gray-500">Pickup</p>
            <h4 className="font-medium text-gray-800 text-sm">{ride?.origin}</h4>
          </div>
        </div>

        {/* Destination */}
        <div className="flex items-start gap-4">
          <div className="bg-white border border-gray-200 rounded-lg h-10 w-10 flex items-center justify-center shadow-sm">
            <i className="ri-navigation-fill text-black text-xl"></i>
          </div>
          <div>
            <p className="text-xs text-gray-500">Drop</p>
            <h4 className="font-medium text-gray-800 text-sm">{ride?.destination}</h4>
          </div>
        </div>

        {/* Fare */}
        <div className="flex items-start gap-4">
          <div className="bg-white border border-gray-200 rounded-lg h-10 w-10 flex items-center justify-center shadow-sm">
            <i className="ri-money-rupee-circle-fill text-black text-xl"></i>
          </div>
          <div>
            <h4 className="text-xl font-semibold text-gray-900">₹{ride?.fare}</h4>
            <p className="text-xs text-gray-500">
              Ride fare collected from customer
            </p>
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <button
        onClick={endRide}
        className="mt-8 w-full bg-black text-white font-semibold rounded-xl py-4 text-sm tracking-wide 
                 hover:bg-[#1a1a1a] active:scale-95 transition shadow-md"
      >
        🚦 End Ride
      </button>

      <button
        onClick={() => setFinishRidepanel(false)}
        className="mt-3 w-full py-3 text-gray-700 text-sm rounded-xl border border-gray-300 
                   bg-white hover:bg-gray-100 active:scale-95 transition"
      >
        Cancel
      </button>
    </div>
  );
};

export default FinishRide;
