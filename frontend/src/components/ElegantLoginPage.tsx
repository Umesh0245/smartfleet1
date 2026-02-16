import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, ArrowLeft, Shield, Zap, Cpu } from 'lucide-react';
import SmartFleetLogo from './SmartFleetLogo';

interface ElegantLoginPageProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSwitchToSignup: () => void;
  onForgotPassword: () => void;
  onBack: () => void;
  loading: boolean;
  error: string;
}

const ElegantLoginPage: React.FC<ElegantLoginPageProps> = ({ 
  onLogin, 
  onSwitchToSignup, 
  onForgotPassword, 
  onBack,
  loading, 
  error 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    
    if (!trimmedEmail || !trimmedPassword) {
      return;
    }
    
    try {
      await onLogin(trimmedEmail, trimmedPassword);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-gray-100 flex relative overflow-hidden">
      {/* Professional Background - Subtle and Clean */}
      <div className="absolute inset-0">
        {/* Minimal Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(15, 23, 42, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(15, 23, 42, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        
        {/* Subtle Moving Elements */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-500/20 rounded-full"
            style={{
              left: `${20 + i * 30}%`,
              top: `${20 + i * 20}%`,
              animation: `float ${8 + i * 2}s ease-in-out infinite`
            }}
          />
        ))}
        
        {/* Professional Accent Elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-blue-500/8 to-indigo-500/4 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-tr from-slate-500/6 to-gray-500/3 rounded-full blur-2xl"></div>
      </div>

      {/* Left Panel - Professional Brand Section */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-gray-900 to-slate-900 overflow-hidden">    
        {/* Clean Professional Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-600/5 to-purple-600/10"></div>
        
        {/* Simple Professional Pattern */}
        <div className="absolute inset-0 opacity-5 z-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        {/* Simple accent elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-gradient-to-tr from-blue-500/10 to-purple-500/5 rounded-full blur-lg"></div>
        
        <div className="flex flex-col justify-center items-center p-16 relative z-10 text-center w-full">
          {/* Clean Logo Presentation */}
          <div className="mb-10">
            <SmartFleetLogo size="xl" animated={false} />
          </div>
          
          {/* Professional Brand Message */}
          <div className="space-y-6 max-w-lg">
            <h1 className="text-4xl font-light text-white leading-tight tracking-wide">
              Enterprise Fleet
              <span className="block font-semibold text-blue-400">
                Management Platform
              </span>
            </h1>
            
            <p className="text-gray-400 text-lg leading-relaxed font-light">
              Streamline operations with intelligent analytics, real-time monitoring, and comprehensive fleet oversight designed for enterprise scale.
            </p>
            
            {/* Professional Features */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-700/50">
              <div className="text-center">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-3 border border-blue-500/20">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-sm text-gray-400 font-medium">Secure</span>
              </div>
              
              <div className="text-center">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-3 border border-blue-500/20">
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-sm text-gray-400 font-medium">Fast</span>
              </div>
              
              <div className="text-center">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-3 border border-blue-500/20">
                  <Cpu className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-sm text-gray-400 font-medium">Smart</span>
              </div>
            </div>
          </div>

          {/* Enterprise Trust Badge */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-4 px-6 py-3 bg-white/5 rounded-full border border-white/10">
              <span className="text-xs text-gray-400 font-medium">Trusted by 500+ enterprises</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Professional Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-10">
            <SmartFleetLogo size="lg" />
          </div>
          
          {/* Clean Login Card */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
            {/* Back Button */}
            <div className="mb-6">
              <button
                type="button"
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="text-sm font-medium">Back to Home</span>
              </button>
            </div>
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to your account</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className={`h-5 w-5 transition-colors ${focusedField === 'email' ? 'text-blue-500' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="your.email@company.com"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className={`h-5 w-5 transition-colors ${focusedField === 'password' ? 'text-blue-500' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-blue-500 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-blue-500 transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Signup Link */}
              <div className="text-center pt-4">
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={onSwitchToSignup}
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Create Account
                  </button>
                </p>
              </div>
            </form>
          </div>

          {/* Trust Badge */}
          <div className="text-center mt-8">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-full border">
              <Shield className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-600 font-medium">Enterprise Security</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElegantLoginPage;