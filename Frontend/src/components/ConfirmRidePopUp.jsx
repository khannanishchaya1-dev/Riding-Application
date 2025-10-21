import React,{useState} from 'react'
import { Link } from 'react-router-dom'

const ConfirmRidePopUp = (props) => {
  const [OTP,setOTP]=useState("");
  const submitHandler=(e)=>{
    e.preventDefault();
  }
  return (
    <div>
   <h5 className="p-1 text-center absolute w-[90%] top-0"><i onClick={()=>props.setridePopUppanel(false)} className="ri-arrow-down-s-line text-3xl text-gray-400"></i></h5>
        <h3 className="text-2xl mb-5 font-semibold">Confirm this ride to Start!</h3>
        <div className='flex items-center justify-between bg-yellow-400 m-3.5 rounded-lg'>
          <div className='flex items-center gap-3'>
            <img className='h-12 w-12 rounded-full object-cover' src='https://live.staticflickr.com/7160/6410037157_8a32776d93_b.jpg'></img>
          <h2 className='text-lg font-medium'>Harsh Patel</h2>
          </div>
          <h5 className='text-lg'>2.2 KM</h5>
        </div>
        <div className='flex flex-col justify-between items-center'>
       
       
        <div className='w-full'>
          <div className='flex items-center gap-5 p-3 border-b-2  border-gray-300'>
            <i className=" text-lg ri-user-location-fill"></i>
            <div className='flex flex-col'>
              <h3 className='text-lg font-medium'>562/11-A</h3>
              <p className='text-sm text-gray-500'>Sector 62, Noida</p>
            </div>
          </div>
          <div className='w-full'>
            <div className='flex items-center gap-5 p-3 border-b-2  border-gray-300'>
            <i className=" text-lg ri-user-location-fill"></i>
            <div className='flex flex-col'>
              <h3 className='text-lg font-medium'>562/11-A</h3>
              <p className='text-sm text-gray-500'>Sector 62, Noida</p>
            </div>
          </div>
          </div>
          <div className='w-full flex items-center gap-5 p-3'>
            <i className="text-lg ri-money-rupee-circle-fill"></i>
           <div className='flex flex-col'>
              <h3 className='text-lg font-medium'>$193</h3>
              <p className='text-sm text-gray-500'>Cash Payment</p>
            </div>
          </div>

        </div>


         <div className='mt-6 w-full'>
          <form onSubmit={(e)=>{
            submitHandler(e);
          }}>
            <input  type='number' onChange={(e)=>{
              setOTP(e.target.value);
              console.log(e.target.value);
            }} placeholder='Enter OTP' className='bg-[#eee] font-mono text-sm sm:text-lg rounded-lg px-6 sm:px-6 lg:px-8 py-4 sm:py-3 w-full'></input>
             <Link to='/captain-riding' onClick={() => props.setconfirmridePopUppanel(true)} className=" text-lg flex justify-center items-center w-full bg-green-600 text-white font-semibold rounded-lg px-2 py-2 mt-5">Accept</Link>
        <button onClick={() => {props.setridePopUppanel(false)
          props.setconfirmridePopUppanel(false)
        }} className="text-lg w-full bg-red-500 text-white font-semibold rounded-lg px-2 py-2 mt-2">Cancel</button>
        
        
          </form>
          </div> 
         </div>
        
        </div>
  )
}

export default ConfirmRidePopUp