import React, { use } from "react";
import { useState,useRef } from "react";
import {useGSAP} from "@gsap/react";
import {gsap} from "gsap";
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/Vehiclepanel";
import ConfirmedRide from "../components/ConfirmedRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
const Home = () => {
  const [pickup,setpickup]=useState("");
  const [dropoff,setdropoff]=useState("");
  const [panelOpen,setPanelOpen]=useState(false);
  const panelRef=useRef(null);
  const panelCloseRef = useRef(null);
  const [vehiclepanel,setvehiclepanel]=useState(false);
  const vehiclepanelref=useRef(null);
  const confirmRideRef=useRef(null);
  const [confirmRidepanel, setconfirmRidepanel] = useState(false);
  const [lookingForVehicle, setlookingForVehicle] = useState(false);
  const lookingForVehicleRef = useRef(null);
  const WaitingForDriverRef = useRef(null);
  const [waitingForDriver, setWaitingForDriver] = useState(false);

  useGSAP(() => {
  if (panelOpen) {
    gsap.to(panelRef.current, {
      opacity: 1,
      height: "75%",
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
}, { dependencies: [panelOpen] });
 useGSAP(() => {
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
}, { dependencies: [vehiclepanel] });

useGSAP(() => {
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
}, { dependencies: [confirmRidepanel] });


useGSAP(() => {
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
}, { dependencies: [lookingForVehicle] });
useGSAP(() => {
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
}, { dependencies: [waitingForDriver] });


  const submitHandler=(e)=>{
    e.preventDefault();
  }
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Uber Logo */}
      <img
        className="absolute top-5 left-5 w-12 sm:w-16"
        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        alt="Uber Logo"
      />

      {/* Background Animation */}
      <div className="h-screen w-screen">
        <img
          className="object-cover w-full h-full"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt="Uber animation"
        />
      </div>

      {/* Bottom Sheet */}
      <div className="h-screen absolute top-0 w-full flex flex-col justify-end">
        <div className="bg-white p-4 sm:p-6 lg:p-8 shadow-2xl rounded-t-2xl h-[25%] relative">
          <h1 className="absolute top-5 right-6"><i ref={panelCloseRef} onClick={()=>{setPanelOpen(false)}} className="ri-arrow-down-s-line text-3xl opacity-0"></i></h1>
          <h4 className="text-xl sm:text-2xl font-semibold mt-1">Find a trip</h4>
          <form onSubmit={(e)=>{
            submitHandler(e);
          }} className="flex flex-col gap-3 sm:gap-4 mt-3 max-w-md mx-auto w-full">
            <div className="line h-13 w-0.5 bg-black absolute top-[39%] left-7 rounded-full"></div>
            <input
            onClick={()=>{
              setPanelOpen(true)
            }}
              value={pickup}
              className="bg-[#eee] text-sm sm:text-lg rounded-lg px-6 sm:px-6 lg:px-8 py-2 sm:py-3 w-full"
              type="text"
              onChange={(e)=>{setpickup(e.target.value)}}
              placeholder="Enter pickup location"
            />
            <input
            onClick={()=>{
              setPanelOpen(true)
            }}
            value={dropoff}
              className="bg-[#eee] text-sm sm:text-lg rounded-lg px-6 sm:px-6 lg:px-8 py-2 sm:py-3 w-full"
              type="text"
              onChange={(e)=>setdropoff(e.target.value)}
              placeholder="Enter dropoff location"
            />
            
          </form>
        </div>
        <div ref={panelRef} className=" opacity-0 bg-white h-0">
          <LocationSearchPanel panelOpen={panelOpen} setPanelOpen={setPanelOpen}  vehiclepanel={vehiclepanel} setvehiclepanel={setvehiclepanel}/>
        </div>
      </div>
      <div ref={vehiclepanelref} className="fixed z-10 bottom-0 bg-white p-3 w-full translate-y-full py-10">
       <VehiclePanel  vehiclepanel={vehiclepanel} setvehiclepanel={setvehiclepanel} setconfirmRidepanel={setconfirmRidepanel} />
      </div>
      <div ref={confirmRideRef} className="fixed z-10 bottom-0 bg-white p-3 w-full translate-y-full py-10">
        <ConfirmedRide  confirmRidepanel={confirmRidepanel} setconfirmRidepanel={setconfirmRidepanel} setlookingForVehicle={setlookingForVehicle} />
       
      </div>
       <div ref={lookingForVehicleRef} className="fixed z-10 bottom-0 bg-white p-3 w-full translate-y-full py-10">
        <LookingForDriver  lookingForVehicle={lookingForVehicle} setlookingForVehicle={setlookingForVehicle} />
      </div>
      <div ref={WaitingForDriverRef} className="translate-y-0 fixed z-10 bottom-0 bg-white p-3 w-full  py-10">
        <WaitingForDriver waitingForDriver={waitingForDriver} setWaitingForDriver={setWaitingForDriver} />
      </div>
      
    </div>
  );
};

export default Home;
