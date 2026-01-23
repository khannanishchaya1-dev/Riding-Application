import React from 'react'
import { useContext,useEffect } from 'react'
import {useNavigate} from 'react-router-dom'

const CaptainProtectWrapper = ({children}) => {
  const token=localStorage.getItem('token');
  const captain = localStorage.getItem('captain');
  const navigate=useNavigate();
  useEffect(()=>{
    if(!token){
      navigate('/captain-login');
      return;
    }else if(captain.blocked){
      navigate('/captain-blocked');
      return;
    }
  },[token,navigate,captain])

  if(!token){
    return null; // or a loading spinner, or a redirect to login page
  }
  return (
    <div>{children}</div>
  )
}

export default CaptainProtectWrapper;
