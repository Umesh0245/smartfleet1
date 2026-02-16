import { Car, Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
  showLogo?: boolean;
}

const LoadingScreen = ({ 
  message = 'Loading SmartFleet...', 
  showLogo = true 
}: LoadingScreenProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        {showLogo && (
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Car className="w-10 h-10 text-white" />
          </div>
        )}
        
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          <h2 className="text-xl font-semibold text-gray-900">{message}</h2>
        </div>
        
        <div className="w-48 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
        
        <p className="text-sm text-gray-600 mt-4">
          Please wait while we initialize your fleet dashboard...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;