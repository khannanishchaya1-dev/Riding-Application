const Report = require("../models/reports");
const Ride = require("../models/ride");

exports.reportPassenger = async (req, res) => {
  try {
    const { rideId, passengerId, reason } = req.body;
    
    const report = await Report.create({
      rideId,
      reportedBy: req.captain._id,
      reporterType: "captain",
      reportedUser: passengerId,
      reportedUserType: "user",
      reason,
    });
    Ride.findById(rideId).then(ride => {
      if (ride) {
        ride.reportedbyCaptain = true;
        ride.save();
      }
    });

    res.status(201).json({ message: "Report submitted", report });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Report failed" });
  }
};
 exports.reportCaptain = async (req, res) => {
  try {
    const { rideId, captainId, reason } = req.body;
    
    const report = await Report.create({
      rideId,
      reportedBy: req.user._id,
      reporterType: "user",
      reportedUser: captainId,
      reportedUserType: "captain",
      reason,
    });
    Ride.findById(rideId).then(ride => {
      if (ride) {
        ride.reportedbyPassenger = true;
        ride.save();
      }
    });

    res.status(201).json({ message: "Report submitted", report });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Report failed" });
  }
};
