const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const { createUser } = require("../service/user");
const BlacklistedToken = require("../models/blacklist.token");
const {sendOTP,sendEmail} = require("./emailService");
const crypto = require("crypto");

const PendingUser = require("../models/PendingUser");
const jwt = require('jsonwebtoken');

const handleUserRegister = async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    // Check if already exists in main user table
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered." });

    // Delete old pending record if exists
    await PendingUser.deleteOne({ email });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save temporary user
    await PendingUser.create({
      email,
      fullname,
      password,
      otp,
      createdAt: Date.now(),
    });

    // Send email
    await sendOTP(email, otp);

    res.status(201).json({ message: "OTP sent. Verify email to continue." });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong." });
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

  const pending = await PendingUser.findOne({ email });

  if (!pending) return res.status(400).json({ message: "No pending verification found." });

  if (pending.otp !== otp) return res.status(400).json({ message: "Invalid OTP." });

  // Create user
  const user = await User.create({
    fullname: pending.fullname,
    email: pending.email,
    password: pending.password,
  });

  // Delete pending record
  await PendingUser.deleteOne({ email });
  const token = jwt.sign({ _id: user._id, role: "user" }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });
  

  res.status(200).json({ message: "Email verified. Account created!", user,token });
};
const resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    // Find user in pending DB, not main users table
    const pending = await PendingUser.findOne({ email });

    if (!pending) {
      return res.status(404).json({
        message: "No pending registration found. Please sign up again."
      });
    }

    // Generate new OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Update pending record
    pending.otp = newOtp;
    pending.createdAt = Date.now(); // Reset expiry timer
    await pending.save();

    // Send updated OTP
    await sendOTP(email, newOtp);

    res.json({ message: "📨 New OTP sent to your email!" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to resend OTP." });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found." });

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();

  const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

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

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  });
console.log(user);
  if (!user) return res.status(400).json({ message: "Token expired or invalid" });

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.json({ message: "Password reset successful 🎉" });
};

module.exports = {
  handleUserRegister,
  handleUserLogin,
  getUserProfile,
  logoutUser,
  verifyOTP,
  resendOtp,
  forgotPassword,
  resetPassword,

}
