import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import './App.css';

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI("AIzaSyB5WklP4dqWXMlIdUZ-UF5W1jfpHsfMJu4");

function App() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to handle sending a message to the Gemini API
  const sendMessage = async () => {
    if (!userInput.trim()) return;

    // Add user message to the chat history
    const userMessage = { role: 'user', content: userInput };
    setMessages((prev) => [...prev, userMessage]);
    setUserInput('');
    setLoading(true);

    try {
      // Initialize the Gemini model
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      // Send the message to the Gemini API
      const result = await model.generateContent(userInput);
      const response = await result.response;
      const text = response.text();

      // Add the AI's response to the chat history
      const botMessage = { role: 'AI', content: text };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { role: 'AI', content: 'Sorry, something went wrong. Please try again.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  // Handle form submission (on Enter key or button click)
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div className="chat-container">
      <h1 className='h1'>Chat with CodeGenius Bot!</h1>
      <div className="chat-history">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong>
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        ))}
        {loading && <p className="loading">Loading...</p>}
      </div>
      <form onSubmit={handleSubmit} className="input-container">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="chat-input"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
}

export default App;