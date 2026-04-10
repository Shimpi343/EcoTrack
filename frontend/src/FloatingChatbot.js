import React, { useState } from "react";
import Chatbot from "./Chatbot";
import "./FloatingChatbot.css";

function FloatingChatbot() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        className="chatbot-fab"
        onClick={() => setOpen(!open)}
      >
        {open ? "✖" : "💬"}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="chatbot-float-window">
          <Chatbot />
        </div>
      )}
    </>
  );
}

export default FloatingChatbot;