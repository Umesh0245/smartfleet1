import os
import json
import time
import random
import requests
from datetime import datetime
import pandas as pd

# Configuration
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8081")
NUM_VEHICLES = int(os.getenv("NUM_VEHICLES", 30))  # Increased to 30 vehicles
SEND_INTERVAL = float(os.getenv("SEND_INTERVAL", 3.0))
ANOMALY_PROB = float(os.getenv("ANOMALY_PROB", 0.02))

print(f"🚀 Starting HTTP Telemetry Simulator...")
print(f"Backend URL: {BACKEND_URL}")
print(f"Vehicles: {NUM_VEHICLES}")
print(f"Interval: {SEND_INTERVAL}s")
print("-" * 50)

# Load fleet dataset metadata
try:
    spec_df = pd.read_csv("fleet_specifications.csv")
    op_sample = pd.read_csv("fleet_operational_data.csv")
    signal_cols = [c for c in op_sample.columns if c not in ["vehicle_id", "timestamp"]]
    
    # Compute signal statistics from fleet data
    signal_stats = {
        c: {
            "mean": float(op_sample[c].mean()),
            "std": float(op_sample[c].std()),
            "min": float(op_sample[c].min()),
            "max": float(op_sample[c].max())
        }
        for c in signal_cols
    }
    print(f"✅ Loaded {len(signal_cols)} fleet signal types from dataset")
    print(f"📊 Fleet specs loaded: {len(spec_df)} vehicles")
except Exception as e:
    print(f"⚠️  Using synthetic data: {e}")
    # Fallback to synthetic signal generation  
    signal_stats = {
        "engine_temp": {"mean": 85.0, "std": 10.0, "min": 60.0, "max": 120.0},
        "fuel_pressure": {"mean": 45.0, "std": 5.0, "min": 30.0, "max": 60.0},
        "speed": {"mean": 65.0, "std": 15.0, "min": 0.0, "max": 120.0},
        "rpm": {"mean": 2200.0, "std": 400.0, "min": 800.0, "max": 6000.0},
        "oil_pressure": {"mean": 35.0, "std": 5.0, "min": 20.0, "max": 50.0},
        "fuel_level": {"mean": 75.0, "std": 15.0, "min": 0.0, "max": 100.0},
        "tire_pressure": {"mean": 34.0, "std": 3.0, "min": 25.0, "max": 40.0},
        "coolant_temp": {"mean": 85.0, "std": 8.0, "min": 70.0, "max": 110.0},
        "battery_voltage": {"mean": 12.8, "std": 0.5, "min": 11.0, "max": 14.0},
        "exhaust_temp": {"mean": 450.0, "std": 50.0, "min": 300.0, "max": 600.0}
    }
    print(f"✅ Using {len(signal_stats)} synthetic fleet signal types")

def generate_signals(anomaly=False):
    """Generate realistic telemetry signals"""
    signals = {}
    for signal_name, stats in signal_stats.items():
        # Normal distribution around mean
        value = random.normalvariate(stats["mean"], stats["std"])
        # Clamp to realistic bounds
        value = max(stats["min"], min(stats["max"], value))
        
        # Add anomaly if requested
        if anomaly and random.random() < 0.3:
            # Inject significant deviation
            value += random.choice([-1, 1]) * 3 * stats["std"]
            value = max(stats["min"], min(stats["max"], value))
        
        signals[signal_name] = round(float(value), 2)
    
    return signals

def generate_vehicle_specs(vehicle_id=None):
    """Generate vehicle specifications"""
    try:
        if 'spec_df' in globals() and len(spec_df) > 0:
            # Try to find specific vehicle first
            if vehicle_id:
                vehicle_row = spec_df[spec_df['vehicle_id'] == vehicle_id]
                if not vehicle_row.empty:
                    row = vehicle_row.iloc[0].to_dict()
                    return {k: (str(v) if not isinstance(v, (int, float)) else v) for k, v in row.items() if k != 'vehicle_id'}
            
            # Otherwise get random vehicle
            row = spec_df.sample(n=1).iloc[0].to_dict()
            return {k: (str(v) if not isinstance(v, (int, float)) else v) for k, v in row.items() if k != 'vehicle_id'}
    except Exception as e:
        print(f"⚠️  Error loading vehicle specs: {e}")
    
    # Fallback synthetic specs
    return {
        "make": random.choice(["Scania", "Volvo", "Mercedes", "MAN"]),
        "model": f"Series-{random.randint(100, 999)}",
        "year": random.randint(2018, 2024),
        "engine_type": random.choice(["DC13", "DC16", "D16G", "OM471", "D26"]),
        "fuel_type": "Diesel",
        "vehicle_class": random.choice(["Heavy", "Medium", "Light"])
    }

def send_telemetry_http(vehicle_data):
    """Send telemetry data via HTTP POST"""
    try:
        # Try to send to telemetry endpoint
        response = requests.post(
            f"{BACKEND_URL}/api/telemetry/ingest",
            json=vehicle_data,
            headers={"Content-Type": "application/json"},
            timeout=5
        )
        return response.status_code, response.text
    except requests.exceptions.RequestException as e:
        return None, str(e)

def main():
    """Main simulation loop"""
    sent_count = 0
    error_count = 0
    
    while True:
        try:
            # Generate data for all vehicles
            batch_start = time.time()
            
            for vehicle_id in range(1, NUM_VEHICLES + 1):
                # Determine if this should be an anomaly
                is_anomaly = random.random() < ANOMALY_PROB
                
                # Create telemetry payload (matching backend DTO format)
                vehicle_id_str = f"TRUCK-{vehicle_id:03d}"
                telemetry_data = {
                    "vehicleId": vehicle_id_str,
                    "timestamp": datetime.utcnow().isoformat() + "Z",
                    "specs": generate_vehicle_specs(vehicle_id_str),
                    "signals": generate_signals(anomaly=is_anomaly),
                    "status": {
                        "state": "ANOMALY" if is_anomaly else "NORMAL",
                        "location": {
                            "latitude": round(random.uniform(55.0, 69.0), 6),
                            "longitude": round(random.uniform(10.0, 25.0), 6)
                        }
                    }
                }
                
                # Send via HTTP
                status_code, response = send_telemetry_http(telemetry_data)
                
                if status_code and 200 <= status_code < 300:
                    sent_count += 1
                    status_icon = "🔴" if is_anomaly else "🟢"
                    print(f"{status_icon} Vehicle {telemetry_data['vehicleId']}: {status_code} - {len(telemetry_data['signals'])} signals")
                else:
                    error_count += 1
                    print(f"❌ Vehicle {telemetry_data['vehicleId']}: Error - {response}")
                
                # Small delay between vehicles
                time.sleep(0.1)
            
            # Summary stats
            batch_time = time.time() - batch_start
            print(f"📊 Batch complete: {NUM_VEHICLES} vehicles in {batch_time:.1f}s (Total: {sent_count} sent, {error_count} errors)")
            
            # Wait for next interval
            time.sleep(max(0, SEND_INTERVAL - batch_time))
            
        except KeyboardInterrupt:
            print(f"\n🛑 Simulation stopped. Final stats: {sent_count} sent, {error_count} errors")
            break
        except Exception as e:
            error_count += 1
            print(f"❌ Simulation error: {e}")
            time.sleep(1)

if __name__ == "__main__":
    main()