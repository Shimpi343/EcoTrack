import React, { useEffect, useRef, useState } from "react";
import api from "./api";
import "./Chatbot.css";
import { getSmartReply } from "./utils/smartReplies";
import { speak } from "./utils/voice";

function Chatbot({ closeChat }) {

  // INITIAL MESSAGE
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi 👋 I’m EcoBot. Ask me anything about EcoTrack or reducing carbon footprint 🌱"
    }
  ]);

  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);
  const botLock = useRef(false);

  // AUTO SCROLL
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // BOT TYPING EFFECT
  const typeBotMessage = (fullText) => {
    let index = 0;

    setMessages(prev => [...prev, { sender: "bot", text: "" }]);

    const interval = setInterval(() => {
      index++;

      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          sender: "bot",
          text: fullText.slice(0, index)
        };
        return updated;
      });

      if (index === fullText.length) {
        clearInterval(interval);
        botLock.current = false; // 🔓 unlock AFTER typing finishes
      }
    }, 20);

    speak(fullText);
  };

  // SEND MESSAGE
 const sendMessage = async () => {
  if (!input.trim()) return;

  const userMsg = { sender: "user", text: input };
  setMessages(prev => [...prev, userMsg]);
  setInput("");

  if (botLock.current) return;
  botLock.current = true;

  const smartReply = getSmartReply(input);

  if (smartReply) {
    // ✅ Use smart reply ONLY
    typeBotMessage(smartReply);
    botLock.current = false;
  } else {
    // ✅ Call backend ONLY if no smart reply
    try {
      const res = await api.post("/api/chat", { message: input });
      typeBotMessage(res.data.reply);
    } catch {
      typeBotMessage("Sorry 😔 I couldn’t respond right now.");
    } finally {
      botLock.current = false;
    }
  }
};

  // CLOSE CHAT
  const handleClose = () => {
    setMessages([]);
    localStorage.removeItem("chat_history");
    closeChat();
  };

  return (
    <div className="phone-wrapper">
      <div className="phone-frame">

        <div className="phone-notch"></div>

        <div className="chatbot-container">
          <div className="chat-header">
            EcoBot 🌍
            <span onClick={handleClose} style={{ cursor: "pointer" }}> ❌</span>
          </div>

          <div className="chat-body">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            <div ref={chatEndRef}></div>
          </div>

          <div className="chat-input">
            <input
              placeholder="Ask your doubt..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>➤</button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Chatbot;