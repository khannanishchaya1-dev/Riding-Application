import React, { useState } from "react";
import axios from "axios";
import "./AIchatbot.css";

const AIChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I'm Gadigo AI 🤖 How can I help?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Typing animation
  const typeMessage = (text) => {
    let i = 0;
    const speed = 15;

    const interval = setInterval(() => {
      i++;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        return [...prev.slice(0, -1), { ...last, text: text.slice(0, i) }];
      });

      if (i >= text.length) clearInterval(interval);
    }, speed);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInput("");

    try {
      setIsTyping(true);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}api/ai-chat`,
        { message: userText }
      );

      setIsTyping(false);

      // Add empty bot message then type
      setMessages((prev) => [...prev, { sender: "bot", text: "" }]);
      typeMessage(res.data.reply);

    } catch (err) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Oops! AI not responding." },
      ]);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "58px",
          height: "58px",
          borderRadius: "50%",
          background: "#000",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "22px",
          cursor: "pointer",
          zIndex: 1000,
          boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
        }}
      >
        💬
      </div>

      {/* Chat Window */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "340px",
            height: "460px",
            background: "#0d0d0d",
            borderRadius: "16px",
            boxShadow: "0 15px 40px rgba(0,0,0,0.5)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 1000,
            border: "1px solid #1f1f1f",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "14px",
              background: "#000",
              color: "white",
              fontWeight: "600",
              fontSize: "15px",
              borderBottom: "1px solid #1f1f1f",
            }}
          >
            Gadigo AI Assistant
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "14px",
              background: "#0d0d0d",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  textAlign: msg.sender === "user" ? "right" : "left",
                  margin: "8px 0",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: "14px",
                    maxWidth: "75%",
                    fontSize: "14px",
                    background:
                      msg.sender === "user" ? "#ffffff" : "#1a1a1a",
                    color: msg.sender === "user" ? "#000" : "#fff",
                    border:
                      msg.sender === "user"
                        ? "none"
                        : "1px solid #2a2a2a",
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}

            {/* Thinking dots */}
            {isTyping && (
              <div style={{ margin: "8px 0" }}>
                <span
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: "14px",
                    background: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                  }}
                >
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </span>
              </div>
            )}
          </div>

          {/* Input */}
          <div
            style={{
              display: "flex",
              padding: "10px",
              borderTop: "1px solid #1f1f1f",
              background: "#000",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                flex: 1,
                padding: "8px 10px",
                borderRadius: "8px",
                border: "1px solid #2a2a2a",
                background: "#121212",
                color: "white",
                outline: "none",
                fontSize: "14px",
              }}
              placeholder="Ask something..."
            />
            <button
              onClick={sendMessage}
              style={{
                marginLeft: "8px",
                padding: "8px 14px",
                borderRadius: "8px",
                border: "none",
                background: "white",
                color: "black",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
