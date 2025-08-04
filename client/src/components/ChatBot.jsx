import { useState, useRef, useEffect } from 'react';
import { askAI } from '../services/openaiService';

export default function ChatBot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const handleAsk = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const aiResponse = await askAI(userMessage.text);
      const aiMessage = { sender: 'ai', text: aiResponse };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = { sender: 'ai', text: 'Error fetching AI response.' };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white p-4 rounded-2xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center text-indigo-700">StudyPal AI Assistant</h2>

      {/* Scrollable Chat Area */}
      <div className="flex-grow overflow-y-auto bg-gray-50 p-3 rounded-lg border mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded-lg w-fit max-w-[75%] ${msg.sender === 'user' ? 'bg-indigo-100 ml-auto' : 'bg-green-100'}`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex space-x-2">
        <input
          type="text"
          className="flex-grow border rounded-lg p-2"
          placeholder="Ask StudyPal AI..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleAsk(); }}
        />
        <button
          onClick={handleAsk}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Ask
        </button>
      </div>
    </div>
  );
}
