const rideService = require('../service/ride.service');
const { validationResult } = require('express-validator');
const {calculateFare,findRidesByUser,findRidesByCaptain}=require('../service/ride.service');
const mapService = require('../service/maps.service')
const {sendSocketMessageTo}= require('../socket');
const rideModel = require('../models/ride');

// Further ride controller functions would go here
module.exports.createRide = async (req, res) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  

  try {
  console.log(req.user._id, req.body.origin, req.body.destination, req.body.vehicleType);

  const vehicleType = req.body.vehicleType;

  // 1️⃣ Create ride
  const newRide = await rideService.createRideModel({
    userId: req.user._id,
    origin: req.body.origin,
    destination: req.body.destination,
    vehicleType
  });

  console.log("🆕 Ride Created:", newRide);

  // 2️⃣ Convert address → coordinates
  const originCoordinates = await mapService.getCoordinatesfromAddress(req.body.origin);
  console.log("📍 Origin Coordinates:", originCoordinates);

  // 3️⃣ Get captains nearby
  const captainsNearby = await mapService.getCaptainsInRadius(
    originCoordinates.lat,
    originCoordinates.lon,
    10,
    vehicleType
  );
  console.log("captainsNearby", captainsNearby);

  console.log("🚗 Captains Found:", captainsNearby.length);

  // 4️⃣ Populate ride with user details
  const rideWithUser = await rideModel.findById(newRide._id).populate("userId");

  // 5️⃣ Emit ride request to captains
  captainsNearby.forEach(captain => {
    sendSocketMessageTo(captain.socketId, {
      event: "new-ride",
      data: rideWithUser
    });
  });

  // 6️⃣ Final response to frontend
  return res.status(201).json({
    success: true,
    message: "Ride created successfully",
    ride: rideWithUser
  });

} catch (error) {
  console.error(error);
  return res.status(500).json({ success: false, message: error.message });
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
const errors = validationResult(req); 
if(!errors.isEmpty()){
  return res.status(400).json({errors:errors.array()})
} 

const {rideId} = req.body;
try{

  const ride = await rideService.confirmRide({rideId,captain:req.captain});
  console.log("ride has been confirmed sent sucessfully")
  res.status(200).json({ride});
   sendSocketMessageTo(ride.userId.socketId,{
     event:"ride-confirmed",
     data:ride
   })
   console.log("confirmation has been send to frontend")
  
}catch(error){
  res.status(500).json({message:error})
}
}
module.exports.cancelRide = async (req, res) => {
  try {
    const { rideId } = req.body;

    if (!rideId) {
      return res.status(400).json({ message: "rideId is required" });
    }

    const ride = await rideService.cancelRide({ rideId });

    // Respond first
    res.status(200).json({
      message: "Ride cancelled successfully",
      ride
    });

    // Notify user through socket
    sendSocketMessageTo(ride.userId.socketId, {
      event: "ride-cancelled",
      data: ride
    });
    console.log(ride.userId.socketId);

    console.log("🚗 Cancellation update sent to frontend!");
    
  } catch (error) {
    console.error("Cancel Ride Error:", error);
    res.status(500).json({ message: error.message });
  }
};
module.exports.userCancelRide = async (req, res) => {
  try {
    const { rideId } = req.body;

    if (!rideId) {
      return res.status(400).json({ message: "rideId is required" });
    }

    const ride = await rideService.userCancelRide({ rideId });

    // Respond first
    res.status(200).json({
      message: "Ride cancelled successfully",
      ride
    });

    // Notify user through socket
    sendSocketMessageTo(ride.captain.socketId, {
      event: "ride-cancelled",
      data: ride
    });
    console.log(ride.captain.socketId);
    console.log("🚗 Cancellation update sent to frontend!");
    
  } catch (error) {
    console.error("Cancel Ride Error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports.startRide=async (req,res)=>{
  console.log(req.query);
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});

  }
  const {rideId,otp}=req.query;
  try{
    const ride = await rideService.rideStart({rideId,otp,captain:req.captain});
    sendSocketMessageTo(ride.userId.socketId,{
     event:"ride-started",
     data:ride
   })
   return res.status(200).json({ride});

  }catch(err){
    return res.status(500).json({message:err.message})
  } 
}
module.exports.endRide=async(req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});
  }
  const {rideId} = req.body;
  try{
    const ride = await rideService.endRide({rideId,captain:req.captain});
    sendSocketMessageTo(ride.userId.socketId,{
      event:'end-ride',
      data:ride
    })
    console.log('I am here after ending')
    return res.status(200).json(ride);
  }catch(err){
    return res.status(500).json({message:err.message});
  }

}
module.exports.findRide = async (req,res)=>{
const errors = validationResult(req);
if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});
  }
  const user_id = req.body.user_id;

  try{
    const rides = await findRidesByUser( user_id );
    res.status(200).json({
      success: true,
      count: rides.length,
      rides
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
    
}

module.exports.findCaptainRide = async (req,res)=>{
const errors = validationResult(req);
if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});
  }
  const captain_id = req.body.captain_id;
  console.log("captain",captain_id)

  try{
    const rides = await findRidesByCaptain( captain_id );
    res.status(200).json({
      success: true,
      count: rides.length,
      rides
    });
    
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
    
}

