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
    
    // Greeting responses
    if (q.match(/^(hi|hello|hey|namaste|vanakkam)/)) {
      return `Hello! 👋 I'm your AgriSense AI farming assistant. I'm here to help you with all your agricultural questions.

I can assist you with:
• Crop selection and recommendations
• Pest and disease management  
• Irrigation and water management
• Weather forecasting and planning
• Market prices and selling strategies
• Soil health and fertilization
• Government schemes and subsidies

What would you like to know about today?`;
    }
    
    // Thank you responses
    if (q.match(/(thank|thanks|appreciate)/)) {
      return `You're very welcome! 😊 I'm glad I could help.

Is there anything else you'd like to know about farming? I'm here to assist you with:
• Crop advice
• Pest control
• Irrigation tips
• Market information
• Or any other farming questions

Feel free to ask me anything!`;
    }
    
    if (q.includes('crop') || q.includes('plant') || q.includes('kharif') || q.includes('rabi') || q.includes('grow') || q.includes('sow')) {
      return `Great question about crop selection! 🌾 Let me help you understand the best options.

**For Kharif Season (June-October):**
• **Rice** - Perfect if you have clayey soil and good rainfall (1200mm+)
• **Cotton** - Thrives in warm climate with black soil
• **Maize** - Very versatile, adapts to most soil types
• **Sugarcane** - Needs plenty of water but gives excellent returns

**For Rabi Season (November-April):**
• **Wheat** - Loves cool weather and well-drained soil
• **Chickpea** - Great for drought-prone areas
• **Mustard** - Low water requirement, good market demand

**My Recommendation Process:**
1. First, tell me your soil type (loamy, clayey, sandy, black, or red)
2. What's your average rainfall?
3. Do you have irrigation facilities?
4. What's your farm size?

With this info, I can give you personalized recommendations! Or you can use our **Crop Recommendation Tool** for AI-powered suggestions based on your exact conditions.

What's your soil type and location?`;
    }
    
    if (q.includes('pest') || q.includes('disease') || q.includes('bug') || q.includes('insect') || q.includes('attack')) {
      return `I understand pest problems can be really frustrating! 🐛 Let me help you tackle this.

**Immediate Actions:**
1. **Identify the pest** - Can you describe what you're seeing? (holes in leaves, discoloration, visible insects?)
2. **Isolate affected plants** - Remove severely infected ones to prevent spread
3. **Check neighboring plants** - Early detection is key!

**Organic Solutions (Safe & Effective):**
• **Neem Oil Spray** - Mix 5ml neem oil + 1L water, spray in evening
• **Garlic-Chili Spray** - Natural deterrent for most insects
• **Neem Cake** - Apply to soil, prevents root pests
• **Trichoderma** - Biological fungicide for soil diseases

**Chemical Solutions (When Needed):**
• For aphids: Imidacloprid or Acetamiprid
• For fungal diseases: Copper oxychloride or Mancozeb
• For borers: Chlorpyrifos (use carefully)

**Prevention Tips:**
✓ Inspect crops daily
✓ Practice crop rotation
✓ Maintain proper spacing
✓ Remove crop residues after harvest
✓ Use yellow sticky traps

Can you tell me more about what you're seeing on your crops? I can give you more specific advice!`;
    }
    
    if (q.includes('water') || q.includes('irrigat') || q.includes('drip') || q.includes('moisture')) {
      return `Water management is crucial for good yields! 💧 Let me share some practical tips.

**Smart Irrigation Techniques:**

**1. Drip Irrigation (Best Option)**
• Saves 40-60% water compared to flood irrigation
• Delivers water directly to roots
• Initial cost: ₹40,000-60,000 per acre
• Government subsidy available: 50-80%
• Payback period: 2-3 seasons

**2. Sprinkler System**
• Good for vegetables and field crops
• Saves 30-40% water
• More affordable than drip

**3. Flood Irrigation (Traditional)**
• Simple but wastes water
• Best for rice paddies

**Water-Saving Tips:**
✓ **Best time to irrigate:** Early morning (6-8 AM) or evening (5-7 PM)
✓ **Check soil moisture:** Insert finger 6 inches deep - if dry, irrigate
✓ **Mulching:** Reduces evaporation by 50%
✓ **Rainwater harvesting:** Store monsoon water for dry months

**Crop Water Requirements:**
• Rice: 1200-1500mm per season (high)
• Wheat: 450-650mm (medium)
• Cotton: 700-1000mm (medium)
• Vegetables: Daily or alternate day (high)
• Pulses: 300-400mm (low)

Which crop are you growing? I can give you a specific irrigation schedule!`;
    }
    
    if (q.includes('profit') || q.includes('cost') || q.includes('market') || q.includes('price') || q.includes('sell') || q.includes('income')) {
      return `Let's talk about maximizing your profits! 💰 Here's how to make smart financial decisions.

**Reducing Costs:**
1. **Organic Fertilizers** - Make compost from crop residues (saves ₹5,000-8,000/acre)
2. **Bulk Buying** - Join farmer cooperatives for 15-20% discount on inputs
3. **Intercropping** - Grow 2 crops together, increase income by 30%
4. **Drip Irrigation** - Reduce water & electricity bills by 40%

**Increasing Revenue:**
1. **Market Timing** - Don't sell immediately after harvest when prices are low
2. **Storage** - If possible, store for 2-3 months for better prices
3. **Direct Marketing** - Sell directly to consumers, earn 20-30% more
4. **Value Addition** - Process crops (e.g., rice to rice flour)

**Current Market Tips:**
• Check **e-NAM portal** daily for mandi prices
• Use our **Market Predictor** tool for price forecasts
• Sell when demand peaks (festivals, weddings)
• Avoid distress selling

**Government Support:**
• **PM-KISAN** - ₹6,000/year direct benefit
• **Crop Insurance** - Protects against losses
• **KCC (Kisan Credit Card)** - Low interest loans (4%)
• **MSP (Minimum Support Price)** - Guaranteed price for major crops

**Example Profit Calculation (1 acre wheat):**
• Revenue: 25 quintals × ₹2,000 = ₹50,000
• Costs: Seeds (₹2,000) + Fertilizer (₹4,000) + Labor (₹8,000) + Others (₹6,000) = ₹20,000
• **Net Profit: ₹30,000** (60% margin)

Which crop are you planning? I can help you estimate profits!`;
    }
    
    if (q.includes('weather') || q.includes('rain') || q.includes('forecast') || q.includes('climate')) {
      return `Weather planning is essential for successful farming! 🌤️

**Using Weather Information:**

**Our Weather Dashboard provides:**
• Real-time temperature, humidity, wind speed
• 7-day detailed forecast
• Rainfall predictions
• Climate risk alerts (drought, flood, heatwave)

**How to Use Weather Data:**

**Before Planting:**
• Check 15-day forecast
• Ensure good rainfall expected
• Avoid planting before heavy rains

**During Growing Season:**
• Monitor for extreme temperatures
• Plan irrigation based on rainfall forecast
• Apply pesticides when no rain expected for 24 hours

**Before Harvest:**
• Check for rain in next 7 days
• Harvest during dry spell
• Avoid harvesting wet crops

**Climate Alerts We Provide:**
🌵 **Drought Warning** - Start irrigation immediately
🌧️ **Heavy Rainfall** - Ensure drainage, delay fertilizer
🌡️ **Heatwave** - Increase irrigation, provide shade
❄️ **Cold Wave** - Cover sensitive crops

**Pro Tip:** We send alerts 3-7 days in advance, giving you time to take action!

Would you like me to check the current weather for your location?`;
    }
    
    if (q.includes('soil') || q.includes('fertilizer') || q.includes('nutrient') || q.includes('npk') || q.includes('compost')) {
      return `Soil health is the foundation of good farming! 🌱 Let me help you improve it.

**Understanding Your Soil:**

**Soil Types in India:**
• **Black Soil** - Best for cotton, excellent water retention
• **Red Soil** - Good for groundnut, needs fertilizer
• **Alluvial/Loamy** - Most fertile, ideal for wheat, rice
• **Sandy Soil** - Drains fast, needs frequent irrigation
• **Clayey Soil** - Holds water, good for rice

**Soil Testing (Highly Recommended):**
• Cost: ₹200-500 at government labs
• Tests: pH, NPK levels, organic matter
• Get tested every 2-3 years
• Based on results, apply exact fertilizers needed

**Organic Soil Improvement:**
1. **Compost** - Make from crop residues, kitchen waste
2. **Vermicompost** - Rich in nutrients, improves soil structure
3. **Green Manure** - Grow dhaincha/sunhemp, plow back
4. **Crop Rotation** - Prevents nutrient depletion
5. **Mulching** - Adds organic matter, retains moisture

**NPK Fertilizers:**
• **N (Nitrogen)** - For leaf growth (Urea)
• **P (Phosphorus)** - For roots & flowers (DAP)
• **K (Potassium)** - For overall health (MOP)

**Application Schedule:**
• **Basal dose** - Before planting (50% of total)
• **Top dressing** - 30 days after planting (25%)
• **Flowering stage** - 60 days after planting (25%)

**Signs of Nutrient Deficiency:**
• Yellow leaves → Nitrogen deficiency
• Purple leaves → Phosphorus deficiency  
• Brown leaf edges → Potassium deficiency

Want to use our **Soil Scanner** tool? Upload a soil photo for instant analysis!`;
    }
    
    if (q.includes('government') || q.includes('scheme') || q.includes('subsidy') || q.includes('loan') || q.includes('pm-kisan')) {
      return `There are many government schemes to support farmers! 🏛️ Let me explain the main ones.

**Direct Benefit Schemes:**

**1. PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)**
• ₹6,000 per year in 3 installments
• For all landholding farmers
• Apply online: pmkisan.gov.in
• Need: Aadhaar, bank account, land records

**2. Crop Insurance (PMFBY)**
• Protects against crop loss
• Premium: 2% for Kharif, 1.5% for Rabi
• Government pays rest of premium
• Covers natural calamities, pests
• Apply through banks or online

**3. Kisan Credit Card (KCC)**
• Low-interest loans (4% per annum)
• Up to ₹3 lakh without collateral
• For seeds, fertilizers, equipment
• Apply at any bank

**Subsidy Schemes:**

**4. Drip/Sprinkler Irrigation**
• 50-80% subsidy on installation
• Varies by state
• Apply through agriculture department

**5. Farm Mechanization**
• 40-50% subsidy on tractors, equipment
• For small & marginal farmers

**6. Soil Health Card**
• Free soil testing
• Customized fertilizer recommendations
• Available at district agriculture offices

**7. National Agriculture Market (e-NAM)**
• Online trading platform
• Better prices for farmers
• Transparent transactions
• Register at enam.gov.in

**How to Apply:**
1. Visit your nearest **Krishi Vigyan Kendra (KVK)**
2. Or district agriculture office
3. Keep ready: Aadhaar, land documents, bank passbook
4. Many schemes available online

**Pro Tip:** Don't miss deadlines! Most schemes have specific application periods.

Which scheme are you interested in? I can guide you through the application process!`;
    }
    
    // General/default response
    return `I'm here to help with all your farming questions! 🌾

I notice you're asking about something specific. Could you provide a bit more detail? For example:

**If it's about crops:**
• What crop are you growing or planning to grow?
• What's your soil type?
• What's your location/climate?

**If it's about problems:**
• What symptoms are you seeing?
• Which crop is affected?
• When did you first notice this?

**If it's about techniques:**
• What's your current practice?
• What are you trying to improve?
• What's your farm size?

The more details you share, the better I can help you!

**Quick Access Tools:**
• 🌾 **Crop Recommendation** - AI suggests best crops for your farm
• 🌤️ **Weather Dashboard** - 7-day forecast & alerts
• 🦠 **Disease Detection** - Upload photo, get instant diagnosis
• 📈 **Market Predictor** - Check current & future prices
• 💧 **Irrigation Advisor** - Optimize water usage

What would you like to know more about?`;
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
