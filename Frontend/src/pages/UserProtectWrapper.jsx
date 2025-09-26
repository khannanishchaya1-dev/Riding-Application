import React from 'react'
import { useContext,useEffect } from 'react'
import { UserDataContext } from '../UserContext/UserContext'
import {useNavigate} from 'react-router-dom'

const UserProtectWrapper = ({children}) => {
  const token=localStorage.getItem('token');
  const navigate=useNavigate();
  useEffect(()=>{
    if(!token){
      navigate('/login');
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
