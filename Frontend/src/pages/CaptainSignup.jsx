import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { CaptainDataContext } from "../UserContext/CaptainContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import wheelzyCaptainLogo from "../assets/wheelzy-captain.svg";

const CaptainSignup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [color, setColor] = useState("");
  const [capacity, setCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [numberPlate, setNumberPlate] = useState("");
  const [ captainData, setCaptainData ] = useContext(CaptainDataContext);
  const navigate = useNavigate();
  const submitHandler = async (e) => {
    e.preventDefault();
    const newCaptain = {
      email: email,
      password: password,
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      vehicle: {
        color: color, // optional default
        capacity: capacity,
        vehicleType: vehicleType,
        numberPlate: numberPlate,
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
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setCapacity("");
      setColor("");
      setNumberPlate("");
      setVehicleType("");
    } catch (err) {
      console.error("Signup failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Signup failed");
    }
  };
  return (
    <div className="h-screen flex flex-col justify-between">
      <div className="p-7">
        <img className="w-40 mb-5" src={wheelzyCaptainLogo} />
        <form onSubmit={submitHandler}>
          <h3 className="text-base mb-2 font-medium">What's your Name</h3>
          <div className="flex gap-4">
            <input
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="bg-[#eeeeee] px-2 py-2 rounded  w-1/2 text-base mb-7"
              type="text"
              placeholder="First Name"
            ></input>
            <input
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="bg-[#eeeeee] px-2 py-2 rounded  w-1/2 text-base mb-7"
              type="text"
              placeholder="Last Name"
            ></input>
          </div>

          <h3 className="text-base mb-2 font-medium">What's your email</h3>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#eeeeee] px-2 py-2 rounded  w-full text-base mb-7"
            type="email"
            placeholder="example@gmail.com"
          ></input>
          <h3 className="text-base mb-2 font-medium">Enter Password</h3>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#eeeeee] px-2 py-2 rounded w-full text-base mb-7 "
            required
            type="password"
            placeholder="password"
          ></input>
          <h3 className="text-base mb-2 font-medium">Vehicle Information</h3>
          <div className="flex gap-4">
            <input
              required
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="bg-[#eeeeee] rounded mb-7 w-1/2 text-base px-2 py-2"
              type="text"
              placeholder="Color"
            ></input>
            <input
              required
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="bg-[#eeeeee] rounded mb-7 w-1/2 text-base px-2 py-2"
              type="text"
              placeholder="Capacity"
            ></input>
          </div>
          <div className="flex gap-4">
            <input
              required
              value={numberPlate}
              onChange={(e) => setNumberPlate(e.target.value)}
              className="bg-[#eeeeee] rounded mb-7 w-1/2 text-base px-2 py-2"
              type="text"
              placeholder="Vehicle Number"
            ></input>
            <select
              required
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="bg-[#eeeeee] rounded mb-7 w-1/2 text-base px-2 py-2"
            >
              <option value="" disabled>
                Select Vehicle Type
              </option>
              <option value="car">Car</option>
              <option value="motorcycle">Motorcycle</option>
              <option value="auto">Truck</option>
            </select>
          </div>
          <button className="bg-[#111] text-white font-semibold px-2 py-2 rounded w-full text-base mb-4">
            Create Captain Account
          </button>
        </form>
        <p className="text-center">
          Already have an account?{" "}
          <Link to="/captain-login" className="text-blue-600">
            Login here
          </Link>
        </p>
      </div>
      {/* <div className="p-7">
        <Link to='/captain-login' className="bg-[#10b461] flex justify-center text-white font-semibold px-2 py-2 rounded w-full text-lg">
          Sign in as Captain
        </Link>
      </div> */}
      
    </div>
  );
};

export default CaptainSignup;
