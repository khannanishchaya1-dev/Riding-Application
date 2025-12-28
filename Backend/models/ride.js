const mongoose = require('mongoose');

const coordinateSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lon: { type: Number, required: true }
}, { _id: false });

const rideSchema = new mongoose.Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user',
    required:true
  },
  captain:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'captain',
    default:null
  },

  // Address strings
  origin:{
    type:String,
    required:true
  },
  destination:{
    type:String,
    required:true
  },

  // 📍 New fields — actual coordinates
  originCoordinates: {
    type: coordinateSchema,
    required: true
  },
  destinationCoordinates: {
    type: coordinateSchema,
    required: true
  },

  status:{
    type:String,
    enum:['REQUESTED','ACCEPTED','ONGOING','COMPLETED','CANCELLED_BY_USER','CANCELLED_BY_CAPTAIN'],
    default:'REQUESTED'
  },

  fare:{ type:Number },
  duration:{ type:Number }, // seconds
  distance:{ type:Number }, // meters

  paymentId:{ type:String },
  paymentStatus:{
    type:String,
    enum:['PENDING','PAID','FAILED'],
    default:'PENDING'
  },
  OrderId:{ type:String },
  Signature:{ type:String },

  otp:{ type:String, select:false },

  vehicleType:{
    type:String,
    enum:['Car','Moto','Auto'],
    required:true
  }
}, { timestamps:true });

module.exports = mongoose.model('RIDE', rideSchema);
