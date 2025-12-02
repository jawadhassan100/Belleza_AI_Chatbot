import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";
import { RxCross2 } from "react-icons/rx";

export default function App() {
  const [open, setOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I am Belleza AI 💖 How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    const updatedMsgs = [...messages, userMsg];
    setMessages(updatedMsgs);
    setIsTyping(true); 
    try {
      const response = await axios.post("https://belleza-ai-chatbot.vercel.app/chat", {
        message: input,
        conversationHistory: updatedMsgs.map((m) => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.text,
        })),
      });

      setMessages([
        ...updatedMsgs,
        { sender: "bot", text: response.data.reply },
      ]);
    } catch {
      setMessages([
        ...updatedMsgs,
        { sender: "bot", text: "Oops something went wrong 😔" },
      ]);
    }

    setInput("");
    setIsTyping(false); 
  };

  return (
    <>
      {/* Floating Button */}
      <div className="belleza-chat-button" onClick={() => setOpen(!open)}>
        🤖
      </div>

      {/* Chat Window */}
      {open && (
        <div className="belleza-chat-window">
          <div className="chat-header">
            <span>Belleza AI Assistant ✨</span>
            <div 
            className="close-btn"
            onClick={() => setOpen(false)}><RxCross2/></div>
          </div>

          <div className="chat-body">
            {messages.map((msg, i) => (
              <div key={i} className={`msg ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
            {isTyping && (
            <div className="msg bot typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
            <div ref={messagesEndRef}></div>
          </div>

          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask something about Belleza…"
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}
