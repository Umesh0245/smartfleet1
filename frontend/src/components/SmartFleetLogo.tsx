import React from 'react';

interface SmartFleetLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  animated?: boolean;
  className?: string;
}

const SmartFleetLogo: React.FC<SmartFleetLogoProps> = ({ 
  size = 'md', 
  showText = true, 
  animated = true,
  className = '' 
}) => {
  const sizeClasses = {
    sm: { 
      container: 'w-8 h-8', 
      text: 'text-sm font-semibold ml-2',
      svg: 32
    },
    md: { 
      container: 'w-10 h-10', 
      text: 'text-lg font-bold ml-3',
      svg: 40
    },
    lg: { 
      container: 'w-12 h-12', 
      text: 'text-xl font-bold ml-4',
      svg: 48
    },
    xl: { 
      container: 'w-16 h-16', 
      text: 'text-2xl font-bold ml-4',
      svg: 64
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex items-center ${className}`}>
      {/* Futuristic Fleet Management Logo */}
      <div className={`${currentSize.container} relative`}>
        {/* Advanced SVG Logo */}
        <svg 
          width={currentSize.svg} 
          height={currentSize.svg} 
          viewBox="0 0 100 100" 
          className={`drop-shadow-2xl ${animated ? 'animate-pulse' : ''}`}
        >
          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00FFFF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0080FF" stopOpacity="0.4" />
            </linearGradient>
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#06B6D4" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.3" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Outer Hexagonal Ring */}
          <polygon 
            points="50,5 85,25 85,75 50,95 15,75 15,25" 
            fill="none" 
            stroke="url(#primaryGradient)" 
            strokeWidth="2"
            className={animated ? 'animate-spin' : ''}
            style={{ 
              animationDuration: '10s',
              transformOrigin: '50px 50px'
            }}
          />

          {/* Inner Circuit Pattern */}
          <g stroke="url(#glowGradient)" strokeWidth="1" fill="none" filter="url(#glow)">
            {/* Circuit Lines */}
            <path d="M20,30 L35,30 L35,45 L50,45" />
            <path d="M50,45 L65,45 L65,30 L80,30" />
            <path d="M20,70 L35,70 L35,55 L50,55" />
            <path d="M50,55 L65,55 L65,70 L80,70" />
            <path d="M30,20 L30,35 L45,35 L45,50" />
            <path d="M55,50 L70,50 L70,35 L70,20" />
            
            {/* Circuit Nodes */}
            <circle cx="35" cy="30" r="2" fill="url(#glowGradient)" />
            <circle cx="65" cy="30" r="2" fill="url(#glowGradient)" />
            <circle cx="35" cy="70" r="2" fill="url(#glowGradient)" />
            <circle cx="65" cy="70" r="2" fill="url(#glowGradient)" />
          </g>

          {/* Central Smart Vehicle Symbol */}
          <g transform="translate(50,50)">
            {/* Main Vehicle Body */}
            <rect x="-12" y="-6" width="24" height="8" rx="2" fill="url(#primaryGradient)" />
            <rect x="-15" y="-4" width="6" height="4" rx="1" fill="url(#primaryGradient)" />
            
            {/* Vehicle Windows */}
            <rect x="-10" y="-5" width="8" height="2" rx="1" fill="url(#centerGlow)" opacity="0.8" />
            <rect x="2" y="-5" width="8" height="2" rx="1" fill="url(#centerGlow)" opacity="0.8" />
            
            {/* Wheels */}
            <circle cx="-8" cy="4" r="3" fill="url(#primaryGradient)" />
            <circle cx="8" cy="4" r="3" fill="url(#primaryGradient)" />
            <circle cx="-8" cy="4" r="1.5" fill="url(#centerGlow)" />
            <circle cx="8" cy="4" r="1.5" fill="url(#centerGlow)" />

            {/* Smart Technology Indicators */}
            {animated && (
              <g className="animate-ping" style={{ animationDuration: '2s' }}>
                <circle cx="0" cy="-15" r="2" fill="#00FF00" opacity="0.8" />
                <circle cx="15" cy="0" r="2" fill="#FF4500" opacity="0.8" />
                <circle cx="0" cy="15" r="2" fill="#FF0080" opacity="0.8" />
                <circle cx="-15" cy="0" r="2" fill="#00BFFF" opacity="0.8" />
              </g>
            )}

            {/* Signal Waves */}
            {animated && (
              <g opacity="0.6" className="animate-pulse">
                <path d="M-25,-25 Q0,-35 25,-25" stroke="url(#glowGradient)" strokeWidth="1" fill="none" />
                <path d="M-30,-20 Q0,-30 30,-20" stroke="url(#glowGradient)" strokeWidth="0.8" fill="none" />
                <path d="M-35,-15 Q0,-25 35,-15" stroke="url(#glowGradient)" strokeWidth="0.6" fill="none" />
              </g>
            )}
          </g>

          {/* Corner Connection Points */}
          <g fill="url(#glowGradient)" className={animated ? 'animate-pulse' : ''}>
            <circle cx="50" cy="8" r="1.5" />
            <circle cx="82" cy="25" r="1.5" />
            <circle cx="82" cy="75" r="1.5" />
            <circle cx="50" cy="92" r="1.5" />
            <circle cx="18" cy="75" r="1.5" />
            <circle cx="18" cy="25" r="1.5" />
          </g>
        </svg>

        {/* Animated Glow Effects */}
        {animated && (
          <>
            {/* Outer Glow Ring */}
            <div className="absolute -inset-2 rounded-full border border-cyan-400/20 animate-pulse" 
                 style={{ animationDuration: '3s' }}></div>
            
            {/* Inner Pulse */}
            <div className="absolute -inset-1 rounded-full border border-blue-400/30 animate-ping" 
                 style={{ animationDuration: '2s', animationDelay: '0.5s' }}></div>
          </>
        )}
      </div>

      {/* Enhanced Logo Text */}
      {showText && (
        <div className={`${currentSize.text} flex flex-col`}>
          <div className="flex items-center">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent font-black tracking-tight">
              Smart
            </span>
            <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 bg-clip-text text-transparent font-black tracking-tight">
              Fleet
            </span>
          </div>
          {(size === 'lg' || size === 'xl') && (
            <div className="text-xs text-gray-400 font-medium tracking-wider -mt-1 opacity-80">
              INTELLIGENCE PLATFORM
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartFleetLogo;