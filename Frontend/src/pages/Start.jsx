import React from 'react'
import{Link} from 'react-router-dom';
import wheelzyLogo from "../assets/wheelzy.svg";

const Start = () => {
  return (
    <div>
    <div className='bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1619059558110-c45be64b73ae?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dHJhZmZpYyUyMGxpZ2h0fGVufDB8fDB8fHww)] h-screen w-full bg-red-500 flex flex-col justify-between'>
      <img className='mt-0 ml-1 w-60' src={wheelzyLogo} alt="Wheelzy Logo"/>
      <div className='bg-white text-black py-5 px-5'>
      <h2 className='text-2xl font-bold'>Get Started with Wheelzy</h2>
    <Link to='/Home' className='flex justify-center items-center w-full bg-black text-white py-3 rounded mt-7'>Continue</Link>
    </div>
    </div>
    </div>
  )
}

export default Start