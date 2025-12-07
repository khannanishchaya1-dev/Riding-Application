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
const paymentRoutes = require('./router/payment');
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(cors({
  origin: "https://riding-application-x1x2.vercel.app",
  credentials: true,
}));

// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true,
// }));
app.use(express.json());
app.use(cookieParser());
connectMongodb(process.env.MONGODB_URL);

app.get('/',(req,res)=>{
  res.render('index');
})
app.use('/users',userRoutes);
app.use('/captains',captainRoutes);
app.use('/maps',mapRoutes);
app.use('/rides',rideRoutes);
app.use('/payment',paymentRoutes);

module.exports=app;