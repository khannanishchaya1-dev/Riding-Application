import React, { useEffect, useState } from "react";
import { useSocket } from "../UserContext/SocketContext";

const Chat = () => {
  const { sendMessage, receiveMessage } = useSocket();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    // Listen for messages from the "chatMessage" event
    receiveMessage("chatMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }, [receiveMessage]);

  const handleSendMessage = () => {
    // Send a message to the "chatMessage" event
    sendMessage("chatMessage", input);
    setInput("");
  };

  return (
    <div>
      <h1>Chat</h1>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default Chat;