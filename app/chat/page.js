'use client';

import { useState } from 'react';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await response.json();
      const botMessage = { role: 'assistant', content: data.message };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1>Chat with OpenAI</h1>
      <div
        style={{
          border: '1px solid #ccc',
          borderRadius: '5px',
          padding: '10px',
          height: '400px',
          overflowY: 'scroll',
          marginBottom: '20px',
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.role === 'user' ? 'right' : 'left',
              margin: '10px 0',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                padding: '10px',
                borderRadius: '10px',
                backgroundColor: msg.role === 'user' ? '#d1f7c4' : '#f1f1f1',
              }}
            >
              {msg.content}
            </span>
          </div>
        ))}
        {isLoading && <p>Loading...</p>}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        placeholder="Type your message..."
        style={{
          width: '80%',
          padding: '10px',
          marginRight: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc',
        }}
      />
      <button
        onClick={sendMessage}
        style={{
          padding: '10px 20px',
          borderRadius: '5px',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Send
      </button>
    </div>
  );
}
