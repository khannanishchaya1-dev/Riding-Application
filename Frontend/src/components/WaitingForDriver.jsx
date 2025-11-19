import React from "react";

const WaitingForDriver = (props) => {
  return (
    <>
      <h5 className="p-1 text-center absolute w-[90%] top-0">
        <i
          onClick={() => props.setWaitingForDriver(false)}
          className="ri-arrow-down-s-line text-3xl text-gray-400"
        ></i>
      </h5>

      <div className="flex items-center justify-between">
        <img
          className="h-15 "
          src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy9iYWRmYjFkNi02YzJiLTQ1NTMtYjkyOS05ZmYzMmYwMmE1NWUucG5n"
          alt="Car Icon"
        ></img>
        <div className="text-right">
          <h2 className="text-lg font-medium">{`${props.ride?.captain?.fullname?.firstname ?? ""} ${props.ride?.captain?.fullname?.lastname ?? ""}`}</h2>
          <h4 className="text-lg text-gray-500 font-semibold">{props.ride?.captain?.vehicle.numberPlate}</h4>
          
          <h1 className="text-lg font-semibold">{"OTP:"+" "+props.ride?.otp}</h1>
        </div>
      </div>

      <div className="w-full">
        <div className="flex items-center gap-5 p-3 border-b-2  border-gray-300">
          <i className=" text-lg ri-user-location-fill"></i>
          <div className="flex flex-col">
            <h3 className="text-lg font-medium">562/11-A</h3>
            <p className="text-sm text-gray-500">{props.ride?.origin}</p>
          </div>
        </div>
        <div className="w-full">
          <div className="flex items-center gap-5 p-3 border-b-2  border-gray-300">
            <i className=" text-lg ri-user-location-fill"></i>
            <div className="flex flex-col">
              <h3 className="text-lg font-medium">562/11-A</h3>
              <p className="text-sm text-gray-500">{props.ride?.destination}</p>
            </div>
          </div>
        </div>
        <div className="w-full flex items-center gap-5 p-3">
          <i className="text-lg ri-money-rupee-circle-fill"></i>
          <div className="flex flex-col">
            <h3 className="text-lg font-medium">{props.ride?.fare}</h3>
            <p className="text-sm text-gray-500">Cash Payment</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default WaitingForDriver;
