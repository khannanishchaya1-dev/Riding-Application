import React,{useContext,useEffect} from "react";
import { Link } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import { useState,useRef } from "react";
import {useGSAP} from "@gsap/react";
import {gsap} from "gsap";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import { CaptainDataContext } from "../UserContext/CaptainContext";
import { useSocket } from "../UserContext/SocketContext"; // Import the socket contextxt
import axios from 'axios'
import LiveTracking from "../components/LiveTracking";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import wheelzyCaptainLogo from "../assets/wheelzy-captain.svg";
import toast from "react-hot-toast";



const CaptainHome = () => {
  const [ridePopUppanel, setridePopUppanel] = useState(false);
  const ridePopUppanelRef = useRef(null);
  const [confirmridePopUppanel, setconfirmridePopUppanel] = useState(false);
  const confirmridePopUppanelRef = useRef(null);
  const [captainData, setCaptainData] = useContext(CaptainDataContext); // Get captain data from context
  const { sendMessage } = useSocket();
  const {receiveMessage}=useSocket(); // Use sendMessage function from socket context
  const [ride,setride]=useState({});
  useEffect(() => {
    const storedCaptain = localStorage.getItem('captain');
    if (storedCaptain) {
      setCaptainData(JSON.parse(storedCaptain));
    }
  }, []);

   useEffect(() => {
      // Emit the "join" event when the component mounts
       if (captainData && captainData._id) {
        sendMessage("join", { userId: captainData._id, userType: "captain" });
      }else{
        console.log("Captain data not available yet.");
      }

      const locationUpdateInterval = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const data = {
          captainId: captainData._id,
          location: { ltd: latitude, lng: longitude },
        };

        console.log("📍 Sending updated location:", data);

        sendMessage("updateCaptainLocation", data); // or socket.emit()
      },
      (error) => {
        console.error("❌ Error getting location:", error);
      }
    );
  } else {
    console.error("❌ Geolocation not supported by browser");
  }
};

    const intervalId = setInterval(locationUpdateInterval, 5000); // Update location every 5 seconds
    locationUpdateInterval(); // Initial location update on mount
        }, [captainData, sendMessage]);

      receiveMessage('new-ride',(data)=>{
        console.log(data);
        setride(data);
        toast.success("Hurray! You have a new ride request!");
        setridePopUppanel(true);
      })
      useEffect(() => {
        console.log("Updated ride:", ride);
      }, [ride]);



  useGSAP(() => {
  if (ridePopUppanel) {
    gsap.to(ridePopUppanelRef.current, {
      transform: "translateY(0)",
      duration: 0.5,
      ease: "power2.out",
    });
  } else {
    gsap.to(ridePopUppanelRef.current, {
      transform: "translateY(100%)",
      duration: 0.5,
      ease: "power2.inOut",
    });
  }
}, { dependencies: [ridePopUppanel] });
useGSAP(() => {
  if (confirmridePopUppanel) {
    gsap.to(confirmridePopUppanelRef.current, {
      transform: "translateY(0)",
      duration: 0.5,
      ease: "power2.out",
    });
  } else {
    gsap.to(confirmridePopUppanelRef.current, {
      transform: "translateY(100%)",
      duration: 0.5,
      ease: "power2.inOut",
    });
  }
}, { dependencies: [confirmridePopUppanel] });
async function confirmRide() {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}rides/confirm-ride`,
      {
        rideId: ride._id, // request body
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // config object
        },
      }
    );

    console.log('✅ Ride confirmed:', response.data);
  } catch (error) {
    console.log(error);
    console.error('❌ Error confirming ride:', error.response?.data || error.message);
  }
}

 
  return (
    <div className="h-screen w-full">
      <div className="fixed p-6 top-0 flex items-center justify-between w-screen z-10">
        {/* Logo */}
               <img 
                 src={wheelzyCaptainLogo}
                 alt="Logo"
                 className="w-40 sm:w-28 md:w-32"
               />
             
         <Link to="/captain-profile">
          <div className="relative w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-black font-bold text-lg sm:text-xl shadow-md hover:scale-105 transition-transform duration-200 overflow-hidden">
            
            {/* Optional light reflection */}
            <div className="absolute inset-0 bg-white/20 rounded-full pointer-events-none"></div>
        
            {/* Letter */}
            <span className="relative z-10">
              {captainData?.fullname?.firstname?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
        </Link>
        
      </div>
      <div className="h-3/5">
        
          <LiveTracking />
        
        
      </div>
      <div className="h-2/5 p-6 bg-yellow-300">
       <CaptainDetails captain={captainData}/>
      </div>
      <div ref={ridePopUppanelRef} className=" fixed z-10 bottom-0 bg-white p-3 w-full  py-10 translate-y-0">
        <RidePopUp setridePopUppanel={setridePopUppanel} setconfirmridePopUppanel={setconfirmridePopUppanel} ride={ride}
        confirmRide={confirmRide}
        />
      </div>
      <div ref={confirmridePopUppanelRef} className=" fixed h-screen z-30 bottom-0 bg-white p-3 w-full  py-10 translate-y-0">
        <ConfirmRidePopUp setconfirmridePopUppanel={setconfirmridePopUppanel}  setridePopUppanel={setridePopUppanel} ride={ride}/>
      </div>
    </div>
  );
};

export default CaptainHome;