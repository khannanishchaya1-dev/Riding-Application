import React from "react";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../UserContext/CaptainContext";
import wheelzyCaptainLogo from "../assets/wheelzy-captain.svg";

const CaptainSignup = () => {
  // Existing State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [color, setColor] = useState("");
  const [capacity, setCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [numberPlate, setNumberPlate] = useState("");

  // ⭐ NEW STATE FOR PHONE AND MODEL
  const [phone, setPhone] = useState(""); 
  const [vehicleModel, setVehicleModel] = useState(""); 

  const [captainData, setCaptainData] = useContext(CaptainDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    
    // ⭐ INCLUDE NEW FIELDS IN THE API PAYLOAD
    const newCaptain = {
      email: email,
      password: password,
      phone: phone, // Added phone
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      vehicle: {
        color: color,
        capacity: capacity,
        vehicleType: vehicleType,
        numberPlate: numberPlate,
        vehicleModel: vehicleModel, // Added vehicleModel
      },
    };
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}captains/register`,
        newCaptain
      );
      if (response.status === 201) {
        const data = response.data;
        setCaptainData(data.captain);
        localStorage.setItem("token", data.token);
        localStorage.setItem("captain", JSON.stringify(data.captain));
        navigate("/captain-home");
      }
      
      // Clear all fields
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setCapacity("");
      setColor("");
      setNumberPlate("");
      setVehicleType("");
      setPhone(""); 
      setVehicleModel(""); 
      
    } catch (err) {
      console.error("Signup failed:", err.response?.data || err.message);
      // Replaced alert with console error and message
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col items-center justify-center font-sans">
      
      {/* Centered Card Container */}
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl space-y-8 p-6">
        
        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-6">
          <img className="w-40" src={wheelzyCaptainLogo} alt="Wheelzy Captain Logo" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-4">Captain Registration</h1>
          <p className="text-sm text-gray-500 mt-1">Join the fleet and start earning!</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-6">
          
          {/* --- PERSONAL DETAILS SECTION --- */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Personal Details</h3>
            
            {/* Name Fields */}
            <div className="flex gap-4 mb-6">
              <div className="w-1/2">
                <label className="text-sm font-medium text-gray-600 mb-1 block">First Name</label>
                <input
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="bg-gray-100 border border-gray-300 px-3 py-2 rounded-lg w-full text-base focus:ring-2 focus:ring-[#10b461] focus:border-transparent transition duration-200"
                  type="text"
                  placeholder="First Name"
                />
              </div>
              <div className="w-1/2">
                <label className="text-sm font-medium text-gray-600 mb-1 block">Last Name</label>
                <input
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="bg-gray-100 border border-gray-300 px-3 py-2 rounded-lg w-full text-base focus:ring-2 focus:ring-[#10b461] focus:border-transparent transition duration-200"
                  type="text"
                  placeholder="Last Name"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-600 mb-1 block">Email Address</label>
              <input
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-100 border border-gray-300 px-3 py-2 rounded-lg w-full text-base focus:ring-2 focus:ring-[#10b461] focus:border-transparent transition duration-200"
                type="email"
                placeholder="example@gmail.com"
              />
            </div>
            
            {/* Phone Number Field */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-600 mb-1 block">Phone Number</label>
              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-gray-100 border border-gray-300 px-3 py-2 rounded-lg w-full text-base focus:ring-2 focus:ring-[#10b461] focus:border-transparent transition duration-200"
                type="tel"
                placeholder="e.g., +91 98765 43210"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1 block">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-100 border border-gray-300 px-3 py-2 rounded-lg w-full text-base focus:ring-2 focus:ring-[#10b461] focus:border-transparent transition duration-200"
                required
                type="password"
                placeholder="password"
              />
            </div>
          </div>
          
          {/* --- VEHICLE DETAILS SECTION --- */}
          <div className="pt-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Vehicle Details</h3>
            
            {/* Vehicle Model Field */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-600 mb-1 block">Car Name / Model</label>
              <input
                required
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                className="bg-gray-100 border border-gray-300 px-3 py-2 rounded-lg w-full text-base focus:ring-2 focus:ring-[#10b461] focus:border-transparent transition duration-200"
                type="text"
                placeholder="e.g., Maruti Swift"
              />
            </div>

            {/* Color and Capacity Fields */}
            <div className="flex gap-4 mb-6">
              <div className="w-1/2">
                <label className="text-sm font-medium text-gray-600 mb-1 block">Color</label>
                <input
                  required
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="bg-gray-100 border border-gray-300 px-3 py-2 rounded-lg w-full text-base focus:ring-2 focus:ring-[#10b461] focus:border-transparent transition duration-200"
                  type="text"
                  placeholder="Color"
                />
              </div>
              <div className="w-1/2">
                <label className="text-sm font-medium text-gray-600 mb-1 block">Capacity</label>
                <input
                  required
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="bg-gray-100 border border-gray-300 px-3 py-2 rounded-lg w-full text-base focus:ring-2 focus:ring-[#10b461] focus:border-transparent transition duration-200"
                  type="number" // Changed to number type
                  placeholder="Capacity (e.g., 4)"
                />
              </div>
            </div>
            
            {/* Number Plate and Vehicle Type Fields */}
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="text-sm font-medium text-gray-600 mb-1 block">Vehicle Number</label>
                <input
                  required
                  value={numberPlate}
                  onChange={(e) => setNumberPlate(e.target.value)}
                  className="bg-gray-100 border border-gray-300 px-3 py-2 rounded-lg w-full text-base focus:ring-2 focus:ring-[#10b461] focus:border-transparent transition duration-200"
                  type="text"
                  placeholder="e.g., KA01AB1234"
                />
              </div>
              <div className="w-1/2">
                <label className="text-sm font-medium text-gray-600 mb-1 block">Vehicle Type</label>
                <select
                  required
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="bg-gray-100 border border-gray-300 px-3 py-2 rounded-lg w-full text-base focus:ring-2 focus:ring-[#10b461] focus:border-transparent transition duration-200"
                >
                  <option value="" disabled>
                    Select Type
                  </option>
                  <option value="car">Car</option>
                  <option value="motorcycle">Motorcycle</option>
                  <option value="truck">Truck</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <button 
            type="submit" 
            className="bg-gray-900 hover:bg-black text-white font-bold px-4 py-3 rounded-xl w-full text-lg transition duration-200 shadow-lg mt-8"
          >
            Create Captain Account
          </button>
          
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to="/captain-login" className="text-blue-600 hover:text-blue-800 font-medium transition">
              Login here
            </Link>
          </p>

        </form>
      </div>
      
    </div>
  );
};

export default CaptainSignup;