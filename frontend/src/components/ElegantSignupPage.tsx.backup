import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Building, ArrowRight, ArrowLeft, Shield, Zap } from 'lucide-react';
import SmartFleetLogo from './SmartFleetLogo';

interface ElegantSignupPageProps {
  onSignup: (name: string, email: string, company: string, password: string, confirmPassword: string) => Promise<void>;
  onSwitchToLogin: () => void;
  onBack: () => void;
  loading: boolean;
  error: string;
}

const ElegantSignupPage: React.FC<ElegantSignupPageProps> = ({ 
  onSignup, 
  onSwitchToLogin, 
  onBack,
  loading, 
  error 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.company && formData.password && formData.confirmPassword && termsAccepted) {
      await onSignup(formData.name, formData.email, formData.company, formData.password, formData.confirmPassword);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-gray-100 flex relative overflow-hidden">
      {/* Enhanced Futuristic Background */}
      <div className="absolute inset-0">
        {/* Advanced Matrix Grid */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full">
            <defs>
              <pattern id="hexagons" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <polygon points="40,5 65,25 65,55 40,75 15,55 15,25" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                <polygon points="40,15 55,30 55,50 40,65 25,50 25,30" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.6"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexagons)" className="text-cyan-400 animate-pulse"/>
          </svg>
        </div>
        
        {/* Enhanced Floating Tech Elements */}
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 6}s`,
            }}
          >
            <div className={`w-3 h-3 border-2 ${i % 3 === 0 ? 'border-purple-400' : i % 3 === 1 ? 'border-cyan-400' : 'border-blue-400'} rotate-45 backdrop-blur-sm`} />
          </div>
        ))}
        
        {/* Enhanced Gradient Orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/25 via-pink-500/20 to-cyan-500/25 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-gradient-to-l from-cyan-500/25 via-blue-500/20 to-purple-500/25 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-indigo-500/15 to-purple-500/15 rounded-full blur-2xl animate-tech-pulse"></div>
        
        {/* Scanning Effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-scan-line opacity-40"></div>
          <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan-line opacity-30" style={{ animationDelay: '3s' }}></div>
        </div>
      </div>

      {/* Left Panel - Brand Showcase */}
      <div className="hidden lg:flex lg:w-1/2 relative">    
        <div className="flex flex-col justify-center items-center p-16 relative z-10 text-center w-full">
          {/* Professional Logo */}
          <div className="mb-12 transform hover:scale-105 transition-transform duration-500">
            <SmartFleetLogo size="xl" animated={true} />
          </div>
          
          {/* Brand Message */}
          <div className="space-y-6 max-w-md">
            <h2 className="text-3xl font-bold text-white leading-tight">
              Transform Your Fleet
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Management Experience
              </span>
            </h2>
            
            <p className="text-gray-300 text-lg leading-relaxed">
              Join thousands of enterprises leveraging AI-powered fleet intelligence for unprecedented operational efficiency.
            </p>
            
            {/* Feature Highlights */}
            <div className="flex justify-center space-x-8 mt-8">
              <div className="flex flex-col items-center space-y-2 group">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-gray-400 group-hover:text-purple-400 transition-colors">Enterprise Security</span>
              </div>
              
              <div className="flex flex-col items-center space-y-2 group">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center group-hover:shadow-lg group-hover:shadow-cyan-500/50 transition-all duration-300">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-gray-400 group-hover:text-cyan-400 transition-colors">Real-time Insights</span>
              </div>
              
              <div className="flex flex-col items-center space-y-2 group">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center group-hover:shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300">
                  <Cpu className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-gray-400 group-hover:text-blue-400 transition-colors">AI-Powered</span>
              </div>
            </div>
          </div>

          {/* Enterprise Trust Indicators */}
          <div className="mt-12 text-center">
            <p className="text-gray-400 text-sm mb-4">Trusted by Enterprise Leaders</p>
            <div className="flex justify-center space-x-6 opacity-60">
              <div className="w-16 h-8 bg-white/10 rounded flex items-center justify-center">
                <span className="text-xs font-medium text-white">Fortune 500</span>
              </div>
              <div className="w-16 h-8 bg-white/10 rounded flex items-center justify-center">
                <span className="text-xs font-medium text-white">SOC 2</span>
              </div>
              <div className="w-16 h-8 bg-white/10 rounded flex items-center justify-center">
                <span className="text-xs font-medium text-white">GDPR</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <SmartFleetLogo size="lg" />
          </div>
          
          {/* Signup Card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            {/* Back Button */}
            <div className="mb-6">
              <button
                type="button"
                onClick={onBack}
                className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="text-sm font-medium">Back to Home</span>
              </button>
            </div>
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Join SmartFleet</h3>
              <p className="text-gray-300">Create your enterprise account</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm backdrop-blur-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 block">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    placeholder="John Smith"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 block">Business Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    placeholder="john@company.com"
                    required
                  />
                </div>
              </div>

              {/* Company Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 block">Company Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    placeholder="Acme Corporation"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 block">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    placeholder="Create secure password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-purple-400 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-purple-400 transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 block">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-purple-400 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-purple-400 transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 rounded border-gray-600 text-purple-500 focus:ring-purple-500 focus:ring-offset-0 bg-white/10 border-white/20"
                />
                <label htmlFor="terms" className="text-sm text-gray-300">
                  I agree to the{' '}
                  <span className="text-purple-400 hover:text-purple-300 cursor-pointer">Terms of Service</span>
                  {' '}and{' '}
                  <span className="text-purple-400 hover:text-purple-300 cursor-pointer">Privacy Policy</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !termsAccepted}
                className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-500 hover:via-pink-500 hover:to-cyan-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Enterprise Account</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Login Link */}
              <div className="text-center pt-4">
                <p className="text-gray-400">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          </div>

          {/* Security Notice */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">
              Enterprise-grade security • GDPR Compliant • SOC 2 Type II
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElegantSignupPage;