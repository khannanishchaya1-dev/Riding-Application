const rideService = require('../service/ride.service');
const { validationResult } = require('express-validator');

// Further ride controller functions would go here
module.exports.createRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newRide = await rideService.createRideModel({userId: req.body.userId, origin: req.body.origin, destination: req.body.destination, vehicleType: req.body.vehicleType});
    return res.status(201).json(newRide);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}