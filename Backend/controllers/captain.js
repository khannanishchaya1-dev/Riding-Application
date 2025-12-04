const Captain = require('../models/captain');
const { validationResult }=require('express-validator');
const BlacklistedToken = require('../models/blacklist.token')
const {setStatus} = require('../service/ride.service');
const  sendOTP  = require("./emailService");
const jwt = require('jsonwebtoken');

const handleCaptainRegister = async (req, res) => {
  try {
    const { fullname, email, phone, password, vehicle } = req.body;

    const exists = await Captain.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const captain = await Captain.create({
      fullname,
      email,
      phone,
      password,
      vehicle,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    // Send OTP email
   
    await sendOTP(email, otp);
    

    return res.status(201).json({
      message: "Captain account created. Enter OTP to verify.",
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
const verifyOtp = async (req, res) => {
  
  const { email, otp } = req.body;

  const captain = await Captain.findOne({ email });
  if (!captain) return res.status(404).json({ message: "Captain not found" });
  console.log(captain.otp, otp, captain.otpExpires, Date.now());

  if (captain.otp !== otp || Date.now() > captain.otpExpires) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  captain.isVerified = true;
  captain.otp = null;
  captain.otpExpires = null;
  await captain.save();

  const token = jwt.sign(
    { _id: captain._id, role: "captain" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res.status(200).json({
    message: "Verification successful!",
    token,
    captain
  });
};
const resendOtp = async (req, res) => {
  const { email } = req.body;

  const captain = await Captain.findOne({ email });
  if (!captain) return res.status(404).json({ message: "Captain not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  captain.otp = otp;
  captain.otpExpires = Date.now() + 10 * 60 * 1000;
  await captain.save();

  await sendOTP(email, otp);

  return res.status(200).json({ message: "OTP resent successfully" });
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





module.exports={
  handleCaptainRegister,
  loginCaptain,
  getCaptainProfile,
  logoutCaptain,
  changeStatus,
  verifyOtp,
  resendOtp
}