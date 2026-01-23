import React from 'react'
import { useContext,useEffect } from 'react'
import { UserDataContext } from '../UserContext/UserContext'
import {useNavigate} from 'react-router-dom'

const UserProtectWrapper = ({children}) => {
  const token=localStorage.getItem('token');
  const user = localStorage.getItem('user');
  const navigate=useNavigate();
  useEffect(()=>{
    if(!token){
      navigate('/login');
      return;
    }else if(user.blocked){
      navigate('/blocked');
    }
  },[token,navigate])
  
  if(!token){
    return null; // or a loading spinner, or a redirect to login page
  }
  return (
    <div>{children}</div>
  )
}

export default UserProtectWrapper
