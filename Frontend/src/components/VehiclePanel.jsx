import React from "react";

const VehiclePanel = (props) => {
  const handleVehicleSelection = (type) => {
    props.setvehicleType(type);
    props.setconfirmRidepanel(true);
  };

  const vehicles = [
    {
      id: "car",
      name: "WheelzyGo",
      seats: 4,
      img: "https://www.svgrepo.com/show/408292/car-white.svg",
      desc: "Affordable, Compact rides",
    },
    {
      id: "moto",
      name: "Moto",
      seats: 1,
      img: "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8yYzdmYTE5NC1jOTU0LTQ5YjItOWM2ZC1hM2I4NjAxMzcwZjUucG5n",
      desc: "Quick, cost-effective ride",
    },
    {
      id: "auto",
      name: "Wheelzy Auto",
      seats: 2,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRor72fdhJNar5p8b5iAmiwHtcY-c5XCd8nbvYwWgvVfy4Fmyt_9kB8-5kr8rWXdpO_DL0&usqp=CAU",
      desc: "Affordable, Desi style",
    },
  ];

  return (
    <>
      {/* Close button */}
      <h5 className="text-center absolute w-[90%] top-0">
        <i
          onClick={() => props.setvehiclepanel(false)}
          className="ri-arrow-down-s-line text-3xl text-gray-400 cursor-pointer hover:text-black transition"
        ></i>
      </h5>

      {/* Heading */}
      <h3 className="text-2xl font-bold mb-5 text-[#E23744] tracking-tight">Select Your Ride</h3>

      {/* Cards */}
      {vehicles.map((v) => (
        <div
          key={v.id}
          onClick={() => handleVehicleSelection(v.id)}
          className="flex items-center justify-between w-full p-4 mb-3 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl active:scale-[0.97] transition-all cursor-pointer"
        >
          {/* Image */}
          <div className="rounded-2xl bg-[#FFF5F5] p-2 w-[60px] h-[60px] flex items-center justify-center">
            <img className="h-10" src={v.img} alt={v.name} />
          </div>

          {/* Content */}
          <div className="w-1/2 px-3">
            <h4 className="font-semibold text-lg text-gray-800">
              {v.name} <span className="text-[#E23744] text-sm"><i className="ri-user-fill"></i>{v.seats}</span>
            </h4>
            <p className="text-sm text-gray-600">🚀 {v.desc}</p>
            <p className="text-[12px] text-gray-400">⏱ 2 mins away</p>
          </div>

          {/* Price */}
          <div className="text-xl font-bold text-[#E23744]">
            ₹{props?.fare?.[v.id] ?? "--"}
          </div>
        </div>
      ))}
    </>
  );
};

export default VehiclePanel;
