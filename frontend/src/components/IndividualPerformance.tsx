import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Cpu, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Search, 
  ChevronDown, 
  Award, 
  Target
} from 'lucide-react';
import fleetApi, { FleetVehicle } from '../api/fleetApi';

interface AIPerformanceAnalysis {
  vehicleId: string;
  performanceScore: number;
  analysis: {
    summary: string;
    anomalies: string[];
    predictions: string[];
    recommendations: string[];
  };
  lastUpdated: string;
}

interface IndividualPerformanceProps {
  vehicles: FleetVehicle[];
}

const IndividualPerformance: React.FC<IndividualPerformanceProps> = ({ vehicles }) => {
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [performanceAnalysis, setPerformanceAnalysis] = useState<AIPerformanceAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.driverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${vehicle.make} ${vehicle.model}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (selectedVehicle && selectedVehicle !== '') {
      loadPerformanceAnalysis(selectedVehicle);
    }
  }, [selectedVehicle]);

  const loadPerformanceAnalysis = async (vehicleId: string) => {
    setLoading(true);
    setError('');
    
    try {
      const analysis = await fleetApi.getVehiclePerformanceAnalysis(vehicleId);
      setPerformanceAnalysis(analysis);
    } catch (err) {
      setError('Failed to load performance analysis. Please try again.');
      console.error('Performance analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 85) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getPerformanceGlow = (score: number) => {
    if (score >= 85) return 'glow-green';
    if (score >= 70) return 'glow';
    return 'glow-purple';
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="p-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 glow animate-pulse-glow">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gradient">
            AI Performance Analysis
          </h1>
        </div>
        <p className="text-gray-400 text-lg">
          Advanced AI-driven vehicle performance insights and predictive maintenance
        </p>
        <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mt-4"></div>
      </div>

      <div className="card-futuristic p-6 neon-border">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
          <Target className="w-5 h-5 text-cyan-400" />
          <span>Select Vehicle for Analysis</span>
        </h2>

        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              className="input-futuristic pl-10 pr-12"
              placeholder="Search vehicles by ID, driver, or model..."
            />
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors"
            >
              <ChevronDown className={'w-5 h-5 transition-transform ' + (showDropdown ? 'rotate-180' : '')} />
            </button>
          </div>

          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 card-futuristic border border-cyan-400/30 max-h-60 overflow-y-auto z-10">
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map((vehicle) => (
                  <button
                    key={vehicle.vehicleId}
                    onClick={() => {
                      setSelectedVehicle(vehicle.vehicleId);
                      setShowDropdown(false);
                      setSearchTerm('');
                    }}
                    className="w-full text-left p-4 hover:bg-cyan-400/10 transition-colors border-b border-gray-700/50 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">{vehicle.vehicleId}</div>
                        <div className="text-gray-400 text-sm">
                          {vehicle.make} {vehicle.model} • {vehicle.driverName || 'No driver assigned'}
                        </div>
                      </div>
                      <div className={'px-2 py-1 rounded text-xs ' + (
                        vehicle.status === 'active' ? 'bg-green-500/20 text-green-400' :
                        vehicle.status === 'maintenance' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      )}>
                        {vehicle.status}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-gray-400 text-center">
                  No vehicles found matching your search
                </div>
              )}
            </div>
          )}
        </div>

        {selectedVehicle && (
          <div className="mt-4 glass p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse glow"></div>
              <span className="text-cyan-400 font-medium">Selected:</span>
              <span className="text-white">{selectedVehicle}</span>
            </div>
          </div>
        )}
      </div>

      {selectedVehicle && (
        <div className="space-y-6">
          {loading ? (
            <div className="card-futuristic p-12 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center animate-pulse-glow">
                  <Cpu className="w-8 h-8 text-white animate-spin-slow" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-white">
                    AI Processing Vehicle Data
                  </h3>
                  <p className="text-gray-400">
                    Analyzing performance metrics and generating insights...
                  </p>
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="card-futuristic p-6 border border-red-500/30">
              <div className="flex items-center space-x-3 text-red-400">
                <AlertTriangle className="w-6 h-6" />
                <div>
                  <h3 className="font-semibold">Analysis Failed</h3>
                  <p className="text-sm text-gray-400">{error}</p>
                </div>
              </div>
            </div>
          ) : performanceAnalysis ? (
            <>
              <div className="card-futuristic p-6 neon-border-purple">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                    <Award className="w-5 h-5 text-cyan-400" />
                    <span>Overall Performance Score</span>
                  </h2>
                  <div className="text-xs text-gray-400">
                    Updated: {new Date(performanceAnalysis.lastUpdated).toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className={'text-6xl font-bold ' + getPerformanceColor(performanceAnalysis.performanceScore) + ' ' + getPerformanceGlow(performanceAnalysis.performanceScore)}>
                    {performanceAnalysis.performanceScore}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-gray-300">Performance Rating:</span>
                      <span className={'font-semibold ' + getPerformanceColor(performanceAnalysis.performanceScore)}>
                        {performanceAnalysis.performanceScore >= 85 ? 'Excellent' : 
                         performanceAnalysis.performanceScore >= 70 ? 'Good' : 'Needs Improvement'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div 
                        className={'h-3 rounded-full transition-all duration-500 ' + (
                          performanceAnalysis.performanceScore >= 85 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                          performanceAnalysis.performanceScore >= 70 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                          'bg-gradient-to-r from-red-400 to-red-600'
                        )}
                        style={{ width: performanceAnalysis.performanceScore + '%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-futuristic p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  <span>AI Analysis Summary</span>
                </h3>
                <div className="glass p-4 rounded-lg">
                  <p className="text-gray-300 leading-relaxed">
                    {performanceAnalysis.analysis.summary}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="card-futuristic p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    <span>Recent Anomalies</span>
                  </h3>
                  <div className="space-y-3">
                    {performanceAnalysis.analysis.anomalies.map((anomaly, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 glass rounded-lg">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 animate-pulse"></div>
                        <p className="text-gray-300 text-sm leading-relaxed">{anomaly}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card-futuristic p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    <span>Future Predictions</span>
                  </h3>
                  <div className="space-y-3">
                    {performanceAnalysis.analysis.predictions.map((prediction, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 glass rounded-lg">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 animate-pulse glow"></div>
                        <p className="text-gray-300 text-sm leading-relaxed">{prediction}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card-futuristic p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span>Recommendations</span>
                  </h3>
                  <div className="space-y-3">
                    {performanceAnalysis.analysis.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 glass rounded-lg">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 animate-pulse glow-green"></div>
                        <p className="text-gray-300 text-sm leading-relaxed">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      )}

      {!selectedVehicle && (
        <div className="card-futuristic p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-gray-700 to-gray-600 flex items-center justify-center">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Select a Vehicle to Begin Analysis
          </h3>
          <p className="text-gray-400">
            Choose a vehicle from the dropdown above to view AI-powered performance insights,
            predictive maintenance recommendations, and detailed analytics.
          </p>
        </div>
      )}
    </div>
  );
};

export default IndividualPerformance;
