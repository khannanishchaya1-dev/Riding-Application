import React from "react";
import { Link } from "react-router-dom";

const Riding = () => {
  return (
    <div className="h-full w-full">
      <Link to='/home' className="fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full"><i className=" text-lg font-medium ri-home-5-line"></i>
      </Link>
      <div className="h-1/2">
        <img
          className="object-cover w-full h-full"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt="Uber animation"
        />
      </div>
      <div className="h-1/2 p-5">
        <div className="flex items-center justify-between">
          <img
            className="h-15 "
            src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy9iYWRmYjFkNi02YzJiLTQ1NTMtYjkyOS05ZmYzMmYwMmE1NWUucG5n"
            alt="Car Icon"
          ></img>
          <div className="text-right">
            <h2 className="text-lg font-medium">Nishchaya Khanna</h2>
            <h4 className="text-lg text-gray-500 font-semibold">
              MP04 AB 1234
            </h4>
            <p className="text-sm text-gray-500">Hyundai Creta</p>
          </div>
        </div>

        <div className="w-full">
          <div className="w-full">
            <div className="flex items-center gap-5 p-3 border-b-2  border-gray-300">
              <i className=" text-lg ri-user-location-fill"></i>
              <div className="flex flex-col">
                <h3 className="text-lg font-medium">562/11-A</h3>
                <p className="text-sm text-gray-500">Sector 62, Noida</p>
              </div>
            </div>
          </div>
          <div className="w-full flex items-center gap-5 p-3">
            <i className="text-lg ri-money-rupee-circle-fill"></i>
            <div className="flex flex-col">
              <h3 className="text-lg font-medium">$193</h3>
              <p className="text-sm text-gray-500">Cash Payment</p>
            </div>
          </div>
        </div>
        <button className="w-full bg-green-600 text-white font-semibold rounded-lg px-2 py-2 mt-5">Make a Payment</button>
      </div>
    </div>
  );
};

export default Riding;
