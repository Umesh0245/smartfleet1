import React, { useState, useEffect } from 'react';
import { 
  Activity, Zap, Thermometer, Gauge, Fuel, AlertTriangle, 
  TrendingUp, RefreshCw, Play, Pause, Settings,
  BarChart3, LineChart, Monitor, Wifi, WifiOff, CheckCircle
} from 'lucide-react';

interface RealtimeData {
  vehicleId: string;
  vehicleName: string;
  timestamp: number;
  metrics: {
    speed: number;
    fuelLevel: number;
    engineTemp: number;
    rpm: number;
    batteryVoltage: number;
    oilPressure: number;
    coolantTemp: number;
    gpsSignal: number;
  };
  location: {
    latitude: number;
    longitude: number;
    altitude: number;
  };
  status: 'active' | 'idle' | 'maintenance' | 'offline';
  alerts: Array<{
    type: 'warning' | 'critical' | 'info';
    message: string;
    value?: number;
    threshold?: number;
  }>;
}

const RealtimeMonitoring: React.FC = () => {
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>(['TRUCK-001', 'TRUCK-002']);
  const [realtimeData, setRealtimeData] = useState<RealtimeData[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [refreshRate, setRefreshRate] = useState(2000); // 2 seconds
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'reconnecting'>('connected');

  const vehicles = [
    { id: 'TRUCK-001', name: 'Logistics Truck 1' },
    { id: 'TRUCK-002', name: 'Delivery Van 2' },
    { id: 'TRUCK-003', name: 'Service Car 3' },
    { id: 'TRUCK-004', name: 'Cargo Truck 4' },
    { id: 'TRUCK-005', name: 'Express Van 5' }
  ];

  useEffect(() => {
    if (!isLive) return;

    const generateRealtimeData = (): RealtimeData[] => {
      return selectedVehicles.map(vehicleId => {
        const vehicle = vehicles.find(v => v.id === vehicleId);
        const baseSpeed = Math.random() * 60 + 20;
        const isMoving = Math.random() > 0.3;
        
        const metrics = {
          speed: isMoving ? baseSpeed : Math.random() * 5,
          fuelLevel: Math.max(0, Math.min(100, 80 - Math.random() * 40)),
          engineTemp: 80 + Math.random() * 40,
          rpm: isMoving ? 1200 + Math.random() * 1800 : 800 + Math.random() * 400,
          batteryVoltage: 12 + Math.random() * 2,
          oilPressure: 30 + Math.random() * 20,
          coolantTemp: 75 + Math.random() * 25,
          gpsSignal: 75 + Math.random() * 25
        };

        const alerts = [];
        if (metrics.engineTemp > 110) alerts.push({
          type: 'critical' as const,
          message: 'Engine temperature critical',
          value: metrics.engineTemp,
          threshold: 110
        });
        if (metrics.fuelLevel < 20) alerts.push({
          type: 'warning' as const,
          message: 'Low fuel level',
          value: metrics.fuelLevel,
          threshold: 20
        });
        if (metrics.oilPressure < 25) alerts.push({
          type: 'warning' as const,
          message: 'Low oil pressure',
          value: metrics.oilPressure,
          threshold: 25
        });

        return {
          vehicleId,
          vehicleName: vehicle?.name || vehicleId,
          timestamp: Date.now(),
          metrics,
          location: {
            latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
            longitude: -74.0060 + (Math.random() - 0.5) * 0.1,
            altitude: 10 + Math.random() * 50
          },
          status: isMoving ? 'active' : (Math.random() > 0.7 ? 'idle' : 'active'),
          alerts
        } as RealtimeData;
      });
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.05) { // 95% success rate
        setRealtimeData(generateRealtimeData());
        setLastUpdate(new Date());
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('reconnecting');
        setTimeout(() => setConnectionStatus('connected'), 1000);
      }
    }, refreshRate);

    // Initial data
    setRealtimeData(generateRealtimeData());

    return () => clearInterval(interval);
  }, [selectedVehicles, isLive, refreshRate]);

  const getMetricColor = (value: number, thresholds: { low: number; high: number }) => {
    if (value < thresholds.low || value > thresholds.high) return 'text-red-600 bg-red-50';
    if (value < thresholds.low * 1.2 || value > thresholds.high * 0.8) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'maintenance': return 'bg-orange-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Real-time Vehicle Monitoring</h2>
            <p className="text-gray-600">Live telemetry data and vehicle diagnostics</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-100 text-green-700' :
              connectionStatus === 'reconnecting' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {connectionStatus === 'connected' ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              <span className="text-sm capitalize">{connectionStatus}</span>
            </div>
            <button
              onClick={() => setIsLive(!isLive)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isLive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
              }`}
            >
              {isLive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isLive ? 'Live' : 'Paused'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Vehicle Selection */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Monitored Vehicles</label>
            <div className="flex flex-wrap gap-2">
              {vehicles.map(vehicle => (
                <button
                  key={vehicle.id}
                  onClick={() => {
                    setSelectedVehicles(prev => 
                      prev.includes(vehicle.id) 
                        ? prev.filter(id => id !== vehicle.id)
                        : [...prev, vehicle.id]
                    );
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedVehicles.includes(vehicle.id)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {vehicle.name}
                </button>
              ))}
            </div>
          </div>

          {/* Refresh Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Refresh Rate</label>
            <select
              value={refreshRate}
              onChange={(e) => setRefreshRate(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={1000}>1 second</option>
              <option value={2000}>2 seconds</option>
              <option value={5000}>5 seconds</option>
              <option value={10000}>10 seconds</option>
            </select>
          </div>

          {/* Last Update */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Update</label>
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
              <RefreshCw className={`w-4 h-4 text-gray-500 ${isLive ? 'animate-spin' : ''}`} />
              <span className="text-sm text-gray-700">{lastUpdate.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Data Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {realtimeData.map((vehicle) => (
          <div key={vehicle.vehicleId} className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Vehicle Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{vehicle.vehicleName}</h3>
                  <p className="text-blue-100 text-sm">{vehicle.vehicleId}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(vehicle.status)}`}></div>
                  <span className="text-sm capitalize">{vehicle.status}</span>
                  <span className="text-xs text-blue-100">{formatTimestamp(vehicle.timestamp)}</span>
                </div>
              </div>
            </div>

            {/* Alerts */}
            {vehicle.alerts.length > 0 && (
              <div className="p-4 bg-red-50 border-b">
                <h4 className="font-medium text-red-800 mb-2 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Active Alerts ({vehicle.alerts.length})
                </h4>
                <div className="space-y-1">
                  {vehicle.alerts.map((alert, index) => (
                    <div key={index} className={`text-sm p-2 rounded ${
                      alert.type === 'critical' ? 'bg-red-100 text-red-800' :
                      alert.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {alert.message}
                      {alert.value && alert.threshold && (
                        <span className="ml-2 font-mono">
                          ({alert.value.toFixed(1)} / {alert.threshold})
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metrics Grid */}
            <div className="p-4">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Speed */}
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <Gauge className="w-5 h-5 text-blue-600" />
                    <span className="text-2xl font-bold text-blue-700">
                      {vehicle.metrics.speed.toFixed(0)}
                    </span>
                  </div>
                  <p className="text-sm text-blue-600">Speed (mph)</p>
                  <div className="mt-2 flex items-center space-x-1">
                    {vehicle.metrics.speed > 0 ? (
                      <TrendingUp className="w-3 h-3 text-green-500" />
                    ) : (
                      <div className="w-3 h-3 border-b border-gray-400" />
                    )}
                    <span className="text-xs text-gray-600">Real-time</span>
                  </div>
                </div>

                {/* Fuel Level */}
                <div className={`p-3 rounded-lg ${getMetricColor(vehicle.metrics.fuelLevel, { low: 20, high: 100 })}`}>
                  <div className="flex items-center justify-between mb-1">
                    <Fuel className="w-5 h-5" />
                    <span className="text-2xl font-bold">
                      {vehicle.metrics.fuelLevel.toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-sm">Fuel Level</p>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                    <div 
                      className={`h-1 rounded-full transition-all ${
                        vehicle.metrics.fuelLevel > 50 ? 'bg-green-500' : 
                        vehicle.metrics.fuelLevel > 20 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${vehicle.metrics.fuelLevel}%` }}
                    />
                  </div>
                </div>

                {/* Engine Temperature */}
                <div className={`p-3 rounded-lg ${getMetricColor(vehicle.metrics.engineTemp, { low: 60, high: 110 })}`}>
                  <div className="flex items-center justify-between mb-1">
                    <Thermometer className="w-5 h-5" />
                    <span className="text-2xl font-bold">
                      {vehicle.metrics.engineTemp.toFixed(0)}°F
                    </span>
                  </div>
                  <p className="text-sm">Engine Temp</p>
                  <div className="mt-2 flex items-center space-x-1">
                    {vehicle.metrics.engineTemp > 100 ? (
                      <TrendingUp className="w-3 h-3 text-red-500" />
                    ) : (
                      <CheckCircle className="w-3 h-3 text-green-500" />
                    )}
                    <span className="text-xs">
                      {vehicle.metrics.engineTemp > 100 ? 'High' : 'Normal'}
                    </span>
                  </div>
                </div>

                {/* RPM */}
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <Activity className="w-5 h-5 text-purple-600" />
                    <span className="text-2xl font-bold text-purple-700">
                      {vehicle.metrics.rpm.toFixed(0)}
                    </span>
                  </div>
                  <p className="text-sm text-purple-600">RPM</p>
                  <div className="mt-2 text-xs text-gray-600">
                    {vehicle.metrics.rpm > 2000 ? 'High' : 
                     vehicle.metrics.rpm > 1000 ? 'Normal' : 'Idle'}
                  </div>
                </div>

                {/* Battery Voltage */}
                <div className={`p-3 rounded-lg ${getMetricColor(vehicle.metrics.batteryVoltage, { low: 11.5, high: 14.5 })}`}>
                  <div className="flex items-center justify-between mb-1">
                    <Zap className="w-5 h-5" />
                    <span className="text-2xl font-bold">
                      {vehicle.metrics.batteryVoltage.toFixed(1)}V
                    </span>
                  </div>
                  <p className="text-sm">Battery</p>
                  <div className="mt-2 text-xs">
                    {vehicle.metrics.batteryVoltage > 12.5 ? 'Good' : 'Low'}
                  </div>
                </div>

                {/* Oil Pressure */}
                <div className={`p-3 rounded-lg ${getMetricColor(vehicle.metrics.oilPressure, { low: 25, high: 60 })}`}>
                  <div className="flex items-center justify-between mb-1">
                    <Gauge className="w-5 h-5" />
                    <span className="text-2xl font-bold">
                      {vehicle.metrics.oilPressure.toFixed(0)}
                    </span>
                  </div>
                  <p className="text-sm">Oil Pressure (PSI)</p>
                  <div className="mt-2 text-xs">
                    {vehicle.metrics.oilPressure > 30 ? 'Normal' : 'Low'}
                  </div>
                </div>
              </div>

              {/* Location Info */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Location & Connectivity</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Coordinates:</span>
                    <p className="font-mono">{vehicle.location.latitude.toFixed(4)}, {vehicle.location.longitude.toFixed(4)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">GPS Signal:</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{vehicle.metrics.gpsSignal.toFixed(0)}%</span>
                      <div className="w-12 bg-gray-200 rounded-full h-1">
                        <div 
                          className="h-1 bg-green-500 rounded-full"
                          style={{ width: `${vehicle.metrics.gpsSignal}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mini Chart */}
            <div className="p-4 border-t bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-800">Performance Trend</h4>
                <div className="flex space-x-2">
                  <LineChart className="w-4 h-4 text-blue-500" />
                  <BarChart3 className="w-4 h-4 text-purple-500" />
                </div>
              </div>
              <div className="h-16 bg-white rounded flex items-end justify-around p-2">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-blue-500 rounded-t"
                    style={{ 
                      height: `${Math.random() * 80 + 20}%`,
                      width: '8px'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* System Status */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <Monitor className="w-6 h-6 text-green-600" />
              <span className="text-2xl font-bold text-green-700">{realtimeData.length}</span>
            </div>
            <p className="text-sm text-green-600 mt-1">Active Connections</p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <Activity className="w-6 h-6 text-blue-600" />
              <span className="text-2xl font-bold text-blue-700">{refreshRate / 1000}s</span>
            </div>
            <p className="text-sm text-blue-600 mt-1">Update Interval</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <Settings className="w-6 h-6 text-purple-600" />
              <span className="text-2xl font-bold text-purple-700">
                {realtimeData.reduce((sum, v) => sum + v.alerts.length, 0)}
              </span>
            </div>
            <p className="text-sm text-purple-600 mt-1">Total Alerts</p>
          </div>
          
          <div className={`p-4 rounded-lg ${
            connectionStatus === 'connected' ? 'bg-green-50' : 'bg-red-50'
          }`}>
            <div className="flex items-center justify-between">
              {connectionStatus === 'connected' ? (
                <Wifi className="w-6 h-6 text-green-600" />
              ) : (
                <WifiOff className="w-6 h-6 text-red-600" />
              )}
              <span className={`text-2xl font-bold ${
                connectionStatus === 'connected' ? 'text-green-700' : 'text-red-700'
              }`}>
                {connectionStatus === 'connected' ? '100%' : '0%'}
              </span>
            </div>
            <p className={`text-sm mt-1 ${
              connectionStatus === 'connected' ? 'text-green-600' : 'text-red-600'
            }`}>
              Connection Quality
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtimeMonitoring;