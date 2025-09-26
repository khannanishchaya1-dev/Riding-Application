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
const logoutUser = async (req,res,next)=>{
  const token = req.cookies.token;

  await BlacklistedToken.create({token});
  res.clearCookie('token',{httpOnly: true});

   res.status(200).json({message:"user logged out"})
};


module.exports = {
  handleUserRegister,
  handleUserLogin,
  getUserProfile,
  logoutUser,
}
