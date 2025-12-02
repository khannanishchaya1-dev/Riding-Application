import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSocket } from "../UserContext/SocketContext";
import LiveTracking from "../components/LiveTracking";
import toast from "react-hot-toast";

const Riding = () => {
  const location = useLocation();
  const { ride } = location.state || {};
  const { receiveMessage } = useSocket();
  const navigate = useNavigate();

  toast.success("🚕 Your ride has started — enjoy!");

  React.useEffect(() => {
    receiveMessage("end-ride", () => {
      toast.success("🎉 Ride completed — thank you!");
      navigate("/home");
    });
  }, [receiveMessage, navigate]);

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-[#FCEDEE]">

      {/* Home Button */}
      <Link
        to="/home"
        className="fixed right-4 top-4 h-11 w-11 bg-white flex items-center justify-center rounded-full shadow-lg z-20 hover:scale-105 transition"
      >
        <i className="text-xl ri-home-5-line text-[#E23744]"></i>
      </Link>

      {/* Top Map Section */}
      <div className="h-[50%] w-full overflow-hidden rounded-b-3xl shadow-md">
        <LiveTracking />
      </div>

      {/* Bottom Card */}
      <div className="h-[50%] w-full p-5 flex flex-col justify-between bg-white rounded-t-3xl shadow-2xl border-t-4 border-[#E23744]">

        {/* Captain / Vehicle Info */}
        <div className="flex items-center justify-between bg-[#FFF5F5] rounded-2xl p-4 shadow-sm">
          <img
            className="h-16 w-24 object-contain drop-shadow-md"
            src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy9iYWRmYjFkNi02YzJiLTQ1NTMtYjkyOS05ZmYzMmYwMmE1NWUucG5n"
            alt="Vehicle"
          />

          <div className="text-right">
            <h2 className="text-xl font-semibold text-gray-900">
              {ride?.captain.fullname.firstname} {ride?.captain.fullname.lastname}
            </h2>
            <p className="text-gray-500">{ride?.captain.vehicle.numberPlate}</p>
            <p className="text-sm text-gray-500">{ride?.captain.vehicle.vehicleModel}</p>
          </div>
        </div>

        {/* Ride Info */}
        <div className="space-y-4 bg-[#F8F8F8] rounded-3xl border border-gray-200 p-4">

          {/* Destination */}
          <div className="flex items-start gap-4">
            <div className="bg-[#FFE7E7] p-2 rounded-xl shadow-sm">
              <i className="ri-navigation-fill text-[#E23744] text-2xl"></i>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 text-lg">Destination</h3>
              <p className="text-sm text-gray-500">{ride?.destination}</p>
            </div>
          </div>

          {/* Fare */}
          <div className="flex items-center gap-4">
            <div className="bg-[#FFE7E7] p-2 rounded-xl shadow-sm">
              <i className="ri-money-rupee-circle-fill text-[#E23744] text-2xl"></i>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900">₹{ride?.fare}</h3>
              <p className="text-sm text-gray-500">Estimated total</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button className="w-full bg-[#E23744] text-white text-lg font-semibold rounded-2xl py-4 tracking-wide hover:bg-[#c82c35] active:scale-[0.98] transition">
          💵 Make Payment
        </button>
      </div>
    </div>
  );
};

export default Riding;
