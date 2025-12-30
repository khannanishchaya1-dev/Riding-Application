import React, { useContext, useState, useEffect } from "react";
import { CaptainDataContext } from "../UserContext/CaptainContext";
import toast from "react-hot-toast";
import axios from "axios";

const CaptainDetails = () => {
  const local = JSON.parse(localStorage.getItem("captain"));
  const [captainData, setCaptainData] = useContext(CaptainDataContext);
  const [active, setActive] = useState(local?.status);

  useEffect(() => {
    console.log(captainData);
  }, [captainData]);

  const setStatus = async (updated) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}captains/status`,
        { status: updated },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.status === 200) {
        setCaptainData(res.data.captain);
        localStorage.setItem("captain", JSON.stringify(res.data.captain));

        if (!res.data.captain.status) toast.error("You are Offline!");
        else toast.success("You are Online!");
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (!captainData || !captainData.fullname) {
    return <div className="text-gray-500 text-center py-4">Loading captain...</div>;
  }

  return (
    <div className="p-4 bg-white text-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            className="w-14 h-14 rounded-full object-cover border border-gray-200 shadow-sm"
            src="https://media.gettyimages.com/id/1752533660/video/happy-worker-and-face-of-business-asian-man-in-office-with-pride-confidence-and-ambition-in.jpg?s=640x640&k=20&c=FPPyepfVwPRmGudzLY-RkfVPiT1lPE_wBZ2WQZVGUOM="
            alt="Captain"
          />

          <div>
            <h4 className="text-lg font-semibold tracking-tight">
              {captainData.fullname.firstname} {captainData.fullname.lastname}
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
          onClick={() => {
            const newVal = !active;
            setActive(newVal);
            setStatus(newVal);
          }}
          className={`px-4 py-2 rounded-xl font-medium transition active:scale-95
            ${active
              ? "bg-gray-900 text-white hover:bg-black"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
        >
          {active ? "Go Offline" : "Go Online"}
        </button>
      </div>

      {/* Car Animation Section */}
      <div className="mt-6 bg-[#F8F8F8] border border-gray-200 rounded-xl p-5 flex flex-col items-center shadow-sm">
        <div className="car-animation w-full h-20 relative overflow-hidden">
          <div className="car"></div>
        </div>

        <p className="text-gray-600 mt-2 text-sm text-center">
          {active
            ? "You are currently online — waiting for new rides 🚕"
            : "You’re offline — go online to receive requests."}
        </p>
      </div>
    </div>
  );
};

export default CaptainDetails;
