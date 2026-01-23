import React from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSocket } from "../UserContext/SocketContext";
import { CaptainDataContext } from "../UserContext/CaptainContext";


const Blocked = () => {
  const [ , setCaptainData] = React.useContext(CaptainDataContext);
  const navigate = useNavigate();
  const { socket, sendMessage, receiveMessage, offMessage } = useSocket();
  useEffect(() => {
    if (!socket) return;

    const handleBlockStatus = (data) => {
      if(!data.blocked){
      toast.success(data.message);
      }

      if (data.blocked) {
        const captainData = JSON.parse(localStorage.getItem("captain")) || {};
      const updatedCaptain = {
        ...captainData,
        blocked: true,
      };
      setCaptainData(updatedCaptain);
      localStorage.setItem("captain", JSON.stringify(updatedCaptain));
        
        navigate("/captain-blocked");
      }else{
        const captainData = JSON.parse(localStorage.getItem("captain")) || {};
      const updatedCaptain = {
        ...captainData,
        blocked: false,
      };
      setCaptainData(updatedCaptain);
      localStorage.setItem("captain", JSON.stringify(updatedCaptain));
        navigate("/captain-home");
      }
    };

    socket.on("captain-block-status", handleBlockStatus);

    // 🧹 cleanup to avoid duplicate listeners
    return () => {
      socket.off("captain-block-status", handleBlockStatus);
    };
  }, [socket, navigate]);
  return (
    <div className="h-[100dvh] w-full flex items-center justify-center bg-gray-50">
      
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 text-center 
                      border border-gray-200 animate-fadeIn">

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center 
                          animate-pulse">
            <i className="ri-forbid-2-line text-3xl text-red-600"></i>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Account Blocked
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-4 leading-relaxed">
          Your <span className="font-semibold text-red-600">GadiGo Captain account</span> has been blocked by the admin.
        </p>

        <p className="text-sm text-gray-500 mb-6">
          🚫 You will <span className="font-medium text-gray-700">not be able to book rides</span>, 
          request captains, or make payments until your account is unblocked.
        </p>

        {/* Support Info */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-600">
          📞 Support: <span className="font-medium">support@gadigo.com</span>
          <br />
          🕒 Available: 10:00 AM – 6:00 PM
        </div>

      </div>
    </div>
  );
};

export default Blocked;
