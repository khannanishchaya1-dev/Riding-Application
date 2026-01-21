import React, { useContext, useState } from "react";
import { CaptainDataContext } from "../UserContext/CaptainContext";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";
import axios from 'axios';

const CaptainDetails = () => {
  const local = JSON.parse(localStorage.getItem("captain"));
  
  
  const [captainData,setCaptainData] = useContext(CaptainDataContext);
  const [active, setActive] = useState(local.status);
  useEffect(()=>{
    console.log(captainData)
  },[captainData])
  const setStatus = async (updated)=>{
    console.log(updated)
const res =  await axios.post(`${import.meta.env.VITE_BACKEND_URL}captains/status`,
      {status:updated},
{
       headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
    }
)
if(res.status==200){
  console.log("nice");
  setCaptainData(res.data.captain);
  localStorage.setItem("captain", JSON.stringify(res.data.captain));
if (!res.data.captain.status) {
    toast.error("User is Inactive!");
  } else {
   toast.success("User is Active!");
  }
}
  }

  if (!captainData || !captainData.fullname) {
    return <div>Loading captain details...</div>;
  }
  

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            className="w-14 h-14 rounded-full object-cover"
            src={captainData.avatar}
            alt="Captain"
          />
        
          
          <div>
            <h4 className="text-lg font-medium">
              {`${captainData.fullname.firstname} ${captainData.fullname.lastname}`}
            </h4>
            <p className="text-sm text-gray-600">
              Status:{" "}
              <span
                className={`font-semibold ${
                  active ? "text-green-600" : "text-red-600"
                }`}
              >
                {active ? "Active" : "Inactive"}
              </span>
            </p>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => {const updated = !active;
            setActive(updated);
            setStatus(updated)}}
          className={`px-4 py-2 rounded-lg font-medium text-white ${
            active ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {active ? "Go Offline" : "Go Online"}
        </button>
      </div>

      {/* Car Animation Section */}
      <div className="mt-6 bg-gray-100 p-5 rounded-xl flex flex-col items-center">
        <div className="car-animation w-full h-20 relative overflow-hidden">
          <div className="car"></div>
        </div>

        <p className="text-gray-600 mt-2 text-sm">
          {active
            ? "You are currently active. Waiting for new rides..."
            : "You are offline. Go online to receive ride requests."}
        </p>
      </div>
    </div>
  );
};

export default CaptainDetails;
