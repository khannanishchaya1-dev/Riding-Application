import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSocket } from "../UserContext/SocketContext";
import LiveTracking from "../components/LiveTrackingOngoing";
import toast from "react-hot-toast";
import axios from "axios";
const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => {
      console.log("✅ Razorpay SDK loaded");
      resolve(true);
    };

    script.onerror = () => {
      console.error("❌ Razorpay SDK failed to load");
      resolve(false);
    };

    document.body.appendChild(script);
  });
};


const Riding = () => {
  const location = useLocation();
  const [ride, setride] = useState(() => {
    const storedRide = localStorage.getItem("activeRide");
    return storedRide ? JSON.parse(storedRide) : location.state?.ride || null;
  });

  const { receiveMessage, sendMessage, socket, offMessage } = useSocket();
  const navigate = useNavigate();

  const vehicleImages = {
    Car: "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy9iYWRmYjFkNi02YzJiLTQ1NTMtYjkyOS05ZmYzMmYwMmE1NWUucG5n",
    Moto: "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8yYzdmYTE5NC1jOTU0LTQ5YjItOWM2ZC1hM2I4NjAxMzcwZjUucG5n",
    Auto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRor72fdhJNar5p8b5iAmiwHtcY-c5XCd8nbvYwWgvVfy4Fmyt_9kB8-5kr8rWXdpO_DL0&usqp=CAU",
  };

  const vehicleImg = vehicleImages[ride?.vehicleType];
  useEffect(() => {
  if (!receiveMessage || !offMessage) return;

  const handler = (data) => {
    setride((prev) => {
      const updated = { ...prev, ...data };
      localStorage.setItem("activeRide", JSON.stringify(updated));
      return updated;
    });
  };

  receiveMessage("payment-status-updated", handler);

  return () => {
    offMessage("payment-status-updated", handler);
  };
}, [receiveMessage, offMessage]);


  useEffect(() => {
  const fetchRideStatus = async () => {
    if (!ride?._id) return;

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}rides/${ride._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setride(data); // this updates paymentStatus reliably
    } catch (err) {
      console.error("Failed to sync ride status", err);
    }
  };

  fetchRideStatus();
}, []);


  // 🚗 Join ride room
  useEffect(() => {
    if (!socket || !ride?._id) return;
    sendMessage("join-ride", { rideId: ride._id });
  }, [socket, ride?._id]);

  // 📡 GPS update listener
  useEffect(() => {
    if (!socket || !receiveMessage || !ride?._id) return;
    const event = `location-update-${ride._id}`;
    const handler = (data) => console.log("📡 GPS:", data);
    receiveMessage(event, handler);
    return () => offMessage?.(event, handler);
  }, [socket, receiveMessage, ride?._id]);

  // 🧾 Local storage sync
  useEffect(() => {
    if (ride) localStorage.setItem("activeRide", JSON.stringify(ride));
  }, [ride]);

  useEffect(() => () => localStorage.removeItem("activeRide"), []);

  // 🏁 Ride end + Payment Status listener
  useEffect(() => {
    if (!receiveMessage) return;

    receiveMessage("payment-status-updated", (data) =>
      setride((prev) => ({ ...prev, ...data }))
    );

    receiveMessage("end-ride", () => {
      localStorage.removeItem("activeRide");
      toast.success("🎉 Ride Completed — Thank you!");
      navigate("/home");
    });
  }, [receiveMessage]);

  // 💳 Razorpay Handler
  const handlePayment = async () => {
  try {
    const loaded = await loadRazorpay();

    if (!loaded) {
      toast.error("Razorpay SDK failed to load");
      return;
    }

    console.log("Razorpay constructor:", window.Razorpay); // MUST NOT be undefined

    const token = localStorage.getItem("token");

    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}payment/create-order`,
      { amount: ride.fare * 100 },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: data.amount,
      currency: "INR",
      name: "GadiGo",
      order_id: data.id,
      handler: async function (response) {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}payment/verify`,
          {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            rideId: ride._id,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setride((prev) => ({ ...prev, paymentStatus: "PAID" }));
        localStorage.setItem("activeRide", JSON.stringify(updatedRide));
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error(err);
    toast.error("❌ Payment failed");
  }
};

  const getPaymentBadge = () => {
    const status = ride?.paymentStatus;
    const styles = "ml-2 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1";

    return status === "PAID" ? (
      <span className={`${styles} bg-green-100 text-green-700`}>
        <i className="ri-check-double-fill" /> Paid
      </span>
    ) : status === "FAILED" ? (
      <span className={`${styles} bg-red-100 text-red-700`}>
        <i className="ri-close-circle-fill" /> Failed
      </span>
    ) : (
      <span className={`${styles} bg-yellow-100 text-yellow-600`}>
        <i className="ri-time-fill" /> Pending
      </span>
    );
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col relative bg-white">

      {/* Home Button */}
      <Link
        to="/home"
        onClick={() => localStorage.removeItem("activeRide")}
        className="absolute right-5 top-5 h-11 w-11 bg-white border border-gray-200 
                   flex items-center justify-center rounded-full shadow-sm 
                   hover:scale-105 transition z-20"
      >
        <i className="text-xl ri-home-5-line text-black" />
      </Link>

      {/* Map */}
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

      {/* Bottom Sheet */}
      <div className="h-[50vh] w-full bg-white rounded-t-3xl border-t border-gray-200 
                      shadow-[0_-8px_30px_rgba(0,0,0,0.10)] p-6 space-y-5 overflow-y-auto">

        <div className="w-14 h-[4px] bg-gray-300 rounded-full mx-auto" />

        {/* Driver Card */}
        <div className="flex justify-between items-center bg-[#FAFAFA] border border-gray-200 rounded-2xl p-4">
          <img src={vehicleImg} className="h-16 object-contain" alt="Vehicle" />

          <div className="text-right">
            <p className="font-semibold text-lg text-gray-900">
              {ride?.captain?.fullname?.firstname} {ride?.captain?.fullname?.lastname}
            </p>
            <p className="text-sm text-gray-500">{ride?.captain?.vehicle?.numberPlate}</p>
            <p className="text-sm text-gray-500">{ride?.captain?.vehicle?.vehicleModel}</p>
          </div>
        </div>

        {/* Ride Info */}
        <div className="bg-[#FAFAFA] border border-gray-200 rounded-2xl p-4 space-y-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
              <i className="ri-navigation-fill text-black text-lg" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Destination</p>
              <p className="text-sm text-gray-600">{ride?.destination}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
              <i className="ri-money-rupee-circle-fill text-black text-lg" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xl font-semibold text-gray-900">₹{ride?.fare}</p>
                {getPaymentBadge()}
              </div>
              <p className="text-sm text-gray-600">Estimated total fare</p>
            </div>
          </div>
        </div>

        {/* Pay Button */}
        <button
          disabled={ride?.paymentStatus === "PAID"}
          onClick={handlePayment}
          className={`w-full py-4 rounded-xl text-lg font-semibold transition active:scale-95 ${
            ride?.paymentStatus === "PAID"
              ? "bg-gray-200 text-gray-600 cursor-not-allowed"
              : "bg-black text-white hover:bg-neutral-900 shadow-md"
          }`}
        >
          {ride?.paymentStatus === "PAID" ? "✔ Payment Completed" : "💳 Make Payment"}
        </button>
      </div>
    </div>
  );
};

export default Riding;
