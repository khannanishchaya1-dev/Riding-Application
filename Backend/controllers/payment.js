const Razorpay= require("razorpay");
const crypto = require("crypto");
const Ride = require("../models/ride");
const { sendSocketMessageTo } = require("../socket");
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

module.exports.createOrder = async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount,
    currency: "INR",
    receipt: "receipt_" + Date.now(),
  };

  const order = await razorpay.orders.create(options);
  res.json(order);
};

module.exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, rideId } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  // Validate signature
  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ success: false, message: "Invalid payment signature" });
  }

  try {
    // Update DB
    await Ride.findByIdAndUpdate(rideId, { paymentStatus: "PAID" });

    // Get updated ride details
    const ride = await Ride.findById(rideId).populate("captain userId");
console.log(ride);
    // 🚨 Notify captain (to allow finishing ride)
    sendSocketMessageTo(ride.captain.socketId, {
      event: "payment-success",
      data: ride,
    });
console.log("payment send to captain frontend");
    // 🚨 Notify user (UI update)
    sendSocketMessageTo(ride.userId.socketId, {
      event: "payment-status-updated",
      data: ride,
    });
console.log("payment send to user frontend")
    return res.json({ success: true, message: "Payment verified and updated" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Payment update failed" });
  }
};
