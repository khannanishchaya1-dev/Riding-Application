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
      <div className="fixed p-6 top-0 flex items-center justify-between w-screen z-20">
        <img
          className="w-60"
          src={wheelzyCaptainLogo}
          alt="Wheelzy Captain Logo"
        ></img>
        <Link
          to="/captain-logout"
          className="h-10 w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className=" text-lg font-medium ri-logout-box-r-line"></i>
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
      <div ref={confirmridePopUppanelRef} className=" fixed h-screen z-10 bottom-0 bg-white p-3 w-full  py-10 translate-y-0">
        <ConfirmRidePopUp setconfirmridePopUppanel={setconfirmridePopUppanel}  setridePopUppanel={setridePopUppanel} ride={ride}/>
      </div>
    </div>
  );
};

export default CaptainHome;
