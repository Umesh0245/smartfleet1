import { useState } from 'react';
import { 
  Plus, Edit, Trash2, Search, Filter, Car, 
  MapPin, Fuel, Gauge, Thermometer, Settings,
  CheckCircle, AlertTriangle, Clock, X
} from 'lucide-react';
import { FleetVehicle } from '../api/fleetApi';

interface VehicleManagementProps {
  vehicles: FleetVehicle[];
  onAddVehicle: (vehicle: Omit<FleetVehicle, 'vehicleId'>) => void;
  onUpdateVehicle: (vehicleId: string, updates: Partial<FleetVehicle>) => void;
  onDeleteVehicle: (vehicleId: string) => void;
}

const VehicleManagement = ({ 
  vehicles, 
  onAddVehicle, 
  onUpdateVehicle, 
  onDeleteVehicle 
}: VehicleManagementProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'maintenance'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<FleetVehicle | null>(null);
  const [newVehicle, setNewVehicle] = useState({
    gpsId: '',
    iotDeviceId: '',
    driverName: '',
    registrationNumber: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    status: 'active' as const,
    location: '',
    speed: 0,
    fuel: 100,
    engineTemp: 90,
    rpm: 0,
    tirePressure: 32,
    lastUpdated: new Date().toISOString()
  });

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddVehicle = () => {
    onAddVehicle(newVehicle);
    setNewVehicle({
      gpsId: '',
      iotDeviceId: '',
      driverName: '',
      registrationNumber: '',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      status: 'active',
      location: '',
      speed: 0,
      fuel: 100,
      engineTemp: 90,
      rpm: 0,
      tirePressure: 32,
      lastUpdated: new Date().toISOString()
    });
    setShowAddModal(false);
  };

  const handleUpdateVehicle = () => {
    if (editingVehicle) {
      onUpdateVehicle(editingVehicle.vehicleId, editingVehicle);
      setEditingVehicle(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'maintenance':
        return <Settings className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-gray-600">Manage your fleet vehicles and their status</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Vehicle</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search vehicles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle) => (
          <div key={vehicle.vehicleId} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Car className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{vehicle.vehicleId}</h3>
                  <p className="text-sm text-gray-600">{vehicle.make} {vehicle.model}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setEditingVehicle(vehicle)}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteVehicle(vehicle.vehicleId)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
                {getStatusIcon(vehicle.status)}
                <span className="capitalize">{vehicle.status}</span>
              </span>
              <span className="text-xs text-gray-500">Year {vehicle.year}</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm bg-blue-50 px-3 py-2 rounded-lg">
                <div className="flex items-center space-x-2 text-blue-700">
                  <MapPin className="w-4 h-4" />
                  <span className="font-medium">Location</span>
                </div>
                <span className="font-bold text-blue-900">{vehicle.location || 'Unknown'}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between bg-gray-50 px-2 py-1 rounded">
                  <div className="flex items-center space-x-1">
                    <Gauge className="w-3 h-3 text-blue-600" />
                    <span className="text-xs font-medium text-gray-700">Speed</span>
                  </div>
                  <span className="text-xs font-bold text-gray-900">{vehicle.speed} km/h</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 px-2 py-1 rounded">
                  <div className="flex items-center space-x-1">
                    <Fuel className="w-3 h-3 text-green-600" />
                    <span className="text-xs font-medium text-gray-700">Fuel</span>
                  </div>
                  <span className="text-xs font-bold text-gray-900">{vehicle.fuel}%</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 px-2 py-1 rounded">
                  <div className="flex items-center space-x-1">
                    <Thermometer className="w-3 h-3 text-red-600" />
                    <span className="text-xs font-medium text-gray-700">Engine</span>
                  </div>
                  <span className="text-xs font-bold text-gray-900">{vehicle.engineTemp}°C</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 px-2 py-1 rounded">
                  <div className="flex items-center space-x-1">
                    <Settings className="w-3 h-3 text-gray-600" />
                    <span className="text-xs font-medium text-gray-700">RPM</span>
                  </div>
                  <span className="text-xs font-bold text-gray-900">{vehicle.rpm}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVehicles.length === 0 && (
        <div className="text-center py-12">
          <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No vehicles found matching your criteria</p>
        </div>
      )}

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Vehicle</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                  <input
                    type="text"
                    value={newVehicle.registrationNumber}
                    onChange={(e) => setNewVehicle({...newVehicle, registrationNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="FL-001"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Driver Name</label>
                  <input
                    type="text"
                    value={newVehicle.driverName}
                    onChange={(e) => setNewVehicle({...newVehicle, driverName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Smith"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">IoT Device ID</label>
                  <input
                    type="text"
                    value={newVehicle.iotDeviceId}
                    onChange={(e) => setNewVehicle({...newVehicle, iotDeviceId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="IOT-ABC123"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input
                    type="number"
                    value={newVehicle.year}
                    onChange={(e) => setNewVehicle({...newVehicle, year: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1990"
                    max="2030"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={newVehicle.status}
                    onChange={(e) => setNewVehicle({...newVehicle, status: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={newVehicle.location}
                  onChange={(e) => setNewVehicle({...newVehicle, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="New York, NY"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddVehicle}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Vehicle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Vehicle Modal */}
      {editingVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Vehicle</h3>
              <button
                onClick={() => setEditingVehicle(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editingVehicle.status}
                  onChange={(e) => setEditingVehicle({
                    ...editingVehicle,
                    status: e.target.value as any
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={editingVehicle.location}
                  onChange={(e) => setEditingVehicle({
                    ...editingVehicle,
                    location: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingVehicle(null)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateVehicle}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Vehicle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;