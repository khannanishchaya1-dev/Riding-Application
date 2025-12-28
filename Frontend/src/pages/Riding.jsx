import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSocket } from "../UserContext/SocketContext";
import LiveTracking from "../components/LiveTrackingOngoing";
import toast from "react-hot-toast";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

const Riding = () => {
  const location = useLocation();
  const [ride, setride] = useState(() => {
    const storedRide = localStorage.getItem("activeRide");
    return storedRide ? JSON.parse(storedRide) : location.state?.ride || null;
});

  const { receiveMessage,sendMessage,socket,offMessage } = useSocket();
  const navigate = useNavigate();
  const vehicleImages = {
    Car: "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy9iYWRmYjFkNi02YzJiLTQ1NTMtYjkyOS05ZmYzMmYwMmE1NWUucG5n",
    Moto: "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8yYzdmYTE5NC1jOTU0LTQ5YjItOWM2ZC1hM2I4NjAxMzcwZjUucG5n",
    Auto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRor72fdhJNar5p8b5iAmiwHtcY-c5XCd8nbvYwWgvVfy4Fmyt_9kB8-5kr8rWXdpO_DL0&usqp=CAU",
  };

  const vehicleImg = vehicleImages[ride?.vehicleType];
useEffect(() => {
  if (!socket || !ride?._id) return;

  console.log("👤 USER joining ride room:", ride._id);
  sendMessage("join-ride", { rideId: ride._id });

}, [socket, ride?._id]);
useEffect(() => {
  if (!socket || !receiveMessage || !ride?._id) return;

  const event = `location-update-${ride._id}`;
  console.log("📡 USER listening for GPS:", event);

  const handler = (data) => {
    console.log("📬 USER RECEIVED GPS:", data);  // <--- MUST SHOW
  };

  receiveMessage(event, handler);

  return () => offMessage?.(event, handler);
}, [socket, receiveMessage, ride?._id]);



React.useEffect(() => {
  if (ride) {
    localStorage.setItem("activeRide", JSON.stringify(ride));
  }
}, [ride]);
useEffect(() => {
  return () => {
    localStorage.removeItem("activeRide");
  };
}, []);

 React.useEffect(() => {
  if (!receiveMessage) return;

  const paymentHandler = (data) => {
    toast.success("💳 Payment completed");
    setride(prev => ({ ...prev, ...data })); // merge instead of replace
  };

  receiveMessage("payment-status-updated", paymentHandler);

  receiveMessage("end-ride", () => {
    localStorage.removeItem("activeRide");
    toast.success("🎉 Ride Completed — Thank you!");
    navigate("/home");
  });

 

}, [receiveMessage, navigate]);

// 🚗 Listen to captain live GPS on USER side



  // ⭐ Razorpay Payment Handler
  const handlePayment = async () => {
  try {

    const token = localStorage.getItem("token"); // 👈 get token

    // 1️⃣ Create Razorpay order from backend
    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}payment/create-order`,
      { amount: ride.fare * 100 },
      {
        headers: {
          Authorization: `Bearer ${token}`, // 👈 send token
        },
      }
    );

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: data.amount,
      currency: "INR",
      name: "GadiGo",
      description: "Ride Payment",
      order_id: data.id,
      image: "/favicon.svg",

      handler: async function (response) {
        // 2️⃣ Verify Payment with backend
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}payment/verify`,
          {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            rideId: ride._id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // 👈 include token again
            },
          }
        );

        toast.success("🎉 Payment Successful!");
        setride(prevRide => ({ ...prevRide, paymentStatus: "PAID" })); // Update local ride state
        
      },

      theme: { color: "#E23744" },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();

  } catch (error) {
    toast.error("❌ Payment failed! Try again.");
    ride.paymentStatus = "FAILED";
    console.error(error);
  }
};

const getPaymentBadge = () => {
  const status = ride?.paymentStatus;

  switch (status) {
    case "PAID":
      return (
        <span className="ml-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold flex items-center gap-1">
          <i className="ri-check-double-fill" /> Paid
        </span>
      );

    case "FAILED":
      return (
        <span className="ml-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold flex items-center gap-1">
          <i className="ri-close-circle-fill" /> Failed
        </span>
      );

    default:
      return (
        <span className="ml-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-600 text-xs font-semibold flex items-center gap-1">
          <i className="ri-time-fill" /> Pending
        </span>
      );
  }
};


 return (
  <div className="h-[100dvh] w-full flex flex-col relative">

    {/* Top Home Button */}
    <Link
      to="/home"
      onClick={() => localStorage.removeItem('activeRide')}
      className="absolute right-5 top-5 h-11 w-11 bg-white flex items-center justify-center 
                  rounded-full shadow-md z-20 hover:scale-105 transition"
    >
      <i className="text-xl ri-home-5-line text-[#E23744]" />
    </Link>

    {/* 🚗 Map Section (50% Height) */}
    <div className="h-[50vh] w-full">
      
    <LiveTracking
      origin={ride?.originCoordinates}
      destination={ride?.destinationCoordinates}
      rideId={ride?._id}
      receiveMessage={receiveMessage}
      socket={socket}
      offMessage={offMessage}
    />
  
    </div>

    {/* 📌 Bottom Ride Details Panel (50% height) */}
    <div className="h-[50vh] w-full bg-white rounded-t-3xl 
                    shadow-[0_-8px_28px_rgba(0,0,0,0.18)] border-t border-gray-200 
                    flex flex-col p-6 space-y-5 overflow-y-auto no-scrollbar">

      {/* Drag Handle */}
      <div className="w-14 h-[4px] bg-gray-300 rounded-full mx-auto" />

      {/* Driver / Vehicle Card */}
      <div className="flex justify-between items-center bg-[#F9F9F9] border border-gray-200 rounded-2xl p-4">
        <img
          src={vehicleImg}
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

      {/* Ride Info */}
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
            <div className="flex items-center gap-2">
              <p className="text-xl font-semibold text-gray-900">₹{ride?.fare}</p>
              {getPaymentBadge()}
            </div>
            <p className="text-sm text-gray-600">Estimated total</p>
          </div>
        </div>

      </div>

      {/* CTA Button */}
      <button
        disabled={ride?.paymentStatus === "PAID"}
        onClick={handlePayment}
        className={`w-full py-4 rounded-xl text-lg font-semibold transition ${
          ride?.paymentStatus === "PAID"
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-[#E23744] text-white hover:bg-[#c32c36]"
        }`}
      >
        {ride?.paymentStatus === "PAID" ? "✔ Payment Completed" : "💳 Make Payment"}
      </button>
    </div>
  </div>
);
};

export default Riding;
