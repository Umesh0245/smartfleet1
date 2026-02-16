import { useState } from 'react';
import { 
  User, Mail, Building, Bell, Globe, 
  Monitor, Palette, Clock, Save, AlertCircle,
  CheckCircle, Shield, Key, Database, Eye, EyeOff, Lock,
  Zap, Cpu, Network, Settings2
} from 'lucide-react';
import { AuthUser } from '../api/fleetApi';

interface ProfileSettingsProps {
  user: AuthUser | null;
  onUpdate: (updates: Partial<AuthUser>) => void;
}

const ProfileSettings = ({ user, onUpdate }: ProfileSettingsProps) => {
  const [activeSection, setActiveSection] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: user?.company || '',
    phone: '',
    timezone: 'UTC-5 (EST)',
    language: 'English'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    criticalAlerts: true,
    performanceReports: true,
    maintenanceReminders: true
  });

  const [systemSettings, setSystemSettings] = useState({
    autoRefresh: true,
    soundAlerts: true,
    darkMode: false,
    refreshInterval: 30,
    mapStyle: 'standard'
  });

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  
  // Password change states
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordChangeStatus, setPasswordChangeStatus] = useState<'idle' | 'changing' | 'success' | 'error'>('idle');
  const [passwordError, setPasswordError] = useState('');

  const handleSaveProfile = async () => {
    setSaveStatus('saving');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      onUpdate(profileData);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const getPasswordStrength = (password: string): { score: number; feedback: string; color: string } => {
    let score = 0;
    let feedback = '';
    
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    switch (score) {
      case 0:
      case 1:
        feedback = 'Very Weak';
        return { score, feedback, color: 'text-red-400' };
      case 2:
        feedback = 'Weak';
        return { score, feedback, color: 'text-orange-400' };
      case 3:
        feedback = 'Fair';
        return { score, feedback, color: 'text-yellow-400' };
      case 4:
        feedback = 'Good';
        return { score, feedback, color: 'text-blue-400' };
      case 5:
        feedback = 'Strong';
        return { score, feedback, color: 'text-green-400' };
      default:
        return { score, feedback, color: 'text-gray-400' };
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('Please fill in all password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      return;
    }

    const passwordStrength = getPasswordStrength(passwordData.newPassword);
    if (passwordStrength.score < 3) {
      setPasswordError('Password is too weak. Please use a stronger password with uppercase, lowercase, numbers, and special characters.');
      return;
    }

    setPasswordChangeStatus('changing');
    setPasswordError('');

    try {
      // Simulate API call to change password
      console.log('🔐 Changing password for user:', user?.email);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would make an API call here
      // const result = await fleetApi.changePassword({
      //   currentPassword: passwordData.currentPassword,
      //   newPassword: passwordData.newPassword
      // });

      setPasswordChangeStatus('success');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      
      // Show success notification
      setTimeout(() => {
        const notification = document.createElement('div');
        notification.innerHTML = `
          <div style="position: fixed; top: 20px; right: 20px; z-index: 10000; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 16px 20px; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); max-width: 350px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <span style="font-size: 18px;">✅</span>
              <strong>Password Changed Successfully</strong>
            </div>
            <p style="margin: 0; font-size: 14px; line-height: 1.4;">Your password has been updated. Please use the new password for future logins.</p>
          </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 5000);
      }, 500);

      setTimeout(() => setPasswordChangeStatus('idle'), 3000);
      
    } catch (error) {
      console.error('❌ Password change error:', error);
      setPasswordChangeStatus('error');
      setPasswordError('Failed to change password. Please try again.');
      setTimeout(() => setPasswordChangeStatus('idle'), 3000);
    }
  };

  const sections = [
    { id: 'profile', label: 'Profile Information', icon: User },
    { id: 'notifications', label: 'Notification Preferences', icon: Bell },
    { id: 'system', label: 'System Preferences', icon: Monitor },
    { id: 'security', label: 'Security Settings', icon: Shield },
    { id: 'advanced', label: 'Advanced Settings', icon: Database }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Futuristic Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-cyan-500/10 via-blue-600/10 to-purple-600/10 backdrop-blur-xl border border-cyan-500/20 rounded-2xl shadow-2xl p-6 relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5 animate-pulse"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-pulse"></div>
            
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Profile Settings
                </h1>
                <p className="text-cyan-300/80 mt-2 text-lg">Manage your account preferences and system configuration</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 bg-emerald-500/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-emerald-400/30">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
                  <span className="text-sm font-medium text-emerald-300">System Online</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Network className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
                <button
                  onClick={handleSaveProfile}
                  disabled={saveStatus === 'saving'}
                  className="flex items-center space-x-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 border border-cyan-400/30 backdrop-blur-sm"
                >
                  {saveStatus === 'saving' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Futuristic Navigation Sidebar */}
          <div className="col-span-3">
            <div className="bg-gradient-to-b from-gray-800/50 to-gray-900/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl shadow-2xl overflow-hidden sticky top-6">
              {/* User Profile Header */}
              <div className="p-6 bg-gradient-to-r from-cyan-500/20 via-blue-600/20 to-purple-600/20 border-b border-cyan-500/30 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse"></div>
                <div className="relative z-10 flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30 border border-cyan-400/50">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-white">{user?.name || 'User'}</h3>
                    <p className="text-sm text-cyan-300/80">{user?.email}</p>
                    <div className="flex items-center mt-1 space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-300 font-medium">Active Session</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Navigation Menu */}
              <nav className="p-4">
                <div className="space-y-2">
                  {sections.map((section, index) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center space-x-4 px-4 py-4 rounded-xl text-left transition-all duration-300 group relative overflow-hidden ${
                          isActive
                            ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/30 text-white shadow-lg shadow-cyan-500/20 border border-cyan-400/30'
                            : 'text-gray-300 hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-blue-500/10 hover:text-white border border-transparent hover:border-cyan-500/20'
                        }`}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-blue-500 rounded-r-full"></div>
                        )}
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                          isActive 
                            ? 'bg-gradient-to-br from-cyan-500/30 to-blue-600/30 shadow-lg shadow-cyan-500/20' 
                            : 'bg-gray-700/50 group-hover:bg-gradient-to-br group-hover:from-cyan-500/20 group-hover:to-blue-600/20'
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            isActive ? 'text-cyan-300' : 'text-gray-400 group-hover:text-cyan-300'
                          }`} />
                        </div>
                        <div>
                          <span className="font-semibold text-sm">{section.label}</span>
                          <div className={`w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 ${
                            isActive ? 'w-full' : 'group-hover:w-full'
                          }`}></div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </nav>
            </div>
          </div>

          {/* Futuristic Main Content */}
          <div className="col-span-9">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/80 backdrop-blur-xl border border-cyan-500/20 rounded-2xl shadow-2xl overflow-hidden">
              {activeSection === 'profile' && (
                <div>
                  <div className="p-6 border-b border-cyan-500/30 bg-gradient-to-r from-cyan-500/20 via-blue-600/20 to-purple-600/20 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse"></div>
                    <div className="relative z-10 flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30 border border-cyan-400/50">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                          Profile Information
                        </h2>
                        <p className="text-cyan-300/80">Update your personal details and preferences</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-8">
                    {/* Basic Information Card */}
                    <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/30 shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
                      <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-cyan-500/30">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                          Basic Information
                        </span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="block text-sm font-semibold text-cyan-300">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-900/80 backdrop-blur-sm border border-cyan-500/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 focus:outline-none transition-all shadow-lg hover:shadow-cyan-500/20 hover:border-cyan-400/70"
                            placeholder="Enter your full name"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="block text-sm font-semibold text-cyan-300">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-900/80 backdrop-blur-sm border border-cyan-500/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 focus:outline-none transition-all shadow-lg hover:shadow-cyan-500/20 hover:border-cyan-400/70"
                            placeholder="Enter your email address"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="block text-sm font-semibold text-cyan-300">
                            Company
                          </label>
                          <input
                            type="text"
                            value={profileData.company}
                            onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-900/80 backdrop-blur-sm border border-cyan-500/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 focus:outline-none transition-all shadow-lg hover:shadow-cyan-500/20 hover:border-cyan-400/70"
                            placeholder="Enter your company name"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="block text-sm font-semibold text-cyan-300">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-900/80 backdrop-blur-sm border border-cyan-500/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 focus:outline-none transition-all shadow-lg hover:shadow-cyan-500/20 hover:border-cyan-400/70"
                            placeholder="Enter your phone number"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Regional Settings Card */}
                    <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-500"></div>
                      <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-purple-500/30">
                          <Globe className="w-4 h-4 text-white" />
                        </div>
                        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                          Regional Settings
                        </span>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="block text-sm font-semibold text-purple-300">
                            Timezone
                          </label>
                          <select
                            value={profileData.timezone}
                            onChange={(e) => setProfileData({ ...profileData, timezone: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-900/80 backdrop-blur-sm border border-purple-500/50 rounded-xl text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 focus:outline-none transition-all shadow-lg hover:shadow-purple-500/20 hover:border-purple-400/70"
                          >
                            <option value="UTC-5 (EST)">UTC-5 (Eastern Time)</option>
                            <option value="UTC-8 (PST)">UTC-8 (Pacific Time)</option>
                            <option value="UTC+0 (GMT)">UTC+0 (Greenwich Mean Time)</option>
                            <option value="UTC+5:30 (IST)">UTC+5:30 (India Standard Time)</option>
                            <option value="UTC+1 (CET)">UTC+1 (Central European Time)</option>
                          </select>
                        </div>
                        <div className="space-y-3">
                          <label className="block text-sm font-semibold text-purple-300">
                            Language
                          </label>
                          <select
                            value={profileData.language}
                            onChange={(e) => setProfileData({ ...profileData, language: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-900/80 backdrop-blur-sm border border-purple-500/50 rounded-xl text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 focus:outline-none transition-all shadow-lg hover:shadow-purple-500/20 hover:border-purple-400/70"
                          >
                            <option value="English">English</option>
                            <option value="Spanish">Spanish</option>
                            <option value="French">French</option>
                            <option value="German">German</option>
                            <option value="Chinese">Chinese</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Futuristic Security Section */}
              {activeSection === 'security' && (
                <div>
                  <div className="p-6 border-b border-red-500/30 bg-gradient-to-r from-red-500/20 via-orange-600/20 to-yellow-600/20 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-yellow-500/10 animate-pulse"></div>
                    <div className="relative z-10 flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30 border border-red-400/50">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                          Security Settings
                        </h2>
                        <p className="text-red-300/80">Manage your account security and authentication</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <form onSubmit={handlePasswordChange} className="space-y-6">
                      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-red-500/30 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-orange-500"></div>
                        <div className="flex items-start space-x-4 mb-6">
                          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-500/30">
                            <Key className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xl text-white">Change Password</h4>
                            <p className="text-sm text-red-300/80 mt-1">
                              Update your password to keep your account secure. Use a strong password with mixed characters.
                            </p>
                          </div>
                        </div>

                        {passwordError && (
                          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 text-red-300 rounded-lg backdrop-blur-sm">
                            <div className="flex items-center space-x-3">
                              <AlertCircle className="w-5 h-5" />
                              <span className="text-sm font-medium">{passwordError}</span>
                            </div>
                          </div>
                        )}

                        {passwordChangeStatus === 'success' && (
                          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/40 text-green-300 rounded-lg backdrop-blur-sm">
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="w-5 h-5" />
                              <span className="text-sm font-medium">Password changed successfully!</span>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-1 gap-6">
                          {/* Current Password */}
                          <div className="space-y-3">
                            <label className="block text-sm font-semibold text-red-300 flex items-center">
                              <Lock className="w-4 h-4 mr-2" />
                              Current Password
                            </label>
                            <div className="relative">
                              <input
                                type={showCurrentPassword ? 'text' : 'password'}
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                className="w-full pl-4 pr-12 py-3 bg-gray-900/80 backdrop-blur-sm border border-red-500/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500/50 focus:border-red-400 focus:outline-none transition-all shadow-lg hover:shadow-red-500/20"
                                placeholder="Enter your current password"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-400 hover:text-red-300 transition-colors"
                              >
                                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                          </div>

                          {/* New Password */}
                          <div className="space-y-3">
                            <label className="block text-sm font-semibold text-red-300 flex items-center">
                              <Key className="w-4 h-4 mr-2" />
                              New Password
                            </label>
                            <div className="relative">
                              <input
                                type={showNewPassword ? 'text' : 'password'}
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                className="w-full pl-4 pr-12 py-3 bg-gray-900/80 backdrop-blur-sm border border-red-500/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500/50 focus:border-red-400 focus:outline-none transition-all shadow-lg hover:shadow-red-500/20"
                                placeholder="Enter your new password"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-400 hover:text-red-300 transition-colors"
                              >
                                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                            
                            {/* Password Strength Indicator */}
                            {passwordData.newPassword && (
                              <div className="mt-3">
                                <div className="flex items-center space-x-3">
                                  <div className={`text-xs font-bold ${getPasswordStrength(passwordData.newPassword).color}`}>
                                    {getPasswordStrength(passwordData.newPassword).feedback}
                                  </div>
                                  <div className="flex-1 bg-gray-800/80 rounded-full h-3 border border-gray-700">
                                    <div 
                                      className={`h-3 rounded-full transition-all duration-500 ${
                                        getPasswordStrength(passwordData.newPassword).score <= 1 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                                        getPasswordStrength(passwordData.newPassword).score === 2 ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                                        getPasswordStrength(passwordData.newPassword).score === 3 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                                        getPasswordStrength(passwordData.newPassword).score === 4 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                                        'bg-gradient-to-r from-green-500 to-green-600'
                                      }`}
                                      style={{ width: `${(getPasswordStrength(passwordData.newPassword).score / 5) * 100}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Confirm New Password */}
                          <div className="space-y-3">
                            <label className="block text-sm font-semibold text-red-300 flex items-center">
                              <Key className="w-4 h-4 mr-2" />
                              Confirm New Password
                            </label>
                            <div className="relative">
                              <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                className={`w-full pl-4 pr-12 py-3 bg-gray-900/80 backdrop-blur-sm border rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:outline-none transition-all shadow-lg ${
                                  passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword 
                                    ? 'border-red-400 focus:border-red-400 focus:ring-red-500/30 hover:shadow-red-500/20' 
                                    : passwordData.confirmPassword && passwordData.newPassword === passwordData.confirmPassword
                                    ? 'border-green-400 focus:border-green-400 focus:ring-green-500/30 hover:shadow-green-500/20'
                                    : 'border-red-500/50 focus:border-red-400 focus:ring-red-500/30 hover:shadow-red-500/20'
                                }`}
                                placeholder="Confirm your new password"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-400 hover:text-red-300 transition-colors"
                              >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                            {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                              <p className="text-red-400 text-sm font-medium">Passwords do not match</p>
                            )}
                          </div>
                        </div>

                        <div className="mt-8">
                          <button
                            type="submit"
                            disabled={passwordChangeStatus === 'changing' || 
                                     !passwordData.currentPassword || 
                                     !passwordData.newPassword || 
                                     !passwordData.confirmPassword ||
                                     passwordData.newPassword !== passwordData.confirmPassword}
                            className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-red-500/25 border border-red-400/30 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {passwordChangeStatus === 'changing' ? (
                              <div className="flex items-center justify-center space-x-3">
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                <span>Changing Password...</span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center space-x-3">
                                <Shield className="w-5 h-5" />
                                <span>Update Password</span>
                              </div>
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Futuristic Notifications Section */}
              {activeSection === 'notifications' && (
                <div>
                  <div className="p-6 border-b border-emerald-500/30 bg-gradient-to-r from-emerald-500/20 via-green-600/20 to-cyan-600/20 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 animate-pulse"></div>
                    <div className="relative z-10 flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 border border-emerald-400/50">
                        <Bell className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                          Notification Preferences
                        </h2>
                        <p className="text-emerald-300/80">Control how you receive alerts and updates</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {Object.entries(notificationSettings).map(([key, value]) => (
                        <div key={key} className="bg-gradient-to-r from-gray-800/60 to-gray-900/80 backdrop-blur-sm rounded-xl p-5 border border-emerald-500/30 shadow-lg flex items-center justify-between hover:border-emerald-400/50 transition-all duration-300">
                          <div className="flex-1">
                            <h4 className="font-bold text-white capitalize text-lg">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </h4>
                            <p className="text-sm text-emerald-300/80 mt-1">
                              {key === 'emailNotifications' && 'Receive alerts and updates via email'}
                              {key === 'pushNotifications' && 'Get real-time push alerts in browser'}
                              {key === 'smsNotifications' && 'Receive critical alerts via SMS'}
                              {key === 'criticalAlerts' && 'Get notified of critical system alerts'}
                              {key === 'performanceReports' && 'Weekly performance summary reports'}
                              {key === 'maintenanceReminders' && 'Vehicle maintenance schedule alerts'}
                            </p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer ml-4">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => setNotificationSettings({
                                ...notificationSettings,
                                [key]: e.target.checked
                              })}
                              className="sr-only peer"
                            />
                            <div className="w-14 h-8 bg-gray-700/80 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-500/30 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-green-600 shadow-lg peer-checked:shadow-emerald-500/30"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Futuristic System Preferences Section */}
              {activeSection === 'system' && (
                <div>
                  <div className="p-6 border-b border-indigo-500/30 bg-gradient-to-r from-indigo-500/20 via-purple-600/20 to-blue-600/20 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 animate-pulse"></div>
                    <div className="relative z-10 flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 border border-indigo-400/50">
                        <Monitor className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                          System Preferences
                        </h2>
                        <p className="text-indigo-300/80">Configure system behavior and display options</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-6">
                      {/* Performance Settings */}
                      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-indigo-500/30 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-purple-500"></div>
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-indigo-500/30">
                            <Zap className="w-4 h-4 text-white" />
                          </div>
                          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            Performance Settings
                          </span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <label className="block text-sm font-semibold text-indigo-300 flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              Auto Refresh Interval
                            </label>
                            <select
                              value={systemSettings.refreshInterval}
                              onChange={(e) => setSystemSettings({
                                ...systemSettings,
                                refreshInterval: Number(e.target.value)
                              })}
                              className="w-full px-4 py-3 bg-gray-900/80 backdrop-blur-sm border border-indigo-500/50 rounded-xl text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 focus:outline-none transition-all shadow-lg hover:shadow-indigo-500/20"
                            >
                              <option value={10}>10 seconds</option>
                              <option value={30}>30 seconds</option>
                              <option value={60}>1 minute</option>
                              <option value={300}>5 minutes</option>
                            </select>
                          </div>
                          <div className="space-y-3">
                            <label className="block text-sm font-semibold text-indigo-300 flex items-center">
                              <Palette className="w-4 h-4 mr-2" />
                              Map Display Style
                            </label>
                            <select
                              value={systemSettings.mapStyle}
                              onChange={(e) => setSystemSettings({
                                ...systemSettings,
                                mapStyle: e.target.value
                              })}
                              className="w-full px-4 py-3 bg-gray-900/80 backdrop-blur-sm border border-indigo-500/50 rounded-xl text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 focus:outline-none transition-all shadow-lg hover:shadow-indigo-500/20"
                            >
                              <option value="standard">Standard View</option>
                              <option value="satellite">Satellite View</option>
                              <option value="terrain">Terrain View</option>
                              <option value="dark">Dark Mode</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* UI Preferences */}
                      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-500"></div>
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-purple-500/30">
                            <Settings2 className="w-4 h-4 text-white" />
                          </div>
                          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Interface Preferences
                          </span>
                        </h3>
                        <div className="space-y-4">
                          {Object.entries(systemSettings).slice(0, 3).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between p-4 bg-gray-900/60 rounded-lg border border-purple-500/20">
                              <div>
                                <h4 className="font-semibold text-white capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </h4>
                                <p className="text-sm text-purple-300/70">
                                  {key === 'autoRefresh' && 'Automatically refresh data and updates'}
                                  {key === 'soundAlerts' && 'Play sound notifications for alerts'}
                                  {key === 'darkMode' && 'Use dark theme interface'}
                                </p>
                              </div>
                              {typeof value === 'boolean' && (
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={value as boolean}
                                    onChange={(e) => setSystemSettings({
                                      ...systemSettings,
                                      [key]: e.target.checked
                                    })}
                                    className="sr-only peer"
                                  />
                                  <div className="w-14 h-8 bg-gray-700/80 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-500/30 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-pink-600 shadow-lg peer-checked:shadow-purple-500/30"></div>
                                </label>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'advanced' && (
                <div>
                  <div className="p-6 border-b border-orange-500/30 bg-gradient-to-r from-orange-500/20 via-red-600/20 to-pink-600/20 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-pink-500/10 animate-pulse"></div>
                    <div className="relative z-10 flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 border border-orange-400/50">
                        <Database className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                          Advanced Settings
                        </h2>
                        <p className="text-orange-300/80">Advanced configuration and data management</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-6">
                      {/* Data Management */}
                      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-red-500"></div>
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-orange-500/30">
                            <Database className="w-4 h-4 text-white" />
                          </div>
                          <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                            Data Management
                          </span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <button className="p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/40 rounded-lg text-left hover:border-orange-400/60 transition-all duration-300">
                            <h4 className="font-semibold text-white mb-2">Export Data</h4>
                            <p className="text-sm text-orange-300/70">Export your fleet data and analytics</p>
                          </button>
                          <button className="p-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/40 rounded-lg text-left hover:border-red-400/60 transition-all duration-300">
                            <h4 className="font-semibold text-white mb-2">Clear Cache</h4>
                            <p className="text-sm text-red-300/70">Clear temporary data and cache</p>
                          </button>
                        </div>
                      </div>

                      {/* API Configuration */}
                      <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/30 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-cyan-500/30">
                            <Cpu className="w-4 h-4 text-white" />
                          </div>
                          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                            API Configuration
                          </span>
                        </h3>
                        <div className="space-y-4">
                          <div className="p-4 bg-gray-900/60 rounded-lg border border-cyan-500/20">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-white">API Endpoints</h4>
                                <p className="text-sm text-cyan-300/70">Manage external API connections</p>
                              </div>
                              <div className="flex items-center space-x-2 bg-emerald-500/20 px-3 py-1 rounded-lg">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                <span className="text-xs text-emerald-300">Connected</span>
                              </div>
                            </div>
                          </div>
                          <div className="p-4 bg-gray-900/60 rounded-lg border border-cyan-500/20">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-white">Rate Limiting</h4>
                                <p className="text-sm text-cyan-300/70">Configure API request limits</p>
                              </div>
                              <span className="text-sm font-medium text-cyan-300">1000/hr</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;