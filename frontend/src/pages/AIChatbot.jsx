import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader, Sparkles, Leaf, Droplets, Bug, TrendingUp, Cloud, BookOpen } from 'lucide-react';

function AIChatbot() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! 🌾 I\'m your AgriSense AI assistant. I can help you with crop selection, irrigation, soil health, pest control, weather advice, government schemes, and market prices. How can I assist you today?'
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

  const quickSuggestions = [
    { icon: Leaf, text: 'Best crops for this season', color: 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200' },
    { icon: Droplets, text: 'Irrigation tips', color: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200' },
    { icon: Bug, text: 'Pest prevention', color: 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200' },
    { icon: TrendingUp, text: 'Market prices', color: 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200' },
    { icon: Cloud, text: 'Weather impact on crops', color: 'bg-sky-50 hover:bg-sky-100 text-sky-700 border-sky-200' },
    { icon: BookOpen, text: 'Government schemes', color: 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200' }
  ];

  const handleSend = async (messageText = input) => {
    if (!messageText.trim() || loading) return;

    const userMessage = messageText.trim();
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
          content: 'I couldn\'t find a precise answer. Please try asking in a different way about crops, soil, irrigation, or farming.' 
        }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I\'m having trouble connecting right now. Please check your internet connection and try again.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleSend(suggestion);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2E7D32] to-[#4FC3F7] text-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur">
            <Sparkles className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">AI Farming Assistant</h2>
            <p className="text-green-100">Get instant expert advice on all farming topics</p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-[#F5F7F6] rounded-2xl shadow-xl overflow-hidden">
        {/* Messages Area */}
        <div className="h-[500px] overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
              <div className={`flex items-start space-x-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-[#A5D6A7] to-[#2E7D32]' 
                    : 'bg-white border-2 border-[#2E7D32]'
                }`}>
                  {msg.role === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-[#2E7D32]" />
                  )}
                </div>
                
                {/* Message Bubble */}
                <div className={`rounded-2xl px-5 py-3 shadow-md ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-[#A5D6A7] to-[#81C784] text-gray-800'
                    : 'bg-white border-2 border-[#2E7D32] text-gray-800'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}
          
          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-start animate-fade-in-up">
              <div className="flex items-start space-x-3 max-w-[80%]">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white border-2 border-[#2E7D32] flex items-center justify-center shadow-md">
                  <Bot className="w-5 h-5 text-[#2E7D32]" />
                </div>
                <div className="bg-white border-2 border-[#2E7D32] rounded-2xl px-5 py-3 shadow-md">
                  <div className="flex items-center space-x-2">
                    <Loader className="w-5 h-5 animate-spin text-[#2E7D32]" />
                    <span className="text-[#2E7D32] font-medium">Analyzing your farming question...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions */}
        {messages.length === 1 && (
          <div className="px-6 pb-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3 font-medium">Quick suggestions:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {quickSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className={`flex items-center gap-2 p-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md border-2 ${suggestion.color}`}
                >
                  <suggestion.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs font-medium text-left">{suggestion.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t-2 border-[#2E7D32] bg-white p-4">
          <div className="flex space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything about farming..."
              className="flex-1 px-5 py-3 border-2 border-[#A5D6A7] rounded-xl focus:outline-none focus:border-[#2E7D32] transition-colors bg-[#F5F7F6] text-gray-800 placeholder-gray-500"
              disabled={loading}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="bg-gradient-to-r from-[#2E7D32] to-[#4FC3F7] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Powered by AI • Specialized in Indian Agriculture
          </p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white border-2 border-[#2E7D32] rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#A5D6A7] p-2 rounded-lg">
              <Leaf className="w-5 h-5 text-[#2E7D32]" />
            </div>
            <h3 className="font-bold text-[#2E7D32]">Crop Advice</h3>
          </div>
          <p className="text-sm text-gray-600">Get recommendations for kharif, rabi, and zaid seasons</p>
        </div>

        <div className="bg-white border-2 border-[#4FC3F7] rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#B3E5FC] p-2 rounded-lg">
              <Droplets className="w-5 h-5 text-[#4FC3F7]" />
            </div>
            <h3 className="font-bold text-[#4FC3F7]">Water Management</h3>
          </div>
          <p className="text-sm text-gray-600">Learn irrigation techniques to save 30-40% water</p>
        </div>

        <div className="bg-white border-2 border-[#FF9800] rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#FFE0B2] p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-[#FF9800]" />
            </div>
            <h3 className="font-bold text-[#FF9800]">Market Insights</h3>
          </div>
          <p className="text-sm text-gray-600">Get tips on pricing and selling strategies</p>
        </div>
      </div>
    </div>
  );
}

export default AIChatbot;
