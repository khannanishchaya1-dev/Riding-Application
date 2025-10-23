const Captain = require('../models/captain');
const { validationResult }=require('express-validator');
const BlacklistedToken = require('../models/blacklist.token')
const handleCaptainRegister = async (req,res,next)=>{
  // const body  = req.body;
  // if(!body.email || !body.password)
  //|| not required
const errors = validationResult(req);
if(!errors.isEmpty()){
   return res.status(400).json({ errors: errors.array() });
}
const {email,fullname,vehicle,password} = req.body;
const isCaptainAlreadyExist=await Captain.findOne({email})
if(isCaptainAlreadyExist){
  return res.status(400).json({message:"Captain already exists"});
}

const captain = await Captain.create({
  fullname: {
    firstname: fullname.firstname,
    lastname: fullname.lastname || "",
  },
  email: email,
  password:password,
  status: "inactive", // default, can be changed later
  vehicle: {
    color: vehicle.color,
    capacity: vehicle.capacity,
    vehicleType:vehicle.vehicleType,
    numberPlate: vehicle.numberPlate,
  },

});
const token = captain.generateAuthToken();

res.cookie("token",token);
res.status(201).json({ token, captain });


};
const loginCaptain = async (req,res,next)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
  }
  const {email,password} = req.body;
  console.log(password);
  if(!email || !password){
    throw new Error("All fields are required");
  }
  const captain = await Captain.findOne({email});
  if(!captain){
    return res.status(401).json({message:'Invalid email and password'});
  }
  console.log("captain",captain);
  const token = await captain.matchPasswordAndGenerateToken(password);
  
  res.cookie("token",token);
  res.status(200).json({message:"Welcome",token,captain});


};
const getCaptainProfile =(req,res,next)=>{
return res.status(200).json(req.captain);
}

const logoutCaptain = async (req,res,next)=>{
  const token = req.cookies.token;
   if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }

  await BlacklistedToken.create({token});
  res.clearCookie('token');
  


  res.status(200).json({message:"logout Success"})
}






module.exports={
  handleCaptainRegister,
  loginCaptain,
  getCaptainProfile,
  logoutCaptain,
}