import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../UserContext/UserContext";
import WheelzyLogo from "../assets/wheelzy-captain-dark.svg";
import toast from "react-hot-toast";

const UserSignup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserDataContext);
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    const newUser = {
      email,
      password,
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}users/register`,
        newUser
      );

      if (response.status === 201) {
        toast.success("Account created 🚀");

        const data = response.data;
        setUser(data.user);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        navigate("/home");
      }
    } catch (error) {
      toast.error("Signup failed ⚠️ Please try again.");
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-[#F5F5F5] flex flex-col">

      {/* Center Card */}
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md bg-white mx-4 p-8 rounded-2xl shadow-md">

          <img src={WheelzyLogo} alt="Wheelzy" className="w-48 mb-6 mx-auto" />

          <h2 className="text-3xl font-bold text-[#E23744] text-center">
            Create an Account ✨
          </h2>

          <p className="text-gray-600 text-center mb-6">
            Join Wheelzy and start your journey.
          </p>

          {/* Signup Form */}
          <form onSubmit={submitHandler} className="space-y-6">

            {/* Name Fields */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Full Name
              </label>

              <div className="flex gap-3 flex-col sm:flex-row">
                <input
                  required
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#E23744] transition outline-none"
                />
                <input
                  required
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#E23744] transition outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-1">
                Email Address
              </label>
              <input
                required
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#E23744] transition outline-none"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#E23744] focus:border-[#E23744] outline-none transition"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 text-lg rounded-lg text-white font-semibold bg-[#E23744] hover:bg-[#FF4F5A] transition-transform active:scale-[0.97]"
            >
              Create Account
            </button>
          </form>

          {/* Login Redirect */}
          <p className="text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#E23744] font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <p className="text-xs text-gray-500 text-center mb-4">
        By signing up, you agree to our{" "}
        <span className="text-[#E23744] underline cursor-pointer">
          Terms
        </span>{" "}
        &{" "}
        <span className="text-[#E23744] underline cursor-pointer">
          Privacy Policy
        </span>
        .
      </p>
    </div>
  );
};

export default UserSignup;
