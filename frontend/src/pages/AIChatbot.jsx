import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader, Sparkles, ThumbsUp, ThumbsDown, Copy, RefreshCw, BookOpen, Leaf, Cloud, Sprout, AlertTriangle, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

function AIChatbot() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `👋 Welcome to AgriSense AI Assistant!

I'm your smart farming companion, here to help you with:

🌾 **Crop Management** - Recommendations, planting schedules, harvest timing
💧 **Irrigation** - Water optimization, scheduling, drought management  
🐛 **Pest & Disease** - Identification, prevention, organic & chemical solutions
🌤️ **Weather** - Forecasting, climate patterns, seasonal advice
📈 **Market Prices** - Current rates, trends, best selling times
💰 **Profit Planning** - Cost estimation, yield optimization

How can I help you improve your farm today?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(Date.now());
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Contextual quick questions based on conversation
  const getQuickQuestions = () => {
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content?.toLowerCase() || '';
    
    if (lastUserMessage.includes('crop') || lastUserMessage.includes('plant')) {
      return [
        'What is the best season for rice cultivation?',
        'How do I increase wheat yield?',
        'Which crops need less water?',
        'Tell me about organic farming'
      ];
    } else if (lastUserMessage.includes('pest') || lastUserMessage.includes('disease')) {
      return [
        'How to identify pest damage?',
        'Natural pest control methods',
        'When to use pesticides?',
        'Common tomato diseases'
      ];
    } else if (lastUserMessage.includes('water') || lastUserMessage.includes('irrigat')) {
      return [
        'Best irrigation methods?',
        'How much water does rice need?',
        'Drip irrigation benefits',
        'When to stop irrigation before harvest'
      ];
    } else if (lastUserMessage.includes('market') || lastUserMessage.includes('price')) {
      return [
        'Current rice prices?',
        'Best time to sell wheat?',
        'How to get better rates?',
        'Minimum support prices'
      ];
    }
    
    // Default farming questions
    return [
      'What crops should I plant this kharif season?',
      'How do I prevent pest attacks on my crops?',
      'When is the best time to irrigate?',
      'What are current market prices for rice?',
      'How to improve soil fertility naturally?',
      'Tell me about government farming schemes'
    ];
  };

  const handleSend = async (messageText = null) => {
    const text = messageText || input.trim();
    if (!text || loading) return;

    const userMessage = text;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: new Date() }]);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: messages.slice(-12).map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.response,
          timestamp: new Date()
        }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: getFallbackResponse(userMessage),
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: getFallbackResponse(userMessage),
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const getFallbackResponse = (query) => {
    const q = query.toLowerCase();
    
    if (q.includes('crop') || q.includes('plant') || q.includes('kharif') || q.includes('rabi')) {
      return `🌾 **Crop Selection Guide**

For successful farming, consider these factors:

**Kharif Season (June-Oct):**
• Rice - Requires high rainfall, clayey soil
• Cotton - Needs warm climate, black soil
• Maize - Versatile, grows in most soils
• Sugarcane - Needs plenty of water

**Rabi Season (Nov-April):**
• Wheat - Cool climate, well-drained soil
• Chickpea - Drought tolerant
• Mustard - Low water requirement

**Tips:**
1. Check your soil type
2. Consider available irrigation
3. Look at market demand
4. Check government MSP prices

Would you like specific recommendations for your location?`;
    }
    
    if (q.includes('pest') || q.includes('disease') || q.includes('bug')) {
      return `🐛 **Pest & Disease Management**

**Prevention is Better Than Cure:**

1. **Regular Monitoring** - Check crops daily for early signs
2. **Crop Rotation** - Prevents pest buildup
3. **Companion Planting** - Natural pest deterrents
4. **Neem Spray** - Effective organic pesticide
5. **Remove Infected Plants** - Prevent spread

**Common Solutions:**
• For aphids: Neem oil spray
• For fungus: Copper fungicide
• For borers: Pheromone traps

**Organic Options:**
- Neem cake
- Trichoderma
- Beauveria fungus

Would you like help identifying a specific pest?`;
    }
    
    if (q.includes('water') || q.includes('irrigat') || q.includes('drip')) {
      return `💧 **Smart Irrigation Guide**

**Water Conservation Tips:**

1. **Drip Irrigation** - Saves 40-60% water
2. **Mulching** - Reduces evaporation
3. **Morning Watering** - Best time before 10 AM
4. **Check Soil Moisture** - Use finger test

