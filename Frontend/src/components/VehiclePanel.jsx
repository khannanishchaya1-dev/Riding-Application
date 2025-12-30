import React from "react";

const VehiclePanel = ({ fare, setvehiclepanel, setvehicleType, setconfirmRidepanel }) => {

  const handleVehicleSelection = (type) => {
    setvehicleType(type);
    setconfirmRidepanel(true);
    console.log("Selected vehicle type:", type);
  };

  const vehicles = [
    {
      id: "Car",
      name: "GadiGO Car",
      seats: 4,
      img: "https://www.svgrepo.com/show/408292/car-white.svg",
      desc: "Affordable, compact rides",
    },
    {
      id: "Moto",
      name: "GadiGO Moto",
      seats: 1,
      img: "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8yYzdmYTE5NC1jOTU0LTQ5YjItOWM2ZC1hM2I4NjAxMzcwZjUucG5n",
      desc: "Fast and budget friendly",
    },
    {
      id: "Auto",
      name: "GadiGO Auto",
      seats: 2,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRor72fdhJNar5p8b5iAmiwHtcY-c5XCd8nbvYwWgvVfy4Fmyt_9kB8-5kr8rWXdpO_DL0&usqp=CAU",
      desc: "Easy and iconic local rides",
    },
  ];

  return (
    <div className="px-2 select-none">

      {/* Handle Bar */}
      <div className="w-14 h-[5px] rounded-full bg-gray-300 mx-auto mb-4" />

      {/* Title */}
      <h3 className="text-xl font-semibold text-black text-center mb-5">
        Choose Your Ride
      </h3>

      {/* Ride Options */}
      <div className="space-y-4">
        {vehicles.map((v) => (
          <div
            key={v.id}
            onClick={() => handleVehicleSelection(v.id)}
            className="flex items-center justify-between bg-white/90 border border-gray-200 
              p-4 rounded-2xl backdrop-blur-lg cursor-pointer transition-all hover:bg-gray-200
              hover:shadow-md active:scale-[0.95]"
          >
            {/* Image */}
            <div className="rounded-xl bg-gray-100 p-2 flex items-center justify-center w-14 h-14">
              <img className="h-9 opacity-90" src={v.img} alt={v.name} />
            </div>

            {/* Details */}
            <div className="flex flex-col w-[55%]">
              <p className="font-medium text-[17px] text-black flex items-center gap-2">
                {v.name}
                <span className="text-black text-sm flex items-center gap-1">
                  <i className="ri-user-fill text-[15px]"></i>
                  {v.seats}
                </span>
              </p>
              <p className="text-gray-600 text-sm">{v.desc}</p>
              <p className="text-[12px] text-gray-400">2 min away</p>
            </div>

            {/* Price */}
            <p className="text-lg font-bold text-black">
              ₹{fare?.[v.id] ?? "--"}
            </p>
          </div>
        ))}
      </div>

      {/* Close Button */}
      <button
        onClick={() => setvehiclepanel(false)}
        className="mt-6 w-full text-center py-3 text-gray-600 hover:text-black 
          hover:scale-[1.02] active:scale-[0.96] transition font-medium"
      >
        Cancel
      </button>
    </div>
  );
};

export default VehiclePanel;
