import { Link } from 'react-router-dom';
import { Sprout, Cloud, TrendingUp, Droplets, Brain, Shield, Users, Zap, CheckCircle, ArrowRight, Star, BarChart3, Smartphone } from 'lucide-react';

function LandingPage() {
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
      color: 'from-accent-mint to-primary-lighter'
    },
    {
      icon: TrendingUp,
      title: 'Market Intelligence',
      description: 'Live mandi rates, price predictions, and demand forecasting to maximize your profits',
      color: 'from-accent-pink to-accent-pinkLight'
    },
    {
      icon: Droplets,
      title: 'Smart Irrigation',
      description: 'Save 30-40% water with AI-driven irrigation recommendations based on soil moisture and weather',
      color: 'from-secondary to-primary-lighter'
    },
    {
      icon: Shield,
      title: 'Disease Detection',
      description: 'Upload crop images for instant AI-powered disease identification and treatment recommendations',
      color: 'from-primary-light to-accent-mint'
    },
    {
      icon: Users,
      title: 'Farmer Community',
      description: 'Connect with 100,000+ farmers, share knowledge, and learn from agricultural experts',
      color: 'from-accent-pinkLight to-accent-pink'
    }
  ];

  const stats = [
    { value: '100K+', label: 'Active Farmers' },
    { value: '95%', label: 'ML Accuracy' },
    { value: '40%', label: 'Water Saved' },
    { value: '25%', label: 'Yield Increase' }
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
        'Mobile app access'
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
        'Disease detection',
        'Market intelligence',
        'Priority support',
        'Offline mode'
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
        'White-label solution'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80" alt="Agriculture" className="w-full h-full object-cover opacity-20" />
        </div>
        <div className="absolute inset-0 gradient-bg opacity-10"></div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md mb-6">
              <Zap className="w-4 h-4 text-accent-pink" />
              <span className="text-sm font-semibold text-primary">Trusted by 100,000+ Farmers</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-light to-accent-mint bg-clip-text text-transparent">
              Climate-Smart Farming with AI
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
              Increase yields by 25%, save 40% water, and boost profits with real-time weather intelligence, 
              AI-powered crop recommendations, and smart farming tools.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/register" className="btn-primary text-lg px-8 py-4">
                Start Free Trial <ArrowRight className="w-5 h-5 inline ml-2" />
              </Link>
              <Link to="/dashboard" className="btn-secondary text-lg px-8 py-4">
                View Demo
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary-light" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary-light" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary-light" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1920&q=80" alt="Smart Farming" className="w-full h-full object-cover opacity-5" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive suite of AI-powered tools designed specifically for modern farmers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="glass-card hover:scale-105 transition-transform animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Loved by Farmers Across India
            </h2>
            <p className="text-xl text-gray-600">Real stories from real farmers</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl">{testimonial.image}</div>
                  <div>
                    <div className="font-bold text-primary">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.location}</div>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent-pink text-accent-pink" />
                  ))}
                </div>
                <p className="text-gray-700 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">Choose the plan that fits your farm</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`card ${plan.popular ? 'ring-4 ring-primary scale-105' : ''} animate-fade-in-up`} style={{ animationDelay: `${index * 0.1}s` }}>
                {plan.popular && (
                  <div className="bg-gradient-to-r from-accent-pink to-accent-pinkLight text-primary font-bold text-sm px-4 py-1 rounded-full inline-block mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-primary mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-primary">{plan.price}</span>
                  <span className="text-gray-600 ml-2">/ {plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-primary-light flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/register" className={plan.popular ? 'btn-primary w-full text-center block' : 'btn-secondary w-full text-center block'}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join 100,000+ farmers who are already using AgriSense AI to increase yields and profits
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg text-lg">
              Start Free Trial <ArrowRight className="w-5 h-5 inline ml-2" />
            </Link>
            <Link to="/dashboard" className="bg-white/20 backdrop-blur text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/30 transition-all border-2 border-white text-lg">
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sprout className="w-8 h-8" />
                <span className="text-2xl font-bold">AgriSense AI</span>
              </div>
              <p className="text-primary-pale">Climate-smart farming for the modern farmer</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-primary-pale">
                <li><Link to="/dashboard" className="hover:text-white">Dashboard</Link></li>
                <li><Link to="/crop-advice" className="hover:text-white">Crop Advice</Link></li>
                <li><Link to="/weather" className="hover:text-white">Weather</Link></li>
                <li><Link to="/market-predictor" className="hover:text-white">Market Prices</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-primary-pale">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-primary-pale">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-light pt-8 text-center text-primary-pale">
            <p>&copy; 2024 AgriSense AI. All rights reserved. Made with ❤️ for farmers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
