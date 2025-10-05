import React from 'react'

const LocationSearchPanel = (props) => {
  console.log(props)
  const locations = [
    "White House PG, Sunder Nagar, Rajpura, Punjab 140401",
    "Green Villa, Model Town, Rajpura, Punjab 140401",
    "Blue Residency, Patel Nagar, Rajpura, Punjab 140401",
    "Sunrise Hostel, Urban Estate, Rajpura, Punjab 140401"
  ];
  return (
    <div>
      {locations.map((location) => (
        <div onClick={() => {props.setvehiclepanel(true)
          props.setPanelOpen(false)
        }} className='flex gap-4 items-center my-4 justify-start border-2 border-white active:border-black p-3 my-2'>
          <h4 className='bg-[#eee] h-8 w-12 rounded-full flex items-center justify-center'><i className="ri-map-pin-2-fill"></i></h4>
          <div className='font-medium'>{location}</div>
        </div>
      ))}
    </div>
  )
}

export default LocationSearchPanel