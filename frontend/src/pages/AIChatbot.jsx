import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle, Send, Bot, User, Loader } from 'lucide-react';

export default function AIChatbot() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: t('chatbot.welcome') }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();
    
    // Weather queries
    if (msg.includes('weather') || msg.includes('rain') || msg.includes('temperature')) {
      return t('chatbot.weatherResponse');
    }
    
    // Crop queries
    if (msg.includes('crop') || msg.includes('plant') || msg.includes('grow')) {
      return t('chatbot.cropResponse');
    }
    
    // Pest/disease
    if (msg.includes('pest') || msg.includes('disease') || msg.includes('insect')) {
      return t('chatbot.pestResponse');
    }
    
    // Fertilizer
    if (msg.includes('fertilizer') || msg.includes('nutrient') || msg.includes('soil')) {
      return t('chatbot.fertilizerResponse');
    }
    
    // Irrigation
    if (msg.includes('water') || msg.includes('irrigation') || msg.includes('drip')) {
      return t('chatbot.irrigationResponse');
    }
    
    // Market price
    if (msg.includes('price') || msg.includes('market') || msg.includes('sell')) {
      return t('chatbot.priceResponse');
    }
    
    // Subsidy/loan
    if (msg.includes('subsidy') || msg.includes('loan') || msg.includes('scheme')) {
      return t('chatbot.subsidyResponse');
    }
    
    return t('chatbot.defaultResponse');
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), type: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        text: getBotResponse(input)
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const quickQuestions = [
    t('chatbot.q1'),
    t('chatbot.q2'),
    t('chatbot.q3'),
    t('chatbot.q4')
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="gradient-bg text-white p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{t('chatbot.title')}</h1>
              <p className="text-green-100">{t('chatbot.subtitle')}</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="h-[500px] overflow-y-auto p-6 bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 mb-4 ${
                msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.type === 'bot' ? 'bg-green-100' : 'bg-sky-100'
                }`}
              >
                {msg.type === 'bot' ? (
                  <Bot className="w-5 h-5 text-green-600" />
                ) : (
                  <User className="w-5 h-5 text-sky-600" />
                )}
              </div>
              <div
                className={`max-w-[70%] p-4 rounded-2xl ${
                  msg.type === 'bot'
                    ? 'bg-white shadow-md'
                    : 'bg-gradient-to-r from-green-600 to-sky-500 text-white'
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-green-600" />
              </div>
              <div className="bg-white shadow-md p-4 rounded-2xl">
                <Loader className="w-5 h-5 text-gray-400 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        <div className="px-6 py-3 bg-white border-t">
          <p className="text-sm text-gray-600 mb-2">{t('chatbot.quickQuestions')}</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => setInput(q)}
                className="text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-full hover:bg-green-100 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t">
          <div className="flex space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t('chatbot.placeholder')}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="bg-gradient-to-r from-green-600 to-sky-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
