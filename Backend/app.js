const dotenv = require('dotenv');
const path = require("path");
dotenv.config();
const cors = require("cors")
const express=require('express');
const app=express();
const{ connectMongodb } = require('./connection/db');
const userRoutes = require('./router/user_routes');
const captainRoutes = require('./router/captain');
const cookieParser = require('cookie-parser');
const mapRoutes = require('./router/maps_routes');
const rideRoutes = require('./router/rides');
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(cors());
app.use(express.json());
app.use(cookieParser());
connectMongodb("mongodb://127.0.0.1:27017/Uber");

app.get('/',(req,res)=>{
  res.render('index');
})
app.use('/users',userRoutes);
app.use('/captains',captainRoutes);
app.use('/maps',mapRoutes);
app.use('/rides',rideRoutes);
module.exports=app;