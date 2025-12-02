import React, { useRef } from "react";

const RidePopUp = ({ ride, setridePopUppanel, setconfirmridePopUppanel, confirmRide }) => {
  const soundRef = useRef(new Audio("/src/assets/sounds/incoming.mp3"));

  const closePanel = () => {
    setridePopUppanel(false);
    soundRef.current.currentTime = 0;
    soundRef.current.play().catch(() => {});
  };

  return (
    <div className="px-5 pb-7 pt-10">

      {/* Drag/Close Icon */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2">
        <div
          onClick={closePanel}
          className="w-14 h-1.5 bg-gray-300 rounded-full cursor-pointer"
        ></div>
      </div>

      {/* Title */}
      <h3 className="text-[22px] font-semibold text-gray-900 mb-4">
        New Ride Request
      </h3>

      {/* User Info Card */}
      <div className="bg-[#FFF7CC] border border-[#F1C65B] rounded-lg p-4 flex items-center justify-between shadow-sm mb-4">
        <div className="flex items-center gap-3">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src="https://live.staticflickr.com/7160/6410037157_8a32776d93_b.jpg"
            alt=""
          />
          <h2 className="text-lg font-medium">
            {ride?.userId?.fullname?.firstname} {ride?.userId?.fullname?.lastname}
          </h2>
        </div>
        <span className="text-lg font-semibold text-gray-800">2.4 km</span>
      </div>

      {/* Details Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm divide-y">
        
        {/* Pickup */}
        <div className="flex gap-4 items-start p-4">
          <i className="ri-map-pin-user-fill text-xl text-gray-600"></i>
          <div>
            <label className="text-sm text-gray-500">Pickup</label>
            <p className="text-base font-medium text-gray-800">{ride?.origin}</p>
          </div>
        </div>

        {/* Drop */}
        <div className="flex gap-4 items-start p-4">
          <i className="ri-navigation-fill text-xl text-gray-600"></i>
          <div>
            <label className="text-sm text-gray-500">Drop</label>
            <p className="text-base font-medium text-gray-800">{ride?.destination}</p>
          </div>
        </div>

        {/* Fare */}
        <div className="flex gap-4 items-start p-4">
          <i className="ri-money-rupee-circle-fill text-xl text-gray-600"></i>
          <div>
            <label className="text-sm text-gray-500">Fare</label>
            <p className="text-lg font-semibold text-gray-900">₹{ride?.fare}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col gap-3">
        
        {/* Accept Button (Amazon Yellow) */}
        <button
          onClick={() => {
            setconfirmridePopUppanel(true);
            confirmRide();
          }}
          className="bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-semibold rounded-lg py-3 w-full transition active:scale-[0.97]"
        >
          Accept Ride
        </button>

        {/* Secondary Button */}
        <button
          onClick={() => setridePopUppanel(false)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg py-3 transition active:scale-[0.97]"
        >
          Ignore
        </button>
      </div>
    </div>
  );
};

export default RidePopUp;
