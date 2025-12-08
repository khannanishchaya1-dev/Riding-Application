
const mongoose = require("mongoose");

const pendingUserSchema = new mongoose.Schema({
  fullname: Object,
  email: String,
  password: String,
  phone: String,
  otp: String,
  createdAt: Date,
}, { expires: "10m" }); // Auto delete after 10 min

module.exports = mongoose.model("PendingUser", pendingUserSchema);
