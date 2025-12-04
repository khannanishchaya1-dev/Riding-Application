import React from "react";

const ConfirmedRide = ({
  vehicleType,
  fare,
  origin,
  destination,
  setconfirmRidepanel,
  setlookingForVehicle,
  setvehiclepanel,
  create_ride,
}) => {

  const vehicleImages = {
    car: "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy9iYWRmYjFkNi02YzJiLTQ1NTMtYjkyOS05ZmYzMmYwMmE1NWUucG5n",
    moto: "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8yYzdmYTE5NC1jOTU0LTQ5YjItOWM2ZC1hM2I4NjAxMzcwZjUucG5n",
    auto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRor72fdhJNar5p8b5iAmiwHtcY-c5XCd8nbvYwWgvVfy4Fmyt_9kB8-5kr8rWXdpO_DL0&usqp=CAU",
  };

  const vehicleImg = vehicleImages[vehicleType];

  const onConfirm = () => {
    create_ride(vehicleType);
    setvehiclepanel(false);
    setlookingForVehicle(true);
    setconfirmRidepanel(false);
  };

  return (
    <div className="backdrop-blur-xl bg-white/80 border border-gray-200 rounded-t-3xl p-6 animate-fadeIn">

      {/* Drag Handle */}
      <div className="w-14 h-[5px] bg-gray-300 rounded-full mx-auto mb-5" />

      {/* Title */}
      <h3 className="text-xl font-semibold text-black text-center mb-4">
        Confirm Your Ride
      </h3>

      {/* Vehicle */}
      <div className="flex justify-center mb-6">
        <img src={vehicleImg} alt={vehicleType} className="h-24 object-contain" />
      </div>

      {/* Ride Details */}
      <div className="bg-gray-100/60 border border-gray-300 rounded-2xl p-5 space-y-5">

        {/* Pickup */}
        <div className="flex gap-4">
          <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-gray-200/60">
            <i className="ri-map-pin-user-fill text-[#E23744] text-xl"></i>
          </div>
          <div>
            <p className="text-gray-900 font-medium">Pickup</p>
            <p className="text-gray-600 text-sm">{origin}</p>
          </div>
        </div>

        {/* Destination */}
        <div className="flex gap-4">
          <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-gray-200/60">
            <i className="ri-navigation-fill text-[#E23744] text-xl"></i>
          </div>
          <div>
            <p className="text-gray-900 font-medium">Destination</p>
            <p className="text-gray-600 text-sm">{destination}</p>
          </div>
        </div>

        {/* Fare */}
        <div className="flex gap-4">
          <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-gray-200/60">
            <i className="ri-money-rupee-circle-fill text-[#E23744] text-xl"></i>
          </div>
          <div>
            <p className="text-gray-900 font-semibold text-lg">₹{fare?.[vehicleType]}</p>
            <p className="text-gray-600 text-sm">Cash Payment</p>
          </div>
        </div>
      </div>

      {/* Confirm Button */}
      <button
        onClick={onConfirm}
        className="mt-6 w-full py-4 text-lg font-semibold bg-[#E23744] text-white rounded-xl transition active:scale-95 hover:bg-[#c62f39]"
      >
        Confirm Ride
      </button>

      {/* Cancel Option */}
      <button
        onClick={() => setconfirmRidepanel(false)}
        className="mt-3 w-full text-center py-3 text-gray-500 text-sm hover:text-black transition"
      >
        Cancel
      </button>
    </div>
  );
};

export default ConfirmedRide;
