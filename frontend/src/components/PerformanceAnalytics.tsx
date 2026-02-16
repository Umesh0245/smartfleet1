import { useState } from 'react';
import { 
  TrendingUp, TrendingDown, BarChart3, PieChart, 
  Download, RefreshCw, AlertTriangle,
  CheckCircle, Clock, Fuel, Gauge, Thermometer,
  Activity, Zap, Target
} from 'lucide-react';
import { FleetMetrics, VehicleTelemetry } from '../api/fleetApi';

interface PerformanceAnalyticsProps {
  metrics: FleetMetrics | null;
  telemetryData: VehicleTelemetry[];
  isLoading: boolean;
  onRefresh: () => void;
}

const PerformanceAnalytics = ({ 
  metrics, 
  telemetryData, 
  isLoading, 
  onRefresh 
}: PerformanceAnalyticsProps) => {
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [activeChart, setActiveChart] = useState<'performance' | 'efficiency' | 'alerts'>('performance');

  // Calculate performance metrics
  const performanceMetrics = {
    avgSpeed: telemetryData.reduce((sum, t) => sum + (t.signals.speed || 0), 0) / (telemetryData.length || 1),
    avgFuel: telemetryData.reduce((sum, t) => sum + (t.signals.fuel || 0), 0) / (telemetryData.length || 1),
    avgEngineTemp: telemetryData.reduce((sum, t) => sum + (t.signals.engineTemp || 0), 0) / (telemetryData.length || 1),
    activeVehicles: telemetryData.filter(t => t.status.isActive).length,
    totalVehicles: telemetryData.length,
    uptime: ((telemetryData.filter(t => t.status.isActive).length / (telemetryData.length || 1)) * 100)
  };

  // Performance indicators
  const performanceIndicators = [
    {
      title: 'Fleet Uptime',
      value: `${performanceMetrics.uptime.toFixed(1)}%`,
      change: '+2.5%',
      trend: 'up',
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Average Speed',
      value: `${performanceMetrics.avgSpeed.toFixed(1)} km/h`,
      change: '+5.2%',
      trend: 'up',
      icon: Gauge,
      color: 'blue'
    },
    {
      title: 'Fuel Efficiency',
      value: `${(100 - performanceMetrics.avgFuel).toFixed(1)}L/100km`,
      change: '-1.8%',
      trend: 'down',
      icon: Fuel,
      color: 'yellow'
    },
    {
      title: 'Engine Performance',
      value: `${performanceMetrics.avgEngineTemp.toFixed(0)}°C`,
      change: '+0.5%',
      trend: 'up',
      icon: Thermometer,
      color: 'red'
    }
  ];

  // Vehicle performance ranking
  const vehiclePerformance = telemetryData
    .map(vehicle => ({
      vehicleId: vehicle.vehicleId,
      score: (
        ((vehicle.signals.speed || 0) / 100) * 0.3 +
        ((vehicle.signals.fuel || 0) / 100) * 0.3 +
        (((100 - (vehicle.signals.engineTemp || 90)) / 10)) * 0.2 +
        (vehicle.status.isActive ? 1 : 0) * 0.2
      ) * 100,
      speed: vehicle.signals.speed || 0,
      fuel: vehicle.signals.fuel || 0,
      status: vehicle.status.isActive ? 'Active' : 'Inactive'
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  const exportReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      timeRange,
      metrics: performanceMetrics,
      vehiclePerformance,
      summary: {
        totalVehicles: performanceMetrics.totalVehicles,
        activeVehicles: performanceMetrics.activeVehicles,
        fleetUptime: performanceMetrics.uptime,
        averageSpeed: performanceMetrics.avgSpeed,
        fuelEfficiency: 100 - performanceMetrics.avgFuel
      }
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fleet_performance_report_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 relative z-10">
      {/* Enhanced Professional Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/90 via-black/90 to-slate-900/90 backdrop-blur-2xl border-2 border-cyan-500/30 shadow-2xl p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 animate-pulse"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center space-x-6">
            <div className="p-4 bg-cyan-500/20 rounded-2xl border border-cyan-500/30">
              <BarChart3 className="w-10 h-10 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent font-serif">
                Neural Performance Analytics
              </h2>
              <p className="text-cyan-300/80 text-lg font-medium">Quantum-enhanced fleet intelligence and predictive insights</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-300 font-semibold">REAL-TIME</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-cyan-300 font-semibold">AI-POWERED</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-4 py-3 bg-black/40 backdrop-blur-sm border-2 border-cyan-500/30 rounded-xl text-cyan-300 focus:ring-4 focus:ring-cyan-500/20 focus:border-cyan-400 hover:border-cyan-400/50 transition-all duration-300 font-medium"
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center space-x-3 px-4 py-3 bg-cyan-500/20 border-2 border-cyan-500/30 rounded-xl text-cyan-300 hover:bg-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300 disabled:opacity-50 font-semibold"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Neural Sync</span>
            </button>
            
            <button
              onClick={exportReport}
              className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 border-2 border-purple-500/30 rounded-xl text-purple-300 hover:from-purple-500/30 hover:via-blue-500/30 hover:to-cyan-500/30 hover:border-purple-400/50 transition-all duration-300 font-semibold"
            >
              <Download className="w-5 h-5" />
              <span>Export Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceIndicators.map((indicator, index) => {
          const Icon = indicator.icon;
          const trendIcon = indicator.trend === 'up' ? TrendingUp : TrendingDown;
          const TrendIcon = trendIcon;
          
          return (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  indicator.color === 'green' ? 'bg-green-100' :
                  indicator.color === 'blue' ? 'bg-blue-100' :
                  indicator.color === 'yellow' ? 'bg-yellow-100' :
                  'bg-red-100'
                }`}>
                  <Icon className={`w-5 h-5 ${
                    indicator.color === 'green' ? 'text-green-600' :
                    indicator.color === 'blue' ? 'text-blue-600' :
                    indicator.color === 'yellow' ? 'text-yellow-600' :
                    'text-red-600'
                  }`} />
                </div>
                <div className={`flex items-center space-x-1 text-sm ${
                  indicator.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendIcon className="w-3 h-3" />
                  <span>{indicator.change}</span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">{indicator.title}</h3>
                <p className="text-2xl font-bold text-gray-900">{indicator.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'performance', label: 'Performance Overview', icon: BarChart3 },
              { id: 'efficiency', label: 'Efficiency Metrics', icon: Target },
              { id: 'alerts', label: 'Alert Analysis', icon: AlertTriangle }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveChart(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                    activeChart === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-8">
          {activeChart === 'performance' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent font-serif">
                  Fleet Performance Neural Network
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-300 font-semibold">LIVE ANALYTICS</span>
                </div>
              </div>
              
              {/* Enhanced Performance Visualization */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/60 via-black/60 to-slate-800/60 backdrop-blur-xl border-2 border-cyan-500/20 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 animate-pulse"></div>
                
                <div className="relative z-10 p-8">
                  {/* Performance Metrics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-6 rounded-2xl border border-cyan-500/20">
                      <div className="flex items-center justify-between mb-4">
                        <Gauge className="w-8 h-8 text-cyan-400" />
                        <span className="text-xs text-cyan-300 font-mono">VELOCITY.AVG</span>
                      </div>
                      <div className="text-3xl font-black text-white mb-2">
                        {performanceMetrics.avgSpeed.toFixed(1)}
                        <span className="text-lg text-cyan-300 ml-1">km/h</span>
                      </div>
                      <div className="w-full bg-cyan-500/20 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${Math.min((performanceMetrics.avgSpeed / 100) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-6 rounded-2xl border border-green-500/20">
                      <div className="flex items-center justify-between mb-4">
                        <Fuel className="w-8 h-8 text-green-400" />
                        <span className="text-xs text-green-300 font-mono">FUEL.EFF</span>
                      </div>
                      <div className="text-3xl font-black text-white mb-2">
                        {performanceMetrics.avgFuel.toFixed(1)}
                        <span className="text-lg text-green-300 ml-1">%</span>
                      </div>
                      <div className="w-full bg-green-500/20 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${performanceMetrics.avgFuel}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 p-6 rounded-2xl border border-orange-500/20">
                      <div className="flex items-center justify-between mb-4">
                        <Thermometer className="w-8 h-8 text-orange-400" />
                        <span className="text-xs text-orange-300 font-mono">TEMP.AVG</span>
                      </div>
                      <div className="text-3xl font-black text-white mb-2">
                        {performanceMetrics.avgEngineTemp.toFixed(1)}
                        <span className="text-lg text-orange-300 ml-1">°C</span>
                      </div>
                      <div className="w-full bg-orange-500/20 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${Math.min((performanceMetrics.avgEngineTemp / 120) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Real-time Performance Graph Simulation */}
                  <div className="bg-black/40 p-6 rounded-2xl border border-cyan-500/20">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-lg font-bold text-cyan-300 font-serif">Neural Performance Matrix</h4>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                          <span className="text-xs text-cyan-300">Speed</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                          <span className="text-xs text-green-300">Efficiency</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                          <span className="text-xs text-orange-300">Temperature</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="h-48 flex items-end justify-between space-x-2">
                      {telemetryData.slice(0, 12).map((vehicle, index) => (
                        <div key={vehicle.vehicleId} className="flex-1 flex flex-col items-center space-y-2">
                          <div className="flex flex-col space-y-1 w-full">
                            <div 
                              className="bg-gradient-to-t from-cyan-500 to-cyan-300 rounded-t-lg transition-all duration-1000 hover:from-cyan-400 hover:to-cyan-200"
                              style={{ 
                                height: `${Math.max((vehicle.signals.speed || 0) * 2, 8)}px`,
                                minHeight: '8px'
                              }}
                            ></div>
                            <div 
                              className="bg-gradient-to-t from-green-500 to-green-300 rounded-t-lg transition-all duration-1000 hover:from-green-400 hover:to-green-200"
                              style={{ 
                                height: `${Math.max((vehicle.signals.fuel || 0) * 1.5, 8)}px`,
                                minHeight: '8px'
                              }}
                            ></div>
                            <div 
                              className="bg-gradient-to-t from-orange-500 to-orange-300 rounded-t-lg transition-all duration-1000 hover:from-orange-400 hover:to-orange-200"
                              style={{ 
                                height: `${Math.max((vehicle.signals.engineTemp || 0) * 1.2, 8)}px`,
                                minHeight: '8px'
                              }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-400 font-mono transform rotate-45 origin-left">
                            {vehicle.vehicleId.replace('TRUCK-', 'T')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Elite Performance Ranking */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/60 via-black/60 to-slate-800/60 backdrop-blur-xl border-2 border-purple-500/20 shadow-2xl p-8">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 animate-pulse"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-purple-500/20 rounded-2xl border border-purple-500/30">
                        <Target className="w-8 h-8 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent font-serif">
                          Elite Performance Ranking
                        </h4>
                        <p className="text-purple-300/80 font-medium">Quantum-analyzed performance champions</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-purple-300 font-semibold">NEURAL RANKED</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {vehiclePerformance.slice(0, 5).map((vehicle, index) => (
                      <div key={vehicle.vehicleId} className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800/60 via-black/40 to-slate-800/60 backdrop-blur-sm border-2 border-purple-500/20 hover:border-purple-400/50 transition-all duration-500 hover:scale-102 hover:shadow-2xl p-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        <div className="relative z-10 flex items-center justify-between">
                          <div className="flex items-center space-x-6">
                            {/* Enhanced Ranking Badge */}
                            <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black border-2 transition-all duration-500 ${
                              index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-300 text-yellow-900 border-yellow-400/50 shadow-glow' :
                              index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-200 text-gray-800 border-gray-300/50' :
                              index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-300 text-orange-900 border-orange-400/50' :
                              'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border-cyan-500/30'
                            }`}>
                              {index === 0 && <div className="absolute inset-0 bg-yellow-400/20 rounded-2xl animate-pulse"></div>}
                              <span className="relative z-10">{index + 1}</span>
                            </div>
                            
                            {/* Vehicle Info */}
                            <div className="flex items-center space-x-4">
                              <div className="p-3 bg-cyan-500/20 rounded-xl border border-cyan-500/30">
                                <Activity className="w-6 h-6 text-cyan-400" />
                              </div>
                              <div>
                                <div className="flex items-center space-x-3">
                                  <span className="text-xl font-bold text-white font-serif">{vehicle.vehicleId}</span>
                                  {index === 0 && (
                                    <div className="px-3 py-1 bg-yellow-400/20 border border-yellow-400/50 rounded-full">
                                      <span className="text-xs font-bold text-yellow-300">👑 CHAMPION</span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center space-x-6 mt-2">
                                  <div className="flex items-center space-x-2">
                                    <Gauge className="w-4 h-4 text-cyan-400" />
                                    <span className="text-sm text-cyan-300 font-medium">{vehicle.speed}km/h</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Fuel className="w-4 h-4 text-green-400" />
                                    <span className="text-sm text-green-300 font-medium">{vehicle.fuel}%</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Zap className="w-4 h-4 text-purple-400" />
                                    <span className="text-sm text-purple-300 font-medium">Elite Status</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Performance Score */}
                          <div className="text-right">
                            <div className="relative">
                              <div className={`text-4xl font-black mb-2 ${
                                index === 0 ? 'text-yellow-300' :
                                index === 1 ? 'text-gray-300' :
                                index === 2 ? 'text-orange-300' :
                                'text-cyan-300'
                              }`}>
                                {vehicle.score.toFixed(1)}
                              </div>
                              {index === 0 && (
                                <div className="absolute inset-0 text-4xl font-black text-yellow-400/30 animate-pulse">
                                  {vehicle.score.toFixed(1)}
                                </div>
                              )}
                            </div>
                            <div className="text-sm font-bold text-gray-400 tracking-wide">NEURAL SCORE</div>
                            
                            {/* Performance Bar */}
                            <div className="w-24 bg-gray-700/50 rounded-full h-2 mt-3">
                              <div 
                                className={`h-2 rounded-full transition-all duration-1000 ${
                                  index === 0 ? 'bg-gradient-to-r from-yellow-500 to-yellow-300' :
                                  index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-300' :
                                  index === 2 ? 'bg-gradient-to-r from-orange-500 to-orange-300' :
                                  'bg-gradient-to-r from-cyan-500 to-purple-500'
                                }`}
                                style={{ width: `${Math.min((vehicle.score / 50) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Enhanced Status Indicator */}
                        <div className={`absolute bottom-0 left-0 w-full h-1 ${
                          index === 0 ? 'bg-gradient-to-r from-yellow-500/50 via-yellow-400 to-yellow-500/50' :
                          index === 1 ? 'bg-gradient-to-r from-gray-400/50 via-gray-300 to-gray-400/50' :
                          index === 2 ? 'bg-gradient-to-r from-orange-500/50 via-orange-400 to-orange-500/50' :
                          'bg-gradient-to-r from-cyan-500/50 via-purple-500 to-cyan-500/50'
                        }`}></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeChart === 'efficiency' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Efficiency Metrics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Fuel Efficiency Trend</h4>
                  <div className="h-32 bg-gray-50 rounded flex items-center justify-center">
                    <div className="text-center">
                      <PieChart className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                      <p className="text-sm text-gray-500">Fuel efficiency chart</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Route Optimization</h4>
                  <div className="h-32 bg-gray-50 rounded flex items-center justify-center">
                    <div className="text-center">
                      <Activity className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                      <p className="text-sm text-gray-500">Route efficiency data</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Zap className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">
                    {((100 - performanceMetrics.avgFuel) * 0.8).toFixed(1)}L
                  </div>
                  <div className="text-sm text-gray-600">Avg Fuel Consumption</div>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">
                    {(performanceMetrics.avgSpeed * 0.6).toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-600">Avg Trip Time (min)</div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">92%</div>
                  <div className="text-sm text-gray-600">Route Efficiency</div>
                </div>
              </div>
            </div>
          )}

          {activeChart === 'alerts' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Alert Analysis</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-red-900">Critical Alerts</span>
                  </div>
                  <div className="text-2xl font-bold text-red-600">
                    {telemetryData.filter(t => (t.signals.engineTemp || 0) > 95 || (t.signals.fuel || 0) < 10).length}
                  </div>
                </div>
                
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium text-yellow-900">Maintenance Due</span>
                  </div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {Math.floor(telemetryData.length * 0.15)}
                  </div>
                </div>
                
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-900">Healthy Vehicles</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {telemetryData.filter(t => t.status.isActive && (t.signals.fuel || 0) > 20).length}
                  </div>
                </div>
              </div>

              {/* Recent Alerts */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Recent Alerts</h4>
                <div className="space-y-3">
                  {telemetryData.slice(0, 3).map((vehicle) => (
                    <div key={vehicle.vehicleId} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <div>
                          <span className="font-medium text-gray-900">{vehicle.vehicleId}</span>
                          <div className="text-sm text-gray-600">
                            {(vehicle.signals.fuel || 0) < 20 ? 'Low fuel warning' : 
                             (vehicle.signals.engineTemp || 0) > 90 ? 'High engine temperature' :
                             'Routine maintenance check'}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {Math.floor(Math.random() * 60)} min ago
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalytics;