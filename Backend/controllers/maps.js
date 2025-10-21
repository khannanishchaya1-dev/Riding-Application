const mapService = require("../service/maps.service");
const { validationResult } = require('express-validator');

module.exports.getCoordinates=async(req,res)=>{
  const errors=validationResult(req);
  if(!errors.isEmpty()){
    res.status(400).json({errors:errors.array()})

  }
  const {address} = req.query;
  try{
    const coordinates = await mapService.getCoordinatesfromAddress(address);
    res.status(200).json({coordinates});

  }catch(error){
    console.log(error);
    res.status(500).json({message:"Internal server error"});
    
  }
}

module.exports.getDistanceTime=async(req,res)=>{
  const errors=validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});
  }
  const {origin,destination} = req.query;
  try{
    const distanceTime = await mapService.getDistanceTime(origin,destination);
    res.status(200).json({distanceTime});
  }catch(error){
    console.log(error);
    res.status(500).json({message:"Internal server error"});
  }
}
module.exports.getSuggestions=async(req,res)=>{
  const errors=validationResult(req);
  if(!errors.isEmpty()){
  return res.status(400).json({errors:errors.array()});
  }
  const {input} = req.query;
  try{
    const suggestions = await mapService.getAutoSuggestions(input);
    res.status(200).json({suggestions});
  }catch(error){
    res.status(500).json({message:"Internal server error"});
}
}