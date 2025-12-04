import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../UserContext/UserContext"; // If you have user context

const UserLoggedOut = () => {
  const navigate = useNavigate();
  const{user , setUser} = useContext(UserDataContext || {});

  useEffect(() => {
    const token = localStorage.getItem("token"); // capture before removal

    axios.get(`${import.meta.env.VITE_BACKEND_URL}users/logout`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`, // send token if backend uses it
      }
    })
    .catch((err) => console.error("Logout error:", err))
    .finally(() => {
      // Clear everything after request completes
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete axios.defaults.headers.common["Authorization"];

      if (setUser) setUser(null); // clear global state if exists

      navigate("/login");
    });
  }, [navigate, setUser]);
  return <div>Logging you out...</div>;
};

export default UserLoggedOut;
