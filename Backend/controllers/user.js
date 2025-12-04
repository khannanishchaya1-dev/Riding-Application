const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const { createUser } = require("../service/user");
const BlacklistedToken = require("../models/blacklist.token");
const sendOTP = require("./emailService");
const crypto = require("crypto");

const handleUserRegister = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "User already exists" });

    const otp = (Math.floor(100000 + Math.random() * 900000)).toString();

    user = await User.create({
      fullname,
      email,
      password,
      otp,
      otpExpires: Date.now() + 5 * 60 * 1000, // 5 mins
    });

    // 🔥 send OTP
    await sendOTP(email, otp);

    res.status(201).json({
      message: "OTP sent to email",
      email,
    });

  } catch (err) {
    console.log("❌ OTP send error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const handleUserLogin =async  (req,res,next)=>{

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {email,password} = req.body;
  if(!email || !password){
    throw new Error("All fields are required");
  }
  
  
  const user = await User.findOne({email}).select('+password');

  if(!user){
    return res.status(401).json({message:'Invalid email and password'});
  }
  const token = await user.matchPasswordAndGenerateToken(password);
  res.cookie("token",token);
  res.status(200).json({message:"Welcome",token,user});


};
const getUserProfile = (req,res,next)=>{
return res.status(200).json(req.user)
}
const logoutUser = async (req, res) => {
  // First check cookie
  let token = req.cookies?.token;

  // If no cookie, check Authorization header
  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    if (parts.length === 2 && parts[0] === "Bearer") {
      token = parts[1];
    }
  }

  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  // Add token to blacklist so it can't be reused
  await BlacklistedToken.create({ token });

  // Clear cookie if exists
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });

  return res.status(200).json({ message: "User logged out" });
};
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: "User not found" });

  if (user.otp !== otp || user.otpExpires < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.otp = null;
  user.otpExpires = null;
  user.isVerified = true;
  await user.save();

  return res.status(200).json({
    message: "OTP verified successfully",
    user,
    token: "JWT_LATER", // replace with real JWT
  });
};
exports.resendOtp = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
  user.otp = otp;
  user.otpExpires = Date.now() + 5 * 60 * 1000;
  await user.save();

  await sendOTP(email, otp);

  res.json({ message: "New OTP sent!" });
};
const resendOtp = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
  user.otp = otp;
  user.otpExpires = Date.now() + 5 * 60 * 1000;
  await user.save();

  await sendOTP(email, otp);

  res.json({ message: "New OTP sent!" });
};


module.exports = {
  handleUserRegister,
  handleUserLogin,
  getUserProfile,
  logoutUser,
  verifyOTP,
  resendOtp,

}
