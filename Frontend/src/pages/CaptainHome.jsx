import React,{useContext} from "react";
import { Link } from "react-router-dom";
import CapatainDetails from "../components/CapatainDetails";
import RidePopUp from "../components/RidePopUp";
import { useState,useRef } from "react";
import {useGSAP} from "@gsap/react";
import {gsap} from "gsap";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import { CaptainDataContext } from "../UserContext/CaptainContext";

const CaptainHome = () => {
  const [ridePopUppanel, setridePopUppanel] = useState(false);
  const ridePopUppanelRef = useRef(null);
  const [confirmridePopUppanel, setconfirmridePopUppanel] = useState(false);
  const confirmridePopUppanelRef = useRef(null);
  const [captain]=useContext(CaptainDataContext);

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

  return (
    <div className="h-screen w-full">
      <div className="fixed p-6 top-0 flex items-center justify-between w-screen">
        <img
          className="w-14"
          src="https://pngimg.com/d/uber_PNG24.png"
          alt=""
        ></img>
        <Link
          to="/home"
          className="h-10 w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className=" text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>
      <div className="h-3/5">
        <img
          className="object-cover w-full h-full"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt="Uber animation"
        />
      </div>
      <div className="h-2/5 p-6">
       <CapatainDetails captain={captain}/>
      </div>
      <div ref={ridePopUppanelRef} className=" fixed z-10 bottom-0 bg-white p-3 w-full  py-10 translate-y-0">
        <RidePopUp setridePopUppanel={setridePopUppanel} setconfirmridePopUppanel={setconfirmridePopUppanel}/>
      </div>
      <div ref={confirmridePopUppanelRef} className=" fixed h-screen z-10 bottom-0 bg-white p-3 w-full  py-10 translate-y-0">
        <ConfirmRidePopUp setconfirmridePopUppanel={setconfirmridePopUppanel}  setridePopUppanel={setridePopUppanel}/>
      </div>
    </div>
  );
};

export default CaptainHome;
