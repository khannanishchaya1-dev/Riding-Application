const rideService = require('../service/ride.service');
const { validationResult } = require('express-validator');
const {calculateFare}=require('../service/ride.service');
const mapService = require('../service/maps.service')
const {sendSocketMessageTo}= require('../Socket');
const rideModel = require('../models/ride');

// Further ride controller functions would go here
module.exports.createRide = async (req, res) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  

  try {  
      console.log(req.user._id, req.body.origin, req.body.destination, req.body.vehicleType);
    const newRide = await rideService.createRideModel({userId: req.user._id, origin: req.body.origin, destination: req.body.destination, vehicleType: req.body.vehicleType});
   
     res.status(201).json(newRide);
      const originCoordinates = await mapService.getCoordinatesfromAddress(req.body.origin);
    console.log(originCoordinates);
    const getCaptainsInRadius = await mapService.getCaptainsInRadius (originCoordinates.lat,originCoordinates.lon,150); 
    const distanceMatrix = await mapService.getDistanceInKm(originCoordinates.lat,originCoordinates.lon,30.6511872, 76.8835584);
    console.log(distanceMatrix);
     newRide.otp=" "// 10 km
    console.log("Captains in radius:", getCaptainsInRadius);
    const rideWithUser = await rideModel.findOne({_id:newRide._id}).populate('userId');
    (getCaptainsInRadius.map(async(captain)=>{
sendSocketMessageTo(captain.socketId,{
  event:'new-ride',
  data:rideWithUser
})
    }))
    

    
    
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message });
  }
}
module.exports.calculateFare = async (req, res) => {
 const errors = validationResult(req);
 if(!errors.isEmpty){
  res.status(400).json({errors:errors.array()});
 }
 const {origin,destination}=req.query;
 
 try{
  
 
 const final_fare = await rideService.calculateFare(origin,destination);
 return res.status(200).json({final_fare});
 }catch(error){
  // controllers/ride.js (add this export)
  res.status(500).json({message:"Internal server error"});
 }
}

module.exports.confirmRide=async (req,res)=>{
 console.log("i am here1");
const errors = validationResult(req); 
if(!errors.isEmpty()){
  return res.status(400).json({errors:errors.array()})
} 

const {rideId} = req.body;
try{

  const ride = await rideService.confirmRide({rideId,captain:req.captain});
  console.log("ride has been confirmed sent sucessfully")
  res.status(200).json({ride});
  console.log(ride.userId.socketId);
  console.log(req.captain.socketId);
   sendSocketMessageTo(ride.userId.socketId,{
     event:"ride-confirmed",
     data:ride
   })
   console.log("confirmation has been send to frontend")
  
}catch(error){
  res.status(500).json({message:error})
}

}
