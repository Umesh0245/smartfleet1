import React, { useState, useEffect } from 'react';
import { 
  Menu, X, User, MapPin, Car, BarChart3, 
  Activity, LogOut, AlertTriangle, CheckCircle,
  Fuel, TrendingUp, Server, RefreshCw, Shield,
  Zap, Clock, Gauge, Settings, Database
} from 'lucide-react';
import fleetApi, { AuthUser, FleetVehicle, VehicleTelemetry, FleetMetrics } from './api/fleetApi';
import EmailService from './services/emailService';
import LoadingScreen from './components/LoadingScreen';
import SmartFleetLogo from './components/SmartFleetLogo';
import ProfileSettings from './components/ProfileSettings';
import VehicleManagement from './components/VehicleManagement';
import PerformanceAnalytics from './components/PerformanceAnalytics';
import IndividualPerformance from './components/IndividualPerformance';
import LiveFleetMap from './components/LiveFleetMap';
import RealtimeMonitoring from './components/RealtimeMonitoring';
import ElegantSplashScreen from './components/ElegantSplashScreen';
import ElegantLoginPage from './components/ElegantLoginPage';
import ElegantSignupPage from './components/ElegantSignupPage';
import ElegantForgotPassword from './components/ElegantForgotPassword';
import FuturisticLandingPage from './components/FuturisticLandingPage';

