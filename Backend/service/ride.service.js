const RIDE = require('../models/ride');
const mapService = require('./maps.service');


async function calculateFare(pickupLocation,destination){
  if(!pickupLocation || !destination){
    throw new error("Pickup and destination locations are required")
  }
  const baseFare = 50;//in rupees
  const distance = await mapService.getDistanceTime(pickupLocation,destination);
  

}