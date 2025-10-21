const dotenv = require('dotenv');
dotenv.config();
const cors = require("cors")
const express=require('express');
const app=express();
const{ connectMongodb } = require('./connection/db');
const userRoutes = require('./router/user_routes');
const captainRoutes = require('./router/captain');
const cookieParser = require('cookie-parser');
const mapRoutes = require('./router/maps_routes');

app.use(cors());
app.use(express.json());
app.use(cookieParser());
connectMongodb("mongodb://127.0.0.1:27017/Uber");

app.get('/',(req,res)=>{
  res.send('Hello World');
})
app.use('/users',userRoutes);
app.use('/captains',captainRoutes);
app.use('/maps',mapRoutes);
module.exports=app;