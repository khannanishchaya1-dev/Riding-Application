import React from 'react'

const VehiclePanel = (props) => {
  const handleVehicleSelection=(type)=>{
    props.setvehicleType(type);
    props.setconfirmRidepanel(true);
  }
  return (
    <>
    
        <h5 className="p-1 text-center absolute w-[90%] top-0"><i onClick={()=>props.setvehiclepanel(false)} className="ri-arrow-down-s-line text-3xl text-gray-400"></i></h5>
        <h3 className="text-2xl mb-5 font-semibold">Choose a Vehicle</h3>
        <div onClick={() => handleVehicleSelection('car')} className="flex items-center justify-between w-full p-3 active:border-black border-2 rounded-lg mb-2">
          <img className="h-15" src="https://www.svgrepo.com/show/408292/car-white.svg" alt="Car Icon"></img>
          <div className="w-1/2">
            <h4 className="font-medium text-lg">UberGo <span><i className="ri-user-fill">4</i></span></h4>
            <h5 className="font-medium text-sm">2 mins away</h5>
            <p className="font-normal text-xs">Affordable, Compact rides</p>
          </div>
          <div className="text-xl font-semibold"><h2>₹{props.fare['car']}</h2></div>
        </div>
        <div onClick={() => handleVehicleSelection('moto')} className="flex items-center justify-between w-full p-3 active:border-black border-2 rounded-lg mb-2">
          <img className="h-15" src="https://cn-geo1.uber.com/image-proc/crop/resizecrop/udam/format=auto/width=552/height=368/srcb64=aHR0cHM6Ly90Yi1zdGF0aWMudWJlci5jb20vcHJvZC91ZGFtLWFzc2V0cy8yYzdmYTE5NC1jOTU0LTQ5YjItOWM2ZC1hM2I4NjAxMzcwZjUucG5n" alt="Bike Icon"></img>
          <div className="w-1/2">
            <h4 className="font-medium text-lg">Moto <span><i className="ri-user-fill">1</i></span></h4>
            <h5 className="font-medium text-sm">2 mins away</h5>
            <p className="font-normal text-xs">Affordable, motorcycle rides</p>
          </div>
          <div className="text-xl font-semibold"><h2>₹{props.fare['moto']}</h2></div>
        </div>
         <div onClick={() => handleVehicleSelection('auto')} className="flex items-center justify-between w-full p-3 active:border-black border-2 rounded-lg mb-2">
          <img className="h-15" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRor72fdhJNar5p8b5iAmiwHtcY-c5XCd8nbvYwWgvVfy4Fmyt_9kB8-5kr8rWXdpO_DL0&usqp=CAU" alt="Bike Icon"></img>
          <div className="w-1/2">
            <h4 className="font-medium text-lg">Uber auto <span><i className="ri-user-fill">1</i></span></h4>
            <h5 className="font-medium text-sm">2 mins away</h5>
            <p className="font-normal text-xs">Affordable, Desi style</p>
          </div>
          <div className="text-xl font-semibold"><h2>₹{props.fare['auto']}</h2></div>
        </div>
      
    </>
  )
}

export default VehiclePanel