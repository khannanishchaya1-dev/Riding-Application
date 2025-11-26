import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_BACKEND_URL, {
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      console.log("🔥 Socket connected:", newSocket.id);
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  const sendMessage = (eventName, message) => socket?.emit(eventName, message);

  const receiveMessage = (eventName, callback) => {
    if (!socket) return;
    socket.off(eventName);
    socket.on(eventName, callback);
  };

  const offMessage = (eventName, callback) => socket?.off(eventName, callback);

  return (
    <SocketContext.Provider value={{ socket, sendMessage, receiveMessage, offMessage }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

export default SocketProvider;
