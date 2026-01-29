const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  rideId: { type: mongoose.Schema.Types.ObjectId, ref: "RIDE", required: true },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, refPath: "reporterType", required: true },
  reporterType: { type: String, enum: ["user", "captain"], required: true },
  reportedUser: { type: mongoose.Schema.Types.ObjectId, refPath: "reportedUserType", required: true },
  reportedUserType: { type: String, enum: ["user", "captain"], required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ["PENDING","UNDER_REVIEW","RESOLVED","REJECTED"], default: "PENDING" },
}, { timestamps: true });

module.exports = mongoose.model("Report", reportSchema);
