import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSocket } from "../UserContext/SocketContext";
import LiveTracking from "../components/LiveTracking";
import WheelzyLogo from "../assets/wheelzy.svg";

const Riding = () => {
  const location = useLocation();
  const { ride } = location.state || {};
  const { receiveMessage } = useSocket();
  const navigate = useNavigate();

  // Navigate home when ride ends
  React.useEffect(() => {
    receiveMessage("end-ride", () => {
      navigate("/home");
    });
  }, [receiveMessage, navigate]);

  return (
    <div className="h-screen w-full flex flex-col bg-gray-50">
      {/* Home Button */}
      <Link
        to="/home"
        className="fixed right-4 top-4 h-10 w-10 bg-white flex items-center justify-center rounded-full shadow-md z-20"
      >
        <i className="text-lg font-medium ri-home-5-line"></i>
      </Link>

      {/* Live Tracking Map */}
      <div className="h-1/2 w-full bg-amber-500">

        <LiveTracking />
      </div>

      {/* Ride Details */}
      <div className="h-1/2 w-full p-4 sm:p-6 flex flex-col justify-between">
        {/* Captain Info */}
        <div className="flex items-center justify-between mb-4">
          <img
            className="h-20 w-20 sm:h-20 sm:w-20 rounded-lg"
            src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy9iYWRmYjFkNi02YzJiLTQ1NTMtYjkyOS05ZmYzMmYwMmE1NWUucG5n"
            alt="Car Icon"
          />
          <div className="text-right flex-1 ml-3">
            <h2 className="text-lg sm:text-xl font-medium">
              {ride?.captain.fullname.firstname} {ride?.captain.fullname.lastname}
            </h2>
            <h4 className="text-md sm:text-lg text-gray-500 font-semibold">
              {ride?.captain.vehicle.numberPlate}
            </h4>
            <p className="text-sm sm:text-md text-gray-500">Hyundai Creta</p>
          </div>
        </div>

        {/* Ride Info */}
        <div className="flex flex-col gap-4">
          {/* Destination */}
          <div className="flex items-center gap-3 p-3 border-b border-gray-300">
            <i className="text-xl ri-user-location-fill"></i>
            <div className="flex flex-col">
              <h3 className="text-md sm:text-lg font-medium">Have you reached</h3>
              <p className="text-sm sm:text-md text-gray-500">{ride?.destination}</p>
            </div>
          </div>

          {/* Fare */}
          <div className="flex items-center gap-3 p-3">
            <i className="text-xl ri-money-rupee-circle-fill"></i>
            <div className="flex flex-col">
              <h3 className="text-md sm:text-lg font-medium">{ride?.fare}</h3>
              <p className="text-sm sm:text-md text-gray-500">Estimated Fare</p>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <button className="w-full bg-green-600 text-white font-semibold rounded-lg px-3 py-3 mt-4 sm:mt-6 hover:bg-green-700 transition">
          Make a Payment
        </button>
      </div>
    </div>
  );
};

export default Riding;
