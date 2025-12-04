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

  React.useEffect(() => {
    toast.success("🚕 Ride Started");

    receiveMessage("end-ride", () => {
      toast.success("🎉 Ride Completed — Thank you!");
      navigate("/home");
    });
  }, [receiveMessage, navigate]);

  return (
    <div className="h-[100dvh] w-full relative">

      {/* Home Button */}
      <Link
        to="/home"
        className="absolute right-5 top-5 h-11 w-11 bg-white flex items-center justify-center 
                   rounded-full shadow-md z-20 hover:scale-105 transition"
      >
        <i className="text-xl ri-home-5-line text-[#E23744]" />
      </Link>

      {/* Full Map */}
      <div className="h-[100dvh] w-full absolute inset-0">
        <LiveTracking />
      </div>

      {/* Bottom Ride Panel */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl 
                      shadow-[0_-8px_28px_rgba(0,0,0,0.18)] border-t border-gray-200 p-6 space-y-5">

        {/* Drag Handle */}
        <div className="w-14 h-[4px] bg-gray-300 rounded-full mx-auto" />

        {/* Driver/Vehicle Card */}
        <div className="flex justify-between items-center bg-[#F9F9F9] border border-gray-200 rounded-2xl p-4">
          <img
            src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy9iYWRmYjFkNi02YzJiLTQ1NTMtYjkyOS05ZmYzMmYwMmE1NWUucG5n"
            className="h-16 object-contain"
            alt="Vehicle"
          />

          <div className="text-right">
            <p className="font-semibold text-lg text-gray-900">
              {ride?.captain?.fullname?.firstname} {ride?.captain?.fullname?.lastname}
            </p>
            <p className="text-sm text-gray-500">{ride?.captain?.vehicle?.numberPlate}</p>
            <p className="text-sm text-gray-500">{ride?.captain?.vehicle?.vehicleModel}</p>
          </div>
        </div>

        {/* Ride Details */}
        <div className="bg-[#F9F9F9] border border-gray-200 rounded-2xl p-4 space-y-4">

          {/* Destination */}
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center border border-gray-200">
              <i className="ri-navigation-fill text-[#E23744] text-lg" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Destination</p>
              <p className="text-sm text-gray-600">{ride?.destination}</p>
            </div>
          </div>

          {/* Fare */}
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center border border-gray-200">
              <i className="ri-money-rupee-circle-fill text-[#E23744] text-lg" />
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-900">₹{ride?.fare}</p>
              <p className="text-sm text-gray-600">Estimated total</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button className="w-full py-4 bg-[#E23744] text-white rounded-xl text-lg font-semibold 
                           tracking-wide hover:bg-[#c32c36] active:scale-[0.97] transition">
          💳 Make Payment
        </button>
      </div>
    </div>
  );
};

export default Riding;
