import React from 'react'

const RidePopUp = (props) => {
  return (
    <>
   <h5 className="p-1 text-center absolute w-[90%] top-0"><i onClick={()=>props.setridePopUppanel(false)} className="ri-arrow-down-s-line text-3xl text-gray-400"></i></h5>
        <h3 className="text-2xl mb-5 font-semibold">New Ride Available!</h3>
        <div className='p-2 flex items-center justify-between bg-yellow-400 m-3.5 rounded-lg'>
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
        <div className=' w-full flex justify-between items-center'>
        <button onClick={() => props.setconfirmridePopUppanel(true)} className=" bg-green-600 text-white font-semibold rounded-lg p-3 px-8 mt-5">Accept</button>
        <button onClick={() => props.setridePopUppanel(false)} className=" bg-gray-300 text-gray-700 font-semibold rounded-lg p-3 px-8 mt-2">Ignore</button>
       </div>
         </div>
        
        </>
  )
}

export default RidePopUp