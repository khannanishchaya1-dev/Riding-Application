const mongoose = require('mongoose');
const { randomBytes, createHmac }=require("crypto");
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
  fullname:{
    firstname:{
      type:String,
      required:true,
      minlength:[3,'First name is of atleast 3 charchters']
    },
    lastname:{
      type:String,
      required:true,
      minlength:[3,'First name is of atleast 3 charchters']
    },
    

  },
  email:{
    type:String,
    unique:true,
    required:true,
     minlength:[5,'email is of atleast 3 charchters']

  },
  password:{
    type:String,
    required:true,
  },
  socketId:{
    type:String,
  },
  salt:{
        type:String,

    },
},{ timestamps: true });

userSchema.pre("save",function(next){
   const user=this;
   if (!user.isModified("password")) return next();

    const salt=randomBytes(16).toString("hex");
    const hashedPassword = createHmac("sha256",salt)
    .update(user.password).digest("hex")
    this.salt=salt;
    this.password=hashedPassword;

    next();
});

userSchema.methods.generateAuthToken = function(){

  const payload = {
    _id:this._id,
    email:this.email,

}
const token = jwt.sign(payload,"$#Nishu@123",{expiresIn:'24h'});
return token;

};
userSchema.methods.matchPasswordAndGenerateToken=async function(password){
  const salt = this.salt;
  const hashedPassword= this.password;


  const hashedPasswordProvided = createHmac("sha256",salt)
    .update(password).digest("hex");

    if(hashedPassword !== hashedPasswordProvided) throw new Error("Incorrect Password");
    console.log('User',this.email);

    return this.generateAuthToken();


}

const USER = mongoose.model('User',userSchema);
module.exports=USER;
