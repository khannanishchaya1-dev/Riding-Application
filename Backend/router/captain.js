const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const { handleCaptainRegister, loginCaptain, getCaptainProfile, logoutCaptain,changeStatus,verifyOtp,resendOtp,forgotPassword ,resetPassword}=require('../controllers/captain');
const { authCaptain } = require('../middlewares/auth');
const Ride = require('../models/ride');
const Captain = require("../models/captain");
const upload = require("../middlewares/upload");


router.post(
  "/register",
  upload.single("image"), // ✅ multer FIRST

  [
    // Personal details
    body("email").isEmail().withMessage("Invalid Email"),

    body("phone")
      .isLength({ min: 10 })
      .withMessage("Phone number must be at least 10 digits"),

    body("firstName")
      .isLength({ min: 3 })
      .withMessage("First name must be at least 3 characters"),

    body("lastName")
      .isLength({ min: 3 })
      .withMessage("Last name must be at least 3 characters"),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),

    // Vehicle details
    body("color").notEmpty().withMessage("Vehicle color is required"),

    body("vehicleModel")
      .notEmpty()
      .withMessage("Vehicle model is required"),

    body("capacity")
      .isInt({ min: 1 })
      .withMessage("Capacity must be at least 1"),

    body("vehicleType")
      .isIn(["Car", "Moto", "Auto"])
      .withMessage("Vehicle type must be Car, Moto, or Auto"),

    body("numberPlate")
      .notEmpty()
      .withMessage("Number plate is required"),
  ],

  handleCaptainRegister
);

router.post('/login',[
  body("email").isEmail().withMessage('Invalid Email'),
  body("password").isLength({min:6}).withMessage("Password mus be of atleast 6 charchters long")
],
loginCaptain
);
router.get("/profile",authCaptain,getCaptainProfile);
router.get("/logout",authCaptain,logoutCaptain);
router.post("/status",[body("status")
  .isBoolean()
  .withMessage("Status must be true or false")]
        ,authCaptain,changeStatus)

router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/find-ride/:id", async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id).populate("userId").select('+otp');

    if (!ride) return res.status(404).json({ message: "Ride not found" });
console.log(ride);
    res.json({ ride });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.delete("/delete-account", authCaptain, async (req, res) => {
  try {
    const captain =await Captain.findById(req.captain._id);
    if (!captain) return res.status(404).json({ message: "Captain not found" });
    await Captain.findByIdAndDelete(req.captain._id);
    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete account" });
  }
});
router.post("/cancel-ride", authCaptain, );
// GET /captain/location/:id
router.get("/location/passenger", authCaptain,async (req,res)=>{
  console.log("hello jiji")
  const captain = req.captain;
  console.log("captain is.....",captain)
  res.json({ lat: captain.location.coordinates[1], lon: captain.location.coordinates[0] });
});



module.exports=router;