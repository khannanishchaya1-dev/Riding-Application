const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const { handleCaptainRegister, loginCaptain, getCaptainProfile, logoutCaptain }=require('../controllers/captain');
const { authCaptain } = require('../middlewares/auth');
router.post('/register',
[
    body("email").isEmail().withMessage("Invalid Email"),
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("First name must be at least 3 characters"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("vehicle.color").notEmpty().withMessage("Vehicle color is required"),
    body("vehicle.capacity")
      .isInt({ min: 1 })
      .withMessage("Capacity must be at least 1"),
    body("vehicle.vehicleType")
      .isIn(["car", "motorcycle"])
      .withMessage("Vehicle type must be either car or motorcycle"),
    body("vehicle.numberPlate")
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




module.exports=router;