import React from 'react'
import { useEffect } from "react";
import { useNavigate} from "react-router-dom";
import axios from "axios";

const CaptainLoggedOut = () => {
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:3000/captains/logout", { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          console.log("User logged out successfully (server)");
        }
      })
      .catch((err) => console.error("Logout error:", err))
      .finally(() => {
        // ✅ Always clear client token
        localStorage.removeItem("token");
        navigate("/captain-login");
      });
  }, [navigate]);
  return (
    <div>Captain logging out ...</div>
  )
}

export default CaptainLoggedOut