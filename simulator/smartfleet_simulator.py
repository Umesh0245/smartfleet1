#!/usr/bin/env python3
"""
SmartFleet2 Vehicle Telemetry Simulator
Sends real-time vehicle telemetry data to the Spring Boot backend API
"""

import os
import json
import time
import random
import requests
from datetime import datetime, timezone
from typing import Dict, Any, List

# Configuration
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8081")
NUM_VEHICLES = int(os.getenv("NUM_VEHICLES", 5))
SEND_INTERVAL = float(os.getenv("SEND_INTERVAL", 5.0))  # seconds
SIMULATE_DURATION = int(os.getenv("SIMULATE_DURATION", 300))  # 5 minutes

# Vehicle configurations
VEHICLE_CONFIGS = [
    {
        "vehicleId": "SCANIA_001",
        "make": "Scania",
        "model": "R450",
        "year": 2022,
        "engineType": "DC13",
        "baseLocation": "Stockholm"
    },
    {
        "vehicleId": "SCANIA_002", 
        "make": "Scania",
        "model": "S500",
        "year": 2023,
        "engineType": "DC16",
        "baseLocation": "Gothenburg"
    },
    {
        "vehicleId": "SCANIA_003",
        "make": "Scania",
        "model": "G410",
        "year": 2021,
        "engineType": "DC13",
        "baseLocation": "Malmo"
    },
    {
        "vehicleId": "SCANIA_004",
        "make": "Scania",
        "model": "R650",
        "year": 2023,
        "engineType": "V8",
        "baseLocation": "Uppsala"  
    },
    {
        "vehicleId": "SCANIA_005",
        "make": "Scania",
        "model": "P320",
        "year": 2020,
        "engineType": "DC09",
        "baseLocation": "Linkoping"
    }
]

class VehicleTelemetrySimulator:
    def __init__(self):
        self.backend_url = BACKEND_URL
        self.vehicles = VEHICLE_CONFIGS[:NUM_VEHICLES]
        self.vehicle_states = {}
        self.initialize_vehicle_states()
        
    def initialize_vehicle_states(self):
        """Initialize tracking states for each vehicle"""
        for vehicle in self.vehicles:
            self.vehicle_states[vehicle["vehicleId"]] = {
                "speed": random.uniform(0, 80),
                "fuel": random.uniform(20, 95),
                "engineTemp": random.uniform(75, 95),
                "rpm": random.uniform(800, 2200),
                "tirePressure": random.uniform(28, 35),
                "odometer": random.uniform(50000, 200000),
                "isActive": True,
                "lastLocation": vehicle["baseLocation"]
            }
    
    def generate_telemetry_data(self, vehicle_config: Dict[str, Any]) -> Dict[str, Any]:
        """Generate realistic telemetry data for a vehicle"""
        vehicle_id = vehicle_config["vehicleId"]
        state = self.vehicle_states[vehicle_id]
        
        # Simulate realistic changes
        state["speed"] = max(0, min(90, state["speed"] + random.uniform(-5, 5)))
        state["fuel"] = max(0, min(100, state["fuel"] + random.uniform(-0.5, 0.1)))
        state["engineTemp"] = max(70, min(110, state["engineTemp"] + random.uniform(-2, 2)))
        state["rpm"] = max(600, min(2500, state["rpm"] + random.uniform(-100, 100)))
        state["tirePressure"] = max(25, min(40, state["tirePressure"] + random.uniform(-0.5, 0.5)))
        
        # Create telemetry payload
        telemetry = {
            "vehicleId": vehicle_id,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "specs": {
                "make": vehicle_config["make"],
                "model": vehicle_config["model"], 
                "year": vehicle_config["year"],
                "engineType": vehicle_config["engineType"]
            },
            "signals": {
                "speed": round(state["speed"], 1),
                "fuel": round(state["fuel"], 1),
                "engineTemp": round(state["engineTemp"], 1),
                "rpm": round(state["rpm"], 0),
                "tirePressure": round(state["tirePressure"], 1)
            },
            "status": {
                "isActive": state["isActive"],
                "lastUpdated": datetime.now(timezone.utc).isoformat(),
                "location": f"{state['lastLocation']} - Highway"
            }
        }
        
        return telemetry
    
    def send_telemetry_data(self, telemetry_data: Dict[str, Any]) -> bool:
        """Send telemetry data to backend API"""
        try:
            # Use the telemetry service endpoint
            url = f"{self.backend_url}/api/telemetry"
            headers = {
                "Content-Type": "application/json",
                "User-Agent": "SmartFleet-Simulator/1.0"
            }
            
            response = requests.post(
                url, 
                json=telemetry_data,
                headers=headers,
                timeout=10
            )
            
            if response.status_code in [200, 201]:
                print(f"✓ Sent telemetry for {telemetry_data['vehicleId']} - Speed: {telemetry_data['signals']['speed']}km/h, Fuel: {telemetry_data['signals']['fuel']}%")
                return True
            else:
                print(f"✗ Failed to send telemetry for {telemetry_data['vehicleId']}: {response.status_code} - {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            print(f"✗ Network error sending telemetry for {telemetry_data['vehicleId']}: {e}")
            return False
        except Exception as e:
            print(f"✗ Unexpected error sending telemetry for {telemetry_data['vehicleId']}: {e}")
            return False
    
    def test_backend_connection(self) -> bool:
        """Test if backend is reachable"""
        try:
            health_url = f"{self.backend_url}/actuator/health"
            response = requests.get(health_url, timeout=5)
            return response.status_code == 200
        except:
            return False
    
    def run_simulation(self):
        """Run the telemetry simulation"""
        print(f"🚛 SmartFleet2 Vehicle Telemetry Simulator")
        print(f"📍 Backend URL: {self.backend_url}")
        print(f"🚐 Vehicles: {NUM_VEHICLES}")
        print(f"⏱️  Send Interval: {SEND_INTERVAL}s")
        print(f"⏰ Duration: {SIMULATE_DURATION}s")
        print("=" * 60)
        
        # Test backend connection
        if not self.test_backend_connection():
            print("❌ Backend connection failed! Make sure the backend is running on port 8080")
            return
        else:
            print("✅ Backend connection successful!")
        
        start_time = time.time()
        total_sent = 0
        total_failed = 0
        
        try:
            while True:
                current_time = time.time()
                if current_time - start_time > SIMULATE_DURATION:
                    break
                
                print(f"\n📊 Sending telemetry batch at {datetime.now().strftime('%H:%M:%S')}")
                
                batch_sent = 0
                batch_failed = 0
                
                # Send telemetry for each vehicle
                for vehicle in self.vehicles:
                    telemetry = self.generate_telemetry_data(vehicle)
                    
                    if self.send_telemetry_data(telemetry):
                        batch_sent += 1
                        total_sent += 1
                    else:
                        batch_failed += 1
                        total_failed += 1
                
                print(f"📈 Batch results: {batch_sent} sent, {batch_failed} failed")
                time.sleep(SEND_INTERVAL)
                
        except KeyboardInterrupt:
            print("\n🛑 Simulation interrupted by user")
        
        print(f"\n" + "=" * 60)
        print(f"📊 Simulation Summary:")
        print(f"✅ Total messages sent: {total_sent}")
        print(f"❌ Total messages failed: {total_failed}")
        print(f"📈 Success rate: {(total_sent/(total_sent+total_failed)*100):.1f}%" if (total_sent + total_failed) > 0 else "N/A")
        print(f"⏱️  Duration: {time.time() - start_time:.1f}s")

if __name__ == "__main__":
    simulator = VehicleTelemetrySimulator()
    simulator.run_simulation()