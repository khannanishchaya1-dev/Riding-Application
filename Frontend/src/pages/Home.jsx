import React, { useContext } from "react";
import { useState,useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";

import ConfirmedRide from "../components/ConfirmedRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import axios from "axios";
import { useSocket } from "../UserContext/SocketContext"; // Import the socket context
import { UserDataContext } from "../UserContext/UserContext"; // Import user context
import { CaptainDataContext } from "../UserContext/CaptainContext"; // Import captain context
import { useNavigate } from "react-router-dom";
import LiveTracking from "../components/LiveTracking";
import GadiGoLogo from "../assets/GadiGo.svg";
import VehiclePanel from "../components/VehiclePanel";
import { Link } from "react-router-dom";
import NoDriverFound from "../components/NoDriverFound";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";






const Home = () => {
  const location=useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [origin, setorigin] = useState("");
  const [destination, setdestination] = useState("");
  const [activeField, setActiveField] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const [vehiclepanel, setvehiclepanel] = useState(false);
  const vehiclepanelref = useRef(null);
  const confirmRideRef = useRef(null);
  const [confirmRidepanel, setconfirmRidepanel] = useState(false);
  const [lookingForVehicle, setlookingForVehicle] = useState(false);
  const lookingForVehicleRef = useRef(null);
  const WaitingForDriverRef = useRef(null);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const [fare, setfare] = useState({});
  const [vehicleType,setvehicleType]=useState("");
  const [ride,setride]=useState(()=>{
  const storedRide = localStorage.getItem("activeRide");
  console.log("Stored ride in Home:", location.state?.ride);
  return storedRide ? JSON.parse(storedRide) : location.state?.ride || null;
});
  const { user, setUser } = useContext(UserDataContext); // Get user data from context
  const [captainData] = useContext(CaptainDataContext); // Get captain data from context
const[noDriverFound,setnoDriverFound] = useState(false);
  const { sendMessage } = useSocket();
  const {receiveMessage,offMessage}=useSocket();
  const navigate = useNavigate();
const noDriverFoundRef = useRef(null);

  
useEffect(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser){ 
  setUser(JSON.parse(storedUser))
}else{
  console.log("No user data in localStorage");
  navigate('/login');
}

}, []);
useEffect(()=>{
  return()=>{
    localStorage.removeItem("activeRide");
  }
},[])

  useEffect(() => {
    if (!user._id) return;
     console.log("User data:", user);
     
    // Emit the "join" event when the component mounts
    if (user && user._id) {
      sendMessage("join", { userId: user._id, userType: "user" });
    }else{
      console.log("User data not available")
    }
  }, [user, sendMessage]);

  const handleSelect = (description) => {
    if (activeField === "origin") {
      setorigin(description);
    } else if (activeField === "destination") {
      console.log("Setting destination to:", description);
      setdestination(description);
    }

    if (typeof setActiveField === "function") setActiveField(null);
  };
  useEffect(() => {
  if (!ride) return;

  if (ride.status === "REQUESTED") {
    setlookingForVehicle(true);
  } else if (ride.status === "ACCEPTED") {
    setWaitingForDriver(true);
  }
}, [ride]);

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


 useEffect(() => {
  if (!lookingForVehicle) return;

  // Show loading toast
  

  


  const timer = setTimeout(() => {

      // remove loading toast
    toast.error("❌ No driver found");

    setlookingForVehicle(false);
    localStorage.removeItem("activeRide");
    setnoDriverFound(true);

  }, 20000);

  return () => {
    clearTimeout(timer);
     // cleanup toast on cancel/confirm
  };
}, [lookingForVehicle]);


useGSAP(
  () => {
    if (noDriverFound) {
      gsap.to(noDriverFoundRef.current, {
        transform: "translateY(0)",
        duration: 0.5,
        ease: "power2.out",
      });
    } else {
      gsap.to(noDriverFoundRef.current, {
        transform: "translateY(100%)",
        duration: 0.5,
        ease: "power2.inOut",
      });
    }
  },
  { dependencies: [noDriverFound] }
);

