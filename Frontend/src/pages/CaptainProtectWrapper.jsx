import React from 'react'
import { useContext,useEffect } from 'react'
import {useNavigate} from 'react-router-dom'

const CaptainProtectWrapper = ({children}) => {
  const token=localStorage.getItem('token');
  const navigate=useNavigate();
  useEffect(()=>{
    if(!token){
      navigate('/captain-login');
    }
  },[token,navigate])
  
  if(!token){
    return null; // or a loading spinner, or a redirect to login page
  }
  return (
    <div>{children}</div>
  )
}

export default CaptainProtectWrapper;
