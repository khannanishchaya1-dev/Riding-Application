import React from 'react';
import {Link} from 'react-router-dom';
import { useState } from 'react';


const CaptainLogin = () => {
const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const[captainData,setData]=useState({});
  const submitHandler = (e)=>{
    e.preventDefault();
    setData({
      email:email,
      password:password,
    })
    console.log(captainData);
    setEmail('');
    setPassword('');
  }
  return (
    <div className="h-screen flex flex-col justify-between">
      <div className="p-7">
        <img className="w-14 mb-5" src="https://pngimg.com/d/uber_PNG24.png"/>
        <form onSubmit={submitHandler}>
          <h3 className="text-lg mb-2 font-medium">What's your email</h3>
          <input
          required
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="bg-[#eeeeee] px-2 py-2 rounded  w-full text-lg mb-7"
            type="email"
            placeholder="example@gmail.com"
          ></input>
          <h3 className="text-lg mb-2 font-medium">Enter Password</h3>
          <input
           value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="bg-[#eeeeee] px-2 py-2 rounded w-full text-lg mb-7"
            required
            type="password"
            placeholder="password"
          ></input>
          <button className="bg-[#10b461] text-white font-semibold px-2 py-2 rounded w-full text-lg mb-4">
            Login
          </button>
        </form>
        <p className="text-center">
            Join a fleet? <Link to='/captain-signup' className="text-blue-600">Register as a Captain</Link>
          </p>
      </div>
      <div className="p-7">
        <Link to='/login' className="bg-[#111] flex justify-center text-white font-semibold px-2 py-2 rounded w-full text-lg">
          Sign in as User
        </Link>
      </div>
    </div>
  );
};


export default CaptainLogin