const Razorpay= require("razorpay");
const crypto = require("crypto");
const Ride = require("../models/ride");
const { sendSocketMessageTo } = require("../socket");
const { validationResult } = require('express-validator');
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

module.exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid amount is required",
      });
    }

    console.log("Creating Razorpay Order, amount (paise):", amount);

    const options = {
      amount: Math.round(amount), // already in paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    console.log("Order created:", order.id);

    return res.status(200).json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Razorpay create order error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
    });
  }
};

module.exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      rideId,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !rideId
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification fields",
      });
    }

    // 🔐 Verify signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("Signature mismatch");
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // ✅ Update ride payment status
    await Ride.findByIdAndUpdate(rideId, {
      paymentStatus: "PAID",
    });

    const ride = await Ride.findById(rideId).populate("captain userId");

    // 🚨 Notify Captain
    if (ride?.captain?.socketId) {
      sendSocketMessageTo(ride.captain.socketId, {
        event: "payment-success",
        data: ride,
      });
    }

    // 🚨 Notify User
    if (ride?.userId?.socketId) {
      sendSocketMessageTo(ride.userId.socketId, {
        event: "payment-status-updated",
        data: ride,
      });
    }

    console.log("Payment verified successfully for ride:", rideId);

    return res.json({
      success: true,
      message: "Payment verified and updated",
    });
  } catch (error) {
    console.error("Payment verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};

module.exports.handleCashPayment = async (req, res) => {
  try {
    const { rideId } = req.body;

    if (!rideId) {
      return res.status(400).json({
        success: false,
        message: "Ride ID is required",
      });
    }

    await Ride.findByIdAndUpdate(rideId, {
      paymentStatus: "PAID",
    });

    const ride = await Ride.findById(rideId).populate("captain userId");

    if (ride?.captain?.socketId) {
      sendSocketMessageTo(ride.captain.socketId, {
        event: "payment-success",
        data: ride,
      });
    }

    if (ride?.userId?.socketId) {
      sendSocketMessageTo(ride.userId.socketId, {
        event: "payment-status-updated",
        data: ride,
      });
    }

    return res.json({
      success: true,
      message: "Cash payment handled successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Cash payment failed",
    });
  }
};
