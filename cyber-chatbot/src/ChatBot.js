import React, { useState } from "react";
import "./App.css";
import OpenAI from "openai";
import logo from './logo.jpg';
import keywords from './cybersecurityKeywords.json';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KE,
  dangerouslyAllowBrowser: true,
});

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;

    const newMessages = [...messages, { text: inputMessage, sender: "user" }];
    setMessages(newMessages);
    setInputMessage("");

    const userMessage = inputMessage.toLowerCase();
    const hasCybersecurityKeyword = keywords.keywords.some(keyword =>
      userMessage.includes(keyword)
    );

    let botMessage = "";
    if (hasCybersecurityKeyword) {
      try {
        const chatCompletion = await openai.completions.create({
          prompt: inputMessage,
          model: "text-davinci-003",
          max_tokens: 150
        });
        botMessage = chatCompletion.choices.map(choice => choice.text).join("");
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      botMessage = "I'm sorry, I can only respond to cybersecurity-related queries.";
    }

    setMessages([...newMessages, { text: botMessage, sender: "bot" }]);
  };

  return (
    <div className="main">
      <div className="explanation">
        <img src={logo} alt="Logo" className="Logo" />
        <h2 className="explanation-title">What is CyberBot?</h2>
        <p className="explanation-text">
          CyberBot is an AI-powered chatbot focused on cybersecurity. It's designed to provide insights, answer questions, and offer guidance on various cybersecurity topics, including threat prevention, data protection, network security, and more.
        </p>
      </div>
      <div className="chat-container">
        <div className="messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              {message.text}
            </div>
          ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            placeholder="Ask me about cybersecurity..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            className="input-field"
          />
          <button onClick={handleSendMessage} className="send-button">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
export default ChatBot;
