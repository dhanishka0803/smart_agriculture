import { Link } from 'react-router-dom';
import { Sprout, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube, Send, ExternalLink } from 'lucide-react';
import { useState } from 'react';

function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert('Thank you for subscribing to AgriSense AI updates!');
      setEmail('');
    }
  };

  return (
    <footer className="bg-primary text-white mt-20">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-primary-light to-primary-dark py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated with AgriSense AI</h3>
            <p className="text-green-100 mb-6">Get the latest farming tips, weather updates, and market prices delivered to your inbox</p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-light"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-accent-pink hover:bg-accent-pinkLight rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-5 h-5" />
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sprout className="w-10 h-10" />
              <span className="text-2xl font-bold">AgriSense AI</span>
            </div>
            <p className="text-primary-pale mb-6">
              Empowering farmers with AI-powered climate-smart farming solutions for sustainable agriculture and increased yields.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://facebook.com/agrisense" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com/agrisense" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com/agrisense" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com/company/agrisense" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://youtube.com/agrisense" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3 text-primary-pale">
              <li><Link to="/dashboard" className="hover:text-white transition-colors flex items-center gap-2"><ExternalLink className="w-4 h-4" />Dashboard</Link></li>
              <li><Link to="/weather" className="hover:text-white transition-colors flex items-center gap-2"><ExternalLink className="w-4 h-4" />Weather</Link></li>
              <li><Link to="/crop-advice" className="hover:text-white transition-colors flex items-center gap-2"><ExternalLink className="w-4 h-4" />Crop Advice</Link></li>
              <li><Link to="/disease-detection" className="hover:text-white transition-colors flex items-center gap-2"><ExternalLink className="w-4 h-4" />Disease Detection</Link></li>
              <li><Link to="/market-predictor" className="hover:text-white transition-colors flex items-center gap-2"><ExternalLink className="w-4 h-4" />Market Prices</Link></li>
              <li><Link to="/ai-chatbot" className="hover:text-white transition-colors flex items-center gap-2"><ExternalLink className="w-4 h-4" />AI Assistant</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-lg mb-4">Resources</h4>
            <ul className="space-y-3 text-primary-pale">
              <li><a href="#help" className="hover:text-white transition-colors flex items-center gap-2"><ExternalLink className="w-4 h-4" />Help Center</a></li>
              <li><a href="#tutorials" className="hover:text-white transition-colors flex items-center gap-2"><ExternalLink className="w-4 h-4" />Video Tutorials</a></li>
              <li><a href="#blog" className="hover:text-white transition-colors flex items-center gap-2"><ExternalLink className="w-4 h-4" />Farming Blog</a></li>
              <li><a href="#api" className="hover:text-white transition-colors flex items-center gap-2"><ExternalLink className="w-4 h-4" />API Documentation</a></li>
              <li><a href="#faqs" className="hover:text-white transition-colors flex items-center gap-2"><ExternalLink className="w-4 h-4" />FAQs</a></li>
              <li><a href="#community" className="hover:text-white transition-colors flex items-center gap-2"><ExternalLink className="w-4 h-4" />Community Forum</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-4 text-primary-pale">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-1" />
                <span>AgriSense Technologies Pvt Ltd<br/>123 Agriculture Street, Coimbatore, Tamil Nadu 641001, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <a href="tel:+919876543210" className="hover:text-white">+91 98765 43210</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <a href="mailto:support@agrisense.ai" className="hover:text-white">support@agrisense.ai</a>
              </li>
            </ul>
            
            {/* App Download Section */}
            <div className="mt-6">
              <h5 className="font-semibold mb-3">Download App</h5>
              <div className="flex gap-3">
                <a href="#" className="bg-black/30 hover:bg-black/40 px-4 py-2 rounded-lg text-sm transition-all">
                  <span className="block text-xs">Download on the</span>
                  <span className="block font-semibold">App Store</span>
                </a>
                <a href="#" className="bg-black/30 hover:bg-black/40 px-4 py-2 rounded-lg text-sm transition-all">
                  <span className="block text-xs">Get it on</span>
                  <span className="block font-semibold">Google Play</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image Section */}
        <div className="mb-12">
          <img 
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&q=80" 
            alt="Smart Farming" 
            className="w-full h-48 md:h-64 object-cover rounded-xl"
          />
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-light pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-pale text-sm">
              © 2026 AgriSense AI. All rights reserved. Made with ❤️ for farmers.
            </p>
            <div className="flex gap-6 text-sm text-primary-pale">
              <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#cookies" className="hover:text-white transition-colors">Cookie Policy</a>
              <a href="#refund" className="hover:text-white transition-colors">Refund Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
