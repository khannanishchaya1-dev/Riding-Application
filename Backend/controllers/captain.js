const Captain = require('../models/captain');
const { validationResult }=require('express-validator');
const BlacklistedToken = require('../models/blacklist.token')
const {setStatus} = require('../service/ride.service');
const  {sendOTP,sendEmail}  = require("./emailService");
const jwt = require('jsonwebtoken');
const PendingCaptain = require("../models/PendingCaptain");
const crypto = require("crypto");

const handleCaptainRegister = async (req, res) => {
  try {
    const { fullname, email, phone, password, vehicle } = req.body;

    // Check if already signed up
    const exists = await Captain.findOne({ email });
   
    if (exists) return res.status(400).json({ message: "Email already registered." });

    // Remove any previous registration attempts
    await PendingCaptain.deleteOne({ email });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store temporary record
    await PendingCaptain.create({
      fullname,
      email,
      phone,
      vehicle,
      password,
      otp
    });

console.log("pending captain created");
    // Send OTP
    await sendOTP(email, otp);
    console.log("OTP sent to:", email);
    
    return res.status(201).json({
      message: "OTP sent! Verify email to activate your captain account."
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const pending = await PendingCaptain.findOne({ email });

  if (!pending) {
    return res.status(400).json({ message: "No pending registration found. Please sign up again." });
  }

  if (pending.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  // Create actual captain
  const captain = await Captain.create({
    fullname: pending.fullname,
    email: pending.email,
    phone: pending.phone,
    password: pending.password,
    vehicle: pending.vehicle,
    isVerified: true
  });

  // Delete temporary record
  await PendingCaptain.deleteOne({ email });

  // Generate token
  const token = jwt.sign({ _id: captain._id, role: "captain" }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });

  return res.status(200).json({
    message: "Email verified — Captain account created!",
    token,
    captain
  });
};
const resendOtp = async (req, res) => {
  const { email } = req.body;

  const pending = await PendingCaptain.findOne({ email });

  if (!pending) {
    return res.status(400).json({ message: "No pending registration found." });
  }

  const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
  pending.otp = newOtp;
  pending.createdAt = Date.now(); // refresh timer
  await pending.save();

  await sendOTP(email, newOtp);

  return res.status(200).json({ message: "New OTP sent!" });
};
const loginCaptain = async (req,res,next)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
  }
  const {email,password} = req.body;
  console.log(password);
  if(!email || !password){
    throw new Error("All fields are required");
  }
  const captain = await Captain.findOne({email});
  if(!captain){
    return res.status(401).json({message:'Invalid email and password'});
  }
  console.log("captain",captain);
  const token = await captain.matchPasswordAndGenerateToken(password);
  
  res.cookie("token",token);
  res.status(200).json({message:"Welcome",token,captain});


};
const getCaptainProfile =(req,res,next)=>{
return res.status(200).json(req.captain);
}

const logoutCaptain = async (req, res) => {
  let token = req.cookies?.token;

  // Support Authorization header too
  if (!token && req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  // Blacklist token
  await BlacklistedToken.create({ token });

  // Remove cookie if it exists
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });

  return res.status(200).json({ message: "Logout Success" });
};

const changeStatus= async (req,res,next)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
     return res.status(400).json({ errors: errors.array() });
  }
  if(!req.captain){
     return res.status(400).json({ message:"no captain available" });
  }
 const {status} = req.body;
  console.log(status)
  const result = await setStatus(req.captain,status);
  return res.status(200).json({"message": `Captain status changed to ${result.status}`,"captain": result
})
}

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const captain = await Captain.findOne({ email });
  
  if (!captain) return res.status(400).json({ message: "Captain not found." });

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  captain.resetPasswordToken = resetToken;
  captain.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await captain.save();

  const resetURL = `${process.env.FRONTEND_URL}/reset-password-captain/${resetToken}`;

  await sendEmail(
    email,
    "🔐 Reset Your Wheelzy Password",
    `
      <div style="font-family:sans-serif; padding:20px;">
        <h2 style="color:#E23744;">Forgot Password? 🔄</h2>
        <p>We received a request to reset your Wheelzy password.</p>
        <p>Click below to reset it:</p>

        <a href="${resetURL}" 
          style="background:#E23744;color:white;padding:12px 18px;border-radius:8px;text-decoration:none;">
          Reset Password
        </a>

        <p style="margin-top:15px;font-size:14px;">
          If you didn't request this, you can safely ignore it.
        </p>

        <p style="font-size:12px;color:#777;">This link expires in 10 minutes.</p>
      </div>
    `
  );

  res.json({ message: "Reset email sent ✔ Check inbox." });
};


const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const captain = await Captain.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  });
console.log(token);
  if (!captain) return res.status(400).json({ message: "Token expired or invalid" });

  captain.password = password;
  captain.resetPasswordToken = undefined;
  captain.resetPasswordExpires = undefined;
  await captain.save();

  res.json({ message: "Password reset successful 🎉" });
};

module.exports={
  handleCaptainRegister,
  loginCaptain,
  getCaptainProfile,
  logoutCaptain,
  changeStatus,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
}