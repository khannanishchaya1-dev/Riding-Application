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
  const handleLoginRedirect = () => {
    // optional: clear session
    localStorage.removeItem("token");
    localStorage.removeItem("captain");
    navigate("/captain-login");
  };
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
   <div className="h-[100dvh] w-full flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-200">

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
            <i className="ri-forbid-2-line text-3xl text-red-600"></i>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Account Blocked
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-4">
          Your <span className="font-semibold text-red-600">GadiGo Captain account</span> has been blocked by the admin.
        </p>

        <p className="text-sm text-gray-500 mb-6">
          Your captain account is currently blocked. You won’t be able to accept rides or receive payments until it’s unblocked.
        </p>

        {/* Support Info */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-600 mb-5">
          📞 Support: <span className="font-medium">support@gadigo.com</span>
          <br />
          🕒 Available: 10:00 AM – 6:00 PM
        </div>

        {/* Login Button */}
        <button
          onClick={handleLoginRedirect}
          className="w-full py-3 rounded-xl bg-black text-white font-semibold hover:bg-neutral-900 transition"
        >
          🔐 Go to Login
        </button>

        {/* Optional link style */}
        <p className="text-xs text-gray-400 mt-3">
          Try logging in again after your account is unblocked
        </p>
      </div>
    </div>
  );
};

export default Blocked;
