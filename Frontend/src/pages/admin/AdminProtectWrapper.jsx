import { useContext,useEffect } from "react";
import { AdminContext } from "../../AdminContext/AdminContext";
import { useNavigate } from "react-router-dom";
const AdminProtectedWrapper = ({children}) => {
  const token=localStorage.getItem('adminToken');
  const navigate=useNavigate();
  useEffect(()=>{
    if(!token){
      navigate('/admin/login');
    }
  },[token,navigate])
  
  if(!token){
    return null; // or a loading spinner, or a redirect to login page
  }
  return (
    <div>{children}</div>
  )
}

export default AdminProtectedWrapper
