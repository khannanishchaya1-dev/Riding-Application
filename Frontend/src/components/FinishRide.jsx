import React from 'react'
import { Link } from 'react-router-dom'
import axios from "axios";
import {useNavigate} from 'react-router-dom'
import toast from "react-hot-toast";

const FinishRide = (props) => {
  const navigate=useNavigate();
  const endRide = async ()=>{
    try{
      console.log("Hitted the endRide",props.ride);
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}rides/end-ride`,{
      rideId:props.ride._id

    },
  {
    
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      
    }
  })
  toast.success("Hurray! You've successfully completed your ride!");
  

  if(response.status==200){
    toast.success("Hurray! You've successfully completed your ride!");
   navigate('/captain-home');
    
  }
}catch(error){
  console.error('❌ Error ending ride:', error.response?.data || error.message);
}
  

  }
  return (
    <div>
   <h5 className="p-1 text-center absolute w-[90%] top-0"><i onClick={()=>props.setFinishRidepanel(false)} className="ri-arrow-down-s-line text-3xl text-gray-400"></i></h5>
        <h3 className="text-2xl mb-5 font-semibold">Finish this ride </h3>
        <div className='flex items-center justify-between bg-yellow-400 m-3.5 rounded-lg'>
          <div className='flex items-center gap-3'>
            <img className='h-12 w-12 rounded-full object-cover' src='https://live.staticflickr.com/7160/6410037157_8a32776d93_b.jpg'></img>
          <h2 className='text-lg font-medium'>{props.ride?.userId.fullname.firstname+" "+props.ride?.userId.fullname.lastname}</h2>
          </div>
          <h5 className='text-lg'>2.2 KM</h5>
        </div>
        <div className='flex flex-col justify-between items-center'>
       
       
        <div className='w-full'>
          <div className='flex items-center gap-5 p-3 border-b-2  border-gray-300'>
            <i className=" text-lg ri-user-location-fill"></i>
            <div className='flex flex-col'>
              <h3 className='text-lg font-medium'>562/11-A</h3>
              <p className='text-sm text-gray-500'>{props.ride?.origin}</p>
            </div>
          </div>
          <div className='w-full'>
            <div className='flex items-center gap-5 p-3 border-b-2  border-gray-300'>
            <i className=" text-lg ri-user-location-fill"></i>
            <div className='flex flex-col'>
              <h3 className='text-lg font-medium'>562/11-A</h3>
              <p className='text-sm text-gray-500'>{props.ride?.destination}</p>
            </div>
          </div>
          </div>
          <div className='w-full flex items-center gap-5 p-3'>
            <i className="text-lg ri-money-rupee-circle-fill"></i>
           <div className='flex flex-col'>
              <h3 className='text-lg font-medium'>₹{props.ride?.fare}</h3>
              <p className='text-sm text-gray-500'>Finish only when the payment is done</p>
            </div>
          </div>

        </div>


         <div className='mt-6 w-full'>
          
             <button onClick={endRide} className="flex justify-center items-center w-full bg-green-600 text-white font-semibold rounded-lg px-2 py-2 mt-5 text-lg">Finish Ride</button>
        
        
          
          </div> 
         </div>
        
        </div>
  )
}

export default FinishRide