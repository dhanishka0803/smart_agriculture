import { Link } from 'react-router-dom';
import { Sprout, Cloud, TrendingUp, Droplets, Brain, Shield, Users, Zap, CheckCircle, ArrowRight, Star, BarChart3, Smartphone, MapPin, Phone, Mail, Calendar, TrendingDown, Leaf, Sun, CloudRain, Wind } from 'lucide-react';
import { useState, useEffect } from 'react';

function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero slider images
  const heroImages = [
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80',
    'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=1920&q=80',
    'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=1920&q=80'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Advanced machine learning models trained on real agricultural data for 95%+ accurate crop recommendations',
      color: 'from-primary to-primary-light'
    },
    {
      icon: Cloud,
      title: 'Real-Time Weather',
      description: 'Hyperlocal weather forecasts, climate alerts, and historical data to plan your farming activities',
      color: 'from-blue-500 to-blue-400'
    },
    {
      icon: TrendingUp,
      title: 'Market Intelligence',
      description: 'Live mandi rates, price predictions, and demand forecasting to maximize your profits',
      color: 'from-purple-500 to-purple-400'
    },
    {
      icon: Droplets,
      title: 'Smart Irrigation',
      description: 'Save 30-40% water with AI-driven irrigation recommendations based on soil moisture and weather',
      color: 'from-cyan-500 to-cyan-400'
    },
    {
      icon: Shield,
      title: 'Disease Detection',
      description: 'Upload crop images for instant AI-powered disease identification and treatment recommendations',
      color: 'from-red-500 to-red-400'
    },
    {
      icon: Users,
      title: 'Farmer Community',
      description: 'Connect with 100,000+ farmers, share knowledge, and learn from agricultural experts',
      color: 'from-indigo-500 to-indigo-400'
    }
  ];

  const stats = [
    { value: '100K+', label: 'Active Farmers', icon: Users },
    { value: '95%', label: 'ML Accuracy', icon: Brain },
    { value: '40%', label: 'Water Saved', icon: Droplets },
    { value: '25%', label: 'Yield Increase', icon: TrendingUp }
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      location: 'Punjab',
      image: '👨‍🌾',
      rating: 5,
      text: 'AgriSense helped me increase my wheat yield by 30%. The AI recommendations are spot-on!'
    },
    {
      name: 'Lakshmi Devi',
      location: 'Tamil Nadu',
      image: '👩‍🌾',
      rating: 5,
      text: 'The weather alerts saved my rice crop from unexpected rainfall. Highly recommended!'
    },
    {
      name: 'Suresh Patil',
      location: 'Maharashtra',
      image: '👨‍🌾',
      rating: 5,
      text: 'Market price predictions helped me sell cotton at the right time. Earned 20% more profit!'
    }
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '₹0',
      period: 'forever',
      features: [
        'Basic weather forecasts',
        'Crop recommendations',
        'Community access',
        'Mobile app access',
        '5 disease scans/month'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Pro',
      price: '₹99',
      period: 'per month',
      features: [
        'Everything in Free',
        'Advanced AI insights',
        'Unlimited disease detection',
        'Market intelligence',
        'Priority support',
        'Offline mode',
        'SMS alerts'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact us',
      features: [
        'Everything in Pro',
        'IoT sensor integration',
        'Custom ML models',
        'Dedicated support',
        'API access',
        'White-label solution',
        'Training sessions'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  const cropImages = [
    { src: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80', name: 'Rice Paddies', region: 'Tamil Nadu' },
    { src: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80', name: 'Wheat Fields', region: 'Punjab' },
    { src: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&q=80', name: 'Vegetable Farms', region: 'Maharashtra' },
    { src: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80', name: 'Fruit Orchards', region: 'Karnataka' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Slider */}
      <section className="relative overflow-hidden h-screen min-h-[600px]">
        {heroImages.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <img src={img} alt="Agriculture" className="w-full h-full object-cover" />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        
        {/* Slider Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 rounded-full transition-all ${idx === currentSlide ? 'bg-white w-8' : 'bg-white/50'}`}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 h-full relative z-10 flex items-center">
          <div className="max-w-3xl text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full mb-6">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-semibold">Trusted by 100,000+ Farmers</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Climate-Smart
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-300">
                Farming with AI
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-green-100 mb-8 leading-relaxed">
              Increase yields by 25%, save 40% water, and boost profits with real-time weather intelligence, 
              AI-powered crop recommendations, and smart farming tools.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/register" className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center gap-2">
                Start Free Trial <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/dashboard" className="bg-white/20 backdrop-blur text-white border-2 border-white/30 hover:bg-white/30 text-lg px-8 py-4 rounded-xl font-semibold inline-flex items-center justify-center gap-2 transition-all">
                <Cloud className="w-5 h-5" />
                View Demo
              </Link>
            </div>

            <div className="flex flex-wrap gap-8 text-sm text-green-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary dark:text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive suite of AI-powered tools designed specifically for modern farmers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Crop Gallery Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary dark:text-white mb-4">
              Farms Across India
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Trusted by farmers in every state</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cropImages.map((crop, index) => (
              <div key={index} className="relative group overflow-hidden rounded-xl">
                <img 
                  src={crop.src} 
                  alt={crop.name} 
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="font-bold text-lg">{crop.name}</p>
                    <p className="text-sm text-green-300 flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {crop.region}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-green-800 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Loved by Farmers Across India
            </h2>
            <p className="text-xl text-green-100">Real stories from real farmers</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/10 backdrop-blur p-8 rounded-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl">{testimonial.image}</div>
                  <div>
                    <div className="font-bold text-lg">{testimonial.name}</div>
                    <div className="text-sm text-green-200">{testimonial.location}</div>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-green-50 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary dark:text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Choose the plan that fits your farm</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`bg-white dark:bg-gray-800 rounded-2xl overflow-hidden ${plan.popular ? 'ring-4 ring-primary scale-105' : ''} shadow-xl`}>
                {plan.popular && (
                  <div className="bg-gradient-to-r from-accent-pink to-accent-pinkLight text-primary font-bold text-sm px-4 py-2 text-center">
                    Most Popular
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-primary">{plan.price}</span>
                    <span className="text-gray-500 ml-2 dark:text-gray-400">/ {plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link 
                    to="/register" 
                    className={plan.popular ? 'btn-primary w-full text-center block' : 'btn-secondary w-full text-center block'}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join 100,000+ farmers who are already using AgriSense AI to increase yields and profits
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg text-lg inline-flex items-center gap-2">
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/dashboard" className="bg-white/20 backdrop-blur text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/30 transition-all border-2 border-white text-lg inline-flex items-center gap-2">
              <Cloud className="w-5 h-5" />
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sprout className="w-10 h-10" />
                <span className="text-2xl font-bold">AgriSense AI</span>
              </div>
              <p className="text-primary-pale mb-6">Climate-smart farming for the modern farmer</p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all">f</a>
                <a href="#" className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all">t</a>
                <a href="#" className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all">in</a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Product</h4>
              <ul className="space-y-2 text-primary-pale">
                <li><Link to="/dashboard" className="hover:text-white">Dashboard</Link></li>
                <li><Link to="/crop-advice" className="hover:text-white">Crop Advice</Link></li>
                <li><Link to="/weather" className="hover:text-white">Weather</Link></li>
                <li><Link to="/market-predictor" className="hover:text-white">Market Prices</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Company</h4>
              <ul className="space-y-2 text-primary-pale">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Contact</h4>
              <ul className="space-y-3 text-primary-pale">
                <li className="flex items-center gap-2"><MapPin className="w-5 h-5" /> Coimbatore, TN</li>
                <li className="flex items-center gap-2"><Phone className="w-5 h-5" /> +91 98765 43210</li>
                <li className="flex items-center gap-2"><Mail className="w-5 h-5" /> support@agrisense.ai</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-light pt-8 text-center text-primary-pale">
            <p>© 2026 AgriSense AI. All rights reserved. Made with ❤️ for farmers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
