import React from "react";

const LookingForDriver = ({ ride, setlookingForVehicle }) => {
  const vehicleImages = {
    Car: "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy9iYWRmYjFkNi02YzJiLTQ1NTMtYjkyOS05ZmYzMmYwMmE1NWUucG5n",
    Moto: "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8yYzdmYTE5NC1jOTU0LTQ5YjItOWM2ZC1hM2I4NjAxMzcwZjUucG5n",
    Auto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRor72fdhJNar5p8b5iAmiwHtcY-c5XCd8nbvYwWgvVfy4Fmyt_9kB8-5kr8rWXdpO_DL0&usqp=CAU",
  };

  const vehicleImg = vehicleImages[ride?.vehicleType];
  return (
    <div className="px-3">

      {/* Drag Handle */}
      <div className="w-14 h-[5px] rounded-full bg-gray-300 mx-auto mt-1 mb-5"></div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-center text-black">
        Looking for a Driver
      </h3>
      <p className="text-center text-gray-500 text-sm mb-6">
        Matching you with the nearest available driver...
      </p>

      {/* Loading Spinner */}
      <div className="flex justify-center mb-5">
        <div className="animate-spin rounded-full h-14 w-14 border-[3px] border-[#E23744] border-x-transparent border-t-transparent"></div>
      </div>

      {/* Car Image */}
      <div className="flex justify-center mb-6">
        <img
          src={vehicleImg}
          alt="Searching Car"
          className="h-22 object-contain opacity-90"
        />
      </div>

      {/* Ride Details Box */}
      <div className="bg-white/85 backdrop-blur-xl border border-gray-200 rounded-2xl p-5 space-y-5">

        {/* Pickup */}
        <div className="flex gap-4">
          <div className="h-12 w-12 bg-gray-100 flex items-center justify-center rounded-xl">
            <i className="ri-map-pin-user-fill text-[#E23744] text-xl"></i>
          </div>
          <div>
            <p className="font-medium text-black text-sm">Pickup</p>
            <p className="text-gray-600 text-sm">{ride?.origin}</p>
          </div>
        </div>

        {/* Drop */}
        <div className="flex gap-4">
          <div className="h-12 w-12 bg-gray-100 flex items-center justify-center rounded-xl">
            <i className="ri-navigation-fill text-[#E23744] text-xl"></i>
          </div>
          <div>
            <p className="font-medium text-black text-sm">Destination</p>
            <p className="text-gray-600 text-sm">{ride?.destination}</p>
          </div>
        </div>

        {/* Fare */}
        <div className="flex gap-4">
          <div className="h-12 w-12 bg-gray-100 flex items-center justify-center rounded-xl">
            <i className="ri-money-rupee-circle-fill text-[#E23744] text-xl"></i>
          </div>
          <div>
            <p className="text-lg font-semibold text-black">₹{ride?.fare}</p>
            <p className="text-gray-600 text-sm">Cash Payment</p>
          </div>
        </div>
      </div>

      {/* Footer Hint */}
      <p className="text-center text-gray-400 text-xs mt-5">
        ⏳ Please wait — driver acceptance may take a moment
      </p>

      {/* Cancel */}
      <button
        onClick={() => { setlookingForVehicle(false); localStorage.removeItem("activeRide"); }}
        className="w-full mt-5 py-3 rounded-xl text-gray-500 text-sm hover:text-black transition active:scale-95"
      >
        Cancel Search
      </button>
    </div>
  );
};

export default LookingForDriver;
