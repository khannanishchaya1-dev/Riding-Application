import React from "react";

const ConfirmedRide = (props) => {

  const handleConfirmRide = () => {
    props.create_ride(props.vehicleType);
    props.setvehiclepanel(false);
    console.log("ride is confirmed");
  };

  const vehicleImages = {
    car: "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy9iYWRmYjFkNi02YzJiLTQ1NTMtYjkyOS05ZmYzMmYwMmE1NWUucG5n",
    moto: "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8yYzdmYTE5NC1jOTU0LTQ5YjItOWM2ZC1hM2I4NjAxMzcwZjUucG5n",
    auto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRor72fdhJNar5p8b5iAmiwHtcY-c5XCd8nbvYwWgvVfy4Fmyt_9kB8-5kr8rWXdpO_DL0&usqp=CAU",
  };

  const vehicleImageSrc = vehicleImages[props.vehicleType] || vehicleImages.car;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border-t-4 border-[#E23744] animate-fadeIn">

      {/* Close Button */}
      <div className="text-center">
        <i
          onClick={() => props.setconfirmRidepanel(false)}
          className="ri-arrow-down-s-line text-3xl text-gray-400 hover:text-black cursor-pointer transition"
        ></i>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-[#E23744] tracking-tight text-center mb-4">
        Confirm Your Ride
      </h3>

      {/* Vehicle Image */}
      <div className="flex justify-center mb-5">
        <img
          className="h-24 w-auto drop-shadow-md"
          src={vehicleImageSrc}
          alt={props.vehicleType}
        />
      </div>

      {/* Summary Box */}
      <div className="bg-[#F8F8F8] rounded-3xl border border-gray-200 p-4 space-y-4">

        {/* Pickup */}
        <div className="flex gap-4 items-start">
          <div className="bg-[#FFE7E7] p-2 rounded-xl shadow-sm">
            <i className="ri-map-pin-user-fill text-[#E23744] text-2xl"></i>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">Pickup</h3>
            <p className="text-sm text-gray-600">{props.origin}</p>
          </div>
        </div>

        {/* Destination */}
        <div className="flex gap-4 items-start">
          <div className="bg-[#FFE7E7] p-2 rounded-xl shadow-sm">
            <i className="ri-navigation-fill text-[#E23744] text-2xl"></i>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">Destination</h3>
            <p className="text-sm text-gray-600">{props.destination}</p>
          </div>
        </div>

        {/* Fare */}
        <div className="flex gap-4 items-center">
          <div className="bg-[#FFE7E7] p-2 rounded-xl shadow-sm">
            <i className="ri-money-rupee-circle-fill text-[#E23744] text-2xl"></i>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              ₹{props.fare[props.vehicleType]}
            </h3>
            <p className="text-sm text-gray-600">Cash Payment</p>
          </div>
        </div>
      </div>

      {/* Confirm Button */}
      <button
        onClick={() => {
          props.setlookingForVehicle(true);
          props.setconfirmRidepanel(false);
          handleConfirmRide();
        }}
        className="mt-6 w-full bg-[#E23744] text-white font-semibold rounded-2xl py-4 text-lg tracking-wide hover:bg-[#c82c35] transition active:scale-[0.97]"
      >
        🚕 Confirm Ride
      </button>
    </div>
  );
};

export default ConfirmedRide;
