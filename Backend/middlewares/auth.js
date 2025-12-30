const USER = require('../models/user');
const Captain = require('../models/captain');
const jwt  = require('jsonwebtoken');
const BlacklistedToken = require("../models/blacklist.token")


module.exports.authUser = async (req,res,next)=>{
  const secretKey = process.env.JWT_SECRET;
  const token =
  req.cookies.token ||
  (req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.split(' ')[1]
    : null);
  if(!token){
    console.log("No token")
    return res.status(401).json({message:"Unauthorized"})
  }
  const isblacklisted = await BlacklistedToken.findOne({ token });
    if (isblacklisted) {
      console.log("Blacklisted token used:", token);
      return res.status(401).json({ message: "undefined" }); // 👈 as you asked
    }
  try{
    //send payload
    const currUser = jwt.verify(token, secretKey);
    console.log("Decoded token:", currUser);
    const user =await USER.findById(currUser._id);
    req.user = user;
  next();
  }catch(error){
    return res.status(401).json({message:"Unauthorized"});

  }
  

}
module.exports.authCaptain = async (req,res,next)=>{
  //extract token from cookies
  const token =
  req.cookies.token ||
  (req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.split(' ')[1]
    : null);
  if(!token){
    console.log("No token")
    return res.status(401).json({message:"Unauthorized"})
  }
  //check wether belongs to blacklist
  const isblacklisted = await BlacklistedToken.findOne({ token });
    if (isblacklisted) {
      console.log("Blacklisted token used:", token);
      return res.status(401).json({ message: "undefined" }); // 👈 as you asked
    }

  try{
    //send payload
    const currCaptain = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", currCaptain);
    //find from db and send to header
    const captain =await Captain.findById(currCaptain._id);
    req.captain = captain;
  next();
  }catch(error){
    return res.status(401).json({message:"Unauthorized"});

  }
  

}
module.exports.adminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Admin unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") return res.status(403).json({ message: "Forbidden" });
    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};