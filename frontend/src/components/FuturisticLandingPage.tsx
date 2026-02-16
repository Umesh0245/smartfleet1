import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Play, Star, Globe, 
  Truck, MapPin, Shield,
  TrendingUp, Activity, Cpu, Network,
  ChevronRight, Menu, X, Target, AlertTriangle,
  Battery, DollarSign, Fuel, Route,
  Cloud, Lock, Eye, TrendingDown
} from 'lucide-react';
import Orb from './Orb';
import SmartFleetLogo from './SmartFleetLogo';
import { motion } from 'framer-motion';

interface FuturisticLandingPageProps {
  onLogin: () => void;
  onSignup: () => void;
}

const FuturisticLandingPage: React.FC<FuturisticLandingPageProps> = ({ onLogin, onSignup }) => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: MapPin,
      title: 'Real-time Tracking',
      description: 'Advanced GPS tracking with AI-powered route optimization and predictive analytics.',
      gradient: 'from-cyan-500 to-blue-600',
      bgGradient: 'from-cyan-500/20 to-blue-600/20'
    },
    {
      icon: Cpu,
      title: 'Predictive Analytics',
      description: 'Machine learning algorithms that predict maintenance needs and optimize fleet performance.',
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-500/20 to-pink-600/20'
    },
    {
      icon: Network,
      title: 'Automated Logistics',
      description: 'Smart dispatch system with automated routing and load optimization.',
      gradient: 'from-emerald-500 to-green-600',
      bgGradient: 'from-emerald-500/20 to-green-600/20'
    },
    {
      icon: Activity,
      title: 'Fleet Health Monitor',
      description: 'Comprehensive vehicle diagnostics with predictive maintenance alerts.',
      gradient: 'from-orange-500 to-red-600',
      bgGradient: 'from-orange-500/20 to-red-600/20'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      company: 'LogiTech Solutions',
      text: 'SmartFleet reduced our operational costs by 35% while improving delivery times.',
      rating: 5,
      avatar: '👩‍💼'
    },
    {
      name: 'Marcus Rodriguez',
      company: 'Global Transport Inc.',
      text: 'The predictive analytics helped us prevent 90% of potential breakdowns.',
      rating: 5,
      avatar: '👨‍💼'
    },
    {
      name: 'Emily Watson',
      company: 'Urban Delivery',
      text: 'Best fleet management system we\'ve ever used. Intuitive and powerful.',
      rating: 5,
      avatar: '👩‍🔬'
    }
  ];

  const primaryStats = [
    { label: 'Fleet Vehicles Managed', value: '50K+', icon: Truck, color: 'text-cyan-400' },
    { label: 'Cost Reduction Average', value: '35%', icon: TrendingUp, color: 'text-green-400' },
    { label: 'Uptime Improvement', value: '99.9%', icon: Shield, color: 'text-blue-400' },
    { label: 'Global Clients', value: '500+', icon: Globe, color: 'text-purple-400' }
  ];

  const advancedMetrics = [
    { label: 'Predictive Accuracy', value: '94.7%', icon: Target, color: 'text-emerald-400', description: 'ML prediction accuracy for maintenance needs' },
    { label: 'Fuel Efficiency Gain', value: '22%', icon: Fuel, color: 'text-yellow-400', description: 'Average fuel consumption reduction' },
    { label: 'Route Optimization', value: '18%', icon: Route, color: 'text-orange-400', description: 'Time saved through smart routing' },
    { label: 'Breakdown Prevention', value: '87%', icon: AlertTriangle, color: 'text-red-400', description: 'Preventable breakdowns avoided' },
    { label: 'Data Processing Speed', value: '2.3ms', icon: Cpu, color: 'text-indigo-400', description: 'Real-time telemetry processing' },
    { label: 'Driver Safety Score', value: '9.2/10', icon: Shield, color: 'text-blue-400', description: 'Average safety improvement rating' },
    { label: 'Maintenance Cost Savings', value: '$2.4M', icon: DollarSign, color: 'text-green-400', description: 'Annual maintenance cost reduction' },
    { label: 'Fleet Availability', value: '98.6%', icon: Battery, color: 'text-cyan-400', description: 'Vehicle uptime percentage' },
    { label: 'Environmental Impact', value: '-28%', icon: TrendingDown, color: 'text-green-500', description: 'CO2 emissions reduction' },
    { label: 'Data Security Events', value: '0', icon: Lock, color: 'text-purple-400', description: 'Zero security breaches maintained' },
    { label: 'Real-time Monitoring', value: '24/7', icon: Eye, color: 'text-orange-400', description: 'Continuous fleet surveillance' },
    { label: 'Cloud Reliability', value: '99.99%', icon: Cloud, color: 'text-sky-400', description: 'Platform uptime guarantee' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-black text-white overflow-x-hidden relative">
      {/* Subtle Orb Background - Single centered orb with proper dark theme */}
      <div className="fixed inset-0 z-[-1]">
        {/* Strong dark background to ensure proper contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-gray-900 to-black"></div>
        
        {/* Single subtle orb for accent only */}
        <div className="absolute inset-0 opacity-20">
          <Orb
            hoverIntensity={0.1}
            rotateOnHover={false}
            hue={200}
            forceHoverState={false}
          />
        </div>
      </div>
      
      {/* Navigation Header */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-gray-900/80 border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <SmartFleetLogo size="sm" />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">Features</a>
              <a href="#analytics" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">Analytics</a>
              <a href="#testimonials" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">Testimonials</a>
              <a href="#pricing" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">Pricing</a>
            </div>

            {/* Login/Signup Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={onLogin}
                className="px-6 py-2 text-cyan-400 border border-cyan-500/50 rounded-lg hover:bg-cyan-500/10 transition-all duration-300 font-medium"
              >
                Login
              </button>
              <button
                onClick={onSignup}
                className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg transition-all duration-300 font-medium shadow-lg shadow-cyan-500/25"
              >
                Sign Up
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-cyan-400"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-700 pt-4">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-300 hover:text-cyan-400 transition-colors">Features</a>
                <a href="#analytics" className="text-gray-300 hover:text-cyan-400 transition-colors">Analytics</a>
                <a href="#testimonials" className="text-gray-300 hover:text-cyan-400 transition-colors">Testimonials</a>
                <div className="flex flex-col space-y-2 pt-4">
                  <button
                    onClick={onLogin}
                    className="px-6 py-2 text-cyan-400 border border-cyan-500/50 rounded-lg hover:bg-cyan-500/10 transition-all duration-300"
                  >
                    Login
                  </button>
                  <button
                    onClick={onSignup}
                    className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg transition-all duration-300"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Next-Generation
              </span>
              <br />
              <span className="text-white">Fleet Management</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Harness the power of AI and IoT to revolutionize your fleet operations. 
              Real-time tracking, predictive analytics, and automated optimization.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
            <button
              onClick={onSignup}
              className="group flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transform hover:scale-105"
            >
              <span>Start Your Journey</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group flex items-center space-x-3 px-8 py-4 border border-gray-600 hover:border-cyan-400 rounded-xl text-lg font-semibold transition-all duration-300 hover:bg-cyan-500/10">
              <Play className="w-5 h-5 text-cyan-400" />
              <span>Watch Demo</span>
            </button>
          </div>

          {/* Primary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            {primaryStats.map((stat, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-gradient-to-br from-gray-800/60 to-gray-900/80 backdrop-blur-sm border border-cyan-500/20 rounded-xl hover:border-cyan-400/40 transition-all group"
              >
                <div className="flex items-center justify-center mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Advanced Metrics */}
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Advanced Performance Metrics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {advancedMetrics.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-5 bg-gradient-to-br from-gray-800/40 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl hover:border-cyan-500/30 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center group-hover:from-cyan-500/20 group-hover:to-blue-500/20 transition-all`}>
                        <metric.icon className={`w-5 h-5 ${metric.color}`} />
                      </div>
                      <div>
                        <div className={`text-xl font-bold ${metric.color}`}>{metric.value}</div>
                        <div className="text-sm font-medium text-gray-300">{metric.label}</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{metric.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gradient-to-br from-gray-900/50 to-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Intelligent Features
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the future of fleet management with our AI-powered platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Feature Showcase */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-500 transform ${
                    currentFeature === index
                      ? `bg-gradient-to-r ${feature.bgGradient} border border-cyan-500/50 scale-105 shadow-2xl`
                      : 'bg-gray-800/60 border border-gray-700/50 hover:border-cyan-500/30'
                  }`}
                  onClick={() => setCurrentFeature(index)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      currentFeature === index
                        ? `bg-gradient-to-br ${feature.gradient} shadow-lg`
                        : 'bg-gray-700'
                    }`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                      <p className="text-gray-300">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 3D Visualization */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-gray-800/60 to-gray-900/80 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 animate-pulse"></div>
                
                {/* Dynamic Content Based on Selected Feature */}
                <div className="relative z-10 h-full flex items-center justify-center">
                  {currentFeature === 0 && (
                    <div className="text-center space-y-6">
                      <div className="relative">
                        <div className="w-32 h-32 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
                          <MapPin className="w-16 h-16 text-white" />
                        </div>
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                          {[...Array(3)].map((_, i) => (
                            <div
                              key={i}
                              className="absolute w-4 h-4 bg-cyan-400 rounded-full animate-ping"
                              style={{
                                animationDelay: `${i * 0.5}s`,
                                transform: `rotate(${i * 120}deg) translateY(-50px)`
                              }}
                            ></div>
                          ))}
                        </div>
                      </div>
                      <h4 className="text-2xl font-bold text-cyan-400">Real-time Tracking</h4>
                      <p className="text-gray-300">Live vehicle positions with AI route optimization</p>
                    </div>
                  )}

                  {currentFeature === 1 && (
                    <div className="text-center space-y-6">
                      <div className="relative">
                        <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto">
                          <Cpu className="w-16 h-16 text-white" />
                        </div>
                        <div className="absolute inset-0 animate-spin">
                          {[...Array(8)].map((_, i) => (
                            <div
                              key={i}
                              className="absolute w-2 h-2 bg-purple-400 rounded-full"
                              style={{
                                transform: `rotate(${i * 45}deg) translateY(-60px)`,
                                transformOrigin: '50% 60px'
                              }}
                            ></div>
                          ))}
                        </div>
                      </div>
                      <h4 className="text-2xl font-bold text-purple-400">Predictive Analytics</h4>
                      <p className="text-gray-300">AI-powered insights and maintenance predictions</p>
                    </div>
                  )}

                  {currentFeature === 2 && (
                    <div className="text-center space-y-6">
                      <div className="relative">
                        <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto">
                          <Network className="w-16 h-16 text-white" />
                        </div>
                        <div className="absolute inset-0">
                          {[...Array(6)].map((_, i) => (
                            <div
                              key={i}
                              className="absolute w-1 h-8 bg-emerald-400 opacity-60 animate-pulse"
                              style={{
                                transform: `rotate(${i * 60}deg) translateY(-50px)`,
                                transformOrigin: '50% 50px',
                                animationDelay: `${i * 0.2}s`
                              }}
                            ></div>
                          ))}
                        </div>
                      </div>
                      <h4 className="text-2xl font-bold text-emerald-400">Automated Logistics</h4>
                      <p className="text-gray-300">Smart dispatch and route optimization</p>
                    </div>
                  )}

                  {currentFeature === 3 && (
                    <div className="text-center space-y-6">
                      <div className="relative">
                        <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto">
                          <Activity className="w-16 h-16 text-white" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-40 h-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-full relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                            <div className="absolute top-0 left-0 w-4 h-full bg-white rounded-full animate-bounce"></div>
                          </div>
                        </div>
                      </div>
                      <h4 className="text-2xl font-bold text-orange-400">Fleet Health Monitor</h4>
                      <p className="text-gray-300">Comprehensive diagnostics and health monitoring</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6 bg-gradient-to-br from-gray-900/80 to-black/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Trusted by Leaders
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              See what industry leaders say about SmartFleet
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-6 bg-gradient-to-br from-gray-800/60 to-gray-900/80 backdrop-blur-sm border border-cyan-500/20 rounded-2xl hover:border-cyan-400/40 transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{testimonial.avatar}</div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-cyan-400">{testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Simple, Transparent Pricing
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Choose the perfect plan for your fleet size and get started today
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300 transform hover:scale-105">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
                <p className="text-gray-400 mb-4">Perfect for small fleets</p>
                <div className="text-4xl font-bold text-cyan-400 mb-2">$29</div>
                <p className="text-gray-500">per vehicle/month</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                  Up to 10 vehicles
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                  Real-time tracking
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                  Basic analytics
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                  24/7 support
                </li>
              </ul>
              <button
                onClick={onSignup}
                className="w-full py-3 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg font-semibold transition-all duration-300"
              >
                Get Started
              </button>
            </div>

            {/* Professional Plan - Popular */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-2xl p-8 border-2 border-cyan-500/70 hover:border-cyan-400 transition-all duration-300 transform hover:scale-105 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
                <p className="text-gray-400 mb-4">For growing businesses</p>
                <div className="text-4xl font-bold text-cyan-400 mb-2">$49</div>
                <p className="text-gray-500">per vehicle/month</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                  Up to 100 vehicles
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                  Advanced analytics
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                  Predictive maintenance
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                  API access
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
                  Priority support
                </li>
              </ul>
              <button
                onClick={onSignup}
                className="w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-cyan-500/30"
              >
                Get Started
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                <p className="text-gray-400 mb-4">For large operations</p>
                <div className="text-4xl font-bold text-purple-400 mb-2">Custom</div>
                <p className="text-gray-500">tailored pricing</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  Unlimited vehicles
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  AI-powered insights
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  Custom integrations
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  Dedicated support
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  SLA guarantee
                </li>
              </ul>
              <button
                onClick={onSignup}
                className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg font-semibold transition-all duration-300"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-900/70 to-black/70">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-cyan-500/30 rounded-3xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Ready to Transform Your Fleet?
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of companies who have revolutionized their operations with SmartFleet
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <button
                  onClick={onSignup}
                  className="group flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transform hover:scale-105"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={onLogin}
                  className="flex items-center space-x-3 px-8 py-4 border border-cyan-500/50 hover:border-cyan-400 rounded-xl text-lg font-semibold transition-all duration-300 hover:bg-cyan-500/10"
                >
                  <span>Sign In</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900/80 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <SmartFleetLogo size="sm" />
            </div>
            <div className="flex items-center space-x-6 text-gray-400">
              <a href="#" className="hover:text-cyan-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Support</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Contact</a>
            </div>
          </div>
          <div className="text-center text-gray-500 mt-8">
            © 2025 SmartFleet. All rights reserved. Powered by next-generation AI.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FuturisticLandingPage;