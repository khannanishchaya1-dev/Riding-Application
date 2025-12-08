const express = require('express');
const router = express.Router();
const{body} = require('express-validator');
const Ride = require('../models/ride');
const User = require("../models/user");
const { handleUserRegister, handleUserLogin, getUserProfile, logoutUser,verifyOTP,resendOtp,forgotPassword,resetPassword } =require('../controllers/user');
const { authUser } = require('../middlewares/auth');
router.post('/register',[
  body('email').isEmail().withMessage('Invalid Email'),
  body("phone") // ⭐ NEW: Phone validation (assuming min 10 digits)
        .isLength({ min: 10 })
        .withMessage("Phone number must be at least 10 digits"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
],handleUserRegister);


router.post('/login',[
  body('email').isEmail().withMessage('Invalid email'),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
],handleUserLogin);

router.get('/profile',authUser,getUserProfile);
router.get('/logout',authUser,logoutUser)
router.post("/register", handleUserRegister);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/find-ride/:id", async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate("captain").select('+otp');

    if (!ride) return res.status(404).json({ message: "Ride not found" });
console.log(ride);
    res.json({ ride });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.delete("/delete-account", authUser, async (req, res) => {
  try {
    const user =await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    await User.findByIdAndDelete(req.user._id);
    console.log("User deleted");
    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete account" });
  }
});



module.exports=router;