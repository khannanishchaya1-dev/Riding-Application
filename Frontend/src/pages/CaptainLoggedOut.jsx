import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserLoggedOut = () => {
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/users/logout", { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          console.log("Captain logged out successfully (server)");
        }
      })
      .catch((err) => console.error("Logout error:", err))
      .finally(() => {
        // ✅ Always clear client-side token and headers
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        navigate("/login");
      });
  }, [navigate]);

  return <div>Logging you out...</div>;
};

export default UserLoggedOut;
