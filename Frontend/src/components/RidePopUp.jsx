import React, { useRef } from "react";

const RidePopUp = ({ ride, setridePopUppanel, setconfirmridePopUppanel, confirmRide }) => {
  const soundRef = useRef(new Audio("/src/assets/sounds/incoming.mp3"));

  const closePanel = () => {
    setridePopUppanel(false);
    soundRef.current.currentTime = 0;
    soundRef.current.play().catch(() => {});
  };

  return (
    <div className="px-6 pb-7 pt-10 relative">

      {/* Drag Handle */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2">
        <div
          onClick={closePanel}
          className="w-10 h-1.5 bg-gray-300 rounded-full cursor-pointer active:scale-95"
        ></div>
      </div>

      {/* Title */}
      <h3 className="text-[22px] font-semibold text-gray-900 mb-5">
        🚗 New Ride Request
      </h3>

      {/* Passenger Card */}
      <div className="backdrop-blur-lg bg-white/80 border border-gray-200 rounded-2xl p-4 shadow-sm flex justify-between items-center mb-5">
        <div className="flex items-center gap-3">
          <img
            className="h-11 w-11 rounded-full object-cover border border-gray-200"
            src="https://live.staticflickr.com/7160/6410037157_8a32776d93_b.jpg"
            alt=""
          />
          <div>
            <p className="font-semibold text-gray-900 text-sm">
              {ride?.userId?.fullname?.firstname} {ride?.userId?.fullname?.lastname}
            </p>
            <p className="text-xs text-gray-500">Verified Passenger</p>
          </div>
        </div>

        <span className="text-lg font-bold text-[#E23744]">2.4 km</span>
      </div>

      {/* Details Section */}
      <div className="backdrop-blur-xl bg-white/70 border border-gray-200 rounded-2xl shadow-md divide-y">

        {/* Pickup */}
        <div className="flex gap-4 items-start p-4">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-100">
            <i className="ri-map-pin-user-fill text-[#E23744] text-xl"></i>
          </div>

          <div>
            <p className="text-xs text-gray-500">Pickup</p>
            <p className="font-medium text-gray-900 text-sm">{ride?.origin}</p>
          </div>
        </div>

        {/* Drop */}
        <div className="flex gap-4 items-start p-4">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-100">
            <i className="ri-navigation-fill text-[#E23744] text-xl"></i>
          </div>

          <div>
            <p className="text-xs text-gray-500">Destination</p>
            <p className="font-medium text-gray-900 text-sm">{ride?.destination}</p>
          </div>
        </div>

        {/* Fare */}
        <div className="flex gap-4 items-start p-4">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-100">
            <i className="ri-money-rupee-circle-fill text-[#E23744] text-xl"></i>
          </div>

          <div>
            <p className="text-xs text-gray-500">Estimated Fare</p>
            <p className="text-lg font-semibold text-gray-900">
              ₹{ride?.fare}
            </p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 space-y-3">

        {/* Accept */}
        <button
          onClick={() => {
            setconfirmridePopUppanel(true);
            confirmRide();
          }}
          className="w-full bg-[#E23744] text-white font-semibold text-lg rounded-xl py-3 
          hover:bg-[#c52c35] transition active:scale-[0.97]"
        >
          Accept Ride
        </button>

        {/* Ignore */}
        <button
          onClick={() => {setridePopUppanel(false);localStorage.removeItem("activeRide")}}
          className="w-full border border-gray-300 text-gray-700 font-semibold rounded-xl py-3 
          hover:bg-gray-100 transition active:scale-[0.97]"
        >
          Ignore
        </button>
      </div>
    </div>
  );
};

export default RidePopUp;
