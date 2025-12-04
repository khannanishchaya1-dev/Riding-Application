import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ConfirmRidePopUp = ({ ride, setconfirmridePopUppanel, setridePopUppanel }) => {
  const [OTP, setOTP] = useState("");
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}rides/start-ride`,
        {
          params: { rideId: ride._id, otp: OTP },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (res.status === 200) {
        setconfirmridePopUppanel(false);
        setridePopUppanel(false);
        navigate("/captain-riding", { state: { ride } });
      }
    } catch {
      // add toast here if you want
    }
  };

  return (
    <div className="px-6 pt-7 pb-6 bg-white rounded-t-3xl shadow-[0_-8px_28px_rgba(0,0,0,0.18)] relative">

      {/* Pull Handle */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2">
        <div
          onClick={() => setconfirmridePopUppanel(false)}
          className="w-12 h-[4px] rounded-full bg-gray-300 cursor-pointer active:scale-95"
        />
      </div>

      {/* Title */}
      <h3 className="text-[18px] font-semibold text-center text-gray-900 mt-4">
        Enter OTP to Start Ride
      </h3>
      <p className="text-xs text-gray-500 text-center mt-1 mb-5">
        Confirm with the passenger before starting the trip.
      </p>

      {/* Passenger Card */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-200 shadow-sm mb-4">
        <div className="flex items-center gap-3">
          <img
            src="https://live.staticflickr.com/7160/6410037157_8a32776d93_b.jpg"
            className="h-11 w-11 rounded-full object-cover border border-gray-200"
            alt="user"
          />
          <div>
            <h4 className="font-semibold text-gray-900 text-sm">
              {ride?.userId?.fullname?.firstname} {ride?.userId?.fullname?.lastname}
            </h4>
            <p className="text-[11px] text-gray-500">Passenger</p>
          </div>
        </div>

        <span className="text-xs py-1 px-3 bg-gray-100 text-gray-700 rounded-full font-medium">
          {ride?.distance || "2.2"} km
        </span>
      </div>

      {/* Ride Details */}
      <div className="bg-[#F9F9F9] border border-gray-200 rounded-2xl shadow-sm divide-y">

        {/* Pickup */}
        <div className="flex gap-3 items-start p-4">
          <div className="bg-white border border-gray-200 h-9 w-9 rounded-lg flex items-center justify-center">
            <i className="ri-map-pin-line text-lg text-[#E23744]" />
          </div>
          <div>
            <p className="text-[11px] text-gray-500">Pickup Location</p>
            <h4 className="font-medium text-gray-900 text-sm">{ride?.origin}</h4>
          </div>
        </div>

        {/* Drop */}
        <div className="flex gap-3 items-start p-4">
          <div className="bg-white border border-gray-200 h-9 w-9 rounded-lg flex items-center justify-center">
            <i className="ri-navigation-line text-lg text-[#E23744]" />
          </div>
          <div>
            <p className="text-[11px] text-gray-500">Drop Off</p>
            <h4 className="font-medium text-gray-900 text-sm">{ride?.destination}</h4>
          </div>
        </div>

        {/* Fare */}
        <div className="flex gap-3 items-start p-4">
          <div className="bg-white border border-gray-200 h-9 w-9 rounded-lg flex items-center justify-center">
            <i className="ri-money-rupee-circle-line text-lg text-[#E23744]" />
          </div>
          <div>
            <p className="text-[11px] text-gray-500">Fare</p>
            <h4 className="text-lg font-semibold text-gray-900">₹{ride?.fare}</h4>
            <p className="text-[11px] text-gray-500">Cash • Pay before end</p>
          </div>
        </div>
      </div>

      {/* OTP Form */}
      <form onSubmit={submitHandler} className="mt-7">
        <input
          type="tel"
          inputMode="numeric"
          maxLength={6}
          onChange={(e) => setOTP(e.target.value)}
          className="w-full text-center text-2xl tracking-[0.4em] font-semibold bg-[#F5F5F5] 
                     border border-gray-300 rounded-xl py-3.5 outline-none 
                     focus:ring-2 focus:ring-[#E23744] focus:border-transparent"
          placeholder="••••••"
        />

        {/* Start Ride */}
        <button
          type="submit"
          className="w-full bg-[#E23744] text-white font-semibold text-sm rounded-xl py-3.5 mt-6 
                     hover:bg-[#c72f39] active:scale-[0.97] transition"
        >
          Start Ride
        </button>

        {/* Cancel */}
        <button
          type="button"
          onClick={() => {
            setridePopUppanel(false);
            setconfirmridePopUppanel(false);
          }}
          className="w-full bg-gray-100 text-gray-700 font-medium text-sm rounded-xl py-3 mt-3 
                     hover:bg-gray-200 active:scale-[0.97] transition"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default ConfirmRidePopUp;
