import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../UserContext/CaptainContext";
import GadiGoLogo from "../assets/GadiGo.svg";
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
  const [image, setImage] = useState(null);
const [preview, setPreview] = useState(null);
const [imageError, setImageError] = useState("");
 const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // ❌ Type check
  if (!file.type.startsWith("image/")) {
    setImageError("Only image files are allowed");
    return;
  }

  // ❌ Size check (2MB)
  if (file.size > 2 * 1024 * 1024) {
    setImageError("Image size must be under 2MB");
    return;
  }

  setImageError("");
  setImage(file);

  // 👁️ Preview
  const reader = new FileReader();
  reader.onloadend = () => setPreview(reader.result);
  reader.readAsDataURL(file);
};

  

  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
const formData = new FormData();

  Object.entries(form).forEach(([key, value]) => {
  if (value !== "" && value !== null) {
    formData.append(key, String(value));
  }
});

if (!image) {
  toast.error("Profile image is required");
  setLoading(false);
  return;
}

  if (image) {
    formData.append("image", image);
  }
    try {
      console.log("Submitting form data:", formData);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}captains/register`,
       formData
      );

      if (response.data) {
        toast.success("✔ Captain account created — Check your email for OTP!");
        localStorage.setItem("pendingCaptainEmail", form.email);
        navigate("/verify-captain-email", { state: { email: form.email } });
      }
    } catch (error) {
      toast.error(error.response?.data?.errors?.[0]?.msg || "Signup failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-white overflow-y-auto">

      {/* Logo */}
      <div className="w-full pt-10">
        <img src={GadiGoLogo} alt="logo" className="w-32 mx-auto" />
      </div>

      {/* Form Container */}
      <div className="w-full max-w-md mx-auto px-6 mt-4 animate-fadeIn">

        <h2 className="text-4xl font-bold text-[#111] text-center">Captain Signup</h2>
        <p className="text-gray-500 text-center text-sm mt-1">
          Join and start earning within minutes
        </p>

        {/* Form */}
        <form onSubmit={submitHandler} className="mt-10 space-y-6">

          {/* Full Name */}
          <div>
            <label className="text-[15px] text-gray-700 font-medium">Full Name</label>
            <div className="flex gap-3 mt-2 flex-col sm:flex-row">
              <input
                placeholder="First name"
                value={form.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#FAFAFA] border border-gray-200 shadow-sm outline-none focus:border-black transition"
              />
              <input
                placeholder="Last name"
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#FAFAFA] border border-gray-200 shadow-sm outline-none focus:border-black transition"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="text-[15px] text-gray-700 font-medium">Phone Number</label>
            <input
              type="tel"
              placeholder="9876543210"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-[#FAFAFA] border border-gray-200 shadow-sm focus:border-black outline-none transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-[15px] text-gray-700 font-medium">Email Address</label>
            <input
              type="email"
              placeholder="example@mail.com"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-[#FAFAFA] border border-gray-200 shadow-sm outline-none focus:border-black transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-[15px] text-gray-700 font-medium flex justify-between">
              Password
              <span
                className="text-black text-xs cursor-pointer hover:underline"
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
              className="w-full mt-2 px-4 py-3 rounded-xl bg-[#FAFAFA] border border-gray-200 shadow-sm outline-none focus:border-black transition"
            />
          </div>
          {/* Captain Image */}
{/* Profile Image */}
<div>
  <label className="text-[15px] text-gray-700 font-medium">
    Profile Photo
  </label>

  <input
    type="file"
    accept="image/*"
    onChange={handleImageChange}
    className="w-full mt-2 px-4 py-3 rounded-xl bg-[#FAFAFA] border border-gray-200"
  />

  {imageError && (
    <p className="text-red-500 text-xs mt-1">{imageError}</p>
  )}

  {preview && (
    <img
      src={preview}
      alt="preview"
      className="mt-3 w-28 h-28 object-cover rounded-full border"
    />
  )}
</div>



          {/* Vehicle Model */}
          <input
            placeholder="Vehicle Model"
            value={form.vehicleModel}
            onChange={(e) => handleChange("vehicleModel", e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#FAFAFA] border border-gray-200 shadow-sm outline-none focus:border-black transition"
          />

          {/* Number Plate */}
          <input
            placeholder="Number Plate"
            value={form.numberPlate}
            onChange={(e) => handleChange("numberPlate", e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#FAFAFA] border border-gray-200 shadow-sm outline-none focus:border-black transition"
          />

          {/* Color + Seats */}
          <div className="flex gap-3 flex-col sm:flex-row">
            <input
              placeholder="Color"
              value={form.color}
              onChange={(e) => handleChange("color", e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#FAFAFA] border border-gray-200 shadow-sm outline-none focus:border-black transition"
            />
            <input
              type="number"
              placeholder="Capacity (Seats)"
              value={form.capacity}
              onChange={(e) => handleChange("capacity", e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#FAFAFA] border border-gray-200 shadow-sm outline-none focus:border-black transition"
            />
          </div>

          {/* Vehicle Type */}
          <select
            value={form.vehicleType}
            onChange={(e) => handleChange("vehicleType", e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#FAFAFA] border border-gray-200 shadow-sm outline-none focus:border-black transition"
          >
            <option value="">Select Vehicle Type</option>
            <option value="Car">Car</option>
            <option value="Moto">Motorcycle</option>
            <option value="Auto">Auto Rickshaw</option>
          </select>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold text-lg active:scale-95 shadow-md transition duration-150 ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#111]"
            }`}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6">
          Already registered?{" "}
          <Link to="/captain-login" className="text-black font-semibold hover:underline">
            Login →
          </Link>
        </p>
      </div>
      <div className="pb-6"></div>
    </div>
  );
};

export default CaptainSignup;
