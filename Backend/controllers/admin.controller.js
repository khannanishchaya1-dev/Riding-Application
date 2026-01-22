const Admin = require("../models/admin.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Captain = require("../models/captain");
const Ride = require("../models/ride");

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const passMatch = await bcrypt.compare(password, admin.password);
    if (!passMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const admin = await Admin.create(req.body);
    res.status(201).json({ admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAdminStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const captains = await Captain.countDocuments();
    const rides = await Ride.countDocuments();

    return res.json({
      success: true,
      stats: {
        users,
        captains,
        rides
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }); // newest first

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.getAllCaptains = async (req, res) => {
  try {
    const captains = await Captain.find().sort({ createdAt: -1 }); // newest first

    res.json({
      success: true,
      count: captains.length,
      captains
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.getAllRides = async (req, res) => {
  try {
    const rides = await Ride.find().populate("userId captain").sort({ createdAt: -1 }); // newest first

    res.json({
      success: true,
      count: rides.length,
      rides
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.getRideStats = async (req, res) => {
  try {

    const stats = {
      completed: await Ride.countDocuments({ status: "COMPLETED" }),
      ongoing: await Ride.countDocuments({ status: "ONGOING" }),
      requested: await Ride.countDocuments({ status: "REQUESTED" }),
      cancelledByUser: await Ride.countDocuments({ status: "CANCELLED_BY_USER" }),
      cancelledByCaptain: await Ride.countDocuments({ status: "CANCELLED_BY_CAPTAIN" }),
    };

    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
exports.blockUnblockUser = async(req,res)=>{
  try{
    const {userId}=req.params;
    if(!userId){
      return res.status(400).json({message:"User ID is required"});
  }
    const user = await User.findById(userId);
    if(!user){
      return res.status(404).json({message:"User not found"});
    }
    user.blocked = !user.blocked;
    await user.save();
    const statusMessage = user.blocked ? "blocked" : "unblocked";
    res.json({ success: true, message: `User ${statusMessage} successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.blockUnblockCaptain = async(req,res)=>{
  try{
    const {captainId}=req.params;
    if(!captainId){
      res.status(400).json({message:"Captain ID is required"});
    }
    const captain = await Captain.findById(captainId);
    if(!captain){
      return res.status(404).json({message:"Captain not found"});
    }
    captain.blocked = !captain.blocked;
    await captain.save();
    const statusMessage = captain.blocked ? "blocked" : "unblocked";
    res.json({ success: true, message: `Captain ${statusMessage} successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}