useEffect(() => {
  if (!receiveMessage) return;

  const handler = (data) => {
    console.log("Driver confirmed");
    
    setnoDriverFound(false);
    setlookingForVehicle(false);
    setWaitingForDriver(true);
    setride(data);

    toast.success("Hurray! Your captain is ready!");
  };

  const startRide = (data) => {
    localStorage.removeItem("activeRide")
    setWaitingForDriver(false);
    localStorage.removeItem("activeRide");
    navigate("/riding", { state: { ride: data,vehicleType: vehicleType } });
  };
  const cancelHandler = (data) => {
    console.log("Ride cancelled by captain");
    toast.error("❌ Ride cancelled by captain");
    setWaitingForDriver(false);
    setnoDriverFound(true);
    setride(null);
    
  }

  receiveMessage("ride-confirmed", handler);
  receiveMessage("ride-started", startRide);
  receiveMessage("ride-cancelled",cancelHandler); 
   
}, [receiveMessage]);


  const CancelRide = async () => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}rides/user-cancel-ride`,
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
    setWaitingForDriver(false);
    // Reset local ride state
    setride(null);

    

  } catch (error) {
    toast.error(error?.response?.data?.message || "⚠ Error cancelling ride");
  }
};



  useGSAP(
    () => {
      if (panelOpen) {
        gsap.to(panelRef.current, {
          opacity: 1,
          height: "70%",
          padding: "1.25rem", // Tailwind's p-5
          duration: 0.5,
          ease: "power2.out",
        });
        gsap.to(panelCloseRef.current, {
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
        });
      } else {
        gsap.to(panelRef.current, {
          height: 0,
          opacity: 0,
          padding: 0,
          duration: 0.5,
          ease: "power2.inOut",
        });
        gsap.to(panelCloseRef.current, {
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
        });
      }
    },
    { dependencies: [panelOpen] }
  );
  useGSAP(
    () => {
      if (vehiclepanel) {
        gsap.to(vehiclepanelref.current, {
          transform: "translateY(0)",
          duration: 0.5,
          ease: "power2.out",
        });
      } else {
        gsap.to(vehiclepanelref.current, {
          transform: "translateY(100%)",
          duration: 0.5,
          ease: "power2.inOut",
        });
      }
    },
    { dependencies: [vehiclepanel] }
  );

  useGSAP(
    () => {
      if (confirmRidepanel) {
        gsap.to(confirmRideRef.current, {
          transform: "translateY(0)",
          duration: 0.5,
          ease: "power2.out",
        });
      } else {
        gsap.to(confirmRideRef.current, {
          transform: "translateY(100%)",
          duration: 0.5,
          ease: "power2.inOut",
        });
      }
    },
    { dependencies: [confirmRidepanel] }
  );

  useGSAP(
    () => {
      if (lookingForVehicle) {
        gsap.to(lookingForVehicleRef.current, {
          transform: "translateY(0)",
          duration: 0.5,
          ease: "power2.out",
        });
      } else {
        gsap.to(lookingForVehicleRef.current, {
          transform: "translateY(100%)",
          duration: 0.5,
          ease: "power2.inOut",
        });
      }
    },
    { dependencies: [lookingForVehicle] }
  );
 
  const submitHandler = (e) => {
    e.preventDefault();
  };
  const find_trip=async ()=>{
    setPanelOpen(false);
    setvehiclepanel(true);

     const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}rides/calculate-fare`, {
      params: {
        origin,destination
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
setvehiclepanel(true);

    setfare(response.data.final_fare);

}
const create_ride = async (selectedVehicleType) => {

  const ride_details = {
    origin,
    destination,
    vehicleType: selectedVehicleType,
  };
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}rides/create-ride`,
      ride_details,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
console.log("Ride creation response:", response);
    // Store ride properly

    setride(response.data.ride);
    localStorage.setItem("activeRide", JSON.stringify(response.data.ride));

    console.log("🚗 Ride Created:", response.data.ride);

    return true; // 👈 tells UI success

  } catch (error) {
    console.log("Error creating ride:", error);
    console.log(error.response?.data?.message || error.message);
    return false; // 👈 tells UI failure
  }
};

  return (
    <div className="h-[100dvh] w-full overflow-hidden relative">

      {/* 🔹 NAVBAR */}
     {/* NAVBAR – Premium Minimal */}
<div className="absolute top-0 left-0 w-full flex items-center justify-between px-5 py-6 z-10">

  {/* Logo */}
  <img 
    src={GadiGoLogo}
    alt="Logo"
    className="w-28 opacity-100"
  />

  {/* Profile Button */}
  <Link to="/profile">
    <div className="h-11 w-11 rounded-full bg-[#111] text-white shadow-sm border border-gray-700 
                    flex items-center justify-center text-lg font-semibold transition active:scale-95">
      {user?.fullname?.firstname?.charAt(0)?.toUpperCase() || "U"}
    </div>
  </Link>
</div>


      {/* Background Animation (LiveTracking) */}
      <div className="h-[100dvh] w-screen z-10">
        <LiveTracking />
      </div>

      {/* Bottom Sheet - Container for the main interaction area */}
      <div className="h-[100dvh] absolute top-0 w-full flex flex-col justify-end z-10 pointer-events-none">
        
        {/* Main Input Panel (Always visible at the bottom) */}
       {/* Main Input Panel (Zomato Style) */}
{/* 🚗 Premium Minimal – Main Input Panel */}
<div className="bg-white border border-gray-200 p-6  w-full max-w-lg mx-auto shadow-md pointer-events-auto relative">

  {/* Close arrow – animate only when full panel open */}
  <i
    ref={panelCloseRef}
    onClick={() => setPanelOpen(false)}
    className="ri-arrow-down-s-line absolute right-5 top-4 text-[26px] text-gray-500 cursor-pointer 
               opacity-0 transition duration-200 z-[50]"
  />

  {/* Heading */}
  <h4 className="text-[22px] font-semibold text-gray-900 mb-4">
    Where are you headed?
  </h4>

  {/* Input Area */}
  <div className="space-y-4">

    {/* Pickup */}
    <div
      className="flex items-center gap-3 px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl cursor-pointer
                 transition active:scale-[0.97]"
      onClick={() => { setPanelOpen(true); setActiveField("origin"); }}
    >
      <i className="ri-navigation-fill text-gray-700 text-xl"></i>
      <input
        value={origin}
        placeholder="Pickup location"
        className="w-full bg-transparent text-gray-900 placeholder-gray-500 outline-none text-[16px]"
        onChange={(e) => setorigin(e.target.value)}
      />
    </div>

    {/* Destination */}
    <div
      className="flex items-center gap-3 px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl cursor-pointer
                 transition active:scale-[0.97]"
      onClick={() => { setPanelOpen(true); setActiveField("destination"); }}
    >
      <i className="ri-map-pin-2-fill text-gray-700 text-xl"></i>
      <input
        value={destination}
        placeholder="Destination"
        className="w-full bg-transparent text-gray-900 placeholder-gray-500 outline-none text-[16px]"
        onChange={(e) => setdestination(e.target.value)}
      />
    </div>
  </div>

  {/* CTA Button */}
  <button
    onClick={find_trip}
    disabled={!origin || !destination}
    className="mt-5 w-full bg-[#111] text-white font-semibold rounded-xl py-4 text-lg 
               active:scale-[0.97] transition disabled:bg-gray-400"
  >
    Search Ride
  </button>
</div>



        {/* Location Search Panel (Animated) - Use max-w-lg mx-auto for centering */}
        <div ref={panelRef} className=" bg-white h-0 overflow-y-auto w-full max-w-lg mx-auto pointer-events-auto">
          <LocationSearchPanel
            panelOpen={panelOpen}
            setPanelOpen={setPanelOpen}
            vehiclepanel={vehiclepanel}
            setvehiclepanel={setvehiclepanel}
            activeField={activeField}
            setActiveField={setActiveField}
            origin={origin}
            destination={destination}
            setorigin={setorigin}
            setdestination={setdestination}
            handleSelect={handleSelect}
          />
        </div>
      </div>
    
      {/* Vehicle Panel - Use max-w-lg mx-auto for centering */}
      <div
        ref={vehiclepanelref}
        className=" fixed z-10 bottom-0 bg-white p-3 w-full translate-y-full py-10 max-w-lg mx-auto shadow-2xl rounded-t-2xl pointer-events-auto"
      >
        <VehiclePanel
          vehiclepanel={vehiclepanel}
          setvehiclepanel={setvehiclepanel}
          setconfirmRidepanel={setconfirmRidepanel}
          fare={fare}
          setvehicleType={setvehicleType}
          vehicleType={vehicleType}
        />
      </div>
      
      {/* Confirmed Ride Panel - Use max-w-lg mx-auto for centering */}
      <div
        ref={confirmRideRef}
        className={`fixed z-10 bottom-0 bg-white w-full translate-y-full max-w-lg mx-auto  pointer-events-auto" ${
    confirmRidepanel ? "opacity-100" : "opacity-0 pointer-events-none translate-y-full"
  }`}
      >
        <ConfirmedRide
          confirmRidepanel={confirmRidepanel}
          setconfirmRidepanel={setconfirmRidepanel}
          setlookingForVehicle={setlookingForVehicle}
setvehiclepanel={setvehiclepanel}
          origin={origin}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
          create_ride={create_ride}
        />
      </div>

      
      {/* Looking For Driver Panel - Use max-w-lg mx-auto for centering */}
      <div
        ref={lookingForVehicleRef}
       className={`fixed z-10 bottom-0 left-0 right-0 max-w-lg mx-auto  bg-white border-t border-white/10 p-8
