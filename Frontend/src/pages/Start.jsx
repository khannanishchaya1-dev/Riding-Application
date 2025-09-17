import React from 'react'
import{Link} from 'react-router-dom';

const Start = () => {
  return (
    <div>
    <div className='bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1619059558110-c45be64b73ae?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dHJhZmZpYyUyMGxpZ2h0fGVufDB8fDB8fHww)] h-screen w-full bg-red-500 flex flex-col justify-between'>
      <img className='mt-8 ml-9 w-14' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"/>
      <div className='bg-white text-black py-5 px-5'>
      <h2 className='text-3xl font-bold'>Get Started with Uber</h2>
    <Link to='/login' className='flex justify-center items-center w-full bg-black text-white py-3 rounded mt-7'>Continue</Link>
    </div>
    </div>
    </div>
  )
}

export default Start