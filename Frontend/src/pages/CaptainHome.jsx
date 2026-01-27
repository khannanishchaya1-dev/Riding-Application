import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation,useNavigate } from "react-router-dom";
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
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}


const CaptainHome = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [ridePopUppanel, setridePopUppanel] = useState(false);
  const ridePopUppanelRef = useRef(null);

  const [confirmridePopUppanel, setconfirmridePopUppanel] = useState(false);
  const confirmridePopUppanelRef = useRef(null);

  const [captainData, setCaptainData] = useContext(CaptainDataContext);
  const { socket, sendMessage, receiveMessage, offMessage } = useSocket();

  const incomingSound = useRef(new Audio("/src/assets/sounds/incoming_new.mp3"));
  const [rideRejected, setRideRejected] = useState(false);

  const [ride, setride] = useState(() => {
    const storedRide = localStorage.getItem("activeRide");
    return storedRide ? JSON.parse(storedRide) : location.state?.ride || null;
  });

  const [distanceFromPassenger, setDistanceFromPassenger] = useState(0);
  
  useEffect(() => {
  if (!socket) return;

  const handleBlockStatus = (data) => {
    
    if (data.blocked) {
      // 🔔 Show toast
      toast.error(`${data.message} — you are restricted from taking rides`);

      // 🔒 Update captain status in localStorage
      const captainData = JSON.parse(localStorage.getItem("captain")) || {};
      const updatedCaptain = {
        ...captainData,
        blocked: true,
      };
      setCaptainData(updatedCaptain);
      localStorage.setItem("captain", JSON.stringify(updatedCaptain));

      // 🚫 Redirect to blocked page
      navigate("/captain-blocked", { replace: true });
    }else{
       const captainData = JSON.parse(localStorage.getItem("captain")) || {};
      const updatedCaptain = {
        ...captainData,
        blocked: false,
      };
      setCaptainData(updatedCaptain);
      localStorage.setItem("captain", JSON.stringify(updatedCaptain));

    }
  };

  socket.on("captain-block-status", handleBlockStatus);

  // 🧹 Cleanup
  return () => {
    socket.off("captain-block-status", handleBlockStatus);
  };
}, [socket, navigate]);

  useEffect(() => {
      async function fetchInitialDistance() {
        try {
          const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}captains/location/passenger`,{ headers: { Authorization: `Bearer ${localStorage.getItem("token")}`}} );
          const { lat, lon } = res.data;
          const dist = getDistance(lat, lon, ride.originCoordinates.lat, ride.originCoordinates.lon);
          setDistanceFromPassenger(dist.toFixed(1)); // km instant
        } catch (err) {
          console.log("⚠ Could not fetch initial captain location");
        }
      }
  
      if (ride?.originCoordinates) fetchInitialDistance();
    }, [ride]);

  // Clear Active Ride on unmount
  useEffect(() => {
    return () => {
      localStorage.removeItem("activeRide");
    };
  }, []);
   useEffect(() => {
  const storedCaptain = JSON.parse(localStorage.getItem("captain"));

  if (storedCaptain?.blocked) {
    toast.error("Your account is blocked. Please contact support.");
    navigate("/captain-blocked", { replace: true });
  }
}, [navigate]);


  // Persist ride only if REQUESTED or ACCEPTED
  useEffect(() => {
    if (!ride) {
      localStorage.removeItem("activeRide");
      return;
    }

    if (ride.status === "REQUESTED" || ride.status === "ACCEPTED") {
      localStorage.setItem("activeRide", JSON.stringify(ride));
    } else {
      localStorage.removeItem("activeRide");
    }
  }, [ride]);

  // Auto-close ride popup if captain ignores request
useEffect(() => {
  if (!ride || ride.status !== "REQUESTED") return;

  const timer = setTimeout(() => {
    toast.error("⏳ Request timed out");
    incomingSound.current.pause();
    incomingSound.current.currentTime = 0;

    setride(null);               // remove ride
    setridePopUppanel(false);    // close request popup panel
  }, 19000); // 19 seconds timeout

  return () => clearTimeout(timer);
}, [ride]);


  // Show ride popups depending on status
  useEffect(() => {
  if (!ride || rideRejected) return;

  if (ride.status === "ACCEPTED") {
    setconfirmridePopUppanel(true);
    setridePopUppanel(false);
  } else if (ride.status === "REQUESTED") {
    setridePopUppanel(true);
    setconfirmridePopUppanel(false);
  }
}, [ride, rideRejected]);


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

  // GPS Tracking - every 45sec
  useEffect(() => {
    if (!socket || !captainData?._id) return;

    const updateAvailabilityLocation = () => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          sendMessage("updateCaptainLocation", {
            captainId: captainData._id,
            lat: coords.latitude,
            lon: coords.longitude,
            isAvailable: true
          });
        },
        (err) => console.error("GPS error", err),
        { enableHighAccuracy: true }
      );
    };

    updateAvailabilityLocation();
    const interval = setInterval(updateAvailabilityLocation, 45000);
    return () => clearInterval(interval);
  }, [socket, captainData?._id]);

  // Listen for new ride
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

  // Accept Ride
  const confirmRide = async () => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}rides/confirm-ride`,
      { rideId: ride._id },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );

    sendMessage("ride-accepted", { rideId: ride._id });
    toast.success("✔ Ride Accepted");

    setride(response.data.ride);
    setridePopUppanel(false);
    setconfirmridePopUppanel(true);

  } catch (error) {
    if (error.response?.status === 409 || error.response?.status===500) {
      // ride already accepted by someone else
      toast.error("❌ Ride already accepted by another captain");
      setRideRejected(true); 
      setride(null);               // Clear ride data
    setridePopUppanel(false);    // Close request popup
    setconfirmridePopUppanel(false); // Ensure confirm is not shown 
      return;
    }

    toast.error("⚠️ Something went wrong");
  }
};


  // Passenger cancels
  useEffect(() => {
    if (!receiveMessage) return;

    const cancelHandler = () => {
      toast.error("❌ Ride cancelled by Passenger");
      setconfirmridePopUppanel(false);
      setridePopUppanel(false);
      setride(null);
    };

    receiveMessage("ride-cancelled", cancelHandler);
  }, [receiveMessage]);

  // Captain Cancels Ride
  const CancelRide = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}rides/cancel-ride`,
        { rideId: ride._id },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      toast.success(response.data?.message || "✔ Ride Cancelled");
      localStorage.removeItem("activeRide");
      setconfirmridePopUppanel(false);
      setridePopUppanel(false);
      setride(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "⚠ Error cancelling ride");
    }
  };

  // If another captain takes ride
  useEffect(() => {
    if (!socket || !ride?._id) return;

    const handler = (data) => {
      if (data._id === ride._id) {
        toast.error("❌ Ride taken by another captain");
        setridePopUppanel(false);
        incomingSound.current?.pause();
        if (incomingSound.current) incomingSound.current.currentTime = 0;
        setride(null);
      }
    };

    socket.on("ride-confirmed", handler);
    return () => socket.off("ride-confirmed", handler);
  }, [socket, ride?._id]);

  // Animation
  useGSAP(() => {
    gsap.to(ridePopUppanelRef.current, {
      transform: ridePopUppanel ? "translateY(0%)" : "translateY(120%)",
      duration: 0.45,
      ease: "power2.out"
    });
  }, [ridePopUppanel]);

  useGSAP(() => {
    const show = confirmridePopUppanel && ride && ride.status === "ACCEPTED";

    gsap.to(confirmridePopUppanelRef.current, {
      transform: show ? "translateY(0%)" : "translateY(200%)",
      duration: 0.45,
      ease: "power2.out"
    });
  }, [confirmridePopUppanel,ride]);

  return (
    <div className="h-[100dvh] w-full overflow-hidden relative">

      {/* Top Header */}
      <div className="absolute top-0 left-0 w-full flex items-center justify-between px-6 py-8 z-10">
        <img src={GadiGoLogo} alt="Logo" className="w-32 opacity-90" />

        <Link to="/captain-profile">
            <div className="h-11 w-11 rounded-full bg-[#111] text-white shadow-sm border border-gray-700 
                            flex items-center justify-center text-lg font-semibold transition active:scale-95">
              {captainData?.fullname?.firstname?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </Link>
      </div>

      {/* Map */}
      <div className="h-[100dvh]">
        <LiveTracking />
      </div>

      {/* Bottom User Card */}
      <div className="absolute bottom-0 w-full backdrop-blur-xl bg-white/70 rounded-t-3xl p-6 border-t border-gray-300 shadow-lg z-20">
        <CaptainDetails captain={captainData} />
      </div>

      {/* Incoming Ride Popup */}
      <div
        ref={ridePopUppanelRef}
        className="fixed bottom-0 w-full z-40 translate-y-[120%] backdrop-blur-xl bg-white/85 border-t border-gray-200 shadow-xl rounded-t-3xl p-6"
      >
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
          distanceFromPassenger={distanceFromPassenger}
        />
      </div>

      {/* Confirm Ride Popup */}
      {/* Confirm Ride Popup */}
{ride && ride.status === "ACCEPTED" ? (
  <div
    ref={confirmridePopUppanelRef}
    className="inset-x-0 fixed bottom-0 w-full z-40 translate-y-[200%] bg-white border-t border-gray-200 shadow-xl"
  >
    <ConfirmRidePopUp
      ride={ride}
      setridePopUppanel={setridePopUppanel}
      setconfirmridePopUppanel={setconfirmridePopUppanel}
      CancelRide={CancelRide}
      setride={setride}
    />
  </div>
) : null}

    </div>
  );
};

export default CaptainHome;
