import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../UserContext/CaptainContext";
import wheelzyCaptainLogo from "../assets/wheelzy.svg";
import toast from "react-hot-toast";

const CaptainSignup = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    vehicleModel: "",
    color: "",
    capacity: "",
    vehicleType: "",
    numberPlate: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [, setCaptainData] = useContext(CaptainDataContext);

  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      fullname: {
        firstname: form.firstName,
        lastname: form.lastName,
      },
      email: form.email,
      phone: form.phone,
      password: form.password,
      vehicle: {
        vehicleModel: form.vehicleModel,
        vehicleType: form.vehicleType,
        color: form.color,
        capacity: form.capacity,
        numberPlate: form.numberPlate,
      },
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}captains/register`,
        payload
      );
console.log(response.status===201);
      if (response.data) {
  toast.success("✔ Captain account created — Check your email for OTP!");

  // Temporarily store email to validate OTP
  localStorage.setItem("pendingCaptainEmail", form.email);

  navigate("/verify-captain-email"); // redirect to captain OTP page
}

    } catch (error) {
      toast.error(error.response?.data?.errors?.[0]?.msg || "Signup failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-[#FAFAFA] flex flex-col overflow-y-auto py-6">

      {/* Branding */}
      <div className="text-center">
        <img src={wheelzyCaptainLogo} alt="logo" className="w-28 mx-auto opacity-90" />
      </div>

      {/* Main Form Container */}
      <div className="w-full max-w-md mx-auto mt-6 px-5">

        <h2 className="text-3xl font-semibold text-[#E23744] text-center tracking-tight">
          Captain Signup
        </h2>

        <p className="text-gray-500 text-center text-sm mt-1">
          Join Wheelzy and start earning
        </p>

        {/* Form */}
        <form onSubmit={submitHandler} className="mt-8 space-y-5">

          {/* Name */}
          <div>
            <label className="text-sm text-gray-600 font-medium">Full Name</label>
            <div className="flex gap-3 mt-1 flex-col sm:flex-row">
              <input
                placeholder="First name"
                value={form.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#E23744] focus:ring-0 outline-none transition"
              />
              <input
                placeholder="Last name"
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#E23744] focus:ring-0 outline-none transition"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm text-gray-600 font-medium">Phone Number</label>
            <input
              type="tel"
              placeholder="9876543210"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-[#E23744] focus:ring-0 outline-none transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600 font-medium">Email Address</label>
            <input
              type="email"
              placeholder="example@mail.com"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-[#E23744] focus:ring-0 outline-none transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-600 font-medium flex justify-between">
              Password
              <span
                className="text-[#E23744] text-xs cursor-pointer hover:underline"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? "Hide" : "Show"}
              </span>
            </label>

            <input
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-[#E23744] focus:ring-0 outline-none transition"
            />
          </div>

          {/* Vehicle Model */}
          <input
            placeholder="Vehicle Model"
            value={form.vehicleModel}
            onChange={(e) => handleChange("vehicleModel", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#E23744] focus:ring-0 outline-none transition"
          />

          {/* Number Plate */}
          <input
            placeholder="Number Plate"
            value={form.numberPlate}
            onChange={(e) => handleChange("numberPlate", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#E23744] focus:ring-0 outline-none transition"
          />

          {/* Color + Seats */}
          <div className="flex gap-3 flex-col sm:flex-row">
            <input
              placeholder="Color"
              value={form.color}
              onChange={(e) => handleChange("color", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#E23744] focus:ring-0 outline-none transition"
            />
            <input
            type="number"
              placeholder="Capacity (Seats)"
              value={form.capacity}
              onChange={(e) => handleChange("capacity", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#E23744] focus:ring-0 outline-none transition"
            />
          </div>

          {/* Vehicle Type */}
          <select
            value={form.vehicleType}
            onChange={(e) => handleChange("vehicleType", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#E23744] outline-none"
          >
            <option value="">Select Vehicle Type</option>
            <option value="Car">Car</option>
            <option value="Motorcycle">Motorcycle</option>
            <option value="Auto">Auto Rickshaw</option>
          </select>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold text-lg active:scale-95 transition duration-150 ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#E23744]"
            }`}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Redirect */}
        <p className="text-center text-gray-500 mt-6">
          Already registered?{" "}
          <Link to="/captain-login" className="text-[#E23744] font-medium hover:underline">
            Login →
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CaptainSignup;
