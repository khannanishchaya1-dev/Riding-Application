import React, { useContext } from "react";
import { useState,useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/Vehiclepanel";
import ConfirmedRide from "../components/ConfirmedRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import axios from "axios";
import { useSocket } from "../UserContext/SocketContext"; // Import the socket context
import { UserDataContext } from "../UserContext/UserContext"; // Import user context
import { CaptainDataContext } from "../UserContext/CaptainContext"; // Import captain context
import { useNavigate } from "react-router-dom";
import LiveTracking from "../components/LiveTracking";



const Home = () => {
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
  const [ride,setride]=useState({});
  const { user, setUser } = useContext(UserDataContext); // Get user data from context
  const [captainData] = useContext(CaptainDataContext); // Get captain data from context
  const { sendMessage } = useSocket();
  const {receiveMessage}=useSocket();
  const navigate = useNavigate();
  
useEffect(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) setUser(JSON.parse(storedUser));
}, []);

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
  console.log("Updated ride:", ride);
}, [ride]); // This will run whenever `ride` changes

useEffect(() => {
  if (!receiveMessage) return; // ensure socket exists

  const handler = (data) => {
    console.log("near, very close");
    setride(data);
    setvehiclepanel(false);
    setlookingForVehicle(false);
    setWaitingForDriver(true);
    
  };
  const startRide=(data)=>{
    console.log('ride-started',data);
    setride(data);
    setWaitingForDriver(false);
    navigate('/riding',{state:{ride:data}});

  }

  receiveMessage('ride-confirmed', handler);
  receiveMessage('ride-started', startRide);

}, [receiveMessage]);



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
  useGSAP(
    () => {
      if (waitingForDriver) {
        gsap.to(WaitingForDriverRef.current, {
          transform: "translateY(0)",
          duration: 0.5,
          ease: "power2.out",
        });
      } else {
        gsap.to(WaitingForDriverRef.current, {
          transform: "translateY(100%)",
          duration: 0.5,
          ease: "power2.inOut",
        });
      }
    },
    { dependencies: [waitingForDriver] }
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
    setfare(response.data.final_fare);
}
const create_ride=async (selectedVehicleType)=>{
  const ride_details={
    origin,destination,vehicleType:selectedVehicleType
  }
  try{

  const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}rides/create-ride`,
      ride_details,
      {
       headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
    }
);

setride(response.data);
console.log(response.data);
  }catch(error){
    console.log(response?.error?.message || error.message);
  }
}

  return (
    <div className="h-screen w-screen overflow-hidden">
      {/* Uber Logo */}
      <img
        className="absolute top-5 left-5 w-15 sm:w-16 z-10"
        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        alt="Uber Logo"
      />

      {/* Background Animation */}
      <div className="h-screen w-screen">
        <LiveTracking />
      </div>

      {/* Bottom Sheet */}
      <div className="h-screen absolute top-0 w-full flex flex-col justify-end z-10">
        <div className="bg-white p-4 sm:p-6 lg:p-8 shadow-2xl rounded-t-2xl h-[30%] relative ">
          <h1 className="absolute top-5 right-6">
            <i
              ref={panelCloseRef}
              onClick={() => {
                setPanelOpen(false);
              }}
              className="ri-arrow-down-s-line text-3xl opacity-0"
            ></i>
          </h1>
          <h4 className="text-xl sm:text-2xl font-semibold mt-1">
            Find a trip
          </h4>
          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
            className="flex flex-col gap-3 sm:gap-4 mt-3 max-w-md mx-auto w-full"
          >
            <div className="line h-13 w-0.5 bg-black absolute top-[39%] left-7 rounded-full"></div>
            <input
              onClick={() => {
                setPanelOpen(true);
                setActiveField("origin");
              }}
              value={origin}
              className="bg-[#eee] text-sm sm:text-lg rounded-lg px-6 sm:px-6 lg:px-8 py-2 sm:py-3 w-full"
              type="text"
              onChange={(e) => {
                setorigin(e.target.value);
              }}
              placeholder="Enter origin location"
            />
            <input
              onClick={() => {
                setPanelOpen(true);
                setActiveField("destination");
              }}
              value={destination}
              className="bg-[#eee] text-sm sm:text-lg rounded-lg px-6 sm:px-6 lg:px-8 py-2 sm:py-3 w-full"
              type="text"
              onChange={(e) => setdestination(e.target.value)}
              placeholder="Enter destination location"
            />
          </form>
          
          <button onClick={()=>{find_trip()}} className="bg-black text-white px-4 py-2 rounded-xl w-full mt-2">
            Find Trip
          </button>
        
        </div>
        

        <div ref={panelRef} className=" bg-white h-0">
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
      <div
        ref={vehiclepanelref}
        className="fixed z-10 bottom-0 bg-white p-3 w-full translate-y-full py-10"
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
      <div
        ref={confirmRideRef}
        className="fixed z-10 bottom-0 bg-white p-3 w-full translate-y-full py-10"
      >
        <ConfirmedRide
          confirmRidepanel={confirmRidepanel}
          setconfirmRidepanel={setconfirmRidepanel}
          setlookingForVehicle={setlookingForVehicle}
          origin={origin}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
          create_ride={create_ride}
        />
      </div>
      <div
        ref={lookingForVehicleRef}
        className="fixed z-10 bottom-0 bg-white p-3 w-full translate-y-full py-10"
      >
        <LookingForDriver
          lookingForVehicle={lookingForVehicle}
          setlookingForVehicle={setlookingForVehicle}
          ride={ride}
        />
      </div>
      <div
        ref={WaitingForDriverRef}
        className="translate-y-0 fixed z-10 bottom-0 bg-white p-3 w-full  py-10"
      >
        <WaitingForDriver
          waitingForDriver={waitingForDriver}
          setWaitingForDriver={setWaitingForDriver}
          ride={ride}

        />
      </div>
    </div>
  );
};

export default Home;