rounded-t-3xl transition-all duration-300 pointer-events-auto ${
   lookingForVehicle ? "opacity-100" : "opacity-0 pointer-events-none translate-y-full"
  }`}


      >
        <LookingForDriver
          lookingForVehicle={lookingForVehicle}
          setlookingForVehicle={setlookingForVehicle}
          ride={ride}
vehicleType={vehicleType}
        />

      </div>
      
      {/* Waiting For Driver Panel - Use max-w-lg mx-auto for centering */}
 <div
        ref={noDriverFoundRef}
        className={`fixed z-10 bottom-0 left-0 right-0 max-w-lg mx-auto backdrop-blur-xl bg-white border-t border-white/10 p-8 
rounded-t-3xl transition-all duration-300 pointer-events-auto ${
    noDriverFound ? "opacity-100" : "opacity-0 pointer-events-none translate-y-full"
  } `}
      >
        <NoDriverFound
          
setnoDriverFound={setnoDriverFound}
          ride={ride}
setride={setride}
        />

      </div>

    
      
      {/* Note: I kept translate-y-0 for this one as it seems it's intended to be visible on ride confirmation */}
      <div
        ref={WaitingForDriverRef}
        className={`fixed z-10 bottom-0 left-0 right-0 max-w-lg mx-auto bg-white border-t border-white/10 p-4
rounded-t-3xl transition-all duration-300 pointer-events-auto ${
    waitingForDriver ? "opacity-100" : "opacity-0 pointer-events-none translate-y-full"
  }`}
      >
        <WaitingForDriver
          waitingForDriver={waitingForDriver}
          setWaitingForDriver={setWaitingForDriver}
          ride={ride}
CancelRide={CancelRide}
vehicleType={vehicleType}
        />
      </div>
    </div>
  );
};

export default Home