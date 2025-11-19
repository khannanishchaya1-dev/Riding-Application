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
    enum:['PENDING','ACCEPTED','IN_PROGRESS','COMPLETED','CANCELLED'],
    default:'PENDING'
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
  OrderId:{
    type:String
  },
  Signature:{
    type:String
  },
  otp:{
    type:String,
    select:false
  }
},{timestamps:true});
module.exports = mongoose.model('RIDE',rideSchema);
