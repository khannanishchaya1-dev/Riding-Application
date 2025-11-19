const Captain = require('../models/captain');
const { validationResult }=require('express-validator');
const BlacklistedToken = require('../models/blacklist.token')
const handleCaptainRegister = async (req, res) => {
    // 1. Check for validation errors from express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Destructure all required fields, including the newly added 'phone'
    const { email, fullname, vehicle, password, phone } = req.body;

    // 2. Check if Captain already exists based on unique fields (email, phone, numberPlate)
    const isCaptainAlreadyExist = await Captain.findOne({
        $or: [{ email }, { phone }, { 'vehicle.numberPlate': vehicle.numberPlate }]
    });

    if (isCaptainAlreadyExist) {
        let message = "Captain account already exists.";
        
        // Provide a specific message based on which field caused the conflict
        if (isCaptainAlreadyExist.email === email) {
            message = "A captain with this email already exists. Please login or use a different email.";
        } else if (isCaptainAlreadyExist.phone === phone) {
            message = "A captain with this phone number already exists.";
        } else if (isCaptainAlreadyExist.vehicle.numberPlate === vehicle.numberPlate) {
            message = "A captain with this vehicle number plate already exists.";
        }
        
        return res.status(400).json({ message });
    }

    // 3. Create the new captain document
    const captain = await Captain.create({
        fullname: {
            firstname: fullname.firstname,
            lastname: fullname.lastname,
        },
        email: email,
        phone: phone, // ⭐ Added phone
        password: password,
        status: "inactive", 
        vehicle: {
            color: vehicle.color,
            capacity: vehicle.capacity,
            vehicleType: vehicle.vehicleType,
            vehicleModel: vehicle.vehicleModel, // ⭐ Added vehicleModel
            numberPlate: vehicle.numberPlate,
        },
    });

    // 4. Generate token and send response
    const token = captain.generateAuthToken();

    // Assuming you have 'res.cookie' implementation available
    res.cookie("token", token);
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