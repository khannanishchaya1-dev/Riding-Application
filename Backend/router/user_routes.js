const express = require('express');
const router = express.Router();
const{body} = require('express-validator');
const { handleUserRegister, handleUserLogin, getUserProfile, logoutUser,verifyOTP,resendOtp,forgotPassword,resetPassword } =require('../controllers/user');
const { authUser } = require('../middlewares/auth');
router.post('/register',[
  body('email').isEmail().withMessage('Invalid Email'),
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

module.exports=router;