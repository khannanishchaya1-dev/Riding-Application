const mongoose=require('mongoose');


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
  origin:{
    type:String,
    required:true
  },
  destination:{
    type:String,
    required:true
  },
  status:{
    type:String,
    enum:['REQUESTED','ACCEPTED','ONGOING','COMPLETED','CANCELLED_BY_USER','CANCELLED_BY_CAPTAIN'],
    default:'REQUESTED'
  },
  fare:{
    type:Number,
  },
  duration:{
    type:Number,//in seconds
    
  },
  distance:{
    type:Number,//in meters

  },
  paymentId:{
    type:String
  },
  paymentStatus:{
    type:String,
    enum:['PENDING','PAID','FAILED'],
    default:'PENDING'
  },
  OrderId:{
    type:String
  },
  Signature:{
    type:String
  },
  otp:{
    type:String,
    select:false
  },
  vehicleType:{
    type:String,
    enum:['Car','Moto','Auto'],
    required:true
  }
},{timestamps:true});
module.exports = mongoose.model('RIDE',rideSchema);
