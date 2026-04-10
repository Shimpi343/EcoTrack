// src/aiChat.js
import axios from "axios";

export async function askAI(message) {
  try {
    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are EcoBot – a friendly eco advisor who helps users reduce carbon footprint. Answer in short, simple sentences."
          },
          {
            role: "user",
            content: message
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_KEY}`
        }
      }
    );

    return res.data.choices[0].message.content;
  } catch (err) {
    console.error("AI Error:", err);
    return "Oops! I couldn't understand that. Try again!";
  }
}