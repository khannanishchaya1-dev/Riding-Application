import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../UserContext/UserContext";
import WheelzyLogo from "../assets/wheelzy-captain-dark.svg";
import toast from "react-hot-toast";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserDataContext);
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}users/login`,
        { email, password }
      );

      if (response.status === 200) {
        toast.success("Welcome back! 🚗🔥");

        const data = response.data;
        setUser(data.user);

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        navigate("/home");
      }
    } catch (error) {
      toast.error("Invalid email or password ❌");
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-[#F5F5F5] flex flex-col">

      {/* Centered Login Card */}
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md bg-white mx-4 p-8 rounded-2xl shadow-md">

          <img src={WheelzyLogo} alt="Wheelzy" className="w-48 mb-8 mx-auto" />

          <h2 className="text-3xl font-bold text-[#E23744] text-center">
            Welcome Back 👋
          </h2>

          <p className="text-gray-600 text-center mb-6">
            Login to continue your ride experience.
          </p>

          {/* Form */}
          <form onSubmit={submitHandler} className="space-y-6">

            {/* Email */}
            <div>
              <label className="text-sm font-semibold">Email Address</label>
              <input
                required
                value={email}
                type="email"
                placeholder="example@email.com"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#E23744] focus:border-[#E23744] outline-none transition"
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
              className="w-full py-3 text-lg font-semibold bg-[#E23744] hover:bg-[#FF4F5A] text-white rounded-lg transition-transform active:scale-[0.97]"
            >
              Login
            </button>
          </form>

          {/* Signup Redirect */}
          <p className="text-center text-gray-600 mt-6">
            New user?{" "}
            <Link to="/signup" className="text-[#E23744] font-medium hover:underline">
              Create Account →
            </Link>
          </p>

        </div>
      </div>

      {/* Bottom Switch */}
      <div className="p-4">
        <Link
          to="/captain-login"
          className="block text-center w-full py-3 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg text-lg font-medium transition"
        >
          Sign in as Captain 🚖
        </Link>
      </div>
    </div>
  );
};

export default UserLogin;
