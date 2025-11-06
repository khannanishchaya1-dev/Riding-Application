import React from 'react'

const ConfirmedRide = (props) => {
  const handleConfirmRide=()=>{
    props.create_ride(props.vehicleType);
  }
  const vehicleImages = {
    car: "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=956/height=538/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy9iYWRmYjFkNi02YzJiLTQ1NTMtYjkyOS05ZmYzMmYwMmE1NWUucG5n", // Car
    moto: "https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8yYzdmYTE5NC1jOTU0LTQ5YjItOWM2ZC1hM2I4NjAxMzcwZjUucG5n", // Bike
    auto: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRor72fdhJNar5p8b5iAmiwHtcY-c5XCd8nbvYwWgvVfy4Fmyt_9kB8-5kr8rWXdpO_DL0&usqp=CAU", // Auto Rickshaw
  };
  const vehicleImageSrc = vehicleImages[props.vehicleType] || vehicleImages['car'];
  return (
   <>
   <h5 className="p-1 text-center absolute w-[90%] top-0"><i onClick={()=>props.setconfirmRidepanel(false)} className="ri-arrow-down-s-line text-3xl text-gray-400"></i></h5>
        <h3 className="text-2xl mb-5 font-semibold">Confirm your Ride</h3>
        <div className='flex flex-col justify-between items-center'>
        <img className="h-30 "src={vehicleImageSrc} alt={`${props.vehicleType} icon`}></img>
       
        <div className='w-full'>
          <div className='flex items-center gap-5 p-3 border-b-2  border-gray-300'>
            <i className=" text-lg ri-user-location-fill"></i>
            <div className='flex flex-col'>
              <h3 className='text-lg font-medium'>Pickup</h3>
              <p className='text-sm text-gray-500'>{props.origin}</p>
            </div>
          </div>
          <div className='w-full'>
            <div className='flex items-center gap-5 p-3 border-b-2  border-gray-300'>
            <i className=" text-lg ri-user-location-fill"></i>
            <div className='flex flex-col'>
              <h3 className='text-lg font-medium'>Destination</h3>
              <p className='text-sm text-gray-500'>{props.destination}</p>
            </div>
          </div>
          </div>
          <div className='w-full flex items-center gap-5 p-3'>
            <i className="text-lg ri-money-rupee-circle-fill"></i>
           <div className='flex flex-col'>
              <h3 className='text-lg font-medium'>₹{props.fare[props.vehicleType]}</h3>
              <p className='text-sm text-gray-500'>Cash Payment</p>
            </div>
          </div>

        </div>
        <button onClick={() =>{ props.setlookingForVehicle(true)
          props.setconfirmRidepanel(false)
          handleConfirmRide();
        }
        } className="w-full bg-green-600 text-white font-semibold rounded-lg px-2 py-2 mt-5">Confirm Ride</button>
         </div>
        
        </>
  )
}

export default ConfirmedRide