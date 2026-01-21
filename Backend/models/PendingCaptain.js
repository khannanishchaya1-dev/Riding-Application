const mongoose = require("mongoose");

const pendingCaptainSchema = new mongoose.Schema({
  fullname: Object,
  email: String,
  phone: String,
  vehicle: Object,
  password: String, // Must already be hashed if using hashing middleware
  otp: String,
  avatar: {
  type: String,
  default: "",
},
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600 // auto delete after 10 minutes
  }
});

module.exports = mongoose.model("PendingCaptain", pendingCaptainSchema);
