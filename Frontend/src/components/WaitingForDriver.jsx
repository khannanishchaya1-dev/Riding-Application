import React from "react";

const WaitingForDriver = (props) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border-t-4 border-[#E23744] animate-fadeIn">

      {/* Close Button */}
      <div className="text-center">
        <i
          onClick={() => props.setWaitingForDriver(false)}
          className="ri-arrow-down-s-line text-3xl text-gray-400 hover:text-black cursor-pointer transition"
        ></i>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-center text-[#E23744] mt-2 tracking-tight">
        Your Captain is on the way 🚕
      </h3>

      {/* Driver Card */}
      <div className="flex items-center justify-between bg-[#FFF5F5] rounded-2xl p-4 shadow-sm mt-6">
        
        {/* Driver Image / Vehicle */}
        <img
          className="h-16 w-24 object-contain drop-shadow-md"
          src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy9iYWRmYjFkNi02YzJiLTQ1NTMtYjkyOS05ZmYzMmYwMmE1NWUucG5n"
          alt="Vehicle"
        />

        {/* Driver Details */}
        <div className="text-right">
          <h2 className="font-semibold text-lg text-gray-900">
            {`${props.ride?.captain?.fullname?.firstname ?? ""} ${props.ride?.captain?.fullname?.lastname ?? ""}`}
          </h2>
          <p className="text-md text-gray-500">{props?.ride?.captain?.vehicle?.numberPlate}</p>

          {/* OTP */}
          <p className="mt-1 text-lg font-bold text-[#E23744] tracking-widest">
            OTP: {props.ride?.otp}
          </p>
        </div>
      </div>

      {/* Trip Summary */}
      <div className="bg-[#F8F8F8] rounded-3xl p-4 border border-gray-200 mt-6 space-y-4">

        {/* Pickup */}
        <div className="flex items-start gap-4">
          <div className="bg-[#FFE7E7] rounded-xl p-2 shadow-sm">
            <i className="ri-map-pin-user-fill text-[#E23744] text-2xl"></i>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Pickup</h4>
            <p className="text-sm text-gray-500">{props?.ride?.origin}</p>
          </div>
        </div>

        {/* Destination */}
        <div className="flex items-start gap-4">
          <div className="bg-[#FFE7E7] rounded-xl p-2 shadow-sm">
            <i className="ri-navigation-fill text-[#E23744] text-2xl"></i>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Drop</h4>
            <p className="text-sm text-gray-500">{props?.ride?.destination}</p>
          </div>
        </div>

        {/* Fare */}
        <div className="flex items-center gap-4">
          <div className="bg-[#FFE7E7] rounded-xl p-2 shadow-sm">
            <i className="ri-money-rupee-circle-fill text-[#E23744] text-2xl"></i>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 text-lg">₹{props?.ride?.fare}</h4>
            <p className="text-sm text-gray-500">Cash Payment</p>
          </div>
        </div>
      </div>

      {/* Searching Pulse Text */}
      <div className="flex justify-center mt-6">
        <div className="flex items-center gap-2 text-gray-600 animate-pulse">
          <div className="h-3 w-3 bg-[#E23744] rounded-full"></div>
          <p>Waiting for captain to arrive...</p>
        </div>
      </div>
    </div>
  );
};

export default WaitingForDriver;