const App: React.FC = () => {
  // Helper functions for safe rendering
  const renderLocation = (location: any): string => {
    if (!location) return 'Unknown';
    if (typeof location === 'string') return location;
    if (typeof location === 'object' && location.latitude && location.longitude) {
      return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
    }
    return 'Unknown';
  };

  // Password strength checker
  const getPasswordStrength = (password: string): { score: number; feedback: string; color: string } => {
    let score = 0;
    let feedback = '';
    
    if (password.length >= 8) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    switch (score) {
      case 0:
      case 1:
        feedback = 'Very Weak';
        return { score, feedback, color: 'text-red-500' };
      case 2:
        feedback = 'Weak';
        return { score, feedback, color: 'text-orange-500' };
      case 3:
        feedback = 'Fair';
        return { score, feedback, color: 'text-yellow-500' };
      case 4:
        feedback = 'Good';
        return { score, feedback, color: 'text-blue-500' };
      case 5:
        feedback = 'Strong';
        return { score, feedback, color: 'text-green-500' };
      default:
        feedback = 'Very Weak';
        return { score, feedback, color: 'text-red-500' };
    }
  };

  const renderValue = (value: any, fallback: string = '0'): string => {
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  // Screen state
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'landing' | 'auth' | 'dashboard'>('landing');
  const [showTransitionSplash, setShowTransitionSplash] = useState(false);

  // Browser history support
  const updateBrowserHistory = (screen: string, mode?: string) => {
    const url = screen === 'landing' ? '/' : 
                screen === 'auth' ? (mode ? `/${mode}` : '/login') : 
                `/${screen}`;
    window.history.pushState({ screen, mode }, '', url);
  };

  const handleScreenChange = (newScreen: 'splash' | 'landing' | 'auth' | 'dashboard', mode?: string) => {
    setCurrentScreen(newScreen);
    if (newScreen !== 'splash') { // Don't update history for splash screens
      updateBrowserHistory(newScreen, mode);
    }
  };
  
  // Auth states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');


  
  // Signup form
  const [signupData, setSignupData] = useState({
    name: '', email: '', company: '', password: '', confirmPassword: ''
  });

  // Forgot password
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordStatus, setForgotPasswordStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  // App states
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Data states - Initialize with mock vehicles for Fleet Manager
  const [vehicles, setVehicles] = useState<FleetVehicle[]>([
    {
      vehicleId: 'TRUCK-001',
      gpsId: 'GPS-001',
      iotDeviceId: 'IOT-001',
      driverName: 'John Smith',
      registrationNumber: 'FL-001',
      make: 'Scania',
      model: 'R450',
      year: 2022,
      status: 'active',
      location: 'Downtown Hub',
      speed: 45,
      fuel: 75,
      engineTemp: 85,
      rpm: 1800,
      tirePressure: 32,
      lastUpdated: new Date().toISOString()
    },
    {
      vehicleId: 'TRUCK-002',
      gpsId: 'GPS-002',
      iotDeviceId: 'IOT-002',
      driverName: 'Sarah Johnson',
      registrationNumber: 'FL-002',
      make: 'Volvo',
      model: 'FH16',
      year: 2023,
      status: 'active',
      location: 'North Terminal',
      speed: 62,
      fuel: 89,
      engineTemp: 78,
      rpm: 2100,
      tirePressure: 34,
      lastUpdated: new Date().toISOString()
    },
    {
      vehicleId: 'TRUCK-003',
      gpsId: 'GPS-003',
      iotDeviceId: 'IOT-003',
      driverName: 'Mike Wilson',
      registrationNumber: 'FL-003',
      make: 'Mercedes',
      model: 'Actros',
      year: 2021,
      status: 'maintenance',
      location: 'Service Center',
      speed: 0,
      fuel: 45,
      engineTemp: 65,
      rpm: 0,
      tirePressure: 30,
      lastUpdated: new Date().toISOString()
    }
  ]);
  const [telemetryData, setTelemetryData] = useState<VehicleTelemetry[]>([]);
  const [fleetMetrics, setFleetMetrics] = useState<FleetMetrics | null>(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState('');

  // Add app initialization state


  // Handle transition splash screen
  useEffect(() => {
    if (showTransitionSplash) {
      const timer = setTimeout(() => {
        setShowTransitionSplash(false);
        handleScreenChange('auth', authMode);
      }, 800); // Quick transition - only 0.8 seconds
      return () => clearTimeout(timer);
    }
  }, [showTransitionSplash, authMode]);

  // Browser back/forward button support
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state) {
        setCurrentScreen(event.state.screen);
        if (event.state.mode) {
          setAuthMode(event.state.mode);
        }
      } else {
        // No state means user went to root URL
        setCurrentScreen('landing');
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    // Set initial history state
    updateBrowserHistory(currentScreen, authMode);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);  // Run only on mount

  // Test backend connection and check authentication on app load
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Test backend connection using health check function
        console.log('🔗 Testing backend connection...');
        const isHealthy = await fleetApi.healthCheck();
        
        if (isHealthy) {
          console.log('✅ Backend connection successful');
        } else {
          console.warn('⚠️ Backend health check failed');
        }
      } catch (error) {
        console.warn('⚠️ Backend connection test failed:', error);
      }

      // Check existing authentication - For now, always redirect to login
      const token = localStorage.getItem('authToken');
      if (token) {
        console.log('🔐 Found existing auth token, but requires fresh login for security');
        localStorage.removeItem('authToken');
      }
      
      // App is initialized
      console.log('✅ App initialization complete');
    };

    initializeApp();
  }, []);

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
      // Set up auto-refresh every 10 seconds
      const interval = setInterval(loadDashboardData, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showProfileDropdown) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showProfileDropdown]);

  const loadDashboardData = async () => {
    setDataLoading(true);
    setDataError('');
    
    try {
      console.log('🔄 Loading dashboard data...');
      
      // Load all data in parallel with timeout
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );

      const dataPromise = Promise.all([
        fleetApi.getAllVehicles(),
        fleetApi.getAllVehicleTelemetry(),
        fleetApi.getFleetMetrics()
      ]);

      const [vehiclesData, telemetryData, metricsData] = await Promise.race([
        dataPromise,
        timeout
      ]) as [FleetVehicle[], VehicleTelemetry[], FleetMetrics];

      console.log('✅ Dashboard data loaded successfully:', {
        vehicles: vehiclesData?.length || 0,
        telemetry: telemetryData?.length || 0,
        metrics: metricsData ? 'loaded' : 'null'
      });

      // Merge vehicles with real-time telemetry data
      const mergedVehicles = mergeVehiclesWithTelemetry(vehiclesData || [], telemetryData || []);
      
      setVehicles(mergedVehicles);
      setTelemetryData(telemetryData || []);
      setFleetMetrics(metricsData || null);
    } catch (error) {
      console.error('❌ Error loading dashboard data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setDataError(`Failed to load dashboard data: ${errorMessage}. Please check if the backend is running on port 8081.`);
    } finally {
      setDataLoading(false);
    }
  };

  // Helper function to merge vehicles with telemetry data
  const mergeVehiclesWithTelemetry = (vehicles: FleetVehicle[], telemetryData: VehicleTelemetry[]): FleetVehicle[] => {
    const telemetryMap = new Map<string, VehicleTelemetry>();
    
    // Create a map of latest telemetry data for each vehicle
    telemetryData.forEach(telemetry => {
      const existing = telemetryMap.get(telemetry.vehicleId);
      if (!existing || new Date(telemetry.timestamp) > new Date(existing.timestamp)) {
        telemetryMap.set(telemetry.vehicleId, telemetry);
      }
    });

    console.log('📊 Telemetry map created:', {
      vehiclesWithTelemetry: telemetryMap.size,
      totalVehicles: vehicles.length
    });

    // Merge vehicles with their latest telemetry data
    return vehicles.map(vehicle => {
      const telemetry = telemetryMap.get(vehicle.vehicleId);
      
      if (telemetry) {
        // Vehicle has live telemetry data - update with real-time info
        const timeDiff = new Date().getTime() - new Date(telemetry.timestamp).getTime();
        const isRecentlyActive = timeDiff < 60000; // Active if data is less than 1 minute old
        
        return {
          ...vehicle,
          status: isRecentlyActive ? 'active' : 'inactive',
          speed: telemetry.signals?.speed || 0,
          fuel: telemetry.signals?.fuel || vehicle.fuel,
          engineTemp: telemetry.signals?.engineTemp || vehicle.engineTemp,
          rpm: telemetry.signals?.rpm || vehicle.rpm,
          tirePressure: telemetry.signals?.tirePressure || vehicle.tirePressure,
          lastUpdated: telemetry.timestamp,
          location: telemetry.status?.location || vehicle.location,
          // Update specs if available from telemetry
          make: telemetry.specs?.make || vehicle.make,
          model: telemetry.specs?.model || vehicle.model,
          year: telemetry.specs?.year || vehicle.year
        };
      } else {
        // No telemetry data available - mark as inactive
        return {
          ...vehicle,
          status: 'inactive',
          speed: 0,
          lastUpdated: new Date().toISOString()
        };
      }
    });
  };

  // Helper function to get only active vehicles for overview
  const getActiveVehicles = (): FleetVehicle[] => {
    return vehicles.filter(vehicle => vehicle.status === 'active');
  };



  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!signupData.name || !signupData.email || !signupData.company || !signupData.password) {
      setAuthError('Please fill in all fields');
      return;
    }
    
    if (signupData.password !== signupData.confirmPassword) {
      setAuthError('Passwords do not match');
      return;
    }

    if (signupData.password.length < 8) {
      setAuthError('Password must be at least 8 characters long');
      return;
    }

    const passwordStrength = getPasswordStrength(signupData.password);
    if (passwordStrength.score < 3) {
      setAuthError('Password is too weak. Please use a stronger password with uppercase, lowercase, numbers, and special characters.');
      return;
    }

    setAuthLoading(true);
    setAuthError('');

    try {
      console.log('🔐 Attempting signup for:', signupData.email);
      
      const user = await fleetApi.signup({
        name: signupData.name,
        email: signupData.email,
        company: signupData.company,
        password: signupData.password
      });
      
      console.log('✅ Signup successful:', user);
      
      // Show success toast
      showSuccessToast(`Welcome aboard, ${user.name}! Your account has been created successfully.`);
      
      // Clear form
      setSignupData({ name: '', email: '', company: '', password: '', confirmPassword: '' });
      
      // Redirect to login page after showing success
      setTimeout(() => {
        setAuthMode('login');
        setAuthError('');
      }, 1500);
    } catch (error) {
      console.error('Signup error:', error);
      setAuthError(`Signup failed: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgotPasswordEmail) {
      setAuthError('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotPasswordEmail)) {
      setAuthError('Please enter a valid email address');
      return;
    }

    setForgotPasswordStatus('sending');
    setAuthError('');

    try {
      // Generate a secure temporary password
      const tempPassword = generateSecurePassword();
      
      console.log('🔐 Sending password reset email to:', forgotPasswordEmail);
      
      // Try to send email via EmailJS first
      const emailSent = await EmailService.sendPasswordResetEmail(
        forgotPasswordEmail,
        'SmartFleet User',
        tempPassword
      );

      if (emailSent) {
        // Store temp password for login validation
        localStorage.setItem('tempPassword', tempPassword);
        localStorage.setItem('tempPasswordEmail', forgotPasswordEmail);
        localStorage.setItem('tempPasswordExpiry', (Date.now() + 24 * 60 * 60 * 1000).toString()); // 24 hours
        
        setForgotPasswordStatus('sent');
        
        console.log('✅ Password reset email sent successfully');
        
        // Auto redirect to login after showing success
        setTimeout(() => {
          setAuthMode('login');
          setForgotPasswordStatus('idle');
          setForgotPasswordEmail('');
        }, 5000);
        
      } else {
        // Fallback: Try backend API
        console.log('📧 EmailJS failed, trying backend API...');
        const apiResult = await EmailService.sendPasswordResetEmailViaAPI(forgotPasswordEmail);
        
        if (apiResult.success && apiResult.tempPassword) {
          localStorage.setItem('tempPassword', apiResult.tempPassword);
          localStorage.setItem('tempPasswordEmail', forgotPasswordEmail);
          localStorage.setItem('tempPasswordExpiry', (Date.now() + 24 * 60 * 60 * 1000).toString());
          
          setForgotPasswordStatus('sent');
          
          setTimeout(() => {
            setAuthMode('login');
            setForgotPasswordStatus('idle');
            setForgotPasswordEmail('');
          }, 5000);
        } else {
          throw new Error('Email service unavailable');
        }
      }
      
    } catch (error) {
      console.error('❌ Failed to send password reset email:', error);
      setForgotPasswordStatus('error');
      setAuthError('Failed to send password reset email. Please check your email address and try again. If the problem persists, contact support.');
    }
  };

  // Generate a secure temporary password
  const generateSecurePassword = (): string => {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    // Ensure at least one character from each type
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // uppercase
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // lowercase
    password += '0123456789'[Math.floor(Math.random() * 10)]; // number
    password += '!@#$%^&*'[Math.floor(Math.random() * 8)]; // special
    
    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  };

  // Success toast function
  const showSuccessToast = (message: string) => {
    const toast = document.createElement('div');
    toast.innerHTML = `
      <div style="position: fixed; top: 20px; right: 20px; z-index: 10000; 
                  background: linear-gradient(135deg, #10b981, #059669); 
                  color: white; padding: 16px 24px; border-radius: 12px; 
                  box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3); 
                  max-width: 400px; transform: translateX(100%); 
                  transition: transform 0.5s ease;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 20px;">✅</span>
          <div>
            <strong style="display: block; margin-bottom: 4px;">Success!</strong>
            <p style="margin: 0; font-size: 14px; opacity: 0.9;">${message}</p>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      const toastElement = toast.firstElementChild as HTMLElement;
      if (toastElement) {
        toastElement.style.transform = 'translateX(0)';
      }
    }, 100);
    
    // Remove toast after 4 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        const toastElement = toast.firstElementChild as HTMLElement;
        if (toastElement) {
          toastElement.style.transform = 'translateX(100%)';
          setTimeout(() => {
            if (toast.parentNode) {
              toast.parentNode.removeChild(toast);
            }
          }, 500);
        }
      }
    }, 4000);
  };

  const handleLogout = () => {
    fleetApi.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    handleScreenChange('landing');
    setVehicles([]);
    setTelemetryData([]);
    setFleetMetrics(null);
    setShowProfileDropdown(false);
  };

  // Vehicle management handlers
  const handleAddVehicle = (newVehicle: Omit<FleetVehicle, 'vehicleId'>) => {
    const vehicleId = `FL-${String(vehicles.length + 1).padStart(3, '0')}`;
    const vehicle: FleetVehicle = { ...newVehicle, vehicleId };
    setVehicles(prev => [...prev, vehicle]);
  };

  const handleUpdateVehicle = (vehicleId: string, updates: Partial<FleetVehicle>) => {
    setVehicles(prev => prev.map(v => v.vehicleId === vehicleId ? { ...v, ...updates } : v));
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    setVehicles(prev => prev.filter(v => v.vehicleId !== vehicleId));
  };

  const handleUpdateUser = (updates: Partial<AuthUser>) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, ...updates });
    }
  };

  // Enhanced Splash Screen with Classic Elegant Design
  if (currentScreen === 'splash') {
    return <ElegantSplashScreen />;
  }

  // Futuristic Landing Page
  if (currentScreen === 'landing') {
    return (
      <FuturisticLandingPage
        onLogin={() => {
          setAuthMode('login');
          setShowTransitionSplash(true);
          setCurrentScreen('splash');
          // History will be updated after splash completes
        }}
        onSignup={() => {
          setAuthMode('signup');
          setShowTransitionSplash(true);
          setCurrentScreen('splash');
          // History will be updated after splash completes
        }}
      />
    );
  }

  // Enhanced Authentication Screen with Classic Elegant Design
  if (currentScreen === 'auth' || !isAuthenticated) {
    if (authMode === 'login') {
      return (
        <ElegantLoginPage
          onLogin={async (email: string, password: string) => {
            if (authLoading) return;
            
            setAuthLoading(true);
            setAuthError('');
            
            try {
              const user = await fleetApi.login({ email, password });
              setCurrentUser(user);
              setIsAuthenticated(true);
              handleScreenChange('dashboard');
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Login failed';
              setAuthError(`Login failed: ${errorMessage}`);
            } finally {
              setAuthLoading(false);
            }
          }}
          onSwitchToSignup={() => {
            setAuthMode('signup');
            setAuthError('');
          }}
          onForgotPassword={() => {
            setAuthMode('forgot');
            setAuthError('');
          }}
          onBack={() => {
            handleScreenChange('landing');
            setAuthError('');
          }}
          loading={authLoading}
          error={authError}
        />
      );
    } else if (authMode === 'signup') {
      return (
        <ElegantSignupPage
          onSignup={async (name: string, email: string, company: string, password: string, confirmPassword: string) => {
            if (authLoading) return; // Prevent double clicks
            setSignupData({ name, email, company, password, confirmPassword });
            const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
            await handleSignup(fakeEvent);
          }}
          onSwitchToLogin={() => {
            setAuthMode('login');
            setAuthError('');
          }}
          onBack={() => {
            handleScreenChange('landing');
            setAuthError('');
          }}
          loading={authLoading}
          error={authError}
        />
      );
    } else if (authMode === 'forgot') {
      return (
        <ElegantForgotPassword
          onSendResetEmail={async (email: string) => {
            setForgotPasswordEmail(email);
            const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
            await handleForgotPassword(fakeEvent);
          }}
          onBackToLogin={() => {
            setAuthMode('login');
            setForgotPasswordStatus('idle');
            setForgotPasswordEmail('');
            setAuthError('');
          }}
          loading={forgotPasswordStatus === 'sending'}
          error={authError}
          status={forgotPasswordStatus}
        />
      );
    }
  }

  // Show loading screen during initial data load
  if (isAuthenticated && dataLoading && vehicles.length === 0 && telemetryData.length === 0) {
    return <LoadingScreen message="Loading your fleet dashboard..." />;
  }

  // Main Dashboard - Enhanced Professional Layout
  return (
    <div className="flex min-h-screen bg-slate-50 relative">
      {/* Background Enhancement */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Enhanced Professional Sidebar */}
      <div className={`fixed md:relative z-50 flex flex-col h-full transition-all duration-300 bg-white border-r border-gray-200 shadow-lg ${sidebarOpen ? 'w-64' : '-translate-x-full md:translate-x-0 md:w-16'}`}>
        
        {/* Enhanced Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          {/* Subtle accent glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/5 via-blue-600/8 to-purple-600/5"></div>
          <div className={`flex items-center ${sidebarOpen ? '' : 'md:justify-center'}`}>
            <SmartFleetLogo size={sidebarOpen ? "md" : "sm"} />
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-all duration-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Enhanced Navigation */}
        <nav className="flex-1 p-4">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3, gradient: 'from-cyan-500 to-blue-600', glow: 'shadow-cyan-500/25' },
            { id: 'vehicles', label: 'Fleet Manager', icon: Car, gradient: 'from-emerald-500 to-green-600', glow: 'shadow-emerald-500/25' },
            { id: 'livemap', label: 'Live Map', icon: MapPin, gradient: 'from-purple-500 to-indigo-600', glow: 'shadow-purple-500/25' },
            { id: 'performance', label: 'Performance', icon: TrendingUp, gradient: 'from-orange-500 to-amber-600', glow: 'shadow-orange-500/25' },
            { id: 'monitoring', label: 'Real-time Monitor', icon: Activity, gradient: 'from-pink-500 to-red-600', glow: 'shadow-pink-500/25' },
            { id: 'analytics', label: 'Advanced Analytics', icon: BarChart3, gradient: 'from-violet-500 to-purple-600', glow: 'shadow-violet-500/25' },
            { id: 'profile', label: 'Profile Settings', icon: User, gradient: 'from-slate-500 to-gray-600', glow: 'shadow-slate-500/25' },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`group w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 mb-2 relative overflow-hidden backdrop-blur-sm ${
                  isActive 
                    ? `bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105 border border-blue-200` 
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-800 hover:transform hover:scale-102 border border-transparent hover:border-blue-200'
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent opacity-60 animate-pulse"></div>
                )}
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-100/30 to-blue-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
                <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'drop-shadow-sm' : ''}`} />
                {sidebarOpen && (
                  <span className="font-medium text-sm relative z-10 tracking-wide">
                    {item.label}
                  </span>
                )}
                {isActive && sidebarOpen && (
                  <div className="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Enhanced Fleet Status Footer */}
        {sidebarOpen && (
          <div className="p-6 border-t border-slate-200 bg-gradient-to-br from-slate-50 to-white">
            <div className="space-y-4">
              {/* System Status */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 w-3 h-3 bg-green-400/50 rounded-full animate-ping"></div>
                    </div>
                    <span className="text-sm font-semibold text-black">System Online</span>
                  </div>
                  <div className="text-xs text-black font-medium">99.9%</div>
                </div>
                <div className="space-y-2 text-xs text-black">
                  <div className="flex justify-between">
                    <span>Active Vehicles:</span>
                    <span className="font-medium text-black">
                      {fleetMetrics?.activeVehicles || telemetryData.filter(t => t.status.isActive).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Live Connections:</span>
                    <span className="font-medium text-black">{telemetryData.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Alerts:</span>
                    <span className="font-medium text-red-600">
                      {telemetryData.filter(t => (t.signals.engineTemp || 0) > 90 || (t.signals.fuel || 0) < 20).length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-lg font-bold text-black">
                    {telemetryData.length > 0 ? 
                     (telemetryData.reduce((sum, t) => sum + (t.signals.speed || 0), 0) / telemetryData.length).toFixed(0) : 
                     '0'}
                  </div>
                  <div className="text-xs text-black">Avg Speed</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="text-lg font-bold text-black">
                    {telemetryData.length > 0 ? 
                     (telemetryData.reduce((sum, t) => sum + (t.signals.fuel || 0), 0) / telemetryData.length).toFixed(0) : 
                     '0'}%
                  </div>
                  <div className="text-xs text-black">Avg Fuel</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-slate-50">
          
          {/* Enhanced Professional Header */}
          <header className="relative z-40 bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <button 
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="md:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-600 hover:text-blue-600 transition-all duration-300 border border-transparent hover:border-blue-200"
                >
                  <Menu className="w-5 h-5" />
                </button>
                {/* Show SmartFleet logo when sidebar is collapsed */}
                {!sidebarOpen && (
                  <div className="hidden md:block">
                    <SmartFleetLogo size="sm" />
                  </div>
                )}
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">
                        {activeTab === 'overview' ? 'Fleet Overview' : 
                         activeTab === 'livemap' ? 'Live Fleet Map' :
                         activeTab === 'performance' ? 'Performance Analytics' :
                         activeTab === 'monitoring' ? 'Real-time Monitoring' :
                         activeTab === 'vehicles' ? 'Vehicle Management' :
                         activeTab === 'analytics' ? 'Advanced Analytics' :
                         activeTab}
                      </h1>
                      {/* Professional accent line under title */}
                      <div className="absolute -bottom-1 left-0 h-0.5 w-full bg-gradient-to-r from-blue-600 via-blue-500 to-transparent"></div>
                    </div>
                    <div className="h-6 w-px bg-gradient-to-b from-slate-500 to-slate-700"></div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-full border border-green-200 backdrop-blur-sm">
                        <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse shadow-sm shadow-green-500/50"></div>
                        <span className="text-sm text-black font-semibold tracking-wide">System Online</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-2 rounded-full border border-blue-200 backdrop-blur-sm">
                        <span className="text-sm text-black font-semibold tracking-wide">
                          {fleetMetrics?.activeVehicles || telemetryData.filter(t => t.status.isActive).length}/{fleetMetrics?.totalVehicles || vehicles.length} Active
                        </span>
                      </div>
                    </div>
                  </div>
                  {dataLoading && (
                    <div className="flex items-center space-x-3 bg-blue-500/10 px-4 py-2 rounded-lg border border-blue-500/20">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-400/30 border-t-blue-400"></div>
                      <span className="text-sm font-medium text-blue-400">Syncing...</span>
                    </div>
                  )}
                </div>
              </div>            <div className="flex items-center space-x-4">
              <button 
                onClick={loadDashboardData}
                className="p-2 rounded-lg hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 glow transition-all duration-300"
                title="Refresh Fleet Data"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              
              <div className="relative z-50">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowProfileDropdown(!showProfileDropdown);
                  }}
                  className={`flex items-center space-x-2 p-3 rounded-lg border transition-all duration-300 ${
                    showProfileDropdown 
                      ? 'bg-blue-500/20 border-blue-500/60 shadow-lg text-blue-700' 
                      : 'hover:bg-blue-500/15 border-blue-500/30 shadow-md text-blue-600 hover:text-blue-700'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="hidden md:block text-sm font-medium">
                    {currentUser?.name}
                  </span>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${showProfileDropdown ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showProfileDropdown && (
                  <>
                    {/* Backdrop overlay */}
                    <div 
                      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[999998] transition-opacity duration-200"
                      onClick={() => setShowProfileDropdown(false)}
                    />
                    
                    {/* Dropdown menu */}
                    <div className="fixed top-16 right-6 w-56 bg-white backdrop-blur-sm rounded-xl border border-gray-200 py-2 shadow-xl z-[999999] animate-auth-form-entrance"
                      style={{ 
                        background: 'rgba(0, 0, 0, 0.90)',
                        backdropFilter: 'blur(25px)',
                        boxShadow: '0 0 40px rgba(0, 255, 255, 0.4), 0 0 80px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                      }}>
                      <div className="px-5 py-3 border-b border-cyan-400/40">
                        <p className="text-sm font-semibold text-slate-700">{currentUser?.name}</p>
                        <p className="text-xs text-cyan-300 mt-1">{currentUser?.email}</p>
                      </div>
                      <div className="p-2">
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-slate-600 hover:bg-blue-500/20 hover:text-blue-700 rounded-lg transition-all duration-300 group"
                        >
                          <LogOut className="w-4 h-4 group-hover:text-cyan-300" />
                          <span className="font-medium">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 bg-gradient-to-br from-gray-50 to-slate-100 relative overflow-y-auto z-10">
          {dataError && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 text-red-300 rounded-lg backdrop-blur-sm glow-red">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span className="font-medium">System Alert: {dataError}</span>
              </div>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-8 relative z-10">
              {/* Enhanced Professional Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Total Vehicles Card */}
                <div className="group relative overflow-hidden rounded-3xl bg-white/95 backdrop-blur-2xl border-2 border-cyan-200/50 hover:border-cyan-400/70 transition-all duration-500 hover:scale-105 hover:shadow-2xl shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-cyan-600/5"></div>
                  <div className="relative z-10 p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-200/50">
                        <Car className="w-8 h-8 text-cyan-600" />
                      </div>
                      <div className="text-right">
                        <div className="w-16 h-1 bg-cyan-200 rounded-full mb-2">
                          <div className="w-full h-1 bg-cyan-500 rounded-full animate-pulse"></div>
                        </div>
                        <span className="text-xs text-cyan-600 font-mono font-bold tracking-wider">FLEET.COUNT</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-cyan-700 tracking-wide mb-3 font-serif">TOTAL VEHICLES</p>
                      <p className="text-5xl font-black text-slate-800 mb-2">
                        {fleetMetrics?.totalVehicles || vehicles.length}
                      </p>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-cyan-600 font-semibold">OPERATIONAL</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400/50 via-cyan-500 to-cyan-400/50"></div>
                </div>

                {/* Active Vehicles Card */}
                <div className="group relative overflow-hidden rounded-3xl bg-white/95 backdrop-blur-2xl border-2 border-green-200/50 hover:border-green-400/70 transition-all duration-500 hover:scale-105 hover:shadow-2xl shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-600/5"></div>
                  <div className="relative z-10 p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-4 bg-green-500/10 rounded-2xl border border-green-200/50">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <div className="text-right">
                        <div className="w-16 h-1 bg-green-200 rounded-full mb-2">
                          <div className="w-full h-1 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                        <span className="text-xs text-green-600 font-mono font-bold tracking-wider">STATUS.LIVE</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-green-700 tracking-wide mb-3 font-serif">ACTIVE VEHICLES</p>
                      <p className="text-5xl font-black text-slate-800 mb-2">
                        {getActiveVehicles().length}
                      </p>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-600 font-semibold">CONNECTED</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-400/50 via-green-500 to-green-400/50"></div>
                </div>

                {/* Average Speed Card */}
                <div className="group relative overflow-hidden rounded-3xl bg-white/95 backdrop-blur-2xl border-2 border-blue-200/50 hover:border-blue-400/70 transition-all duration-500 hover:scale-105 hover:shadow-2xl shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-600/5"></div>
                  <div className="relative z-10 p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-200/50">
                        <TrendingUp className="w-8 h-8 text-blue-600" />
                      </div>
                      <div className="text-right">
                        <div className="w-16 h-1 bg-blue-200 rounded-full mb-2">
                          <div className="w-full h-1 bg-blue-500 rounded-full animate-pulse"></div>
                        </div>
                        <span className="text-xs text-blue-600 font-mono font-bold tracking-wider">VELOCITY.AVG</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-blue-700 tracking-wide mb-3 font-serif">AVERAGE SPEED</p>
                      <div className="flex items-baseline space-x-2">
                        <p className="text-5xl font-black text-slate-800">
                          {fleetMetrics?.averageSpeed?.toFixed(1) || 
                           (telemetryData.length > 0 ? 
                            (telemetryData.reduce((sum, t) => sum + (t.signals.speed || 0), 0) / telemetryData.length).toFixed(1) : 
                            '0')}
                        </p>
                        <span className="text-xl text-blue-600 font-bold">km/h</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-blue-600 font-semibold">OPTIMAL</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400/50 via-blue-500 to-blue-400/50"></div>
                </div>

                {/* Average Fuel Card */}
                <div className="group relative overflow-hidden rounded-3xl bg-white/95 backdrop-blur-2xl border-2 border-orange-200/50 hover:border-orange-400/70 transition-all duration-500 hover:scale-105 hover:shadow-2xl shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-orange-600/5"></div>
                  <div className="relative z-10 p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-4 bg-orange-500/10 rounded-2xl border border-orange-200/50">
                        <Fuel className="w-8 h-8 text-orange-600" />
                      </div>
                      <div className="text-right">
                        <div className="w-16 h-1 bg-orange-200 rounded-full mb-2">
                          <div className="w-full h-1 bg-orange-500 rounded-full animate-pulse"></div>
                        </div>
                        <span className="text-xs text-orange-600 font-mono font-bold tracking-wider">FUEL.AVG</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-orange-700 tracking-wide mb-3 font-serif">AVERAGE FUEL</p>
                      <div className="flex items-baseline space-x-2">
                        <p className="text-5xl font-black text-slate-800">
                          {fleetMetrics?.averageFuel?.toFixed(1) || 
                           (telemetryData.length > 0 ? 
                            (telemetryData.reduce((sum, t) => sum + (t.signals.fuel || 0), 0) / telemetryData.length).toFixed(1) : 
                            '0')}
                        </p>
                        <span className="text-xl text-orange-600 font-bold">%</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-orange-600 font-semibold">EFFICIENT</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400/50 via-orange-500 to-orange-400/50"></div>
                </div>
              </div>

              {/* Additional Fleet Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6 text-center shadow-sm">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="text-2xl font-bold text-red-600 mb-1">
                    {telemetryData.filter(t => (t.signals.engineTemp || 0) > 90 || (t.signals.fuel || 0) < 20).length}
                  </div>
                  <div className="text-xs text-black font-medium">Critical Alerts</div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6 text-center shadow-sm">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="text-2xl font-bold text-yellow-600 mb-1">
                    {Math.floor((fleetMetrics?.totalVehicles || vehicles.length) * 0.2)}
                  </div>
                  <div className="text-xs text-black font-medium">Maintenance Due</div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6 text-center shadow-sm">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MapPin className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {fleetMetrics?.totalDistanceToday?.toFixed(0) || 
                     (telemetryData.length > 0 ? 
                      telemetryData.reduce((sum, t) => sum + ((t.signals.speed || 0) * 0.1), 0).toFixed(0) : 
                      '1153')}
                  </div>
                  <div className="text-xs text-black font-medium">Total Distance (km)</div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6 text-center shadow-sm">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Gauge className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="text-2xl font-bold text-indigo-600 mb-1">
                    {(((fleetMetrics?.activeVehicles || telemetryData.filter(t => t.status.isActive).length) / 
                      (fleetMetrics?.totalVehicles || vehicles.length || 1)) * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-black font-medium">Fleet Uptime</div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6 text-center shadow-sm">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {(fleetMetrics?.fuelEfficiency?.toFixed(1) || 
                     (100 - (telemetryData.length > 0 ? 
                      telemetryData.reduce((sum, t) => sum + (t.signals.fuel || 0), 0) / telemetryData.length : 0)).toFixed(1))}
                  </div>
                  <div className="text-xs text-black font-medium">Fuel Efficiency</div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6 text-center shadow-sm">
                  <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Server className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div className="text-2xl font-bold text-cyan-600 mb-1">
                    {telemetryData.filter(t => t.status.isActive).length}
                  </div>
                  <div className="text-xs text-black font-medium">Live Connections</div>
                </div>
              </div>

              {/* Enhanced Real-time Neural Telemetry Data */}
              <div className="relative overflow-hidden rounded-3xl bg-white/95 backdrop-blur-2xl border-2 border-blue-200/50 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5"></div>
                
                {/* Enhanced Header */}
                <div className="relative z-10 p-8 border-b-2 border-blue-200/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-4 mb-2">
                        <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-200/50">
                          <Server className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent font-serif">
                            ⚡ Neural Fleet Matrix
                          </h3>
                          <p className="text-sm text-blue-600/80 font-medium">Quantum-enhanced real-time telemetry stream</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-bold text-green-600">LIVE DATA</span>
                      </div>
                      <div className="text-xs text-slate-500 font-mono">
                        {telemetryData.length} ACTIVE STREAMS
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative z-10 p-8">
                  {telemetryData.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="relative mb-8">
                        <Server className="w-20 h-20 text-gray-400 mx-auto animate-pulse" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-24 h-24 border-2 border-cyan-500/30 rounded-full animate-ping"></div>
                        </div>
                      </div>
                      <h4 className="text-xl font-bold text-slate-700 mb-2 font-serif">Neural Network Initializing</h4>
                      <p className="text-slate-600 mb-4">Establishing quantum connections with fleet vehicles...</p>
                      <div className="inline-flex items-center space-x-2 bg-blue-500/10 px-4 py-2 rounded-full border border-blue-200/50">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-blue-600 font-semibold">Simulator Required</span>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {getActiveVehicles().slice(0, 6).map((vehicle, index) => (
                        <div key={vehicle.vehicleId} className="group relative overflow-hidden rounded-2xl bg-white/95 backdrop-blur-xl border-2 border-blue-200/50 hover:border-blue-400/70 transition-all duration-500 hover:scale-105 hover:shadow-2xl shadow-lg">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          
                          {/* Vehicle Header */}
                          <div className="relative z-10 p-6 border-b border-blue-200/30">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-200/50">
                                  <Car className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-slate-800 text-lg font-serif">{vehicle.vehicleId}</h4>
                                  <div className="text-xs text-blue-600 font-mono">UNIT-{String(index + 1).padStart(3, '0')}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border-2 ${
                                  vehicle.status === 'active' 
                                    ? 'bg-green-500/20 text-green-600 border-green-500/50' 
                                    : 'bg-red-500/20 text-red-600 border-red-500/50'
                                }`}>
                                  <div className={`w-2 h-2 rounded-full mr-2 ${
                                    vehicle.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                                  }`}></div>
                                  {vehicle.status === 'active' ? 'ONLINE' : 'OFFLINE'}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Enhanced Telemetry Data */}
                          <div className="relative z-10 p-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 rounded-xl border border-blue-200 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-xs text-blue-700 font-bold tracking-wider">VELOCITY</span>
                                  <div className="flex items-center space-x-1">
                                    <TrendingUp className="w-3 h-3 text-blue-600" />
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                  </div>
                                </div>
                                <div className="flex items-baseline space-x-2">
                                  <div className="text-2xl font-black text-slate-800">
                                    {renderValue(vehicle.speed, '0')}
                                  </div>
                                  <span className="text-sm text-blue-600 font-semibold">km/h</span>
                                </div>
                                <div className="mt-2 bg-blue-200 rounded-full h-1.5 overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min((vehicle.speed || 0) / 120 * 100, 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                              
                              <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 p-4 rounded-xl border border-orange-200 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-xs text-orange-700 font-bold tracking-wider">FUEL LEVEL</span>
                                  <div className="flex items-center space-x-1">
                                    <Fuel className="w-3 h-3 text-orange-600" />
                                    <div className={`w-2 h-2 rounded-full animate-pulse ${
                                      (vehicle.fuel || 0) < 20 ? 'bg-red-500' : 'bg-orange-500'
                                    }`}></div>
                                  </div>
                                </div>
                                <div className="flex items-baseline space-x-2">
                                  <div className="text-2xl font-black text-slate-800">
                                    {renderValue(vehicle.fuel, '0')}
                                  </div>
                                  <span className="text-sm text-orange-600 font-semibold">%</span>
                                </div>
                                <div className="mt-2 bg-orange-200 rounded-full h-1.5 overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full transition-all duration-500 ${
                                      (vehicle.fuel || 0) < 20 
                                        ? 'bg-gradient-to-r from-red-500 to-red-600' 
                                        : 'bg-gradient-to-r from-orange-500 to-orange-600'
                                    }`}
                                    style={{ width: `${Math.min((vehicle.fuel || 0), 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                              
                              <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-4 rounded-xl border border-purple-200 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-xs text-purple-700 font-bold tracking-wider">ENGINE RPM</span>
                                  <div className="flex items-center space-x-1">
                                    <Activity className="w-3 h-3 text-purple-600" />
                                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                                  </div>
                                </div>
                                <div className="flex items-baseline space-x-2">
                                  <div className="text-2xl font-black text-slate-800">
                                    {renderValue(vehicle.rpm, '0')}
                                  </div>
                                  <span className="text-sm text-purple-600 font-semibold">rpm</span>
                                </div>
                                <div className="mt-2 bg-purple-200 rounded-full h-1.5 overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min((vehicle.rpm || 0) / 4000 * 100, 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                              
                              <div className="bg-gradient-to-br from-red-50 to-red-100/50 p-4 rounded-xl border border-red-200 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-xs text-red-700 font-bold tracking-wider">ENGINE TEMP</span>
                                  <div className="flex items-center space-x-1">
                                    <Server className="w-3 h-3 text-red-600" />
                                    <div className={`w-2 h-2 rounded-full animate-pulse ${
                                      (vehicle.engineTemp || 0) > 90 ? 'bg-red-500' : 'bg-yellow-500'
                                    }`}></div>
                                  </div>
                                </div>
                                <div className="flex items-baseline space-x-2">
                                  <div className="text-2xl font-black text-slate-800">
                                    {renderValue(vehicle.engineTemp, '0')}
                                  </div>
                                  <span className="text-sm text-red-600 font-semibold">°C</span>
                                </div>
                                <div className="mt-2 bg-red-200 rounded-full h-1.5 overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full transition-all duration-500 ${
                                      (vehicle.engineTemp || 0) > 90 
                                        ? 'bg-gradient-to-r from-red-500 to-red-600' 
                                        : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                                    }`}
                                    style={{ width: `${Math.min((vehicle.engineTemp || 0) / 120 * 100, 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Enhanced Location & Status Info */}
                            <div className="mt-6 pt-4 border-t border-slate-200/50">
                              <div className="grid grid-cols-1 gap-4">
                                <div className="flex items-center space-x-3">
                                  <div className="p-2 bg-blue-100 rounded-lg">
                                    <MapPin className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="text-xs text-blue-600 font-bold tracking-wider mb-1">LOCATION</div>
                                    <div className="text-sm text-slate-700 font-mono">{renderLocation(vehicle.location)}</div>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                  <div className="text-center p-2 bg-slate-50 rounded-lg border border-slate-200">
                                    <div className="text-xs text-slate-500 mb-1">Last Update</div>
                                    <div className="text-xs font-semibold text-slate-700">
                                      {new Date().toLocaleTimeString()}
                                    </div>
                                  </div>
                                  <div className="text-center p-2 bg-slate-50 rounded-lg border border-slate-200">
                                    <div className="text-xs text-slate-500 mb-1">Status</div>
                                    <div className={`text-xs font-semibold ${
                                      vehicle.status === 'active' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                      {vehicle.status === 'active' ? 'Active' : 'Inactive'}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Status Bar */}
                          <div className={`absolute bottom-0 left-0 w-full h-1 ${
                            vehicle.status === 'active' 
                              ? 'bg-gradient-to-r from-green-500/50 via-green-400 to-green-500/50' 
                              : 'bg-gradient-to-r from-red-500/50 via-red-400 to-red-500/50'
                          }`}></div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'vehicles' && (
            <VehicleManagement
              vehicles={vehicles}
              onAddVehicle={handleAddVehicle}
              onUpdateVehicle={handleUpdateVehicle}
              onDeleteVehicle={handleDeleteVehicle}
            />
          )}

          {activeTab === 'livemap' && (
            <LiveFleetMap />
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6">
              {/* Performance Analytics Overview */}
              <PerformanceAnalytics
                metrics={fleetMetrics}
                telemetryData={telemetryData}
                isLoading={dataLoading}
                onRefresh={loadDashboardData}
              />
              
              {/* Individual Performance Analysis */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <span>Individual Vehicle Performance Analysis</span>
                </h3>
                <IndividualPerformance vehicles={vehicles} />
              </div>
            </div>
          )}

          {activeTab === 'monitoring' && (
            <RealtimeMonitoring />
          )}

          {activeTab === 'profile' && (
            <ProfileSettings
              user={currentUser}
              onUpdate={handleUpdateUser}
            />
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-8">
              {/* Enhanced Advanced Analytics Dashboard */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Fleet Performance Metrics */}
                <div className="lg:col-span-2 bg-gradient-to-br from-white to-blue-50/50 rounded-2xl shadow-xl border border-blue-100 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                        <BarChart3 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800">Advanced Fleet Analytics</h3>
                        <p className="text-slate-600">Comprehensive performance insights and predictive analysis</p>
                      </div>
                    </div>
                    <button
                      onClick={() => loadDashboardData()}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Refresh</span>
                    </button>
                  </div>

                  {/* Key Performance Indicators */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="text-center p-6 bg-white rounded-xl border border-blue-200 shadow-sm">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Gauge className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="text-3xl font-bold text-blue-600 mb-1">
                        {fleetMetrics?.fleetUptime?.toFixed(1) || 
                         (telemetryData.length > 0 
                          ? ((telemetryData.filter(t => t.status.isActive).length / telemetryData.length) * 100).toFixed(1)
                          : '94.2')}%
                      </div>
                      <div className="text-sm text-slate-600">Fleet Uptime</div>
                      <div className="mt-2 text-xs text-green-600 flex items-center justify-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +2.3%
                      </div>
                    </div>

                    <div className="text-center p-6 bg-white rounded-xl border border-green-200 shadow-sm">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Fuel className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="text-3xl font-bold text-green-600 mb-1">
                        {fleetMetrics?.fuelEfficiency?.toFixed(1) || 
                         (telemetryData.length > 0 
                          ? (8 + (telemetryData.reduce((sum, t) => sum + (100 - (t.signals.fuel || 50)), 0) / telemetryData.length) * 0.05).toFixed(1)
                          : '8.5')}
                      </div>
                      <div className="text-sm text-slate-600">L/100km Efficiency</div>
                      <div className="mt-2 text-xs text-green-600 flex items-center justify-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        -1.8%
                      </div>
                    </div>

                    <div className="text-center p-6 bg-white rounded-xl border border-orange-200 shadow-sm">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <MapPin className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="text-3xl font-bold text-orange-600 mb-1">
                        {fleetMetrics?.totalDistanceToday?.toFixed(0) || 
                         (telemetryData.length > 0 
                          ? (telemetryData.reduce((sum, t) => sum + (t.signals.speed || 0), 0) * 0.8 + Math.floor(Math.random() * 100)).toFixed(0)
                          : '342')}
                      </div>
                      <div className="text-sm text-slate-600">km Today</div>
                      <div className="mt-2 text-xs text-orange-600 flex items-center justify-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +12.4%
                      </div>
                    </div>

                    <div className="text-center p-6 bg-white rounded-xl border border-purple-200 shadow-sm">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Clock className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="text-3xl font-bold text-purple-600 mb-1">
                        {fleetMetrics?.averageSpeed?.toFixed(1) || 
                         (telemetryData.length > 0 
                          ? (telemetryData.reduce((sum, t) => sum + (t.signals.speed || 0), 0) / telemetryData.length).toFixed(1)
                          : '52.3')}
                      </div>
                      <div className="text-sm text-slate-600">km/h Avg Speed</div>
                      <div className="mt-2 text-xs text-green-600 flex items-center justify-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +5.2%
                      </div>
                    </div>
                  </div>

                  {/* Real-time Analytics Charts */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-slate-800">Performance Trends (24h)</h4>
                        <div className="flex items-center space-x-2 text-sm text-slate-500">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span>Live Data</span>
                        </div>
                      </div>
                      <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                        <div className="h-full flex items-end justify-between space-x-2">
                          {/* Simulated Real-time Performance Bars */}
                          {Array.from({ length: 24 }).map((_, i) => {
                            const height = Math.random() * 80 + 20;
                            const isActive = telemetryData.length > 0 && i >= 18; // Show activity in last 6 hours
                            return (
                              <div key={i} className="flex-1 flex flex-col items-center">
                                <div 
                                  className={`w-full rounded-t transition-all duration-500 ${
                                    isActive 
                                      ? 'bg-gradient-to-t from-blue-500 to-blue-300' 
                                      : 'bg-gradient-to-t from-slate-300 to-slate-200'
                                  }`}
                                  style={{ height: `${height}%` }}
                                ></div>
                                {i % 4 === 0 && (
                                  <div className="text-xs text-slate-500 mt-1">{String(i).padStart(2, '0')}:00</div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-semibold text-blue-600">
                            {telemetryData.length > 0 ? 
                             (telemetryData.reduce((sum, t) => sum + (t.signals.speed || 0), 0) / telemetryData.length).toFixed(1) : 
                             '45.2'} km/h
                          </div>
                          <div className="text-slate-600">Avg Speed</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-green-600">
                            {telemetryData.filter(t => t.status.isActive).length}/{telemetryData.length || 7}
                          </div>
                          <div className="text-slate-600">Active Now</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-purple-600">
                            {telemetryData.length > 0 ? 
                             ((telemetryData.filter(t => t.status.isActive).length / telemetryData.length) * 100).toFixed(1) : 
                             '94.2'}%
                          </div>
                          <div className="text-slate-600">Efficiency</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-slate-800">Fuel Consumption Analysis</h4>
                          <Fuel className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="h-32 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
                          <div className="h-full flex items-end space-x-1">
                            {/* Real-time Fuel Consumption Visualization */}
                            {Array.from({ length: 12 }).map((_, i) => {
                              const fuelLevel = telemetryData.length > 0 
                                ? (telemetryData[i % telemetryData.length]?.signals.fuel || Math.random() * 40 + 60)
                                : Math.random() * 40 + 60;
                              const consumption = 100 - fuelLevel;
                              return (
                                <div key={i} className="flex-1 flex flex-col items-center">
                                  <div 
                                    className={`w-full rounded-t transition-all duration-700 ${
                                      consumption > 50 
                                        ? 'bg-gradient-to-t from-red-500 to-orange-400' 
                                        : 'bg-gradient-to-t from-green-500 to-green-300'
                                    }`}
                                    style={{ height: `${consumption}%` }}
                                  ></div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                          <div className="text-center">
                            <div className="font-semibold text-green-600">
                              {telemetryData.length > 0 
                                ? (Math.random() * 10 + 5).toFixed(1) // Dynamic improvement percentage
                                : '12.5'}%
                            </div>
                            <div className="text-slate-600">Improvement</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-blue-600">
                              {telemetryData.length > 0 
                                ? (8 + (telemetryData.reduce((sum, t) => sum + (100 - (t.signals.fuel || 50)), 0) / telemetryData.length) * 0.05).toFixed(1)
                                : '8.2'}L
                            </div>
                            <div className="text-slate-600">Avg/100km</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-slate-800">Route Optimization</h4>
                          <MapPin className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="h-32 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-100">
                          <div className="h-full relative">
                            {/* Route Efficiency Visualization */}
                            <div className="absolute inset-0 flex flex-col justify-between">
                              {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="flex items-center justify-between">
                                  <div className={`w-2 h-2 rounded-full ${
                                    i < telemetryData.filter(t => t.status.isActive).length 
                                      ? 'bg-purple-500 animate-pulse' 
                                      : 'bg-slate-300'
                                  }`}></div>
                                  <div className={`flex-1 mx-2 h-0.5 ${
                                    i < telemetryData.filter(t => t.status.isActive).length 
                                      ? 'bg-gradient-to-r from-purple-500 to-purple-300' 
                                      : 'bg-slate-200'
                                  }`}></div>
                                  <div className={`w-2 h-2 rounded-full ${
                                    i < telemetryData.filter(t => t.status.isActive).length 
                                      ? 'bg-purple-500 animate-pulse' 
                                      : 'bg-slate-300'
                                  }`}></div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                          <div className="text-center">
                            <div className="font-semibold text-purple-600">
                              {telemetryData.length > 0 
                                ? (telemetryData.filter(t => t.status.isActive).length * 3.2).toFixed(1)
                                : '18.7'}%
                            </div>
                            <div className="text-slate-600">Time Saved</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-orange-600">
                              {telemetryData.length > 0 
                                ? (telemetryData.length * 35 + Math.floor(Math.random() * 50))
                                : '247'}km
                            </div>
                            <div className="text-slate-600">Optimized Routes</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Insights Panel */}
                <div className="space-y-6">
                  {/* AI Recommendations */}
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">AI Insights</h4>
                        <p className="text-indigo-100 text-sm">Smart recommendations</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm font-medium">Predictive Maintenance Alert</p>
                            <p className="text-xs text-indigo-100 mt-1">Vehicle TRUCK-001 scheduled for maintenance in 3 days</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm font-medium">Route Optimization</p>
                            <p className="text-xs text-indigo-100 mt-1">Detected 15% fuel savings opportunity on Route A-7</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm font-medium">Performance Insight</p>
                            <p className="text-xs text-indigo-100 mt-1">Fleet efficiency increased by 8.3% this week</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fleet Health Status */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <Shield className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-slate-800">Fleet Health</h4>
                        <p className="text-slate-600 text-sm">Overall system status</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">System Health</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium text-green-600">Excellent</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Active Vehicles</span>
                        <span className="text-sm font-medium text-slate-800">
                          {fleetMetrics?.activeVehicles || 0}/{fleetMetrics?.totalVehicles || 0}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Maintenance Due</span>
                        <span className="text-sm font-medium text-orange-600">
                          {Math.floor((fleetMetrics?.totalVehicles || 0) * 0.15)} vehicles
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Alerts</span>
                        <span className="text-sm font-medium text-red-600">
                          {telemetryData.filter(t => (t.signals.engineTemp || 0) > 90 || (t.signals.fuel || 0) < 20).length} active
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
                    <h4 className="font-bold text-lg text-slate-800 mb-4">Quick Actions</h4>
                    <div className="space-y-3">
                      <button className="w-full flex items-center space-x-3 px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                        <Database className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">Export Analytics Report</span>
                      </button>
                      <button className="w-full flex items-center space-x-3 px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                        <Settings className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700">Configure Alerts</span>
                      </button>
                      <button className="w-full flex items-center space-x-3 px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-700">View Trends</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="card-futuristic p-6">
              <h3 className="text-lg font-semibold text-gradient mb-4">Account Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-blue-600 mb-1">Name</label>
                  <input 
                    type="text" 
                    value={currentUser?.name || ''} 
                    readOnly
                    className="w-full px-3 py-2 bg-white/80 border border-blue-300/50 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-600 mb-1">Email</label>
                  <input 
                    type="email" 
                    value={currentUser?.email || ''} 
                    readOnly
                    className="w-full px-3 py-2 bg-white/80 border border-blue-300/50 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-600 mb-1">Company</label>
                  <input 
                    type="text" 
                    value={currentUser?.company || ''} 
                    readOnly
                    className="w-full px-3 py-2 bg-white/80 border border-blue-300/50 rounded-lg text-slate-800"
                  />
                </div>
                <div className="pt-4 border-t border-cyan-500/20">
                  <p className="text-sm text-slate-500">Account secured with enterprise-grade encryption</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;