const USER = require('../models/user');
const Captain = require('../models/captain');
const jwt  = require('jsonwebtoken');
const BlacklistedToken = require("../models/blacklist.token")


module.exports.authUser = async (req,res,next)=>{
  const token = req.cookies.token; //|| //req.headers.authorization.split(" ")[1];
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
    const currUser = jwt.verify(token,"$#Nishu@123");
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
  const token = req.cookies.token;
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
    const currCaptain = jwt.verify(token,"$#Nishu@123");
    console.log("Decoded token:", currCaptain);
    //find from db and send to header
    const captain =await Captain.findById(currCaptain._id);
    req.captain = captain;
  next();
  }catch(error){
    return res.status(401).json({message:"Unauthorized"});

  }
  

}