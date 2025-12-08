import React from "react";

const WaitingForDriver = ({ ride, setWaitingForDriver, CancelRide, vehicleType }) => {
  const vehicleImages = {
    Car: "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy9iYWRmYjFkNi02YzJiLTQ1NTMtYjkyOS05ZmYzMmYwMmE1NWUucG5n",
    Moto: "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8yYzdmYTE5NC1jOTU0LTQ5YjItOWM2ZC1hM2I4NjAxMzcwZjUucG5n",
    Auto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRor72fdhJNar5p8b5iAmiwHtcY-c5XCd8nbvYwWgvVfy4Fmyt_9kB8-5kr8rWXdpO_DL0&usqp=CAU",
  };

  const vehicleImg = vehicleImages[vehicleType];

  return (
    <div className="backdrop-blur-xl bg-white/80 border border-gray-200 rounded-t-3xl p-6 animate-fadeIn">
      {/* Drag Handle */}
      <div className="w-16 h-[5px] bg-gray-300 rounded-full mx-auto mb-5"></div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-center text-black">
        Your Captain Is On The Way
      </h3>
      <p className="text-center text-gray-500 text-sm mt-1 mb-5">
        Please be ready at your pickup point
      </p>

      {/* Driver Card */}
      <div className="flex justify-between items-center bg-white/90 border border-gray-200 rounded-2xl p-4 mb-6">
        {/* Vehicle Image */}
        <img src={vehicleImg} alt="Vehicle" className="h-16 object-contain opacity-90" />

        {/* Driver Info */}
        {/* Driver Info */}
<div className="text-right">
  <p className="font-semibold text-lg text-black">
    {ride?.captain?.fullname?.firstname} {ride?.captain?.fullname?.lastname}
  </p>

  <p className="text-sm text-gray-500">
    {ride?.captain?.vehicle?.numberPlate}
  </p>

  {/* 👉 Tap to Call Button (No phone number shown) */}
  <a
    href={`tel:${ride?.captain?.phone}`}
    className="inline-block mt-2 bg-[#E23744] text-white text-xs px-4 py-2 rounded-lg active:scale-95 transition shadow-md"
  >
    Call Captain
  </a>

  <p className="mt-2 text-lg tracking-widest font-semibold text-[#E23744]">
    OTP: {ride?.otp}
  </p>
</div>

      </div>

      {/* Trip Summary */}
      <div className="bg-white/90 backdrop-blur-lg border border-gray-200 rounded-2xl p-5 space-y-5">
        {/* Pickup */}
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 bg-gray-100 rounded-xl flex items-center justify-center">
            <i className="ri-map-pin-user-fill text-[#E23744] text-xl"></i>
          </div>
          <div>
            <p className="font-medium text-black">Pickup</p>
            <p className="text-sm text-gray-600">{ride?.origin}</p>
          </div>
        </div>

        {/* Destination */}
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 bg-gray-100 rounded-xl flex items-center justify-center">
            <i className="ri-navigation-fill text-[#E23744] text-xl"></i>
          </div>
          <div>
            <p className="font-medium text-black">Destination</p>
            <p className="text-sm text-gray-600">{ride?.destination}</p>
          </div>
        </div>

        {/* Fare */}
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-gray-100 rounded-xl flex items-center justify-center">
            <i className="ri-money-rupee-circle-fill text-[#E23744] text-xl"></i>
          </div>
          <div>
            <p className="font-semibold text-lg text-black">₹{ride?.fare}</p>
            <p className="text-sm text-gray-600">Cash Payment</p>
          </div>
        </div>
      </div>

      {/* Live Indicator */}
      <div className="flex justify-center mt-6">
        <div className="flex items-center gap-2 text-gray-500 animate-pulse">
          <div className="h-3 w-3 bg-[#E23744] rounded-full"></div>
          <p className="text-sm">Captain is arriving...</p>
        </div>
      </div>

      {/* Cancel Button */}
      <button
        onClick={() => {
          setWaitingForDriver(false);
          CancelRide();
        }}
        className="w-full text-center mt-6 py-3 text-gray-500 text-sm hover:text-black active:scale-95 transition"
      >
        Cancel Ride
      </button>
    </div>
  );
};

export default WaitingForDriver;
