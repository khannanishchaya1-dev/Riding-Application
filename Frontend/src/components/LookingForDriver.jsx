import React from "react";

const LookingForDriver = ({ ride, setlookingForVehicle }) => {
  return (
    <>
      {/* Top drag/close icon */}
      <div className="w-full flex justify-center absolute top-2">
        <i
          className="ri-arrow-down-s-line text-3xl text-gray-400 cursor-pointer hover:opacity-60 transition"
          onClick={() => setlookingForVehicle(false)}
        ></i>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-semibold text-center mt-6 mb-2 text-[#E23744]">
        🔍 Finding a Driver
      </h3>
      <p className="text-center text-gray-500 mb-5 text-sm">
        Hang tight — we’re matching you with the best ride
      </p>

      {/* Searching Animation */}
      <div className="flex justify-center mb-6">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-[#E23744] border-t-transparent"></div>
      </div>

      {/* Car Image */}
      <div className="flex justify-center mb-4">
        <img
          className="h-20 object-contain drop-shadow-md"
          src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy9iYWRmYjFkNi02YzJiLTQ1NTMtYjkyOS05ZmYzMmYwMmE1NWUucG5n"
          alt="Car"
        />
      </div>

      {/* Ride Details Card */}
      <div className="bg-[#FFF5F5] rounded-2xl p-4 space-y-4 border border-gray-200">

        {/* Pickup */}
        <div className="flex items-start gap-4">
          <div className="bg-[#FFE7E7] p-2 rounded-xl">
            <i className="ri-map-pin-fill text-2xl text-[#E23744]"></i>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">Pickup</h4>
            <p className="text-sm text-gray-500">{ride?.origin}</p>
          </div>
        </div>

        {/* Drop */}
        <div className="flex items-start gap-4 border-t border-gray-300 pt-3">
          <div className="bg-[#FFE7E7] p-2 rounded-xl">
            <i className="ri-navigation-fill text-2xl text-[#E23744]"></i>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">Drop</h4>
            <p className="text-sm text-gray-500">{ride?.destination}</p>
          </div>
        </div>

        {/* Fare */}
        <div className="flex items-start gap-4 border-t border-gray-300 pt-3">
          <div className="bg-[#FFE7E7] p-2 rounded-xl">
            <i className="ri-money-rupee-circle-fill text-2xl text-[#E23744]"></i>
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-900">₹{ride?.fare}</h4>
            <p className="text-sm text-gray-500">Cash Payment</p>
          </div>
        </div>
      </div>

      {/* Footer message */}
      <p className="text-center text-xs mt-4 text-gray-400">
        📡 Searching nearby captains...
      </p>
    </>
  );
};

export default LookingForDriver;
