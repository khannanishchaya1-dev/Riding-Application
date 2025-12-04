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
    } catch {
      toast.error("Signup failed ⚠️ Try again.");
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-[#FAFAFA] flex flex-col justify-center py-6">

      {/* Logo */}
      <div className="text-center">
        <img src={WheelzyLogo} className="w-28 mx-auto opacity-90" />
      </div>

      {/* Card Container */}
      <div className="w-full max-w-md mx-auto mt-6 px-5">

        <h2 className="text-3xl font-semibold text-[#E23744] text-center tracking-tight">
          Create Account
        </h2>

        <p className="text-gray-500 text-center text-sm mt-1">
          Join Wheelzy and start your journey
        </p>

        {/* Signup Form */}
        <form onSubmit={submitHandler} className="mt-8 space-y-5">

          {/* Full Name */}
          <div>
            <label className="text-sm text-gray-600 font-medium">
              Full Name
            </label>

            <div className="flex gap-3 mt-1 flex-col sm:flex-row">
              <input
                required
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#E23744] focus:ring-0 outline-none transition"
              />

              <input
                required
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#E23744] focus:ring-0 outline-none transition"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600 font-medium">
              Email Address
            </label>

            <input
              required
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              required
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-[#E23744] focus:ring-0 outline-none transition"
            />
          </div>

          {/* Create Account Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#E23744] text-white font-semibold text-lg active:scale-95 transition duration-150"
          >
            Continue
          </button>
        </form>

        {/* Login Redirect */}
        <p className="text-center text-gray-500 mt-6 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-[#E23744] font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>

      {/* Terms Footer */}
      <p className="text-xs text-gray-500 text-center mt-5 px-6">
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
