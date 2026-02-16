import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, CheckCircle, Clock, 
  Truck, Car, Fuel, Filter,
  MapPin, Navigation, Target,
  Satellite, Map, Layers, RefreshCw
} from 'lucide-react';

interface VehicleLocation {
  id: string;
  name: string;
  type: 'truck' | 'van' | 'car';
  status: 'active' | 'idle' | 'maintenance' | 'offline';
  speed: number;
  fuel: number;
  driver: string;
  lastUpdate: string;
  alerts: number;
}

const LiveFleetMap: React.FC = () => {
  const [vehicles, setVehicles] = useState<VehicleLocation[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleLocation | null>(null);
  const [mapView, setMapView] = useState<'satellite' | 'street' | 'hybrid'>('street');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const mockVehicles: VehicleLocation[] = [
      {
        id: 'TRUCK-001',
        name: 'Logistics Truck 1',
        type: 'truck',
        status: 'active',
        speed: 45,
        fuel: 78,
        driver: 'John Smith',
        lastUpdate: '2 minutes ago',
        alerts: 0
      },
      {
        id: 'TRUCK-002',
        name: 'Delivery Van 2',
        type: 'van',
        status: 'idle',
        speed: 0,
        fuel: 45,
        driver: 'Sarah Johnson',
        lastUpdate: '5 minutes ago',
        alerts: 1
      }
    ];

    setTimeout(() => {
      setVehicles(mockVehicles);
      setIsLoading(false);
    }, 1500);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'maintenance': return 'bg-orange-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredVehicles = filterStatus === 'all' 
    ? vehicles 
    : vehicles.filter(v => v.status === filterStatus);

  if (isLoading) {
    return (
      <div className="card-futuristic p-8 min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        <div className="flex flex-col items-center justify-center space-y-6 h-96">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center animate-pulse-glow">
            <Satellite className="w-10 h-10 text-white animate-spin-slow" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-white">Initializing Fleet Map</h3>
            <p className="text-gray-400">Connecting to satellite network...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 glow animate-pulse-glow">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gradient">Live Fleet Map</h1>
              <p className="text-gray-400 text-lg">Real-time quantum vehicle tracking system</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="glass px-4 py-2 rounded-lg flex items-center space-x-2 neon-border">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse glow-green"></div>
              <span className="text-green-400 font-medium">QUANTUM LINK ACTIVE</span>
            </div>
            <button className="p-2 glass rounded-lg hover:neon-border transition-all">
              <RefreshCw className="w-5 h-5 text-cyan-400" />
            </button>
          </div>
        </div>
        <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mt-4"></div>
      </div>

      <div className="card-futuristic neon-border overflow-hidden">
        <div className="glass p-4 border-b border-cyan-400/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Navigation className="w-5 h-5 text-cyan-400" />
                <span className="text-white font-medium">Neural Navigation</span>
              </div>
              <div className="flex space-x-1">
                {['street', 'satellite', 'hybrid'].map((view) => (
                  <button
                    key={view}
                    onClick={() => setMapView(view as any)}
                    className={'px-4 py-2 rounded-lg text-sm transition-all ' + (
                      mapView === view 
                        ? 'bg-cyan-400/20 text-cyan-400 neon-border' 
                        : 'text-gray-400 hover:text-cyan-400'
                    )}
                  >
                    {view === 'street' && <Map className="w-4 h-4 inline-block mr-1" />}
                    {view === 'satellite' && <Satellite className="w-4 h-4 inline-block mr-1" />}
                    {view === 'hybrid' && <Layers className="w-4 h-4 inline-block mr-1" />}
                    {view.charAt(0).toUpperCase() + view.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <Target className="w-4 h-4" />
              <span>Tracking {vehicles.length} units</span>
            </div>
          </div>
        </div>

        <div className="flex h-[600px]">
          <div className="flex-1 relative bg-gradient-to-br from-slate-900 via-gray-900 to-black border-r border-cyan-400/30">
            <div className="absolute top-4 left-4 z-10">
              <div className="glass p-3 rounded-lg neon-border-purple min-w-48">
                <div className="flex items-center space-x-2 mb-3">
                  <Filter className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-medium text-white">Neural Filter</span>
                </div>
                <div className="space-y-2">
                  {['all', 'active', 'idle', 'maintenance', 'offline'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={'w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between transition-all ' + (
                        filterStatus === status 
                          ? 'bg-cyan-400/20 text-cyan-400 neon-border' 
                          : 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/10'
                      )}
                    >
                      <span className="capitalize">{status}</span>
                      <span className="bg-gray-700/50 text-gray-300 px-2 py-0.5 rounded-full text-xs glow">
                        {status === 'all' ? vehicles.length : vehicles.filter(v => v.status === status).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full h-full relative overflow-hidden">
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'linear-gradient(rgba(34, 211, 238, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.3) 1px, transparent 1px)',
                  backgroundSize: '40px 40px'
                }}
              />

              {filteredVehicles.map((vehicle, index) => (
                <div
                  key={vehicle.id}
                  className={'absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110 ' + (
                    selectedVehicle?.id === vehicle.id ? 'z-20' : 'z-10'
                  )}
                  style={{
                    left: (20 + (index * 15) % 60) + '%',
                    top: (20 + (index * 20) % 60) + '%'
                  }}
                  onClick={() => setSelectedVehicle(vehicle)}
                >
                  <div className={'relative glass rounded-full p-3 shadow-lg border-2 ' + (
                    selectedVehicle?.id === vehicle.id ? 'border-cyan-400 neon-border' : 'border-gray-600'
                  )}>
                    <div className="text-white">
                      {vehicle.type === 'truck' ? <Truck className="w-5 h-5" /> : <Car className="w-5 h-5" />}
                    </div>
                    
                    <div className={'absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ' + getStatusColor(vehicle.status)}>
                      {vehicle.alerts > 0 && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">{vehicle.alerts}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedVehicle?.id === vehicle.id && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 glass rounded-lg shadow-xl border border-cyan-400/30 p-4 min-w-64 z-30">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {vehicle.type === 'truck' ? <Truck className="w-5 h-5" /> : <Car className="w-5 h-5" />}
                          <div>
                            <h4 className="font-semibold text-white">{vehicle.name}</h4>
                            <p className="text-sm text-gray-400">{vehicle.id}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedVehicle(null)}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          ×
                        </button>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Status:</span>
                          <span className={'capitalize ' + (
                            vehicle.status === 'active' ? 'text-green-400' :
                            vehicle.status === 'idle' ? 'text-yellow-400' :
                            'text-red-400'
                          )}>
                            {vehicle.status}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Driver:</span>
                          <span className="font-medium text-white">{vehicle.driver}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Speed:</span>
                          <span className="font-medium text-cyan-400">{vehicle.speed} mph</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Fuel:</span>
                          <div className="flex items-center space-x-1">
                            <Fuel className="w-4 h-4 text-blue-400" />
                            <span className="font-medium text-white">{vehicle.fuel.toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="w-80 bg-gradient-to-b from-slate-900 to-gray-900 border-l border-cyan-400/30 overflow-y-auto">
            <div className="p-4 border-b border-cyan-400/30">
              <h3 className="font-semibold text-white mb-3">Fleet Status Overview</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="glass p-3 rounded-lg neon-border-green">
                  <div className="flex items-center justify-between">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-2xl font-bold text-green-400">
                      {vehicles.filter(v => v.status === 'active').length}
                    </span>
                  </div>
                  <p className="text-sm text-green-300 mt-1">Active</p>
                </div>
                <div className="glass p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <Clock className="w-5 h-5 text-yellow-400" />
                    <span className="text-2xl font-bold text-yellow-400">
                      {vehicles.filter(v => v.status === 'idle').length}
                    </span>
                  </div>
                  <p className="text-sm text-yellow-300 mt-1">Idle</p>
                </div>
              </div>
            </div>

            <div className="p-4">
              <h4 className="font-medium text-white mb-3">Vehicle List</h4>
              <div className="space-y-2">
                {filteredVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className={'p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ' + (
                      selectedVehicle?.id === vehicle.id 
                        ? 'glass neon-border' 
                        : 'glass border-gray-600/50 hover:border-cyan-400/50'
                    )}
                    onClick={() => setSelectedVehicle(vehicle)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {vehicle.type === 'truck' ? <Truck className="w-4 h-4" /> : <Car className="w-4 h-4" />}
                        <div>
                          <p className="font-medium text-white text-sm">{vehicle.name}</p>
                          <p className="text-xs text-gray-400">{vehicle.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {vehicle.status === 'active' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Clock className="w-4 h-4 text-yellow-400" />}
                        {vehicle.alerts > 0 && (
                          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">{vehicle.alerts}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{vehicle.driver}</span>
                      <span className="text-cyan-400">{vehicle.speed} mph</span>
                    </div>
                    
                    <div className="mt-2 flex items-center space-x-4 text-xs">
                      <div className="flex items-center space-x-1">
                        <Fuel className="w-3 h-3 text-blue-400" />
                        <span className="text-gray-300">{vehicle.fuel.toFixed(0)}%</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-400">{vehicle.lastUpdate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveFleetMap;
