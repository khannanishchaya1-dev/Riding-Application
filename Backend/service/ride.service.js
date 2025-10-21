const RIDE = require('../models/ride');
const mapService = require('./maps.service');


async function calculateFare(pickupLocation,destination,vehicleType){
  if(!pickupLocation || !destination){
    throw new error("Pickup and destination locations are required")
  }
  const baseFare = 50;//in rupees
  const distance = await mapService.getDistanceTime(pickupLocation,destination);
  const distanceInKm = distance.distance.value / 1000;
  const rates = {
    car: { perKm: 15, minFare: 80 },
    auto: { perKm: 10, minFare: 60 },
    moto: { perKm: 8, minFare: 40 }
  };

  const durationInMin = distance.duration.value / 60;
  const timeRates = { car: 0.5, auto: 0.3, moto: 0.2 }; // rupees per minute

  function compute(VehicleType) {
    const rate = rates[VehicleType];
    const distanceCharge = distanceInKm * rate.perKm;
    const timeCharge = durationInMin * timeRates[VehicleType];
    const rawFare = baseFare + distanceCharge + timeCharge;
    return Math.max(rate.minFare, Math.round(rawFare * 100) / 100);
  }

  if(!rates[vehicleType]){
    throw new Error("Invalid vehicle type");
  }else{
    return compute(vehicleType);
  }
}
module.exports.createRideModel=async({userId,origin,destination,vehicleType})=>{
  if(!userId || !origin || !destination || !vehicleType){
    throw new Error("All fields are required to create a ride");
  }
  const fareDetails = await calculateFare(origin,destination,vehicleType);
  // Create a new ride in the database (pseudo code)
  const newRide = await RIDE.create({
    userId,
    origin,
    destination,
    vehicleType,
    fare: fareDetails
  });
  return newRide;
}