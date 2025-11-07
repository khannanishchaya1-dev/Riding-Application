import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

// Create the Socket.IO context
export const SocketContext = createContext();

// Provide the Socket.IO context
const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize the socket connection
    const newSocket = io(`${import.meta.env.VITE_BACKEND_URL}`); // Replace with your server URL
    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Function to send a message to the server
  const sendMessage = (eventName, message) => {
    if (socket) {
      socket.emit(eventName, message);
    }
  };

  // Function to listen for messages from a specific event
  const receiveMessage = (eventName, callback) => {
    if (socket) {
      socket.on(eventName, callback);
    }
  };

  return (
    <SocketContext.Provider value={{socket, sendMessage, receiveMessage }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use the Socket.IO context
export const useSocket = () => useContext(SocketContext);

export default SocketProvider;