

import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../UserContext/CaptainContext";

const CaptainLoggedOut = () => {
  const navigate = useNavigate();
  const [, setCaptainData] = useContext(CaptainDataContext);

  useEffect(() => {
    const token = localStorage.getItem("token"); // capture before clearing

    axios.get(`${import.meta.env.VITE_BACKEND_URL}captains/logout`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,  // now valid token goes to server
      }
    }).catch(() => {})
      .finally(() => {
        // Now safely remove everything
        localStorage.removeItem("token");
        localStorage.removeItem("captain");
        setCaptainData(null);
        delete axios.defaults.headers.common["Authorization"];

        // Navigate after cleanup
        navigate("/login");
      });

  }, [navigate, setCaptainData]);

  return <div>Logging you out...</div>;
};

export default CaptainLoggedOut;
