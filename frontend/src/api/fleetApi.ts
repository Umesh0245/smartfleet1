// Frontend API integration with SmartFleet backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

export interface VehicleTelemetry {
  vehicleId: string;
  timestamp: string;
  specs: {
    make?: string;
    model?: string;
    year?: number;
    engineType?: string;
  };
  signals: {
    speed?: number;
    fuel?: number;
    engineTemp?: number;
    rpm?: number;
    tirePressure?: number;
  };
  status: {
    isActive?: boolean;
    lastUpdated?: string;
    location?: string;
  };
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  company: string;
  token?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  company: string;
  password: string;
}

export interface FleetVehicle {
  vehicleId: string;
  gpsId?: string;
  iotDeviceId?: string;
  driverName?: string;
  registrationNumber?: string;
  make: string;
  model: string;
  year: number;
  status: 'active' | 'inactive' | 'maintenance';
  location: string;
  speed: number;
  fuel: number;
  engineTemp: number;
  rpm: number;
  tirePressure: number;
  lastUpdated: string;
  fuelLevel?: number;
  engineHealth?: string;
}

export interface CreateVehicleRequest {
  vehicleId: string;
  gpsId: string;
  iotDeviceId: string;
  driverName: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  resetToken: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  email: string;
  currentPassword: string;
  newPassword: string;
}

export interface FleetMetrics {
  totalVehicles: number;
  activeVehicles: number;
  averageSpeed: number;
  averageFuel: number;
  totalDistanceToday: number;
  fuelEfficiency: number;
  fleetUptime: number;
  maintenanceAlerts: number;
}

class FleetApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.token = localStorage.getItem('authToken');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Authentication API endpoints
  async login(credentials: LoginRequest): Promise<AuthUser> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      const user = await response.json();
      this.token = user.token;
      localStorage.setItem('authToken', user.token);
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async signup(userData: SignupRequest): Promise<AuthUser> {
    try {
      console.log('Making signup request to:', `${this.baseUrl}/api/auth/signup`);
      console.log('Request data:', userData);
      
      const response = await fetch(`${this.baseUrl}/api/auth/signup`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(userData),
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Signup failed with response:', errorText);
        throw new Error(`Signup failed: ${response.status} - ${errorText}`);
      }
      
      const user = await response.json();
      console.log('Signup response:', user);
      this.token = user.token;
      localStorage.setItem('authToken', user.token);
      return user;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // Forgot Password API endpoints
  async forgotPassword(request: ForgotPasswordRequest): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/forgot-password`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(request),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send reset email');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  async resetPassword(request: ResetPasswordRequest): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/reset-password`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(request),
      });
      
      if (!response.ok) {
        throw new Error('Failed to reset password');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  async changePassword(request: ChangePasswordRequest): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/change-password`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(request),
      });
      
      if (!response.ok) {
        throw new Error('Failed to change password');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  // Vehicle Telemetry API endpoints
  async getAllVehicleTelemetry(): Promise<VehicleTelemetry[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/telemetry`, {
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const telemetryData = await response.json();
      const validatedData = Array.isArray(telemetryData) ? telemetryData : [];
      
      // Validate and clean telemetry data
      return validatedData.map(item => this.validateTelemetryData(item));
    } catch (error) {
      console.error('Error fetching telemetry data:', error);
      return [];
    }
  }

  async getVehicleTelemetry(vehicleId: string): Promise<VehicleTelemetry | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/telemetry/${vehicleId}`, {
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching telemetry for vehicle ${vehicleId}:`, error);
      return null;
    }
  }

  // Helper method to safely render location
  private renderLocationSafe(location: any): string {
    if (!location) return 'Unknown';
    if (typeof location === 'string') return location;
    if (typeof location === 'object' && location.latitude && location.longitude) {
      return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
    }
    return 'Unknown';
  }

  // Validate and clean telemetry data
  private validateTelemetryData(data: any): VehicleTelemetry {
    return {
      vehicleId: data.vehicleId || 'Unknown',
      timestamp: data.timestamp || new Date().toISOString(),
      specs: {
        make: data.specs?.make || 'Unknown',
        model: data.specs?.model || 'Unknown',
        year: data.specs?.year || 2020,
        engineType: data.specs?.engineType || 'Unknown'
      },
      signals: {
        speed: typeof data.signals?.speed === 'number' ? data.signals.speed : 0,
        fuel: typeof data.signals?.fuel === 'number' ? data.signals.fuel : 0,
        engineTemp: typeof data.signals?.engineTemp === 'number' ? data.signals.engineTemp : 0,
        rpm: typeof data.signals?.rpm === 'number' ? data.signals.rpm : 0,
        tirePressure: typeof data.signals?.tirePressure === 'number' ? data.signals.tirePressure : 0
      },
      status: {
        isActive: Boolean(data.status?.isActive),
        lastUpdated: data.status?.lastUpdated || new Date().toISOString(),
        location: this.renderLocationSafe(data.status?.location)
      }
    };
  }

  // Transform telemetry data to fleet vehicle format
  private transformTelemetryToVehicle(telemetry: VehicleTelemetry): FleetVehicle {
    // Handle location safely
    const location = this.renderLocationSafe(telemetry.status.location);
    
    return {
      vehicleId: telemetry.vehicleId,
      make: telemetry.specs.make || 'Unknown',
      model: telemetry.specs.model || 'Unknown',
      year: telemetry.specs.year || 2020,
      status: telemetry.status.isActive ? 'active' : 'inactive',
      location: location,
      speed: telemetry.signals.speed || 0,
      fuel: telemetry.signals.fuel || 0,
      engineTemp: telemetry.signals.engineTemp || 0,
      rpm: telemetry.signals.rpm || 0,
      tirePressure: telemetry.signals.tirePressure || 0,
      lastUpdated: telemetry.status.lastUpdated || telemetry.timestamp,
    };
  }

  async getAllVehicles(): Promise<FleetVehicle[]> {
    try {
      const telemetryData = await this.getAllVehicleTelemetry();
      return telemetryData.map(telemetry => this.transformTelemetryToVehicle(telemetry));
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      return [];
    }
  }

  async getFleetMetrics(): Promise<FleetMetrics> {
    try {
      const vehicles = await this.getAllVehicles();
      const activeVehicles = vehicles.filter(v => v.status === 'active');
      
      return {
        totalVehicles: vehicles.length,
        activeVehicles: activeVehicles.length,
        averageSpeed: activeVehicles.length > 0 
          ? activeVehicles.reduce((sum, v) => sum + v.speed, 0) / activeVehicles.length 
          : 0,
        averageFuel: vehicles.length > 0 
          ? vehicles.reduce((sum, v) => sum + v.fuel, 0) / vehicles.length 
          : 0,
        totalDistanceToday: Math.random() * 1000 + 500, // Mock data - implement actual calculation
        fuelEfficiency: Math.random() * 5 + 6, // Mock data - implement actual calculation
        fleetUptime: (activeVehicles.length / Math.max(vehicles.length, 1)) * 100,
        maintenanceAlerts: vehicles.filter(v => v.status === 'maintenance').length,
      };
    } catch (error) {
      console.error('Error calculating fleet metrics:', error);
      return {
        totalVehicles: 0,
        activeVehicles: 0,
        averageSpeed: 0,
        averageFuel: 0,
        totalDistanceToday: 0,
        fuelEfficiency: 0,
        fleetUptime: 0,
        maintenanceAlerts: 0,
      };
    }
  }

  // Vehicle Management API endpoints
  async createVehicle(vehicleData: CreateVehicleRequest): Promise<FleetVehicle> {
    try {
      console.log('Creating vehicle:', vehicleData);
      
      const response = await fetch(`${this.baseUrl}/api/vehicles`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(vehicleData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create vehicle: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Vehicle created successfully:', result);
      return result.vehicle;
    } catch (error) {
      console.error('Create vehicle error:', error);
      throw error;
    }
  }

  async updateVehicle(vehicleId: string, updates: Partial<FleetVehicle>): Promise<FleetVehicle> {
    try {
      const response = await fetch(`${this.baseUrl}/api/vehicles/${vehicleId}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update vehicle: ${errorText}`);
      }
      
      const result = await response.json();
      return result.vehicle;
    } catch (error) {
      console.error('Update vehicle error:', error);
      throw error;
    }
  }

  async deleteVehicle(vehicleId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/vehicles/${vehicleId}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete vehicle: ${errorText}`);
      }
      
      console.log('Vehicle deleted successfully:', vehicleId);
    } catch (error) {
      console.error('Delete vehicle error:', error);
      throw error;
    }
  }

  async getVehicleById(vehicleId: string): Promise<FleetVehicle | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/vehicles/${vehicleId}`, {
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching vehicle ${vehicleId}:`, error);
      return null;
    }
  }

  async getActiveVehicles(): Promise<FleetVehicle[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/vehicles/active`, {
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching active vehicles:', error);
      return [];
    }
  }

  async searchVehiclesByDriver(driverName: string): Promise<FleetVehicle[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/vehicles/search?driverName=${encodeURIComponent(driverName)}`, {
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error searching vehicles by driver:', error);
      return [];
    }
  }

  // AI Performance Analysis API
  async getVehiclePerformanceAnalysis(vehicleId: string): Promise<any> {
    try {
      // Simulate AI-powered performance analysis
      // In a real implementation, this would call your AI/ML service
      const vehicle = await this.getVehicleById(vehicleId);
      
      if (!vehicle) {
        throw new Error('Vehicle not found');
      }

      // Mock AI analysis response
      const mockAnalysis = {
        vehicleId,
        performanceScore: Math.floor(Math.random() * 30) + 70, // 70-100
        analysis: {
          summary: `Vehicle ${vehicleId} shows ${Math.random() > 0.7 ? 'excellent' : Math.random() > 0.4 ? 'good' : 'fair'} performance metrics.`,
          anomalies: this.generateMockAnomalies(),
          predictions: this.generateMockPredictions(),
          recommendations: this.generateMockRecommendations()
        },
        lastUpdated: new Date().toISOString()
      };

      return mockAnalysis;
    } catch (error) {
      console.error('Error getting vehicle performance analysis:', error);
      throw error;
    }
  }

  private generateMockAnomalies(): string[] {
    const anomalies = [
      'Engine temperature slightly elevated during peak hours',
      'Fuel consumption 3% above normal for route type',
      'Tire pressure variance detected on front-left tire',
      'RPM fluctuations noted during idle periods',
      'Minor GPS accuracy drift in urban areas'
    ];
    
    const count = Math.floor(Math.random() * 3) + 1;
    return anomalies.slice(0, count);
  }

  private generateMockPredictions(): string[] {
    const predictions = [
      'Oil change recommended within next 500 miles',
      'Brake pad replacement suggested in 2-3 weeks',
      'Air filter replacement due in 30 days',
      'Battery performance may decline in next 6 months',
      'Transmission service recommended within 1000 miles'
    ];
    
    const count = Math.floor(Math.random() * 3) + 2;
    return predictions.slice(0, count);
  }

  private generateMockRecommendations(): string[] {
    const recommendations = [
      'Schedule preventive maintenance to optimize performance',
      'Adjust driving patterns to improve fuel efficiency',
      'Monitor engine temperature during extended operations',
      'Consider route optimization for better efficiency',
      'Update GPS calibration for improved accuracy'
    ];
    
    const count = Math.floor(Math.random() * 3) + 2;
    return recommendations.slice(0, count);
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/actuator/health`);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

export const fleetApi = new FleetApiService();
export default fleetApi;