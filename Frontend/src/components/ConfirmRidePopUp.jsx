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
      // toast or error UI can be added later
    }
  };

  return (
    <div className="px-6 py-10 relative bg-white rounded-t-3xl shadow-xl border-t-4 border-[#E23744]">

      {/* Pull Handle */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2">
        <div
          onClick={() => setconfirmridePopUppanel(false)}
          className="w-14 h-1.5 rounded-full bg-gray-300 cursor-pointer"
        ></div>
      </div>

      {/* Title */}
      <h3 className="text-[23px] font-extrabold text-center tracking-tight text-[#E23744] mb-6">
        Start Ride Confirmation
      </h3>

      {/* User Card */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-[#FFF5F5] border border-[#FFC2C2] shadow-sm mb-4">

        <div className="flex items-center gap-3">
          <img
            src="https://live.staticflickr.com/7160/6410037157_8a32776d93_b.jpg"
            className="h-12 w-12 rounded-full object-cover shadow-md"
            alt="user"
          />
          <div>
            <h4 className="font-semibold text-gray-900">
              {ride?.userId?.fullname?.firstname} {ride?.userId?.fullname?.lastname}
            </h4>
            <p className="text-xs text-gray-500">Passenger</p>
          </div>
        </div>

        <span className="text-sm py-1.5 px-3 bg-[#FFEBEB] text-[#D23C3C] rounded-lg font-semibold">
          {ride?.distance || "2.2"} km
        </span>
      </div>

      {/* Ride Details */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm divide-y">

        {/* Pickup */}
        <div className="flex gap-4 items-start p-4">
          <div className="bg-[#FFEAEA] p-2 rounded-lg">
            <i className="ri-map-pin-line text-xl text-[#E23744]"></i>
          </div>
          <div>
            <p className="text-xs text-gray-500">Pickup Location</p>
            <h4 className="font-medium text-gray-900">{ride?.origin}</h4>
          </div>
        </div>

        {/* Drop */}
        <div className="flex gap-4 items-start p-4">
          <div className="bg-[#FFEAEA] p-2 rounded-lg">
            <i className="ri-navigation-line text-xl text-[#E23744]"></i>
          </div>
          <div>
            <p className="text-xs text-gray-500">Drop Off</p>
            <h4 className="font-medium text-gray-900">{ride?.destination}</h4>
          </div>
        </div>

        {/* Fare */}
        <div className="flex gap-4 items-start p-4">
          <div className="bg-[#FFEAEA] p-2 rounded-lg">
            <i className="ri-money-rupee-circle-line text-xl text-[#E23744]"></i>
          </div>
          <div>
            <p className="text-xs text-gray-500">Fare</p>
            <h4 className="text-xl font-bold text-gray-900">₹{ride?.fare}</h4>
            <p className="text-[11px] text-gray-500">Cash • Pay before end</p>
          </div>
        </div>
      </div>

      {/* OTP Form */}
      <form onSubmit={submitHandler} className="mt-8">

        <input
          type="number"
          maxLength="4"
          onChange={(e) => setOTP(e.target.value)}
          className="w-full text-center text-2xl tracking-[0.45em] font-bold bg-[#F8F8F8] border border-gray-300 rounded-xl py-4 outline-none focus:ring-2 focus:ring-[#E23744]"
          placeholder="----"
        />

        {/* Start Ride Button */}
        <button
          onClick={() => setconfirmridePopUppanel(true)}
          className="w-full bg-[#E23744] text-white font-bold text-lg rounded-xl py-4 mt-6 hover:bg-[#c82c3a] active:scale-[0.97] transition"
        >
          Start Ride
        </button>

        {/* Cancel */}
        <button
          onClick={() => {
            setridePopUppanel(false);
            setconfirmridePopUppanel(false);
          }}
          className="w-full bg-gray-200 text-gray-800 font-semibold text-lg rounded-xl py-4 mt-3 active:scale-[0.97] transition"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default ConfirmRidePopUp;
