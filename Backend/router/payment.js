const express = require('express');
const router = express.Router();
const paymentController = require("../controllers/payment");
const authenticate = require("../middlewares/auth"); // if auth required
const {body}=require('express-validator');

// Create Razorpay Order
router.post("/create-order", authenticate.authUser, paymentController.createOrder);

// Verify Razorpay Payment
router.post("/verify", authenticate.authUser, paymentController.verifyPayment);
router.post("/cash-payment",body('rideId').isMongoId().withMessage('invalid rideId'), authenticate.authUser, paymentController.handleCashPayment);

module.exports = router;