**Crop Water Needs:**
- Rice: 1200-1500mm per season
- Wheat: 450-650mm
- Cotton: 700-1000mm
- Vegetables: Daily/alternate day

**Modern Techniques:**
• Drip systems with timers
• Sprinkler irrigation
• Automated sensors
• Rainwater harvesting

Need help planning irrigation schedule?`;
    }
    
    if (q.includes('profit') || q.includes('cost') || q.includes('market') || q.includes('price')) {
      return `💰 **Profit & Market Guide**

**Cost Reduction Tips:**
1. Use organic fertilizers (compost)
2. Practice intercropping
3. Buy seeds in bulk
4. Join farmer cooperatives

**Current Market Tips:**
- Check mandi prices daily
- Sell when demand is high
- Store produce for better prices
- Use government e-NAM platform

**Government Schemes:**
- PM-KISAN direct income support
- Crop insurance schemes
- Subsidies for drip irrigation
- Agricultural loans at low interest

Check our Market Predictor for live prices!`;
    }
    
    return `🌱 **Farming Assistance**

I can help you with:

• **Crop Recommendations** - Based on soil, climate, season
• **Pest Management** - Organic and chemical solutions
• **Irrigation Scheduling** - Water-efficient methods
• **Weather Forecasting** - Plan around weather
• **Market Prices** - Best selling times
• **Government Schemes** - Subsidies and support

Ask me anything about farming! For detailed analysis, try our other tools:
- 🌾 Crop Recommendation
- 🌤️ Weather Dashboard  
- 🛒 Market Predictor
- 🦠 Disease Detection`;
  };

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
    alert('Copied to clipboard!');
  };

  const handleFeedback = (messageIndex, isPositive) => {
    console.log(`Feedback for message ${messageIndex}: ${isPositive ? 'positive' : 'negative'}`);
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: `👋 Welcome back to AgriSense AI Assistant!

I'm here to help with all your farming questions. What would you like to know today?`,
      timestamp: new Date()
    }]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="gradient-bg text-white rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Sparkles className="w-8 h-8" />
              AI Farming Assistant
            </h2>
            <p className="text-green-100">Powered by advanced AI - Ask anything about farming</p>
          </div>
          <button
            onClick={clearChat}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            New Chat
          </button>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/crop-advice" className="card hover:scale-105 transition-transform text-center">
          <Sprout className="w-8 h-8 text-primary mx-auto mb-2" />
          <p className="font-semibold text-gray-800">Crop Advice</p>
        </Link>
        <Link to="/weather" className="card hover:scale-105 transition-transform text-center">
          <Cloud className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="font-semibold text-gray-800">Weather</p>
        </Link>
        <Link to="/disease-detection" className="card hover:scale-105 transition-transform text-center">
          <Leaf className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="font-semibold text-gray-800">Disease ID</p>
        </Link>
        <Link to="/market-predictor" className="card hover:scale-105 transition-transform text-center">
          <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <p className="font-semibold text-gray-800">Market Prices</p>
        </Link>
      </div>

      {/* Chat Container */}
      <div className="card h-[600px] flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start space-x-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`p-2 rounded-full flex-shrink-0 ${msg.role === 'user' ? 'bg-primary' : 'bg-gradient-to-br from-secondary to-primary-light'}`}>
                  {msg.role === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className={`p-4 rounded-lg ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-md'}`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <button
                        onClick={() => handleFeedback(idx, true)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                        title="Helpful"
                      >
                        <ThumbsUp className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleFeedback(idx, false)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                        title="Not helpful"
                      >
                        <ThumbsDown className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={() => handleCopy(msg.content)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                        title="Copy"
                      >
                        <Copy className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2">
                <div className="p-2 rounded-full bg-gradient-to-br from-secondary to-primary-light">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="p-4 rounded-lg bg-white dark:bg-gray-700 shadow-md">
                  <Loader className="w-6 h-6 animate-spin text-primary" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length <= 2 && (
          <div className="mb-4 px-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Try asking:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {getQuickQuestions().map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  disabled={loading}
                  className="text-left text-sm p-3 bg-gray-100 dark:bg-gray-700 hover:bg-primary hover:text-white dark:hover:bg-primary rounded-lg transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 flex-shrink-0" />
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
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Ask me anything about farming..."
              className="flex-1 input-field"
              disabled={loading}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed px-6"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Press Enter to send • Shift+Enter for new line • AI may make mistakes, verify important information
          </p>
        </div>
      </div>
    </div>
  );
}

export default AIChatbot;
