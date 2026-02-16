import React, { useState } from 'react';
import { Mail, ArrowLeft, Send, CheckCircle, AlertCircle } from 'lucide-react';
import Logo from './Logo';

interface ElegantForgotPasswordProps {
  onSendResetEmail: (email: string) => Promise<void>;
  onBackToLogin: () => void;
  loading: boolean;
  error: string;
  status: 'idle' | 'sending' | 'sent' | 'error';
}

const ElegantForgotPassword: React.FC<ElegantForgotPasswordProps> = ({ 
  onSendResetEmail, 
  onBackToLogin, 
  loading, 
  error,
  status 
}) => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      await onSendResetEmail(email);
    }
  };

  const renderContent = () => {
    if (status === 'sent') {
      return (
        <div className="text-center space-y-6 animate-fade-in-up">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <div>
            <h2 className="font-serif text-2xl font-bold text-navy-900 mb-2">Check Your Email</h2>
            <p className="text-slate-600 leading-relaxed">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-2">Next steps:</p>
                <ol className="list-decimal list-inside space-y-1 text-blue-700">
                  <li>Check your email inbox and spam folder</li>
                  <li>Click the reset link in the email</li>
                  <li>Create a new password</li>
                  <li>Sign in with your new password</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-slate-500">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
                disabled={loading}
                className="elegant-button-secondary flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Resend Email</span>
              </button>
              
              <button
                onClick={onBackToLogin}
                className="elegant-button-outline flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Sign In</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6 animate-fade-in-up">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-bold text-slate-800 mb-2">Forgot Password?</h2>
            <p className="text-slate-700 leading-relaxed">
              No problem. Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg animate-form-error flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="reset-email" className="block text-sm font-medium text-slate-800">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="elegant-input pl-12"
                placeholder="Enter your email address"
                required
              />
            </div>
            <p className="text-xs text-slate-600 mt-2">
              We'll send reset instructions to this email address.
            </p>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="elegant-button-primary w-full flex items-center justify-center space-x-2 animate-button-press"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send Reset Link</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onBackToLogin}
              className="elegant-button-outline w-full flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sign In</span>
            </button>
          </div>
        </form>

        {/* Security Notice */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-navy-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 bg-navy-600 rounded-full" />
            </div>
            <div className="text-xs text-slate-600 leading-relaxed">
              <p className="font-medium mb-1">Security Notice:</p>
              <p>
                For your security, password reset links expire after 1 hour. 
                If you don't receive an email within a few minutes, please check your spam folder.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex relative overflow-hidden">
      {/* Elegant Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-5">
          <div 
            className="h-full w-full"
            style={{
              backgroundImage: `
                linear-gradient(var(--navy-200) 1px, transparent 1px),
                linear-gradient(90deg, var(--navy-200) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-gradient-to-r from-navy-100 to-gold-100 opacity-30 blur-xl animate-pulse-elegant" />
        <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-gradient-to-l from-gold-100 to-navy-100 opacity-20 blur-2xl animate-pulse-elegant" style={{ animationDelay: '1s' }} />
      </div>

      {/* Left Panel - Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-800 to-slate-900 relative">
        <div className="absolute inset-0 opacity-10">
          <div 
            className="h-full w-full"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, var(--gold-300) 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="flex flex-col justify-center items-center p-12 relative z-10 text-center">
          <div className="mb-12">
            <div className="w-24 h-24 bg-gradient-to-r from-gold-400 to-gold-300 rounded-full flex items-center justify-center mb-6 shadow-elegant">
              <Logo className="w-12 h-12 text-navy-900" />
            </div>
            <h1 className="font-serif text-4xl font-bold text-white mb-2">SmartFleet</h1>
            <p className="text-gold-300 text-lg font-light tracking-wide">Secure Account Recovery</p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-6">
              <h3 className="font-semibold text-white text-lg mb-4">Account Security</h3>
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gold-400 rounded-full flex-shrink-0" />
                  <span>Encrypted password reset process</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gold-400 rounded-full flex-shrink-0" />
                  <span>Time-limited reset links</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gold-400 rounded-full flex-shrink-0" />
                  <span>Email verification required</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gold-400 rounded-full flex-shrink-0" />
                  <span>Enterprise-grade protection</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Reset Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-navy-600 to-navy-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-elegant">
              <Logo className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-slate-800">SmartFleet</h1>
            <p className="text-slate-700">Account Recovery</p>
          </div>

          {renderContent()}

          {/* Professional Footer */}
          <div className="text-center pt-8 mt-8 border-t border-slate-200">
            <p className="text-xs text-slate-600">
              Need help? Contact our support team at support@smartfleet.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElegantForgotPassword;