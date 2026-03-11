import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader } from 'lucide-react';

function AIChatbot() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AgriSense AI assistant. I can help you with crop recommendations, pest management, irrigation advice, market prices, and farming best practices. How can I assist you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('https://smart-agriculture-4pz4.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: messages.slice(-10)
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.' 
        }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I\'m currently offline. Please check your connection and try again.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    'What crops should I plant this season?',
    'How do I prevent pest attacks?',
    'When should I irrigate my crops?',
    'What are current market prices?'
  ];

  return (
    <div className="space-y-6">
      <div className="gradient-bg text-white rounded-xl p-6">
        <h2 className="text-3xl font-bold mb-2">AI Farming Assistant</h2>
        <p className="text-green-100">Get instant answers to all your farming questions powered by advanced AI</p>
      </div>

      <div className="card h-[600px] flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start space-x-2 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`p-2 rounded-full ${msg.role === 'user' ? 'bg-primary' : 'bg-secondary'}`}>
                  {msg.role === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className={`p-4 rounded-lg ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800'}`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2">
                <div className="p-2 rounded-full bg-secondary">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="p-4 rounded-lg bg-gray-100">
                  <Loader className="w-5 h-5 animate-spin text-primary" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="mb-4 px-4">
            <p className="text-sm text-gray-600 mb-2">Quick questions:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(q)}
                  className="text-left text-sm p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t pt-4 px-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything about farming..."
              className="flex-1 input-field"
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIChatbot;
