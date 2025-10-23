const rideService = require('../service/ride.service');
const { validationResult } = require('express-validator');
const {calculateFare}=require('../service/ride.service');

// Further ride controller functions would go here
module.exports.createRide = async (req, res) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  

  try {    
    const newRide = await rideService.createRideModel({userId: req.user._id, origin: req.body.origin, destination: req.body.destination, vehicleType: req.body.vehicleType});
    
    return res.status(201).json(newRide);
  } catch (error) {
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
  
 const final_fare = await calculateFare(origin,destination);
 return res.status(200).json({final_fare});
 }catch(error){
  res.status(500).json({message:error.message});
 }
}
