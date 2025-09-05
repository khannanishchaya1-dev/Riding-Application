import React, { useState } from "react";
import { Link } from "react-router-dom";

const UserLogin = () => {
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const submitHandler = (e)=>{
    e.preventDefault();
    console.log(email,password);
    setEmail('');
    setPassword('');
  }
  return (
    <div className="h-screen flex flex-col justify-between">
      <div className="p-7">
        <img className="w-14 mb-10" src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"/>
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
          <button className="bg-[#111] text-white font-semibold px-2 py-2 rounded w-full text-lg mb-4">
            Login
          </button>
        </form>
        <p className="text-center">
            New here? <Link to='/signup' className="text-blue-600">Create new Account</Link>
          </p>
      </div>
      <div className="p-7">
        <button className="bg-[#10b461] text-white font-semibold px-2 py-2 rounded w-full text-lg">
          Sign in as Captain
        </button>
      </div>
    </div>
  );
};

export default UserLogin;
