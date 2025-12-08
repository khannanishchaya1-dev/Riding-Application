import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import { CaptainDataContext } from "../UserContext/CaptainContext";
import { useSocket } from "../UserContext/SocketContext";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import axios from "axios";
import LiveTracking from "../components/LiveTracking";
import toast from "react-hot-toast";
import GadiGoLogo from "../assets/GadiGo.svg";
import { useLocation } from "react-router-dom";

const CaptainHome = () => {
  const location=useLocation();
  const [ridePopUppanel, setridePopUppanel] = useState(false);
  const ridePopUppanelRef = useRef(null);

  const [confirmridePopUppanel, setconfirmridePopUppanel] = useState(false);
  const confirmridePopUppanelRef = useRef(null);

  const [captainData, setCaptainData] = useContext(CaptainDataContext);
  const { socket, sendMessage, receiveMessage, offMessage } = useSocket();

  const incomingSound = useRef(new Audio("/src/assets/sounds/incoming_new.mp3"));
  const [ride,setride]=useState(()=>{
    const storedRide = localStorage.getItem("activeRide");
    return storedRide ? JSON.parse(storedRide) : location.state?.ride || null;
  });
useEffect(()=>{
  return()=>{
    localStorage.removeItem("activeRide");
  }
},[])
 useEffect(() => {
  if (!ride) return;

  if (ride.status === "ACCEPTED") {
    setconfirmridePopUppanel(true);
    setridePopUppanel(false);
  }else if (ride.status === "ONGOING") {
      localStorage.removeItem("activeRide");
    
      
  }else if (ride.status ==="REQUESTED"){
    setridePopUppanel(true);
    
  }
}, [ride]);
  // Load captain from local storage
  useEffect(() => {
    const stored = localStorage.getItem("captain");
    if (stored) setCaptainData(JSON.parse(stored));
  }, []);

  // Join socket room
  useEffect(() => {
    if (!socket || !captainData?._id) return;
    sendMessage("join", { userId: captainData._id, userType: "captain" });
  }, [socket, captainData?._id]);
// Auto GPS tracking + emit to backend every 5 seconds
useEffect(() => {
  if (!socket || !captainData?._id) return;

  let watchId = null;

  const sendLocation = (lat, lng) => {
    sendMessage("updateCaptainLocation", {
      captainId: captainData._id,
      location: { ltd: lat, lng: lng },
    });
  };

  // Start GPS watcher
  watchId = navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      console.log(" 📡 captain location ")
      sendLocation(latitude, longitude);
    },
    (err) => {
      console.error("GPS Error:", err);
      toast.error("⚠ Unable to get live location");
    },
    { enableHighAccuracy: true, maximumAge: 0 }
  );

  // Cleanup when component unmounts or socket disconnects
  return () => {
    if (watchId) navigator.geolocation.clearWatch(watchId);
  };
}, [socket, captainData?._id]);
useEffect(() => {
    const storedRide = localStorage.getItem("activeRide");
    if( storedRide ){
      
    }
  },[]);
  useEffect(() => {
    if (!ride) {
      localStorage.removeItem("activeRide");
      return;
    }
  
    // Always update when ride changes
    localStorage.setItem("activeRide", JSON.stringify(ride));
    console.log("Ride updated:", ride);
  
    // If ride finished or cancelled → clean local storage
    if (
      ride.status === "CANCELLED" ||
      ride.status === "CANCELLED_BY_USER" ||
      ride.status === "CANCELLED_BY_CAPTAIN" ||
      ride.status === "COMPLETED"
    ) {
      localStorage.removeItem("activeRide");
    }
  
  }, [ride]); // runs only when ride or its status changes

  // Listen for ride request
  useEffect(() => {
    if (!socket) return;

    const handler = (data) => {
      setride(data);
      toast.success("🚗 New Ride Request");

      incomingSound.current.currentTime = 0;
      incomingSound.current.play().catch(() => {});

      setridePopUppanel(true);
    };

    receiveMessage("new-ride", handler);
  }, [socket]);

  // Confirm ride function
  const confirmRide = async () => {
  try {
    await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}rides/confirm-ride`,
      { rideId: ride._id },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );

    sendMessage("ride-accepted", { rideId: ride._id }); // 👈 broadcast event

    toast.success("✔ Ride Accepted");
    localStorage.setItem("activeRide", JSON.stringify(ride));
    setridePopUppanel(false);
    setconfirmridePopUppanel(true);
  } catch {
    toast.error("⚠ Error confirming ride");
  }
};
useEffect(() => {
  if (ride) {
    localStorage.setItem("activeRide", JSON.stringify(ride));
  }
}, [ride]);
useEffect(() => {
  if (!receiveMessage) return;
  const cancelHandler = (data) => {
      console.log("Ride cancelled by captain");
      toast.error("❌ Ride cancelled by Passenger");
      setconfirmridePopUppanel(false);
      setridePopUppanel(false);
      setride(null);
      
    }
    receiveMessage("ride-cancelled",cancelHandler);
     
},[receiveMessage]);
const CancelRide = async () => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}rides/cancel-ride`,
      { rideId: ride._id },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    toast.success(response.data?.message || "✔ Ride Cancelled");
localStorage.removeItem("activeRide");
    // Close modals
    setconfirmridePopUppanel(false);
    setridePopUppanel(false);

    // Reset local ride state
    setride(null);

    

  } catch (error) {
    toast.error(error?.response?.data?.message || "⚠ Error cancelling ride");
  }
};




  useEffect(() => {
  if (!socket || !ride?._id) return;

  const handler = (data) => {
    console.log("📩 ride-confirmed event received", data);

    if (data._id === ride._id) {
      toast.error("❌ Ride taken by another captain");

      setridePopUppanel(false);

      incomingSound.current?.pause();
      if (incomingSound.current) incomingSound.current.currentTime = 0;

      setride({});
    }
  };

  socket.on("ride-confirmed", handler);

  return () => socket.off("ride-confirmed", handler);
}, [socket, ride?._id]);


  // Popup animations
  useGSAP(() => {
    gsap.to(ridePopUppanelRef.current, {
      transform: ridePopUppanel ? "translateY(0%)" : "translateY(120%)",
      duration: 0.45,
      ease: "power2.out",
    });
  }, [ridePopUppanel]);

  useGSAP(() => {
    gsap.to(confirmridePopUppanelRef.current, {
      transform: confirmridePopUppanel ? "translateY(0%)" : "translateY(200%)",
      duration: 0.45,
      ease: "power2.out",
    });
  }, [confirmridePopUppanel]);


  return (
    <div className="h-[100dvh] w-full overflow-hidden relative">

      {/* Top Avatar Button */}
      <div className="absolute top-0 left-0 w-full flex items-center justify-between px-6 py-8 z-10">
        <img 
          src={GadiGoLogo}
          alt="Logo"
          className="w-32 opacity-90"
        />
      
        <Link to="/captain-profile">
                <div className="h-12 w-12 rounded-full bg-white/90 backdrop-blur-xl shadow-md border border-gray-200 
                                flex items-center justify-center text-[#E23744] text-xl font-bold transition hover:scale-105">
                  {captainData?.fullname?.firstname?.charAt(0)?.toUpperCase() || "U"}
                </div>
              </Link>
      </div>

      {/* Full Map */}
      <div className="h-[100dvh]">
        <LiveTracking />
      </div>

      {/* Bottom Card Glass UI */}
      <div className="absolute bottom-0 w-full backdrop-blur-xl bg-white/70 rounded-t-3xl p-6 border-t border-gray-300 shadow-lg z-20">
        <CaptainDetails captain={captainData} />
      </div>

      {/* Incoming Popup */}
      <div
        ref={ridePopUppanelRef}
        className="fixed bottom-0 w-full z-40 translate-y-[120%] backdrop-blur-xl bg-white/85 
                border-t border-gray-200 shadow-xl rounded-t-3xl p-6">
        <RidePopUp
          ride={ride}
          setridePopUppanel={(v) => {
            if (!v) setconfirmridePopUppanel(false);
            setridePopUppanel(v);
          }}
          setconfirmridePopUppanel={(v) => {
            setridePopUppanel(false);
            setTimeout(() => setconfirmridePopUppanel(v), 250);
          }}
          confirmRide={confirmRide}
        />
      </div>

      {/* Confirm Ride Popup */}
      <div
        ref={confirmridePopUppanelRef}
        className="inset-x-0 fixed bottom-0 w-full z-40 translate-y-[200%] backdrop-blur-xl bg-white/90 
                border-t border-gray-200 shadow-xl rounded-t-3xl">
        <ConfirmRidePopUp
          ride={ride}
          setridePopUppanel={setridePopUppanel}
          setconfirmridePopUppanel={setconfirmridePopUppanel}
          CancelRide={CancelRide}
        />
      </div>
    </div>
  );
};

export default CaptainHome;
