const mongoose = require('mongoose');

async function connectMongodb(url){
  try{
 await mongoose.connect(url,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Mongodb connected");
  }catch(error){
  console.log(error);
}
}
module.exports = {connectMongodb};