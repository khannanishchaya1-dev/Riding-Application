import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';

const UserSignup = () => {
  const[firstName,setFirstName]=useState('');
  const[lastName,setLastName]=useState('');
  const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const[userData,setData]=useState({});
    const submitHandler = (e)=>{
      e.preventDefault();
      setData({
        email:email,
        password:password,
        firstName:firstName,
        lastName:lastName,
      })
      //console.log(userData);
      setEmail('');
      setPassword('');
    }
  return (
    
  <div className="h-screen flex flex-col justify-between">
      <div className="p-7">
        <img className="w-14 mb-10" src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"/>
        <form onSubmit={submitHandler}>
          <h3 className="text-base mb-2 font-medium">What's your Name</h3>
          <div className='flex gap-4'>
          <input
          required
          value={firstName}
          onChange={(e)=>setFirstName(e.target.value)}
          className='bg-[#eeeeee] px-2 py-2 rounded  w-1/2 text-base mb-7'
            type="text"
            placeholder="First Name"
            
            ></input>
            <input
          required
          value={lastName}
          onChange={(e)=>setLastName(e.target.value)}
          className='bg-[#eeeeee] px-2 py-2 rounded  w-1/2 text-base mb-7'
            type="text"
            placeholder="Last Name"
            
            ></input>
            </div>
            
          <h3 className="text-base mb-2 font-medium">What's your email</h3>
          <input
          required
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="bg-[#eeeeee] px-2 py-2 rounded  w-full text-base mb-7"
            type="email"
            placeholder="example@gmail.com"
          ></input>
          <h3 className="text-base mb-2 font-medium">Enter Password</h3>
          <input
           value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="bg-[#eeeeee] px-2 py-2 rounded w-full text-base mb-7"
            required
            type="password"
            placeholder="password"
          ></input>
          <button className="bg-[#111] text-white font-semibold px-2 py-2 rounded w-full text-base mb-4">
            Login
          </button>
        </form>
        <p className="text-center">
            Already have an account? <Link to='/signin' className="text-blue-600">Login here</Link>
          </p>
      </div>
      {/* <div className="p-7">
        <Link to='/captain-login' className="bg-[#10b461] flex justify-center text-white font-semibold px-2 py-2 rounded w-full text-lg">
          Sign in as Captain
        </Link>
      </div> */}
      <p className="text-xs text-gray-500 text-center mb-8">
  By logging in, you agree to our{' '}
  <a href="/terms" className="text-blue-600 underline">
    Terms of Service
  </a>{' '}
  and{' '}
  <a href="/privacy" className="text-blue-600 underline">
    Privacy Policy
  </a>.
</p>

    </div>
  );
};

export default UserSignup;