const USER = require('../models/user');

const createUser = async (req,res)=>{
  
  if(!body.email || body.password || !body.firstname){
    throw new Error("All fields are required");
  }
  const user =await USER.create({
    fullname:{
      firstname,
      lastname
    },
    email,
    password,
  });

}
module.exports={
  createUser
}