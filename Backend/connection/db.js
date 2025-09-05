const mongoose = require('mongoose');

function connectMongodb(url){
  try{
 mongoose.connect(url).then(()=>{console.log("Mongodb connected")})
}catch(error){
  console.log(error);
}
}
module.exports = {connectMongodb};