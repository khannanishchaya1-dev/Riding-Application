import React, { useEffect, useContext } from "react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { useSocket } from "../UserContext/SocketContext";
import { UserDataContext } from "../UserContext/UserContext";

const Blocked = () => {
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { setUser } = useContext(UserDataContext);

  useEffect(() => {
    if (!socket) return;

    const handleUnblock = (data) => {
      // 🔓 ONLY handle UNBLOCK here
      if (!data.blocked) {
        toast.success("✅ Your account has been unblocked");

        const storedUser = JSON.parse(localStorage.getItem("user")) || {};
        const updatedUser = { ...storedUser, blocked: false };

        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);

        navigate("/home", { replace: true });
      }
    };

    socket.on("user-block-status", handleUnblock);

    return () => {
      socket.off("user-block-status", handleUnblock);
    };
  }, [socket, navigate, setUser]);

  const handleLoginRedirect = () => {
    // optional: clear session
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

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
          Your <span className="font-semibold text-red-600">GadiGo Passenger account</span> has been blocked by the admin.
        </p>

        <p className="text-sm text-gray-500 mb-6">
          🚫 You will not be able to book rides, request captains, or make payments until your account is unblocked.
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
