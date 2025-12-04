const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const { createUser } = require("../service/user");
const BlacklistedToken = require("../models/blacklist.token");

const handleUserRegister = async (req, res, next) => {
  const { email, password, fullname } = req.body;
  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const isUserAlreadyExist = await User.findOne({ email });

if (isUserAlreadyExist) {
  return res.status(400).json({ message: "User already exists" });
}
  const user = await User.create({
    fullname: {
      firstname: fullname.firstname,
      lastname: fullname.lastname,
    },
    email:email,
    password:password,
  });

  const token = user.generateAuthToken();
  res.cookie("token",token);
  res.status(201).json({ token, user });
};
const handleUserLogin =async  (req,res,next)=>{

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {email,password} = req.body;
  if(!email || !password){
    throw new Error("All fields are required");
  }
  
  
  const user = await User.findOne({email}).select('+password');

  if(!user){
    return res.status(401).json({message:'Invalid email and password'});
  }
  const token = await user.matchPasswordAndGenerateToken(password);
  res.cookie("token",token);
  res.status(200).json({message:"Welcome",token,user});


};
const getUserProfile = (req,res,next)=>{
return res.status(200).json(req.user)
}
const logoutUser = async (req, res) => {
  // First check cookie
  let token = req.cookies?.token;

  // If no cookie, check Authorization header
  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    if (parts.length === 2 && parts[0] === "Bearer") {
      token = parts[1];
    }
  }

  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  // Add token to blacklist so it can't be reused
  await BlacklistedToken.create({ token });

  // Clear cookie if exists
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });

  return res.status(200).json({ message: "User logged out" });
};


module.exports = {
  handleUserRegister,
  handleUserLogin,
  getUserProfile,
  logoutUser,
}
