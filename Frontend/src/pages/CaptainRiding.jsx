import React from 'react'
import { Link,useLocation } from 'react-router-dom'
import {useGSAP} from "@gsap/react";
import {gsap} from "gsap";
import { useState,useRef } from 'react';
import FinishRide from '../components/FinishRide'
import LiveTracking from '../components/LiveTracking';
import wheelzyCaptainLogo from "../assets/wheelzy-captain.svg";
import toast from "react-hot-toast";

const CaptainRiding = () => {
  const [FinishRidepanel, setFinishRidepanel] = useState(false);
  const FinishRideRef = useRef(null);
  const location=useLocation();
  const {ride} = location.state || {};
  toast.success("Hurray! The ride has begun—have a safe journey!");

  useGSAP(() => {
  if (FinishRidepanel) {
    gsap.to(FinishRideRef.current, {
      transform: "translateY(0)",
      duration: 0.5,
      ease: "power2.out",
    });
  } else {
    gsap.to(FinishRideRef.current, {
      transform: "translateY(100%)",
      duration: 0.5,
      ease: "power2.inOut",
    });
  }
}, { dependencies: [FinishRidepanel] });
  return (
    
      <div className="h-[100dvh] w-full">
      <div className="fixed p-6 top-0 flex items-center justify-between w-screen">
        <img
          className="w-60"
          src={wheelzyCaptainLogo}
          alt="Wheelzy Captain Logo"
        ></img>
        <Link
          to="/home"
          className="h-10 w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className=" text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>
      <div className="h-4/5">
        <LiveTracking />
      </div>
      <div className="h-1/5 bg-yellow-400 flex items-center justify-between p-4 relative">
       <h5 className="p-1 text-center absolute w-[90%] top-0"><i onClick={()=>{setFinishRidepanel(true)}}className="ri-arrow-up-s-line text-3xl text-black-400"></i></h5>
        <h4 className='text-lg font-semibold'>4 KM away</h4>
        <button onClick={() => {setFinishRidepanel(true)}} className=" bg-green-600 text-white font-semibold rounded-lg p-3 px-8 mt-5">Complete Ride</button>
      
      </div>
      <div ref={FinishRideRef} className=" fixed h-[100dvh] z-10 bottom-0 bg-white p-3 w-full  py-10 translate-y-0">
        <FinishRide setFinishRidepanel={setFinishRidepanel}
        ride={ride}
         />
      </div>
    </div>
  )
}

export default CaptainRiding