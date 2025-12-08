
const RIDE = require('../models/ride');
const mapService = require('./maps.service');
const crypto = require('crypto');
const rideModel = require('../models/ride')
const captainModel = require('../models/captain')


module.exports.calculateFare=async (origin,destination)=>{
   
 
  if(!origin || !destination){
    throw new error("Pickup and destination locations are required")
  }
  
  const baseFare = 50;//in rupees
  const distance = await mapService.getDistanceTime(origin,destination);
  

  const distanceInKm = distance.distance.value / 1000;
  const rates = {
    Car: { perKm: 15, minFare: 80 },
    Auto: { perKm: 10, minFare: 60 },
    Moto: { perKm: 8, minFare: 40 }
  };
  

  const durationInMin = distance.duration.value / 60;
  const timeRates = { Car: 0.5, Auto: 0.3, Moto: 0.2 }; // rupees per minute
  function compute(VehicleType) {
    const rate = rates[VehicleType];
    const distanceCharge = distanceInKm * rate.perKm;
    const timeCharge = durationInMin * timeRates[VehicleType];
    const rawFare = baseFare + distanceCharge + timeCharge;
    return Math.max(rate.minFare, Math.round(rawFare * 100) / 100);
  }

  const fares={
    Car:compute('Car'),
    Auto:compute('Auto'),
    Moto:compute('Moto')
  }
 

  return fares;
}

module.exports.createRideModel=async({userId,origin,destination,vehicleType})=>{
  
  if(!userId || !origin || !destination || !vehicleType){
    console.log("issue in frontend")
    throw new Error("All fields are required to create a ride");
  }

  const fareDetails = await this.calculateFare(origin,destination);
  
  const DistanceTime = await mapService.getDistanceTime(origin,destination);
  
  
  // Create a new ride in the database (pseudo code)
  
  const newRide = await RIDE.create({
    userId,
    origin,
    destination,
    vehicleType,
    fare: fareDetails[vehicleType],
    otp:this.generateOTP(6),
    distance:(Number(DistanceTime.distance.value)),
    duration:(Number(DistanceTime.duration.value)),
  });
  return newRide;
}
module.exports.generateOTP=(nums)=>{
  if(!nums || nums<=0){
    throw new Error("Invalid number of digits for OTP");
  }
  let otp="";
  for(let i=0;i<nums;i++){
    otp+=crypto.randomInt(0,10).toString();
  }
  return otp;



}
module.exports.cancelRide=async({rideId})=>{
  if(!rideId){
    throw new Error('Ride id is required');
  }
  const ride = await rideModel.findOne({_id:rideId,}).populate('userId');
  if(!ride){
    throw new Error('Ride not found');
  }
  ride.status = "CANCELLED_BY_CAPTAIN";
  await ride.save();
  return ride;
  
}
module.exports.userCancelRide=async({rideId})=>{
  if(!rideId){
    throw new Error('Ride id is required');
  }
  const ride = await rideModel.findOne({_id:rideId,}).populate('captain');
  if(!ride){
    throw new Error('Ride not found');
  }
  ride.status = "CANCELLED_BY_USER";
  await ride.save();
  return ride;
  
}
module.exports.confirmRide = async ({
    rideId, captain
}) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'ACCEPTED',
        captain: captain._id
    })
console.log(captain)
    const ride = await rideModel
  .findOne({ _id: rideId })
  .populate('userId')
  .populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    return ride;

}
module.exports.rideStart = async ({rideId,otp,captain})=>{
  if(!rideId || !otp){
    throw new Error('Ride id and otp are required');
  }
  const ride = await rideModel.findOne({_id:rideId}).populate('userId').populate('captain').select('+otp');
  if(!ride){
    throw new Error('Ride not found');

  }
  if(ride.status!=='ACCEPTED'){
    throw new error("ride not accepted yet")
  }
  if(ride.otp!==otp){
    throw new Error('Invalid OTP');
  }
  await rideModel.findByIdAndUpdate({_id:rideId},
    {
      status:"ONGOING"
    });


return ride;
}
module.exports.endRide= async({rideId,captain})=>{
  console.log(captain);
  if(!rideId || !captain){
    throw new Error('Ride Id is Required');

  }
  const ride = await rideModel.findOne({_id:rideId,captain:captain._id}).populate('userId').populate('captain').select('+otp');
  if(!ride){
    throw new Error('Ride not found');
  }
  if(ride.status!=="ONGOING")
  {
    throw new Error('Ride not started');
  }
  await rideModel.findOneAndUpdate({_id:rideId},{
    status:'COMPLETED'
  
  });
  return ride;

}
module.exports.findRidesByUser = async (user_id) => {
  if (!user_id) {
    throw new Error("User ID is required");
  }

  const rides = await RIDE.find({ userId: user_id })
    .populate("userId")
    .populate("captain")
    .sort({ createdAt: -1 }); 

  return rides;
};
module.exports.findRidesByCaptain = async (captain_id) => {
  
  if (!captain_id) {
    throw new Error("User ID is required");
  }

  const rides = await RIDE.find({ captain: captain_id })
    .populate("userId")
    .populate("captain")
    .sort({ createdAt: -1 }); 

  return rides;
};


module.exports.setStatus = async (captain, status) => {
  if (!captain) {
    throw new Error("Captain is required");
  }


  const updatedCaptain = await captainModel.findByIdAndUpdate(
    captain._id, 
    { status: status }, 
    { new: true }  // returns updated doc
  );

  return updatedCaptain;
};
