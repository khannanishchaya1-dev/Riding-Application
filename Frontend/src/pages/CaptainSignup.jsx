import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../UserContext/CaptainContext";
import wheelzyCaptainLogo from "../assets/wheelzy-captain-dark.svg";
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

  const [captainData, setCaptainData] = useContext(CaptainDataContext);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

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

      if (response.data?.token) {
        toast.success("Captain account created 🚖🔥");
        setCaptainData(response.data.captain);

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("captain", JSON.stringify(response.data.captain));

        navigate("/captain-home");
      }
    } catch (error) {
      toast.error(error.response?.data?.errors?.[0]?.msg || "Signup failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full  flex flex-col">

      {/* Fullscreen Form Card (No padding outside) */}
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-none sm:rounded-2xl shadow-lg  p-8">

          <img src={wheelzyCaptainLogo} className="w-48 mb-6 mx-auto" alt="logo" />

          <h2 className="text-3xl font-bold text-[#E23744] text-center">
            Captain Signup 🚖
          </h2>

          <p className="text-gray-600 text-center mb-6">
            Join Wheelzy and start earning.
          </p>

          <form onSubmit={submitHandler} className="space-y-6">

            {/* Full Name */}
            <div>
              <label className="text-sm font-semibold">Full Name</label>
              <div className="flex gap-3 flex-col sm:flex-row">
                <input
                  placeholder="First name"
                  value={form.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#E23744] outline-none"
                />
                <input
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#E23744] outline-none"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-semibold">Phone Number</label>
              <input
                type="tel"
                placeholder="9876543210"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#E23744] outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-semibold">Email Address</label>
              <input
                type="email"
                placeholder="example@mail.com"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#E23744] outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-semibold flex justify-between">
                Password
                <span
                  className="text-[#E23744] text-xs cursor-pointer hover:underline"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? "Hide" : "Show"}
                </span>
              </label>

              <input
                required
                type={showPass ? "text" : "password"}
                placeholder="password"
                value={form.password}
                onChange={(e) => handleChange("password",e.target.value)}
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#E23744] focus:border-[#E23744] outline-none transition"
              />
            </div>

            {/* Vehicle Fields */}
            <input
              placeholder="Vehicle Model"
              value={form.vehicleModel}
              onChange={(e) => handleChange("vehicleModel", e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#E23744] outline-none"
            />

            <input
              placeholder="Number Plate"
              value={form.numberPlate}
              onChange={(e) => handleChange("numberPlate", e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#E23744] outline-none"
            />

            <div className="flex gap-3 flex-col sm:flex-row">
              <input
                placeholder="Color"
                value={form.color}
                onChange={(e) => handleChange("color", e.target.value)}
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#E23744] outline-none"
              />

              <input
                type="number"
                placeholder="Capacity (Seats)"
                value={form.capacity}
                onChange={(e) => handleChange("capacity", e.target.value)}
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#E23744] outline-none"
              />
            </div>

            {/* Vehicle Type */}
            <select
              value={form.vehicleType}
              onChange={(e) => handleChange("vehicleType", e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#E23744] outline-none"
            >
              <option value="">Select Vehicle Type</option>
              <option value="Car">Car</option>
              <option value="Motorcycle">Motorcycle</option>
              <option value="Auto">Auto Rickshaw</option>
            </select>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 text-lg font-semibold text-white rounded-xl transition 
                ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#E23744] hover:bg-[#FF4F5A]"}`}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Redirect */}
          <p className="text-center text-gray-600 mt-6 mb-4">
            Already registered?{" "}
            <Link to="/captain-login" className="text-[#E23744] font-medium hover:underline">
              Login →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CaptainSignup;
